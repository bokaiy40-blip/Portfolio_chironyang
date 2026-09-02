import { neon } from '@neondatabase/serverless'

const MAX_CONTACT_LENGTH = 240
const MAX_SUGGESTION_LENGTH = 2000
const DEFAULT_CONTACT_NOTIFICATION_TO = 'ybk0109@qq.com'

type RequestLike = {
  method?: string
  body?: unknown
  headers?: Record<string, string | string[] | undefined>
}

type ResponseLike = {
  status: (statusCode: number) => ResponseLike
  setHeader: (name: string, value: string) => void
  json: (body: Record<string, unknown>) => void
}

const json = (
  response: ResponseLike,
  body: Record<string, unknown>,
  status = 200,
  extraHeaders: Record<string, string> = {},
) => {
  response.status(status)
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  Object.entries(extraHeaders).forEach(([name, value]) => response.setHeader(name, value))
  response.json(body)
}

const readText = (value: unknown, maxLength: number) => typeof value === 'string'
  ? value.trim().slice(0, maxLength)
  : ''

type RuntimeEnvironment = {
  process?: {
    env?: Record<string, string | undefined>
  }
}

const getRuntimeEnvironment = () => (globalThis as typeof globalThis & RuntimeEnvironment).process?.env

const getDatabaseUrl = () => {
  const environment = getRuntimeEnvironment()
  return environment?.POSTGRES_URL
    || environment?.DATABASE_URL
    || environment?.NEON_DATABASE_URL
    || ''
}

const sendContactNotification = async (
  submissionId: string,
  method: 'email' | 'phone',
  value: string,
  suggestion: string,
) => {
  const environment = getRuntimeEnvironment()
  const apiKey = environment?.RESEND_API_KEY?.trim()
  const from = environment?.CONTACT_NOTIFICATION_FROM?.trim()

  if (!apiKey || !from) {
    console.warn('Contact email notification is not configured')
    return
  }

  const to = environment?.CONTACT_NOTIFICATION_TO?.trim() || DEFAULT_CONTACT_NOTIFICATION_TO
  const sentAt = new Date().toISOString()
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `contact-${submissionId}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: '网站收到新的联系信息',
      text: [
        '网站收到一条新的联系信息。',
        '',
        `联系方式类型：${method === 'email' ? '邮箱' : '电话'}`,
        `联系方式：${value}`,
        `建议：${suggestion || '（未填写）'}`,
        `提交时间：${sentAt}`,
        `提交编号：${submissionId}`,
      ].join('\n'),
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`Resend email failed: ${response.status} ${errorText.slice(0, 200)}`)
  }
}

const getHeader = (request: RequestLike, name: string) => {
  const value = request.headers?.[name] ?? request.headers?.[name.toLowerCase()]
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

const getClientFingerprint = async (request: RequestLike, databaseUrl: string) => {
  const forwardedFor = getHeader(request, 'x-forwarded-for').split(',')[0]?.trim() || 'unknown'
  const userAgent = getHeader(request, 'user-agent')
  const salt = getRuntimeEnvironment()?.CONTACT_RATE_LIMIT_SALT || databaseUrl
  const digest = await globalThis.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${salt}\n${forwardedFor}\n${userAgent}`),
  )
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export default async function handler(request: RequestLike, response: ResponseLike) {
  if (request.method !== 'POST') {
    return json(response, { error: 'Method not allowed' }, 405, { Allow: 'POST' })
  }

  let payload = request.body
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch {
      return json(response, { error: 'Invalid JSON' }, 400)
    }
  }

  const body = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {}
  const method = body.method === 'phone' ? 'phone' : body.method === 'email' ? 'email' : ''
  const value = readText(body.value, MAX_CONTACT_LENGTH)
  const suggestion = readText(body.suggestion, MAX_SUGGESTION_LENGTH)
  const website = readText(body.website, 120)

  const isValidValue = method === 'email'
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    : method === 'phone' && /^[\d+\-\s()]{6,}$/.test(value)

  if (!method || !isValidValue) {
    return json(response, { error: 'Invalid contact information' }, 400)
  }

  if (website) {
    return json(response, { error: 'Invalid contact information' }, 400)
  }

  const databaseUrl = getDatabaseUrl()
  if (!databaseUrl) {
    console.error('Contact submission database is not configured')
    return json(response, { error: 'Service unavailable' }, 503)
  }

  try {
    const sql = neon(databaseUrl)
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id uuid PRIMARY KEY,
        contact_method text NOT NULL CHECK (contact_method IN ('email', 'phone')),
        contact_value text NOT NULL,
        suggestion text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `
    await sql`
      CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx
      ON contact_submissions (created_at DESC)
    `
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submission_rate_limits (
        fingerprint text PRIMARY KEY,
        window_started_at timestamptz NOT NULL DEFAULT now(),
        submission_count integer NOT NULL DEFAULT 0
      )
    `
    const fingerprint = await getClientFingerprint(request, databaseUrl)
    const rateRows = await sql`
      INSERT INTO contact_submission_rate_limits (fingerprint, window_started_at, submission_count)
      VALUES (${fingerprint}, now(), 1)
      ON CONFLICT (fingerprint) DO UPDATE
      SET
        submission_count = CASE
          WHEN contact_submission_rate_limits.window_started_at <= now() - interval '1 hour' THEN 1
          ELSE contact_submission_rate_limits.submission_count + 1
        END,
        window_started_at = CASE
          WHEN contact_submission_rate_limits.window_started_at <= now() - interval '1 hour' THEN now()
          ELSE contact_submission_rate_limits.window_started_at
        END
      RETURNING submission_count
    `
    if (Number(rateRows[0]?.submission_count ?? 1) > 5) {
      return json(response, { error: 'Too many submissions' }, 429, { 'Retry-After': '3600' })
    }
    const duplicateRows = await sql`
      SELECT id
      FROM contact_submissions
      WHERE contact_method = ${method}
        AND contact_value = ${value}
        AND suggestion = ${suggestion}
        AND created_at >= now() - interval '24 hours'
      LIMIT 1
    `
    if (duplicateRows.length) {
      return json(response, { error: 'Already submitted' }, 409)
    }
    const submissionId = crypto.randomUUID()
    await sql`
      INSERT INTO contact_submissions (id, contact_method, contact_value, suggestion)
      VALUES (${submissionId}, ${method}, ${value}, ${suggestion})
    `

    try {
      await sendContactNotification(submissionId, method, value, suggestion)
    } catch (error) {
      console.error('Contact email notification failed', error)
    }

    return json(response, { ok: true })
  } catch (error) {
    console.error('Contact submission failed', error)
    return json(response, { error: 'Service unavailable' }, 500)
  }
}
