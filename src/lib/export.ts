import { jsPDF } from 'jspdf'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from 'docx'
import { saveAs } from 'file-saver'

/** Very small markdown -> structured lines parser used for exports. */
interface Line {
  kind: 'h1' | 'h2' | 'h3' | 'bullet' | 'text' | 'blank' | 'hr'
  text: string
}

function parseMarkdown(md: string): Line[] {
  const lines: Line[] = []
  for (const raw of md.split('\n')) {
    const line = raw.replace(/\r$/, '')
    const trimmed = line.trim()
    if (trimmed === '') {
      lines.push({ kind: 'blank', text: '' })
    } else if (/^#\s+/.test(trimmed)) {
      lines.push({ kind: 'h1', text: stripInline(trimmed.replace(/^#\s+/, '')) })
    } else if (/^##\s+/.test(trimmed)) {
      lines.push({ kind: 'h2', text: stripInline(trimmed.replace(/^##\s+/, '')) })
    } else if (/^###\s+/.test(trimmed)) {
      lines.push({ kind: 'h3', text: stripInline(trimmed.replace(/^###\s+/, '')) })
    } else if (/^([-*])\s+/.test(trimmed)) {
      lines.push({ kind: 'bullet', text: stripInline(trimmed.replace(/^([-*])\s+/, '')) })
    } else if (/^(---|\*\*\*|___)$/.test(trimmed)) {
      lines.push({ kind: 'hr', text: '' })
    } else {
      lines.push({ kind: 'text', text: stripInline(trimmed) })
    }
  }
  return lines
}

/** Strip markdown emphasis markers for plain-text renderers. */
function stripInline(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1')
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function exportMarkdown(md: string, filename = 'optimized-resume.md'): void {
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  saveAs(blob, filename)
}

export function exportPdf(md: string, filename = 'optimized-resume.pdf'): void {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const margin = 54
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const maxWidth = pageWidth - margin * 2
  let y = margin

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage()
      y = margin
    }
  }

  for (const line of parseMarkdown(md)) {
    if (line.kind === 'blank') {
      y += 6
      continue
    }
    if (line.kind === 'hr') {
      ensureSpace(12)
      doc.setDrawColor(200)
      doc.line(margin, y, pageWidth - margin, y)
      y += 12
      continue
    }

    let size = 10
    let style: 'normal' | 'bold' = 'normal'
    let indent = 0
    let prefix = ''

    if (line.kind === 'h1') {
      size = 18
      style = 'bold'
    } else if (line.kind === 'h2') {
      size = 12
      style = 'bold'
    } else if (line.kind === 'h3') {
      size = 11
      style = 'bold'
    } else if (line.kind === 'bullet') {
      indent = 14
      prefix = '•  '
    }

    doc.setFont('helvetica', style)
    doc.setFontSize(size)

    const text = prefix + line.text
    const wrapped = doc.splitTextToSize(text, maxWidth - indent) as string[]
    const lineHeight = size * 1.35

    for (const w of wrapped) {
      ensureSpace(lineHeight)
      doc.text(w, margin + indent, y)
      y += lineHeight
    }
    if (line.kind.startsWith('h')) y += 4
  }

  doc.save(filename)
}

export async function exportDocx(md: string, filename = 'optimized-resume.docx'): Promise<void> {
  const children: Paragraph[] = []

  for (const line of parseMarkdown(md)) {
    if (line.kind === 'blank') {
      children.push(new Paragraph({ text: '' }))
    } else if (line.kind === 'hr') {
      children.push(
        new Paragraph({
          text: '',
          border: { bottom: { color: 'CCCCCC', space: 1, style: 'single', size: 6 } },
        }),
      )
    } else if (line.kind === 'h1') {
      children.push(
        new Paragraph({
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: line.text, bold: true })],
        }),
      )
    } else if (line.kind === 'h2') {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: line.text.toUpperCase(), bold: true })],
        }),
      )
    } else if (line.kind === 'h3') {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: line.text, bold: true })],
        }),
      )
    } else if (line.kind === 'bullet') {
      children.push(new Paragraph({ text: line.text, bullet: { level: 0 } }))
    } else {
      children.push(new Paragraph({ children: [new TextRun(line.text)] }))
    }
  }

  const doc = new Document({ sections: [{ children }] })
  const blob = await Packer.toBlob(doc)
  saveAs(blob, filename)
}
