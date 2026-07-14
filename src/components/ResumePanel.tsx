import TextPanel from './TextPanel'
import { TrashIcon, SparkleIcon } from './Icons'
import { EXAMPLE_RESUME } from '../lib/examples'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function ResumePanel({ value, onChange }: Props) {
  return (
    <TextPanel
      title="My Resume"
      subtitle="Paste your current resume"
      value={value}
      onChange={onChange}
      accent="emerald"
      placeholder="Paste your current resume here…"
      actions={
        <>
          <button
            className="btn-ghost"
            onClick={() => onChange(EXAMPLE_RESUME)}
            title="Load an example resume"
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
