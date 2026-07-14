import { useMemo, type ReactNode } from 'react'

interface TextPanelProps {
  title: string
  subtitle?: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  /** action buttons rendered in the panel header */
  actions: ReactNode
  accent: 'indigo' | 'emerald'
}

function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

const accentDot: Record<TextPanelProps['accent'], string> = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
}

export default function TextPanel({
  title,
  subtitle,
  value,
  onChange,
  placeholder,
  actions,
  accent,
}: TextPanelProps) {
  const words = useMemo(() => countWords(value), [value])
  const chars = value.length

  return (
    <section className="card flex min-h-[420px] flex-col overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${accentDot[accent]}`} />
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">{actions}</div>
      </header>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck
        className="scroll-area flex-1 resize-none bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-600"
      />

      <footer className="flex items-center justify-end gap-4 border-t border-slate-200 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{words.toLocaleString()}</span> words
        </span>
        <span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{chars.toLocaleString()}</span> characters
        </span>
      </footer>
    </section>
  )
}
