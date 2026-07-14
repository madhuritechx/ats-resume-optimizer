import { useEffect, useState } from 'react'
import { getApiKey, setApiKey } from '../lib/claude'
import { KeyIcon } from './Icons'

interface Props {
  open: boolean
  onClose: () => void
}

export default function ApiKeyModal({ open, onClose }: Props) {
  const [key, setKey] = useState('')

  useEffect(() => {
    if (open) setKey(getApiKey())
  }, [open])

  if (!open) return null

  const save = () => {
    setApiKey(key.trim())
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card animate-fade-in w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
            <KeyIcon width={20} height={20} />
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Anthropic API Key
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Stored locally in your browser only
            </p>
          </div>
        </div>

        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-ant-…"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && save()}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />

        <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          This app runs entirely in your browser with no backend. Your key is saved to
          <code className="mx-1 rounded bg-slate-100 px-1 dark:bg-slate-800">localStorage</code>
          and used only to call Claude directly. Get a key at{' '}
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 underline dark:text-indigo-400"
          >
            console.anthropic.com
          </a>
          .
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={save}>
            Save Key
          </button>
        </div>
      </div>
    </div>
  )
}
