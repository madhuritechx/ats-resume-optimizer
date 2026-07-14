import { useState } from 'react'
import type { OptimizationResult } from '../lib/types'
import ScoreBars from './ScoreBars'
import OptimizedResumeTab from './tabs/OptimizedResumeTab'
import AtsReportTab from './tabs/AtsReportTab'
import KeywordComparisonTab from './tabs/KeywordComparisonTab'
import ChangeLogTab from './tabs/ChangeLogTab'

interface Props {
  result: OptimizationResult
}

const TABS = [
  { id: 'resume', label: 'Optimized Resume' },
  { id: 'report', label: 'ATS Match Report' },
  { id: 'keywords', label: 'Keyword Comparison' },
  { id: 'changes', label: 'Change Log' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function OutputTabs({ result }: Props) {
  const [tab, setTab] = useState<TabId>('resume')

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Scoring
        </h2>
        <ScoreBars scores={result.scores} />
      </div>

      <div className="card overflow-hidden">
        <div className="scroll-area flex gap-1 overflow-x-auto border-b border-slate-200 p-1.5 dark:border-slate-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          {tab === 'resume' && <OptimizedResumeTab result={result} />}
          {tab === 'report' && <AtsReportTab result={result} />}
          {tab === 'keywords' && <KeywordComparisonTab result={result} />}
          {tab === 'changes' && <ChangeLogTab result={result} />}
        </div>
      </div>
    </div>
  )
}
