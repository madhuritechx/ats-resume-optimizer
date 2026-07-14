import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT, buildUserPrompt } from './prompt'
import type { OptimizationResult } from './types'

const MODEL = 'claude-opus-4-8'
const API_KEY_STORAGE = 'ats-anthropic-key'

export function getApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE) ?? ''
  } catch {
    return ''
  }
}

export function setApiKey(key: string): void {
  try {
    if (key) localStorage.setItem(API_KEY_STORAGE, key)
    else localStorage.removeItem(API_KEY_STORAGE)
  } catch {
    /* ignore */
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

export async function optimizeResume(
  jobDescription: string,
  resume: string,
): Promise<OptimizationResult> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('Missing Anthropic API key. Add it via the key button in the header.')
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(jobDescription, resume) }],
  })

  const text = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')

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
