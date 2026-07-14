export type KeywordStatus = 'present' | 'weak' | 'missing'

export interface KeywordRow {
  keyword: string
  /** How the keyword currently appears in the resume, or empty if absent */
  resume: string
  status: KeywordStatus
}

export interface SkillAlignment {
  skill: string
  /** 0-100 how well the resume covers this skill */
  coverage: number
  note: string
}

export interface ChangeEntry {
  section: string
  original: string
  improved: string
  reason: string
  /** classification used for highlight color */
  type: 'keyword' | 'wording' | 'clarity' | 'grammar' | 'reorganize'
}

export interface AtsReport {
  matchPercent: number
  missingKeywords: string[]
  matchedKeywords: string[]
  skillsAlignment: SkillAlignment[]
  suggestedImprovements: string[]
}

export interface Scores {
  ats: number
  readability: number
  keywordDensity: number
  skillsCoverage: number
  overallMatch: number
}

export interface OptimizationResult {
  optimizedResume: string
  atsReport: AtsReport
  keywordComparison: KeywordRow[]
  changeLog: ChangeEntry[]
  scores: Scores
  /** keywords that were newly woven into the resume (highlighted green) */
  insertedKeywords: string[]
}
