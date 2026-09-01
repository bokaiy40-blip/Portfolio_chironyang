import { neon } from '@neondatabase/serverless'

type ContactEnvironment = {
  POSTGRES_URL?: string
  DATABASE_URL?: string
  NEON_DATABASE_URL?: string
  CONTACT_RATE_LIMIT_SALT?: string
}

type ContactContext = {
  request: Request
  env: ContactEnvironment
}

const MAX_CONTACT_LENGTH = 240
const MAX_SUGGESTION_LENGTH = 2000

const readText = (value: unknown, maxLength: number) => typeof value === 'string'
  ? value.trim().slice(0, maxLength)
  : ''

const getClientFingerprint = async (request: Request, databaseUrl: string, env: ContactEnvironment) => {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const userAgent = request.headers.get('user-agent') || ''
  const salt = env.CONTACT_RATE_LIMIT_SALT || databaseUrl
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${salt}\n${forwardedFor}\n${userAgent}`),
  )
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

const json = (body: Record<string, unknown>, status = 200, extraHeaders: Record<string, string> = {}) => new Response(
  JSON.stringify(body),
  {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      ...extraHeaders,
    },
  },
)

export const onRequestPost = async ({ request, env }: ContactContext) => {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const body = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {}
  const method = body.method === 'phone' ? 'phone' : body.method === 'email' ? 'email' : ''
  const value = readText(body.value, MAX_CONTACT_LENGTH)
  const suggestion = readText(body.suggestion, MAX_SUGGESTION_LENGTH)
  const website = readText(body.website, 120)

  const isValidValue = method === 'email'
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    : method === 'phone' && /^[\d+\-\s()]{6,}$/.test(value)

  if (!method || !isValidValue || website) {
    return json({ error: 'Invalid contact information' }, 400)
  }

  const databaseUrl = env.POSTGRES_URL || env.DATABASE_URL || env.NEON_DATABASE_URL || ''
  if (!databaseUrl) {
    console.error('Contact submission database is not configured')
    return json({ error: 'Service unavailable' }, 503)
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
    const fingerprint = await getClientFingerprint(request, databaseUrl, env)
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
      return json({ error: 'Too many submissions' }, 429, { 'Retry-After': '3600' })
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
      return json({ error: 'Already submitted' }, 409)
    }
    await sql`
      INSERT INTO contact_submissions (id, contact_method, contact_value, suggestion)
      VALUES (${crypto.randomUUID()}, ${method}, ${value}, ${suggestion})
    `
    return json({ ok: true })
  } catch (error) {
    console.error('Contact submission failed', error)
    return json({ error: 'Service unavailable' }, 500)
  }
}

export const onRequest = async ({ request, env }: ContactContext) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, { Allow: 'POST' })
  }
  return onRequestPost({ request, env })
}

