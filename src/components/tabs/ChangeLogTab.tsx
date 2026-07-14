import type { ChangeEntry, OptimizationResult } from '../../lib/types'

interface Props {
  result: OptimizationResult
}

const TYPE_META: Record<ChangeEntry['type'], { label: string; className: string }> = {
  keyword: {
    label: 'ATS Keyword',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200',
  },
  wording: {
    label: 'Stronger Wording',
    className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200',
  },
  clarity: {
    label: 'Clarity',
    className: 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200',
  },
  grammar: {
    label: 'Grammar',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200',
  },
  reorganize: {
    label: 'Reorganized',
    className: 'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200',
  },
}

export default function ChangeLogTab({ result }: Props) {
  const { changeLog } = result

  return (
    <div className="animate-fade-in space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {changeLog.length} change{changeLog.length === 1 ? '' : 's'} made — each one preserves the
        truth of your experience.
      </p>

      <div className="space-y-4">
        {changeLog.map((change, i) => {
          const meta = TYPE_META[change.type] ?? TYPE_META.wording
          return (
            <div key={i} className="card p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {change.section}
                </span>
                <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${meta.className}`}>
                  {meta.label}
                </span>
              </div>

              <div className="space-y-2">
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 dark:border-rose-500/30 dark:bg-rose-500/10">
                  <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-rose-500 dark:text-rose-400">
                    Original
                  </span>
                  <p className="text-sm text-rose-900 line-through decoration-rose-400/60 dark:text-rose-200">
                    {change.original}
                  </p>
                </div>

                <div className="flex justify-center text-slate-400">↓</div>

                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                  <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    Improved
                  </span>
                  <p className="text-sm text-emerald-900 dark:text-emerald-100">
                    {change.improved}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  Why:{' '}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300">{change.reason}</span>
              </div>
            </div>
          )
        })}

        {changeLog.length === 0 && (
          <div className="card p-8 text-center text-sm text-slate-500">
            No changes were recorded.
          </div>
        )}
      </div>
    </div>
  )
}
