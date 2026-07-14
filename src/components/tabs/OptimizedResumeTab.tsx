import { useState } from 'react'
import type { OptimizationResult } from '../../lib/types'
import MarkdownView from '../MarkdownView'
import { ClipboardIcon, CheckIcon, DownloadIcon, DocIcon, MarkdownIcon } from '../Icons'
import { copyToClipboard, exportPdf, exportDocx, exportMarkdown } from '../../lib/export'

interface Props {
  result: OptimizationResult
}

export default function OptimizedResumeTab({ result }: Props) {
  const [copied, setCopied] = useState(false)
  const [highlightOn, setHighlightOn] = useState(true)

  const handleCopy = async () => {
    await copyToClipboard(result.optimizedResume)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={highlightOn}
            onChange={(e) => setHighlightOn(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Highlight inserted ATS keywords
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-200">
            example
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-secondary" onClick={handleCopy}>
            {copied ? <CheckIcon /> : <ClipboardIcon />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button className="btn-secondary" onClick={() => exportPdf(result.optimizedResume)}>
            <DownloadIcon /> PDF
          </button>
          <button className="btn-secondary" onClick={() => exportDocx(result.optimizedResume)}>
            <DocIcon /> DOCX
          </button>
          <button className="btn-secondary" onClick={() => exportMarkdown(result.optimizedResume)}>
            <MarkdownIcon /> Markdown
          </button>
        </div>
      </div>

      <div className="card scroll-area max-h-[70vh] overflow-y-auto p-6 sm:p-8">
        <MarkdownView
          markdown={result.optimizedResume}
          highlight={highlightOn ? result.insertedKeywords : []}
        />
      </div>
    </div>
  )
}
