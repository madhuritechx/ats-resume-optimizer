import type { Scores } from '../lib/types'

interface Props {
  scores: Scores
}

const ORDER: { key: keyof Scores; label: string }[] = [
  { key: 'ats', label: 'ATS Score' },
  { key: 'readability', label: 'Readability' },
  { key: 'keywordDensity', label: 'Keyword Density' },
  { key: 'skillsCoverage', label: 'Skills Coverage' },
  { key: 'overallMatch', label: 'Overall Match' },
]

function barColor(value: number): string {
  if (value >= 80) return 'bg-emerald-500'
  if (value >= 60) return 'bg-amber-500'
  return 'bg-rose-500'
}

function textColor(value: number): string {
  if (value >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (value >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-rose-600 dark:text-rose-400'
}

export default function ScoreBars({ scores }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {ORDER.map(({ key, label }) => {
        const value = Math.round(scores[key] ?? 0)
        return (
          <div key={key} className="card p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {label}
              </span>
              <span className={`text-lg font-bold ${textColor(value)}`}>{value}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ease-out ${barColor(value)}`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
