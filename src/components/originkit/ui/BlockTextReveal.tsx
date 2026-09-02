// Block Text Reveal — Originkit
// Using component defaults.

"use client"

import * as React from "react"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

/**
 * Block Text Reveal — a paragraph uncovered by coloured blocks on scroll.
 *
 * Ported into this repo's standard (CLAUDE.md rule 10) from a compiled Framer
 * library component (`BlockTextRevealOnScroll`). The port kept the reference
 * interaction (rule 8); this build then changed it where asked — see WHAT THIS
 * BUILD CHANGED below. Everything not listed there is still the reference's.
 *
 * WHAT THIS BUILD CHANGED (requested, so it is not a port defect):
 *  - `Sticky` reveal type removed. Two types now, Blocks and Lines. Drive B
 *    (the sticky-scroll progress driver) and the `Delay` it read are gone with
 *    it; nothing else referenced either.
 *  - `Direction` is Left / Right / Center and applies to BOTH types (it used to
 *    be a two-way arrow control hidden unless Lines). Center wipes outward from
 *    the middle of each line: for Lines that needs two half-panels per line, one
 *    pinned to each end, because a single scaleX can only ever pin one edge.
 *  - Blocks reveals one WORD at a time, not one line at a time. The reference
 *    stepped `bandBase = floor(bandStart)`, so the band jumped a whole line per
 *    step and the per-line opacity ramp (`bandEnvelope`) plus a 0.55s CSS
 *    transition were what smoothed the jump — the visible stutter. Each word now
 *    carries a continuous sweep coordinate `pos = line + u`, where `u` is its
 *    horizontal fraction of the line resolved through Direction, and one soft
 *    front sweeps it: `lead` covers, `lead - band` uncovers. Blocks and the text
 *    under them are driven per frame, so their CSS transitions are gone too —
 *    the ramp is in the math now, and a transition on top only adds lag. This
 *    retires `fillRank`, `bandEnvelope`, the separate fill phase (`FILL`) and
 *    the `bandBase - 1` trailing-line fade, all of which existed to soften the
 *    per-line step.
 *  - Highlight plates no longer pop in instantly. They rendered as a plain JSX
 *    span with no opacity handling at all — always fully visible from first
 *    paint, ahead of whatever the reveal was doing. `applyProgress` now ramps
 *    their opacity continuously off the same trigger point driving the word's
 *    own fade — `local` past `enterEnd` for Lines, `front - band - pos`
 *    crossing 0 for Blocks — instead of snapping 0/1 on a threshold, and the
 *    ramp is written every frame with NO live CSS `transition`: a fixed-
 *    duration tween re-targeted 60x/sec by a value that itself keeps moving
 *    never settles, so the plate sits a constant beat behind and any
 *    per-frame rounding jitter in the target restarts it, which is what still
 *    read as "a blink and a delay" after the first pass merely made the
 *    tracked value continuous. The `Transition` control
 *    (`ControlType.Transition`, house convention: one object, never a bare ms
 *    number) now sizes that per-frame ramp's SPAN directly — its `duration`
 *    converts into local/front units at each mode's own constant per-ms rate
 *    — rather than driving a CSS transition; `type`/`ease` still default the
 *    control's shape but no longer change the curve, since there is no CSS
 *    easing left to hand them to.
 *  - The Lines-type reveal panel's height was its own constant (1.18x the
 *    line's font size), independent of the highlight plate's geometry (its
 *    line box ±0.06em top/bottom), so the two never matched. Both now read off
 *    shared `HIGHLIGHT_V_EXTEND` / `HIGHLIGHT_H_EXTEND` constants — the panel
 *    is exactly as tall as a highlight plate drawn over the same line.
 *
 * WHAT THE PORT CUT (unreachable in the source, verified by reading the render
 * path, not by guessing):
 *  - `revealMode` / `blurMax` / the `Word` memo / `wordsLetterData`. The render
 *    IIFE returns for every one of the three `revealType` values BEFORE it can
 *    reach the letter/word path, and neither prop had a control.
 *  - `scrollSpeed` and `easing`: controls declared `hidden: () => true` with no
 *    read site anywhere.
 *  - Six `*LineRange` memos and two overlay layers gated on `bandLines === 3`
 *    while `bandLines` is the literal `5`. They never rendered.
 *  - `fadeBand` / `blocksBand` were byte-identical memos. "Blocks" and "Blocks
 *    Sticky" differed ONLY in what drove progress plus a 1% block bleed. One
 *    band renderer serves the surviving type; the 1% bleed is kept, because it
 *    also closes the sub-pixel seam between adjacent word blocks.
 *  - The `aboveLineIndex` text branches fire only when `bandStartLine` is
 *    exactly integral (for any other value `ceil(x) - 1 === floor(x)`, which the
 *    `revealed` test then rejects) — a one-frame flicker. Its live sibling
 *    (`prevLineIndex === bandBase - 1`) is gone with the per-line band.
 *
 * WHAT THE PORT FIXED (rule 10's "what a port must fix, always"):
 *  - Render loop. The source reset `linesMeasured` in an effect keyed on `font`,
 *    and Framer hands back a fresh object every render, so it ran measure ->
 *    true -> reset false -> measure, forever. Deps are extracted primitives now
 *    (rule G), via a serialized `fontKey`.
 *  - Per-frame `setState`. `setScrollProgress` on every rAF frame re-rendered
 *    every word span 60x/sec. Progress lives in a ref and is written straight to
 *    `style.opacity` / `style.transform`. The CSS transitions are unchanged, and
 *    the source retargeted them every frame too, so the motion is identical.
 *  - No re-measure on resize: word rects were captured once, so a rewrap left
 *    every block at its old x. ResizeObserver + `document.fonts.ready` now.
 *  - Blocks misaligned over highlighted words: the hidden measure layer rendered
 *    every word in the BASE font, so a highlighted word with a larger Font wraps
 *    differently than the real text it is measuring for. The clone is gone; the
 *    real spans are measured, each carrying a zero-size baseline strut so line
 *    grouping survives a per-word font size (offsetTop alone does not — a taller
 *    word sits higher on a shared baseline).
 *  - `text.split(" ")` glued "\n" to a word, which with `pre-wrap` broke inside
 *    an `inline-block` and corrupted its measured box. Parsed into words plus
 *    explicit `<br/>` now.
 *  - Untyped props and untyped defaults (rule 10's TypeScript note).
 *
 * SCALE CHANGES (cannot be migrated with a fallback key — the stored number is
 * the same either way — so they are a deliberate one-off cost):
 *  - `revealSpeed` 0.1–5 step 0.1 -> `Speed` 0–100 whole, 50 = the rate the
 *    reference shipped at (rule 7b). Top end is 4x, where the old dial reached
 *    5x; the bottom is slower.
 *  - `radius` (ControlType.BorderRadius) -> `Rounded`, percent of the maximum
 *    radius, so 100 is a pill at any font size and one number means one shape.
 *  - `direction`'s VALUES changed, `"ltr" | "rtl"` -> `"left" | "right" |
 *    "center"`. The key did not move, so this is not rule 11c's key break — an
 *    unmapped `"rtl"` would silently render as Left, a wrong picture rather than
 *    a reset one, so the two old values are aliased in `normalizeDirection` and
 *    nowhere else.
 *  - `revealType`'s `"sticky"` value is gone. An instance still holding it gets
 *    Blocks (the surviving non-Lines type), same alias site.
 *
 * CONSTANTS PROMOTED TO CONTROLS: `Align` — ControlType.Font carries no
 * text-align, so without it the component could only ever be left-aligned.
 *
 * LEFT ALONE ON PURPOSE (so it is not re-litigated next pass):
 *  - `Rounded` is hidden for Lines. The line block is animated with `scaleX`, so
 *    a corner radius would be drawn as a squashed ellipse for the whole gesture
 *    — a control that lies (rule F). The source hid it too.
 *  - The block box padding (1.02x wide, 1.1x tall, lifted 5%) stays a design
 *    constant — the look, not a dial. The per-line box's ±2px horizontal pad
 *    is too; its height is no longer its own number (see WHAT THIS BUILD
 *    CHANGED — it now shares geometry with the highlight plate).
 *  - `getBoundingClientRect` is still used for the scroll/trigger math. That is
 *    viewport position, not layout measurement, and rule G's zoom hazard cannot
 *    bite: the scroll drivers only run when `useIsStaticRenderer()` is false,
 *    i.e. in the preview, where there is no canvas zoom. Everything MEASURED
 *    uses offsetLeft/offsetTop/offsetWidth/offsetHeight.
 *
 * CANVAS PARITY (rule 5). `useIsStaticRenderer()` is true on the Framer canvas,
 * where there is no scroll to drive anything. The canvas therefore loops the
 * reveal on a raw rAF (which does tick there) so Block Color, Rounded and Band
 * Lines are visible while editing. It is a restart, not a ping-pong: progress
 * never runs backwards. First paint is the finished state, so a thumbnail or
 * export that never gets a frame still renders readable text.
 */

