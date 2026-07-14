import { SYSTEM_PROMPT, buildUserPrompt } from './prompt'
import type { OptimizationResult } from './types'

// Claude model via Puter.js (free, keyless, browser-side).
// Sonnet-tier is Puter's free offering; premium models (Opus) require Puter credits.
const MODEL = 'claude-sonnet-4'

/** Puter rejects with plain objects — dig out a human-readable message. */
function describeError(err: unknown): string {
  if (!err) return 'Unknown error.'
  if (typeof err === 'string') return err
  const e = err as {
    message?: string
    error?: string | { message?: string; delegate?: string }
    code?: string
  }
  if (typeof e.message === 'string' && e.message) return e.message
  if (typeof e.error === 'string' && e.error) return e.error
  if (e.error && typeof e.error === 'object' && e.error.message) return e.error.message
  try {
    return JSON.stringify(err)
  } catch {
    return String(err)
  }
}

/** Pull the first balanced JSON object out of a text blob. */
function extractJson(text: string): string {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object found in the model response.')
  }
  return text.slice(start, end + 1)
}

/** Puter returns different shapes per provider — normalize to plain text. */
function extractText(resp: unknown): string {
  if (typeof resp === 'string') return resp
  const r = resp as {
    message?: { content?: unknown }
    content?: unknown
    text?: string
  }
  const content = r?.message?.content ?? r?.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((b) => (typeof b === 'string' ? b : (b?.text ?? '')))
      .join('')
  }
  if (typeof r?.text === 'string') return r.text
  return String(resp ?? '')
}

export async function optimizeResume(
  jobDescription: string,
  resume: string,
): Promise<OptimizationResult> {
  if (typeof puter === 'undefined') {
    throw new Error('Puter.js failed to load. Check your connection and refresh the page.')
  }

  // Combine system + user into one prompt for cross-provider reliability.
  const prompt = `${SYSTEM_PROMPT}\n\n${buildUserPrompt(jobDescription, resume)}`

  let resp: unknown
  try {
    resp = await puter.ai.chat(prompt, { model: MODEL, max_tokens: 16000 })
  } catch (err) {
    throw new Error('The AI request failed. ' + describeError(err))
  }

  // Puter can resolve with an error payload instead of rejecting.
  const errShape = resp as { success?: boolean; error?: unknown }
  if (errShape && errShape.success === false) {
    throw new Error('The AI request failed. ' + describeError(errShape.error ?? errShape))
  }

  const text = extractText(resp)
  if (!text.trim()) {
    throw new Error('The model returned an empty response. Please try again.')
  }

  let parsed: OptimizationResult
  try {
    parsed = JSON.parse(extractJson(text)) as OptimizationResult
  } catch (err) {
    throw new Error(
      'Could not parse the optimization result. ' +
        (err instanceof Error ? err.message : String(err)),
    )
  }

  return normalizeResult(parsed)
}

/** Guard against missing fields so the UI never crashes on a partial payload. */
function normalizeResult(r: Partial<OptimizationResult>): OptimizationResult {
  return {
    optimizedResume: r.optimizedResume ?? '',
    atsReport: {
      matchPercent: r.atsReport?.matchPercent ?? 0,
      missingKeywords: r.atsReport?.missingKeywords ?? [],
      matchedKeywords: r.atsReport?.matchedKeywords ?? [],
      skillsAlignment: r.atsReport?.skillsAlignment ?? [],
      suggestedImprovements: r.atsReport?.suggestedImprovements ?? [],
    },
    keywordComparison: r.keywordComparison ?? [],
    changeLog: r.changeLog ?? [],
    scores: {
      ats: r.scores?.ats ?? 0,
      readability: r.scores?.readability ?? 0,
      keywordDensity: r.scores?.keywordDensity ?? 0,
      skillsCoverage: r.scores?.skillsCoverage ?? 0,
      overallMatch: r.scores?.overallMatch ?? 0,
    },
    insertedKeywords: r.insertedKeywords ?? [],
  }
}
