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
        <div className="scroll-area overflow-x-auto border-b border-slate-200 p-3 dark:border-slate-800">
          <div className="inline-flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/70">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-700 dark:text-white dark:ring-white/5'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
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