type RevealType = "blocks" | "lines"
type Direction = "left" | "right" | "center"
type TriggerLine = "top" | "center" | "bottom"
type Align = "left" | "center" | "right"

// PANEL (15 rows, at the cap). Frozen at their reference values — the panel row is gone, the
// render path is unchanged. `bandLines`/`cover`/`stagger` were literals in the
// source that an earlier pass promoted to dials; they go back to constants.
const HTML_TAG = "p"
/** Blocks: how much of the sweep is covered at once, in lines. */
const BAND_LINES = 5
const COVER = 42
const STAGGER = 7
const VIEWPORT: TriggerLine = "center"

/** The only place the retired `revealType`/`direction` values are understood. */
const normalizeReveal = (v: unknown): RevealType =>
    v === "lines" ? "lines" : "blocks"
const normalizeDirection = (v: unknown): Direction =>
    v === "right" || v === "rtl"
        ? "right"
        : v === "center"
          ? "center"
          : "left"

/** Framer's Font control value: CSS plus its own `variant` key. */
type FontValue = React.CSSProperties & { variant?: string }

/** Framer's ControlType.Transition value — framer-motion's Transition shape. */
interface TweenTransition {
    type?: "tween"
    duration?: number
    ease?: string | number[]
    damping?: number
    stiffness?: number
    mass?: number
}
interface SpringTransition {
    type: "spring"
    duration?: number
    bounce?: number
    stiffness?: number
    damping?: number
    mass?: number
}
type TransitionValue = TweenTransition | SpringTransition

interface HighlightItem {
    text: string
    block: boolean
    rounded: number
    textColor: string
    color: string
}

