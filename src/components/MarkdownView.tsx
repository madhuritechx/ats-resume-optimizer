import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

interface Props {
  markdown: string
  /** phrases to highlight green as newly-inserted ATS keywords */
  highlight?: string[]
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Wrap highlighted phrases in a <mark> as we render leaf text nodes. */
function highlightText(text: string, regex: RegExp | null): React.ReactNode {
  if (!regex) return text
  const parts = text.split(regex)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    regex.test(part) && part.trim() !== '' ? (
      <mark
        key={i}
        className="rounded bg-emerald-100 px-0.5 text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-200"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

export default function MarkdownView({ markdown, highlight }: Props) {
  const regex = useMemo(() => {
    const terms = (highlight ?? [])
      .map((h) => h.trim())
      .filter((h) => h.length > 2)
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
    if (terms.length === 0) return null
    return new RegExp(`(${terms.join('|')})`, 'gi')
  }, [highlight])

  const components: Components = useMemo(() => {
    if (!regex) return {}
    const transform = (children: React.ReactNode): React.ReactNode => {
      if (typeof children === 'string') return highlightText(children, regex)
      if (Array.isArray(children))
        return children.map((c, i) =>
          typeof c === 'string' ? <span key={i}>{highlightText(c, regex)}</span> : c,
        )
      return children
    }
    return {
      p: ({ children }) => <p>{transform(children)}</p>,
      li: ({ children }) => <li>{transform(children)}</li>,
    }
  }, [regex])

  return (
    <div className="prose-resume max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
