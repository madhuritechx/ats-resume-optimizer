import { useEffect, useState } from 'react'
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
  if (value >= 80) return 'bg-gradient-to-r from-emerald-500 to-emerald-400'
  if (value >= 60) return 'bg-gradient-to-r from-amber-500 to-amber-400'
  return 'bg-gradient-to-r from-rose-500 to-rose-400'
}

function textColor(value: number): string {
  if (value >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (value >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-rose-600 dark:text-rose-400'
}

function dotColor(value: number): string {
  if (value >= 80) return 'bg-emerald-500'
  if (value >= 60) return 'bg-amber-500'
  return 'bg-rose-500'
}

function trendLabel(value: number): string {
  if (value >= 80) return 'Strong'
  if (value >= 60) return 'Fair'
  return 'Needs work'
}

function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

function ScoreCard({ label, value, delay }: { label: string; value: number; delay: number }) {
  const shown = useCountUp(value)
  return (
    <div className="card card-hover p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <span className={`text-lg font-bold tabular-nums ${textColor(value)}`}>{shown}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full ${barColor(value)}`}
          style={{
            width: `${shown}%`,
            transition: `width 900ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
          }}
        />
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor(value)}`} />
        {trendLabel(value)}
      </div>
    </div>
  )
}

export default function ScoreBars({ scores }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {ORDER.map(({ key, label }, i) => (
        <ScoreCard key={key} label={label} value={Math.round(scores[key] ?? 0)} delay={i * 90} />
      ))}
    </div>
  )
}
