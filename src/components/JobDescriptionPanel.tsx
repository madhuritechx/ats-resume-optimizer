import TextPanel from './TextPanel'
import { TrashIcon, PasteIcon, SparkleIcon } from './Icons'
import { EXAMPLE_JOB_DESCRIPTION } from '../lib/examples'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function JobDescriptionPanel({ value, onChange }: Props) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) onChange(value ? `${value}\n${text}` : text)
    } catch {
      alert('Clipboard access was blocked. Paste manually with ⌘/Ctrl + V.')
    }
  }

  return (
    <TextPanel
      title="Job Description"
      subtitle="Paste the complete job posting"
      value={value}
      onChange={onChange}
      accent="indigo"
      placeholder="Paste the full job description here…"
      actions={
        <>
          <button className="btn-ghost" onClick={handlePaste} title="Paste from clipboard">
            <PasteIcon /> Paste
          </button>
          <button
            className="btn-ghost"
            onClick={() => onChange(EXAMPLE_JOB_DESCRIPTION)}
            title="Load an example job description"
          >
            <SparkleIcon /> Example
          </button>
          <button
            className="btn-ghost"
            onClick={() => onChange('')}
            disabled={!value}
            title="Clear"
          >
            <TrashIcon /> Clear
          </button>
        </>
      }
    />
  )
}
