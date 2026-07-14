# ATS Resume Optimizer

A modern, responsive web app that optimizes an existing resume for a specific job description while staying **100% truthful** — it never invents experience, metrics, technologies, or credentials. It only rewrites, reorganizes, and strengthens what's already there.

Built with **React + TypeScript + TailwindCSS + Vite**. No backend — everything runs locally in your browser and calls Claude directly.

## Features

- **Two-panel input** — Job Description (left) and My Resume (right), each with live word/character counts, Clear, Paste, and Example buttons.
- **One-click optimization** via a sticky *Optimize Resume* button with an animated multi-step progress indicator.
- **Four result tabs:**
  1. **Optimized Resume** — the rewritten resume (Markdown rendered), with inserted ATS keywords highlighted in green.
  2. **ATS Match Report** — estimated match %, matched/missing keywords, skills alignment, and suggested improvements.
  3. **Keyword Comparison** — a filterable `Job Keyword | Resume | Status` table (✓ Present / △ Weak / ✗ Missing).
  4. **Change Log** — every change shown as Original → Improved with an explanation of why.
- **Scoring bars** — ATS Score, Readability, Keyword Density, Skills Coverage, Overall Match.
- **Export** — Copy, Download PDF, Download DOCX, Export Markdown.
- **Light / Dark mode** with system-preference detection.
- Fully responsive; supports long (multi-page) resumes without truncation.

## Getting started

```bash
cd ats-resume-optimizer
npm install
npm run dev
```

Open the printed local URL. Click **Add Key** in the header and paste your Anthropic API key
(get one at [console.anthropic.com](https://console.anthropic.com/settings/keys)).

> Your API key and resume never leave your device except to call the Claude API directly.
> The key is stored only in your browser's `localStorage`.

## Build

```bash
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
```

## Architecture

```
src/
  App.tsx                     # layout, state, orchestration
  components/
    JobDescriptionPanel.tsx   # left input panel
    ResumePanel.tsx           # right input panel
    TextPanel.tsx             # shared textarea + counts + actions
    ActionBar.tsx             # sticky Optimize button
    OutputTabs.tsx            # tabbed results container
    ScoreBars.tsx             # scoring progress bars
    Loading.tsx               # animated progress indicator
    ApiKeyModal.tsx           # API key entry (localStorage)
    MarkdownView.tsx          # markdown renderer w/ keyword highlight
    Icons.tsx                 # inline SVG icons
    tabs/                     # the four output tabs
  lib/
    claude.ts                 # Anthropic API call + result normalization
    prompt.ts                 # system + user prompt (truthfulness rules)
    export.ts                 # PDF / DOCX / Markdown / clipboard
    examples.ts               # sample job description + resume
    types.ts                  # shared types
  hooks/
    useTheme.ts               # light/dark theme
```

The model is prompted to return a single structured JSON payload (optimized resume, ATS report,
keyword comparison, change log, scores). The truthfulness rules live in `lib/prompt.ts`.