interface Props {
    text: string
    font?: FontValue
    align: Align
    textColor: string
    blockColor: string
    revealType: RevealType
    direction: Direction
    rounded: number
    speed: number
    /** Eases the highlight plates in; see HIGHLIGHT_V_EXTEND / cssTransitionFrom. */
    transition?: TransitionValue
    /** Was `highlighted: { items: [] }` — the Object wrapper held one row. */
    highlight?: HighlightItem[]
    style?: React.CSSProperties
}

/** One line's own cover->uncover span, in timeline units. Reference constant. */
const PER_LINE_SPAN = 0.85
/** Reference base duration of the viewport-triggered reveal, before Speed. */
const BASE_DURATION_MS = 2200
/**
 * Speed 50 is the rate the reference shipped at (rule 7b). The source computed
 * `effectiveRevealSpeed = revealSpeed * 2` from a default `revealSpeed` of 1, so
 * the shipped factor is 2 — hence 50/25.
 */
const SPEED_DIVISOR = 25
/**
 * Blocks: softness of the sweep front, in sweep units (1 = one line). Every word
 * inside the front's width is mid-ramp, so a fraction of a line's words move at
 * once — the per-word cascade. At `band * 0.45` the band never has a flat
 * fully-opaque core, which is what the reference's per-line opacity envelope was
 * drawing by hand.
 */
const FRONT_SOFT = 0.45
/** Word block box, as a fraction of the measured glyph box. Reference geometry. */
const BLOCK_BLEED_X = 0.02
const BLOCK_TOP_LIFT = 0.05
const BLOCK_HEIGHT = 1.1
/**
 * Line block box (Lines type) and the highlight plate (both types) now share
 * one geometry: each overscans the word's own line box by these fractions of
 * its font size, so a Lines reveal panel comes out exactly as tall as a
 * highlight plate drawn over the same line (this build's ask).
 */
const LINE_PAD_X = 2
const HIGHLIGHT_V_EXTEND = 0.06
const HIGHLIGHT_H_EXTEND = 0.16
/** Canvas loop: hold the finished frame this long, then restart from 0. */
const CANVAS_HOLD_MS = 1400
void CANVAS_HOLD_MS

/**
 * A real floor BEFORE the `...style` spread, so an explicit size on the instance
 * still wins. 240, NOT the repo's 1200 full-bleed floor — same call as
 * Kern_KineticLine: this is a paragraph, placed at relative width inside a
 * stack, and a 1200 floor would force horizontal overflow at every breakpoint
 * under 1200. The 1200 floor exists to stop a full-bleed hero collapsing to a
 * dot, which cannot happen here anyway: the text is in flow, so the root always
 * has content to size to.
 */
const MIN_WIDTH = 240
const MIN_HEIGHT = 80

const DEFAULT_TEXT =
    "Create meaningful digital experiences where every line unfolds with purpose, clarity, and a touch of motion."

const DEFAULT_FONT: FontValue = {
    variant: "Bold",
    fontSize: "60px",
    textAlign: "left",
    fontFamily: "Inter",
    fontWeight: 700,
    lineHeight: "1.3em",
    letterSpacing: "-0.03em",
}

const DEFAULT_HIGHLIGHT: HighlightItem[] = [
    { text: "Create", block: true, color: "#FFFFFF", rounded: 24, textColor: "#000000" },
    { text: "purpose,", block: true, color: "#5C6FFF", rounded: 24, textColor: "#FFFFFF" },
]

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Smootherstep — the source's `smoothstep`, which was the quintic one. */
const smootherstep = (t: number): number => {
    const x = clamp01(t)
    return x * x * x * (x * (x * 6 - 15) + 10)
}

const easeOutCubic = (t: number): number => {
    const x = clamp01(t)
    return 1 - Math.pow(1 - x, 3)
}

/** Sub-pixel precision, kept: integer rounding makes the shrink shake. */
const px = (n: number): number =>
    Number.isFinite(n) ? Math.round(n * 1e3) / 1e3 : 0

/** Percent of the MAXIMUM radius — half the short side — so 100 is a pill. */
const radiusPx = (w: number, h: number, pct: number): number =>
    (Math.max(0, Math.min(100, pct)) / 100) * (Math.min(w, h) / 2)

const DEFAULT_HIGHLIGHT_TRANSITION: TweenTransition = {
    type: "tween",
    duration: 0.4,
    ease: "easeOut",
}

const DEFAULT_TRANSITION: TransitionValue = {
    ease: "easeOut",
    mass: 1,
    type: "tween",
    damping: 60,
    duration: 0.4,
    stiffness: 800,
}

/**
 * The highlight plates fade in on their own eased ramp every frame — same as
 * the word/block opacity around them — never a live CSS transition (that was
 * the residual cause of "still a blink and delay": a fixed-duration tween
 * re-targeted 60x/sec by a continuously moving value never settles, so the
 * plate is perpetually a beat behind, and any rounding jitter in the target
 * retriggers the tween's start, reading as a stutter). `duration` from the
 * Transition control sizes that ramp's span in real ms instead.
 */
const highlightMsFrom = (t: TransitionValue | undefined): number =>
    Math.max(0, (t?.duration ?? DEFAULT_HIGHLIGHT_TRANSITION.duration ?? 0.4) * 1000)

interface WordToken {
    text: string
    /** Hard line breaks that follow this word. */
    breaks: number
}

