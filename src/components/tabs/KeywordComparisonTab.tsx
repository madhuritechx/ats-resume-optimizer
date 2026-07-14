import { useMemo, useState } from 'react'
import type { KeywordStatus, OptimizationResult } from '../../lib/types'

interface Props {
  result: OptimizationResult
}

const STATUS_META: Record<
  KeywordStatus,
  { symbol: string; label: string; className: string }
> = {
  present: {
    symbol: '✓',
    label: 'Present',
    className: 'text-emerald-600 dark:text-emerald-400',
  },
  weak: { symbol: '△', label: 'Weak', className: 'text-amber-600 dark:text-amber-400' },
  missing: { symbol: '✗', label: 'Missing', className: 'text-rose-600 dark:text-rose-400' },
}

const FILTERS: ('all' | KeywordStatus)[] = ['all', 'present', 'weak', 'missing']

export default function KeywordComparisonTab({ result }: Props) {
  const [filter, setFilter] = useState<'all' | KeywordStatus>('all')

  const rows = useMemo(
    () =>
      filter === 'all'
        ? result.keywordComparison
        : result.keywordComparison.filter((r) => r.status === filter),
    [filter, result.keywordComparison],
  )

  const counts = useMemo(() => {
    const c = { present: 0, weak: 0, missing: 0 }
    for (const r of result.keywordComparison) c[r.status]++
    return c
  }, [result.keywordComparison])

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {f}
            {f !== 'all' && (
              <span className="ml-1.5 opacity-70">{counts[f as KeywordStatus]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="scroll-area max-h-[65vh] overflow-y-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Job Keyword</th>
                <th className="px-4 py-3 font-medium">Resume</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const meta = STATUS_META[row.status]
                return (
                  <tr
                    key={i}
                    className="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                      {row.keyword}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {row.resume || <span className="italic text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold ${meta.className}`}
                      >
                        <span className="text-sm">{meta.symbol}</span> {meta.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">
                    No keywords in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
