import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { optimizeResume, getApiKey } from './lib/claude'
import type { OptimizationResult } from './lib/types'
import JobDescriptionPanel from './components/JobDescriptionPanel'
import ResumePanel from './components/ResumePanel'
import ActionBar from './components/ActionBar'
import OutputTabs from './components/OutputTabs'
import Loading from './components/Loading'
import ApiKeyModal from './components/ApiKeyModal'
import { SunIcon, MoonIcon, KeyIcon } from './components/Icons'

export default function App() {
  const { theme, toggle } = useTheme()
  const [jobDescription, setJobDescription] = useState('')
  const [resume, setResume] = useState('')
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [keyModalOpen, setKeyModalOpen] = useState(false)

  const canOptimize = jobDescription.trim().length > 20 && resume.trim().length > 20

  const handleOptimize = async () => {
    setError(null)

    if (!getApiKey()) {
      setKeyModalOpen(true)
      return
    }

    setLoading(true)
    setResult(null)
    try {
      const res = await optimizeResume(jobDescription, resume)
      setResult(res)
      // Bring the results into view on smaller screens.
      requestAnimationFrame(() =>
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const hint = !canOptimize
    ? 'Paste a job description and your resume to begin.'
    : undefined

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-white">
                ATS Resume Optimizer
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Truthful resume optimization for any job
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              className="btn-ghost"
              onClick={() => setKeyModalOpen(true)}
              title="Set Anthropic API key"
            >
              <KeyIcon />
              <span className="hidden sm:inline">{getApiKey() ? 'API Key' : 'Add Key'}</span>
            </button>
            <button
              className="btn-ghost !px-2"
              onClick={toggle}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Input panels */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <JobDescriptionPanel value={jobDescription} onChange={setJobDescription} />
          <ResumePanel value={resume} onChange={setResume} />
        </div>

        {/* Action bar */}
        <div className="mt-5">
          <ActionBar
            onOptimize={handleOptimize}
            loading={loading}
            disabled={!canOptimize}
            hint={hint}
          />
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Results */}
        <div id="results" className="mt-8 scroll-mt-20">
          {loading && <Loading />}
          {!loading && result && <OutputTabs result={result} />}
          {!loading && !result && !error && <EmptyState />}
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-slate-400 dark:text-slate-600 sm:px-6">
        Runs entirely in your browser · Your resume and API key never leave your device except to
        call Claude directly.
      </footer>

      <ApiKeyModal open={keyModalOpen} onClose={() => setKeyModalOpen(false)} />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M9 15l2 2 4-4" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        Your optimized resume will appear here
      </h3>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
        Paste a job description and your resume above, then click{' '}
        <span className="font-medium text-indigo-600 dark:text-indigo-400">Optimize Resume</span>.
        Claude rewrites it for ATS compatibility while staying 100% truthful.
      </p>
    </div>
  )
}