/** Words plus explicit breaks. The source's `split(" ")` glued "\n" to a word. */
function parseWords(text: string): WordToken[] {
    const out: WordToken[] = []
    const lines = String(text ?? "").split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
        const parts = lines[i].split(/\s+/)
        for (const part of parts) if (part) out.push({ text: part, breaks: 0 })
        if (i < lines.length - 1 && out.length > 0) out[out.length - 1].breaks += 1
    }
    return out
}

interface WordRect {
    x: number
    y: number
    w: number
    /** Top of the visible glyph box, independent of the chosen line-height. */
    yText: number
    /** Height of the visible glyph box (the font size). */
    hText: number
    /** The word's own CSS line-height, in px — the highlight plate's em basis. */
    hLine: number
    line: number
}

interface LineRect {
    line: number
    minX: number
    maxX: number
    yText: number
    hText: number
    /** Top of the line's own box (min word offsetTop), not the glyph box. */
    topBox: number
    /** Max CSS line-height across the line's words, in px. */
    hLine: number
}

interface Measurement {
    rects: WordRect[]
    lines: LineRect[]
    lineCount: number
    /** Guards the measure -> setState -> measure loop. */
    sig: string
}

interface LiveParams {
    revealType: RevealType
    direction: Direction
    bandLines: number
    cover: number
    stagger: number
    speed: number
    viewport: TriggerLine
    /** Highlight-plate fade-in span, in real ms — sizes a per-frame eased ramp, never a live CSS transition. */
    highlightMs: number
}

const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect

