import { useEffect, useState } from 'react'

const STEPS = [
  'Analyzing the job description…',
  'Extracting required skills, technologies & ATS keywords…',
  'Analyzing your resume…',
  'Identifying gaps and weak wording…',
  'Rewriting your resume — truthfully…',
  'Scoring ATS compatibility & alignment…',
]

export default function Loading() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s))
    }, 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="card animate-fade-in flex flex-col items-center gap-6 px-6 py-14">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-500" />
        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
          </svg>
        </div>
      </div>

      <div className="w-full max-w-md space-y-2">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              i === step
                ? 'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                : i < step
                  ? 'text-slate-400 line-through dark:text-slate-600'
                  : 'text-slate-400 dark:text-slate-600'
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                i < step
                  ? 'bg-emerald-500 text-white'
                  : i === step
                    ? 'bg-indigo-500 text-white'
                    : 'border border-slate-300 dark:border-slate-700'
              }`}
            >
              {i < step ? '✓' : ''}
            </span>
            {label}
          </div>
        ))}
      </div>

      <div className="h-1 w-full max-w-md overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-500 transition-[width] duration-700 ease-out"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
