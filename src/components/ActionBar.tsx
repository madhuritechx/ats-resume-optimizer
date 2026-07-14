import { SparkleIcon } from './Icons'

interface Props {
  onOptimize: () => void
  loading: boolean
  disabled: boolean
  hint?: string
}

export default function ActionBar({ onOptimize, loading, disabled, hint }: Props) {
  return (
    <div className="sticky bottom-4 z-30">
      <div className="card flex flex-col items-center gap-3 border-indigo-100 p-3 shadow-lg shadow-indigo-600/5 dark:border-slate-800 sm:flex-row sm:justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {hint ?? 'Truthful, ATS-optimized rewriting powered by Claude.'}
        </p>
        <button
          onClick={onOptimize}
          disabled={disabled || loading}
          className="btn-primary w-full px-8 py-3 text-base sm:w-auto"
        >
          <SparkleIcon width={18} height={18} />
          {loading ? 'Optimizing…' : 'Optimize Resume'}
        </button>
      </div>
    </div>
  )
}