export default function BlockTextReveal({
    text = DEFAULT_TEXT,
    font = DEFAULT_FONT,
    align = "left",
    textColor = "#FFFFFF",
    blockColor = "#FFFFFF",
    revealType: revealTypeProp = "lines",
    direction: directionProp = "left",
    rounded = 0,
    speed = 50,
    transition = DEFAULT_TRANSITION,
    highlight = DEFAULT_HIGHLIGHT,
    style,
}: Props) {
    const revealType = normalizeReveal(revealTypeProp)
    const direction = normalizeDirection(directionProp)
    const highlightMs = highlightMsFrom(transition)
    const isStatic = false

    const bandLines = BAND_LINES
    const cover = COVER
    const stagger = STAGGER
    const viewport = VIEWPORT

    const isLines = revealType === "lines"
    /** Center needs TWO panels per line: one scaleX can only pin one edge. */
    const splitLines = isLines && direction === "center"

    const hostRef = useRef<HTMLDivElement | null>(null)
    const textRef = useRef<HTMLElement | null>(null)
    const wordElsRef = useRef<(HTMLElement | null)[]>([])
    const strutElsRef = useRef<(HTMLElement | null)[]>([])
    const blockElsRef = useRef<(HTMLElement | null)[]>([])
    const lineBlockElsRef = useRef<(HTMLElement | null)[]>([])
    /** Second half-panel, Center only. */
    const lineBlockBElsRef = useRef<(HTMLElement | null)[]>([])
    const highlightElsRef = useRef<(HTMLElement | null)[]>([])

    const [measurement, setMeasurement] = useState<Measurement | null>(null)

    // Live inputs read inside the animation loop live in refs, never in effect
    // deps — otherwise a colour edit would tear down and restart the drive.
    const measureRef = useRef<Measurement | null>(null)
    measureRef.current = measurement

    const paramsRef = useRef<LiveParams>({
        revealType,
        direction,
        bandLines,
        cover,
        stagger,
        speed,
        viewport,
        highlightMs,
    })
    paramsRef.current = {
        revealType,
        direction,
        bandLines,
        cover,
        stagger,
        speed,
        viewport,
        highlightMs,
    }

    // First paint of the static renderer is the FINISHED state, so a thumbnail
    // or export that never receives a frame is still readable text.
    const progressRef = useRef(isStatic ? 1 : 0)

    const words = useMemo(() => parseWords(text), [text])

    // Framer hands back a fresh object every render, so identity is useless as a
    // dep (rule G). Serialize instead.
    const fontKey = JSON.stringify(font ?? {})
    const highlightKey = JSON.stringify(highlight ?? [])

    const highlightItems = useMemo<HighlightItem[]>(() => {
        const raw = (highlight ?? []) as HighlightItem[]
        return raw.filter(
            (item) => item && typeof item.text === "string" && item.text.trim()
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [highlightKey])

    /** Word index -> highlight item. Exact token match, as the source had it. */
    const highlightMap = useMemo(() => {
        const map = new Map<number, HighlightItem>()
        if (highlightItems.length === 0 || words.length === 0) return map
        const hay = words.map((w) => w.text)
        for (const item of highlightItems) {
            const tokens = item.text.trim().split(/\s+/).filter(Boolean)
            if (tokens.length === 0) continue
            for (let i = 0; i <= hay.length - tokens.length; i++) {
                let ok = true
                for (let j = 0; j < tokens.length; j++) {
                    if (hay[i + j] !== tokens[j]) {
                        ok = false
                        break
                    }
                }
                if (ok) for (let j = 0; j < tokens.length; j++) map.set(i + j, item)
            }
        }
        return map
    }, [highlightItems, words])

    // Element ref arrays follow the word list, not the render count.
    const wordsKeyRef = useRef<WordToken[] | null>(null)
    if (wordsKeyRef.current !== words) {
        wordsKeyRef.current = words
        wordElsRef.current = []
        strutElsRef.current = []
        blockElsRef.current = []
        highlightElsRef.current = []
        lineBlockElsRef.current = []
        lineBlockBElsRef.current = []
    }

    // ---------------------------------------------------------------------
    // Measurement
    // ---------------------------------------------------------------------

    const measure = () => {
        const host = textRef.current
        if (!host || typeof window === "undefined") return
        const els = wordElsRef.current
        if (els.length === 0) return

        // Highlight plates are sized by their own box, which only exists in the
        // DOM. Written before the signature bail-out, or a Rounded edit that
        // does not move any word would never reach them.
        for (let i = 0; i < highlightElsRef.current.length; i++) {
            const el = highlightElsRef.current[i]
            const item = highlightMap.get(i)
            if (!el || !item) continue
            el.style.borderRadius = `${px(
                radiusPx(el.offsetWidth, el.offsetHeight, item.rounded ?? 0)
            )}px`
        }

        const baseCS = window.getComputedStyle(host)
        const rects: WordRect[] = []
        let lineIdx = -1
        let lineBaseline = Number.NaN

        for (let i = 0; i < els.length; i++) {
            const el = els[i]
            if (!el) continue
            const strut = strutElsRef.current[i]
            // A zero-size empty inline-block sits its bottom margin edge on the
            // baseline and contributes nothing to the line box, so every word on
            // one line reports the same value whatever its own font size.
            const baseline = el.offsetTop + (strut ? strut.offsetTop : 0)
            if (!Number.isFinite(lineBaseline) || baseline - lineBaseline > 0.5) {
                lineIdx += 1
                lineBaseline = baseline
            }

            const cs = highlightMap.has(i) ? window.getComputedStyle(el) : baseCS
            const fontSizePx = parseFloat(cs.fontSize)
            const lineHeightPx = parseFloat(cs.lineHeight)
            const safeFont =
                Number.isFinite(fontSizePx) && fontSizePx > 0
                    ? fontSizePx
                    : el.offsetHeight
            const safeLine =
                Number.isFinite(lineHeightPx) && lineHeightPx > 0
                    ? lineHeightPx
                    : el.offsetHeight

            rects.push({
                x: el.offsetLeft,
                y: el.offsetTop,
                w: el.offsetWidth,
                yText: el.offsetTop + Math.max(0, (safeLine - safeFont) / 2),
                hText: safeFont,
                hLine: safeLine,
                line: Math.max(0, lineIdx),
            })
        }

        if (rects.length === 0) return

        const lineCount = Math.max(1, lineIdx + 1)
        const lines: LineRect[] = []
        for (let li = 0; li < lineCount; li++) {
            let minX = Number.POSITIVE_INFINITY
            let maxX = Number.NEGATIVE_INFINITY
            let top = Number.POSITIVE_INFINITY
            let bottom = Number.NEGATIVE_INFINITY
            let topBox = Number.POSITIVE_INFINITY
            let hLine = 0
            let has = false
            for (const r of rects) {
                if (r.line !== li) continue
                has = true
                minX = Math.min(minX, r.x)
                maxX = Math.max(maxX, r.x + r.w)
                top = Math.min(top, r.yText)
                bottom = Math.max(bottom, r.yText + r.hText)
                topBox = Math.min(topBox, r.y)
                hLine = Math.max(hLine, r.hLine)
            }
            if (!has || !Number.isFinite(minX) || !Number.isFinite(maxX)) continue
            lines.push({
                line: li,
                minX,
                maxX,
                yText: top,
                hText: Math.max(1, bottom - top),
                topBox,
                hLine: Math.max(1, hLine),
            })
        }

        const sig = rects
            .map(
                (r) =>
                    `${Math.round(r.x)},${Math.round(r.y)},${Math.round(
                        r.yText
                    )},${Math.round(r.w)},${Math.round(r.hText)},${Math.round(
                        r.hLine
                    )},${r.line}`
            )
            .join("|")
        if (measureRef.current?.sig === sig) return
        setMeasurement({ rects, lines, lineCount, sig })
    }

    const measureFnRef = useRef(measure)
    measureFnRef.current = measure

    useIsomorphicLayoutEffect(() => {
        measureFnRef.current()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [words, align, fontKey, highlightKey, revealType])

    // Rewrap on resize. The source measured once, so every block stayed at its
    // pre-resize x (rule G).
    useEffect(() => {
        const el = textRef.current
        if (!el || typeof ResizeObserver === "undefined") return
        let raf = 0
        const observer = new ResizeObserver(() => {
            if (raf) cancelAnimationFrame(raf)
            raf = requestAnimationFrame(() => {
                raf = 0
                measureFnRef.current()
            })
        })
        observer.observe(el)
        return () => {
            observer.disconnect()
            if (raf) cancelAnimationFrame(raf)
        }
    }, [])

    // A webfont that lands after the first measure moves every word.
    useEffect(() => {
        const fonts = (document as unknown as { fonts?: { ready?: Promise<unknown> } })
            .fonts
        if (!fonts?.ready) return
        let alive = true
        fonts.ready.then(() => {
            if (alive) measureFnRef.current()
        })
        return () => {
            alive = false
        }
    }, [fontKey])

    // ---------------------------------------------------------------------
    // Imperative apply — no state, no re-render, one style write per element
    // ---------------------------------------------------------------------

    const applyProgress = (p: number) => {
        const m = measureRef.current
        const cfg = paramsRef.current
        if (!m) return
        const { rects, lines, lineCount } = m

        if (cfg.revealType === "lines") {
            const delayStep = PER_LINE_SPAN * (Math.max(0, cfg.stagger) / 100)
            const timeline = PER_LINE_SPAN + delayStep * Math.max(0, lineCount - 1)
            const enterEnd = Math.min(0.98, Math.max(0.02, cfg.cover / 100))
            const exitDuration = Math.max(1e-5, 1 - enterEnd)
            // `local` advances at a constant 1/base per ms regardless of line
            // or stagger (the timeline scaling that sizes durationMs() for
            // stagger cancels out of that rate) — so highlightMs converts
            // straight into a local-unit span, no live CSS transition needed
            // to "convert" ms into a duration for us.
            const factor = Math.max(0.1, cfg.speed / SPEED_DIVISOR)
            const base = BASE_DURATION_MS / factor
            const highlightSpan = Math.max(1e-4, cfg.highlightMs / base)
            const split = cfg.direction === "center"
            // Which edge the cover GROWS from. It uncovers the same way round,
            // so the exit pins the opposite edge — one transform-origin flip.
            // Center's first panel leads from its right edge (the line's middle)
            // and the second from its left, which is the same flip mirrored.
            const leadFromRight = split || cfg.direction === "right"

            const paint = (
                el: HTMLElement | null,
                origin: string,
                hide: boolean,
                sx: number
            ) => {
                if (!el) return
                if (hide) {
                    // Hides the last sub-pixel remnant, which otherwise reads as
                    // a small block stuck at the end of the line.
                    el.style.visibility = "hidden"
                    return
                }
                el.style.visibility = "visible"
                el.style.transformOrigin = origin
                el.style.transform = `scaleX(${px(sx)})`
            }

            for (const lr of lines) {
                const a = lineBlockElsRef.current[lr.line]
                const b = lineBlockBElsRef.current[lr.line]
                if (!a) continue
                const local = clamp01(
                    (p * timeline - lr.line * delayStep) /
                        Math.max(1e-4, PER_LINE_SPAN)
                )
                const boxWidth = lr.maxX - lr.minX + LINE_PAD_X * 2
                const panelWidth = split ? boxWidth / 2 : boxWidth
                const entering = local < enterEnd
                const sx = entering
                    ? easeOutCubic(local / Math.max(1e-5, enterEnd))
                    : Math.max(
                          0,
                          1 - easeOutCubic((local - enterEnd) / exitDuration)
                      )
                const hide = panelWidth * sx <= 1
                paint(
                    a,
                    entering === leadFromRight ? "100% 50%" : "0% 50%",
                    hide,
                    sx
                )
                paint(b, entering ? "0% 50%" : "100% 50%", hide, sx)
            }

            for (let i = 0; i < rects.length; i++) {
                const el = wordElsRef.current[i]
                const local = clamp01(
                    (p * timeline - rects[i].line * delayStep) /
                        Math.max(1e-4, PER_LINE_SPAN)
                )
                // Hidden until the block has fully covered the line, then instant.
                const revealed = local >= enterEnd
                if (el) el.style.opacity = revealed ? "1" : "0"

                // Highlight plates ramp continuously off `local` past
                // `enterEnd`, same trigger as before, but the span is now
                // `highlightSpan` (the Transition control's duration, in
                // local units) instead of `exitDuration`, and nothing here
                // touches `style.transition` — a live CSS transition chasing
                // a value that itself moves every frame never settles, which
                // is what still read as a delayed, occasionally-stuttering
                // fade rather than a clean one.
                const hEl = highlightElsRef.current[i]
                if (hEl) {
                    const hProgress = revealed
                        ? easeOutCubic(
                              clamp01((local - enterEnd) / highlightSpan)
                          )
                        : 0
                    hEl.style.opacity = String(px(hProgress))
                }
            }
            return
        }

        // Blocks: ONE soft front sweeping a per-word coordinate, so the reveal
        // advances word by word instead of stepping a whole line at a time.
        // `pos = line + u`, u in 0..1 across the line resolved through Direction.
        // The front's leading edge covers a word, its trailing edge (one band
        // behind) uncovers it; both edges ramp over FRONT_SOFT, which is the
        // only source of softness now — no CSS transition sits on top.
        const band = Math.max(1, Math.min(Math.round(cfg.bandLines), lineCount))
        const soft = Math.max(0.35, band * FRONT_SOFT)
        // +soft so the trailing edge fully clears the last word at p = 1.
        const front = p * (lineCount + band + soft)
        const dir = cfg.direction
        // Same constant-rate reasoning as the Lines branch: `front` advances
        // at (lineCount + band + soft)/base per ms, so highlightMs converts
        // straight into a front-unit span for the highlight's own ramp.
        const factor = Math.max(0.1, cfg.speed / SPEED_DIVISOR)
        const base = BASE_DURATION_MS / factor
        const highlightSoft = Math.max(
            1e-4,
            (cfg.highlightMs * (lineCount + band + soft)) / base
        )

        for (let i = 0; i < rects.length; i++) {
            const r = rects[i]
            const range = lines[r.line]
            let u = 0
            if (range) {
                const span = Math.max(1, range.maxX - range.minX)
                const fx = clamp01((r.x + r.w / 2 - range.minX) / span)
                u =
                    dir === "right"
                        ? 1 - fx
                        : dir === "center"
                          ? Math.abs(fx - 0.5) * 2
                          : fx
            }
            const pos = r.line + u
            const lead = smootherstep((front - pos) / soft)
            const trail = smootherstep((front - band - pos) / soft)

            const blockEl = blockElsRef.current[i]
            if (blockEl) {
                const v = Math.max(0, lead - trail)
                blockEl.style.opacity = String(px(v))
                blockEl.style.transform = `scaleY(${px(0.94 + 0.06 * v)})`
            }

            const el = wordElsRef.current[i]
            if (el) el.style.opacity = String(px(trail))

            // Highlight plates ramp off the same trigger point as the word's
            // own `trail` (`front - band - pos` crossing 0), but through
            // `highlightSoft` — the Transition control's duration, in front
            // units — rather than `trail`'s own `soft`, and with no
            // `style.transition` at all: chasing a per-frame-moving target
            // with a live CSS tween is what still read as a delayed, faintly
            // stuttering fade.
            const hEl = highlightElsRef.current[i]
            if (hEl) {
                const hTrail = smootherstep((front - band - pos) / highlightSoft)
                hEl.style.opacity = String(px(hTrail))
            }
        }
    }

    const applyRef = useRef(applyProgress)
    applyRef.current = applyProgress

    const setProgress = (p: number) => {
        progressRef.current = p
        applyRef.current(p)
    }
    const setProgressRef = useRef(setProgress)
    setProgressRef.current = setProgress

    // Rule J: opacity and transform are animated imperatively, so they are NOT
    // declared in the style prop — React would clobber the live value whenever
    // any prop changes. This re-applies the LIVE progress after every render,
    // before paint, which also gives the very first frame its correct styling.
    useIsomorphicLayoutEffect(() => {
        applyRef.current(progressRef.current)
    })

    /** Duration of one full reveal, in ms. Derived, so Speed is a rate. */
    const durationMs = (): number => {
        const cfg = paramsRef.current
        const factor = Math.max(0.1, cfg.speed / SPEED_DIVISOR)
        const base = BASE_DURATION_MS / factor
        if (cfg.revealType !== "lines") return base
        const lineCount = measureRef.current?.lineCount ?? 1
        const delayStep = PER_LINE_SPAN * (Math.max(0, cfg.stagger) / 100)
        const timeline = PER_LINE_SPAN + delayStep * Math.max(0, lineCount - 1)
        return base * (timeline / PER_LINE_SPAN)
    }
    const durationRef = useRef(durationMs)
    durationRef.current = durationMs

    const lineCount = measurement?.lineCount ?? 1

    // ---------------------------------------------------------------------
    // Drive A — viewport-triggered timer (Blocks, Lines)
    // ---------------------------------------------------------------------
    useEffect(() => {
        if (isStatic) return
        if (typeof window === "undefined") return

        let raf = 0
        let armed = true
        setProgressRef.current(0)

        const play = () => {
            const duration = Math.max(1, durationRef.current())
            const t0 = performance.now()
            const tick = (now: number) => {
                const t = clamp01((now - t0) / duration)
                setProgressRef.current(t)
                if (t < 1) raf = requestAnimationFrame(tick)
                else raf = 0
            }
            raf = requestAnimationFrame(tick)
        }

        const check = () => {
            if (!armed) return
            const el = hostRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const vh = window.innerHeight || 0
            const triggerY =
                viewport === "top" ? 0 : viewport === "bottom" ? vh : vh / 2
            // `rect.top <= triggerY` ALONE, where the source also demanded
            // `rect.bottom >= triggerY`. That second test means a paragraph
            // shorter than the distance from its top to the trigger line never
            // straddles it, so a component placed above the fold with Viewport
            // "Center" never fires and its text stays invisible forever — a
            // headless probe caught it at 0 of 27 words revealed after 90
            // frames. Dropping the test changes nothing for a block scrolling
            // up from below (its top crosses the line first, while its bottom
            // is still past it); it only adds the case where the line has
            // ALREADY been passed, which is exactly when the reveal is due.
            if (rect.top <= triggerY) {
                armed = false
                window.removeEventListener("scroll", check)
                window.removeEventListener("resize", check)
                play()
            }
        }

        check()
        window.addEventListener("scroll", check, { passive: true })
        window.addEventListener("resize", check)
        return () => {
            armed = false
            window.removeEventListener("scroll", check)
            window.removeEventListener("resize", check)
            if (raf) cancelAnimationFrame(raf)
        }
    }, [isStatic, revealType, viewport, speed, stagger, lineCount])

    // ---------------------------------------------------------------------
    // Render — structure once. Everything animated is written imperatively.
    // ---------------------------------------------------------------------

    const Tag = HTML_TAG as unknown as React.ElementType

    return (
        <div
            ref={hostRef}
            style={{
                minWidth: MIN_WIDTH,
                minHeight: MIN_HEIGHT,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "visible",
                cursor: "default",
                ...style,
            }}
        >
            <Tag
                ref={textRef as React.Ref<HTMLElement>}
                style={{
                    margin: 0,
                    width: "100%",
                    color: textColor,
                    textAlign: align,
                    position: "relative",
                    ...font,
                }}
            >
                {isLines && measurement && (
                    <span
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            zIndex: 2,
                            overflow: "hidden",
                        }}
                    >
                        {measurement.lines.map((lr) => {
                            // Same overscan the highlight plate uses (±HIGHLIGHT_V_EXTEND
                            // em off the word's own line box), so this panel comes out
                            // exactly as tall as a highlight plate over the same line.
                            const vExtend = lr.hText * HIGHLIGHT_V_EXTEND
                            return (
                                // The wrapper carries the line's geometry; the
                                // panel(s) inside carry the transform, so Center can
                                // hold two of them without re-deriving any position.
                                <span
                                    key={`line-${lr.line}`}
                                    style={{
                                        position: "absolute",
                                        left: px(lr.minX - LINE_PAD_X),
                                        top: px(lr.topBox - vExtend),
                                        width: px(
                                            lr.maxX - lr.minX + LINE_PAD_X * 2
                                        ),
                                        height: px(lr.hLine + vExtend * 2),
                                    }}
                                >
                                    <span
                                        ref={(el) => {
                                            lineBlockElsRef.current[lr.line] = el
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            bottom: 0,
                                            left: 0,
                                            // Half a pixel of overlap, or the two
                                            // panels leave a hairline at the middle
                                            // while the cover is closed.
                                            width: splitLines
                                                ? "calc(50% + 0.5px)"
                                                : "100%",
                                            background: blockColor,
                                            // Rounded is hidden for Lines: the block
                                            // is animated with scaleX, which would
                                            // draw any radius as a squashed ellipse
                                            // (rule F).
                                            borderRadius: 0,
                                            transition: "none",
                                            willChange: "transform",
                                            backfaceVisibility: "hidden",
                                        }}
                                    />
                                    {splitLines && (
                                        <span
                                            ref={(el) => {
                                                lineBlockBElsRef.current[
                                                    lr.line
                                                ] = el
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                bottom: 0,
                                                left: "50%",
                                                right: 0,
                                                background: blockColor,
                                                borderRadius: 0,
                                                transition: "none",
                                                willChange: "transform",
                                                backfaceVisibility: "hidden",
                                            }}
                                        />
                                    )}
                                </span>
                            )
                        })}
                    </span>
                )}

                {!isLines && measurement && (
                    <span
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            zIndex: 2,
                        }}
                    >
                        {measurement.rects.map((r, i) => {
                            const w = r.w * (1 + BLOCK_BLEED_X)
                            const h = r.hText * BLOCK_HEIGHT
                            return (
                                <span
                                    key={`block-${i}`}
                                    ref={(el) => {
                                        blockElsRef.current[i] = el
                                    }}
                                    style={{
                                        position: "absolute",
                                        left: px(r.x - r.w * (BLOCK_BLEED_X / 2)),
                                        top: px(
                                            r.yText - r.hText * BLOCK_TOP_LIFT
                                        ),
                                        width: px(w),
                                        height: px(h),
                                        background: blockColor,
                                        borderRadius: px(radiusPx(w, h, rounded)),
                                        transformOrigin: "50% 50%",
                                        // No transition: the per-word front
                                        // ramps these values every frame, and a
                                        // transition on top only adds lag.
                                        transition: "none",
                                        willChange: "opacity, transform",
                                    }}
                                />
                            )
                        })}
                    </span>
                )}

                {words.map((word, i) => {
                    const item = highlightMap.get(i)
                    const breaks: React.ReactNode[] = []
                    for (let b = 0; b < word.breaks; b++)
                        breaks.push(<br key={`br-${i}-${b}`} />)
                    return (
                        <React.Fragment key={`word-${i}`}>
                            <span
                                ref={(el) => {
                                    wordElsRef.current[i] = el
                                }}
                                style={{
                                    display: "inline-block",
                                    marginRight: "0.25em",
                                    verticalAlign: "baseline",
                                    lineHeight: "inherit",
                                    position: "relative",
                                    // Highlighted words sit ABOVE the band, as
                                    // in the reference.
                                    zIndex: item ? 4 : 1,
                                    color: item?.textColor ?? textColor,
                                    // Both types drive word opacity per frame.
                                    transition: "none",
                                }}
                            >
                                <span
                                    ref={(el) => {
                                        strutElsRef.current[i] = el
                                    }}
                                    aria-hidden="true"
                                    style={{
                                        display: "inline-block",
                                        width: 0,
                                        height: 0,
                                    }}
                                />
                                {item?.block && (
                                    <span
                                        aria-hidden="true"
                                        ref={(el) => {
                                            highlightElsRef.current[i] = el
                                        }}
                                        style={{
                                            position: "absolute",
                                            left: `-${HIGHLIGHT_H_EXTEND}em`,
                                            right: `-${HIGHLIGHT_H_EXTEND}em`,
                                            top: `-${HIGHLIGHT_V_EXTEND}em`,
                                            bottom: `-${HIGHLIGHT_V_EXTEND}em`,
                                            background: item.color,
                                            zIndex: -1,
                                            pointerEvents: "none",
                                            // No CSS transition: applyProgress
                                            // writes a per-frame eased opacity,
                                            // same as the word/block spans, so
                                            // there is never a live tween left
                                            // chasing a value that keeps moving.
                                            transition: "none",
                                            // Starting state only — applyProgress
                                            // owns opacity from the first layout
                                            // effect on, eased in rather than
                                            // appearing instantly.
                                            opacity: 0,
                                        }}
                                    />
                                )}
                                {word.text}
                            </span>
                            {breaks}
                        </React.Fragment>
                    )
                })}
            </Tag>
        </div>
    )
}

BlockTextReveal.displayName = "Block Text Reveal"
