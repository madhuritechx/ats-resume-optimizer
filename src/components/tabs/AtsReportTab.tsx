import type { OptimizationResult } from '../../lib/types'

interface Props {
  result: OptimizationResult
}

function MatchRing({ percent }: { percent: number }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  const color =
    percent >= 80 ? 'text-emerald-500' : percent >= 60 ? 'text-amber-500' : 'text-rose-500'

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          className="stroke-slate-100 dark:stroke-slate-800"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${color} transition-[stroke-dashoffset] duration-1000 ease-out`}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${color}`}>{Math.round(percent)}%</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">ATS Match</span>
      </div>
    </div>
  )
}

export default function AtsReportTab({ result }: Props) {
  const { atsReport } = result

  return (
    <div className="animate-fade-in space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card flex flex-col items-center justify-center gap-2 p-6">
          <MatchRing percent={atsReport.matchPercent} />
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Estimated compatibility after optimization
          </p>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
            Skills Alignment
          </h3>
          <div className="scroll-area max-h-64 space-y-3 overflow-y-auto pr-1">
            {atsReport.skillsAlignment.length === 0 && (
              <p className="text-sm text-slate-500">No skills analysis available.</p>
            )}
            {atsReport.skillsAlignment.map((s) => (
              <div key={s.skill}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{s.skill}</span>
                  <span className="text-slate-500 dark:text-slate-400">{s.coverage}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      s.coverage >= 80
                        ? 'bg-emerald-500'
                        : s.coverage >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                    }`}
                    style={{ width: `${s.coverage}%` }}
                  />
                </div>
                {s.note && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <KeywordCard
          title="Matched Keywords"
          items={atsReport.matchedKeywords}
          tone="emerald"
        />
        <KeywordCard title="Missing Keywords" items={atsReport.missingKeywords} tone="rose" />
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
          Suggested Improvements
        </h3>
        <ul className="space-y-2">
          {atsReport.suggestedImprovements.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-200">
              <span className="mt-0.5 text-indigo-500">→</span>
              {s}
            </li>
          ))}
          {atsReport.suggestedImprovements.length === 0 && (
            <li className="text-sm text-slate-500">No suggestions — great match!</li>
          )}
        </ul>
      </div>
    </div>
  )
}

function KeywordCard({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: 'emerald' | 'rose'
}) {
  const chip =
    tone === 'emerald'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200'
      : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200'

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">{items.length}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((k, i) => (
          <span key={i} className={`rounded-md px-2 py-1 text-xs font-medium ${chip}`}>
            {k}
          </span>
        ))}
        {items.length === 0 && <span className="text-sm text-slate-500">None.</span>}
      </div>
    </div>
  )
}
