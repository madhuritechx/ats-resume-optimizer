# ATS Resume Optimizer

A modern, responsive web app that rewrites your resume to match a specific job description — while staying **100% truthful**. It never invents experience, metrics, technologies, or credentials. It only rewrites, reorganizes, and strengthens what's already there.

Powered by **Claude (Opus 4)** via [Puter.js](https://developer.puter.com/) — **free, with no API key required.**

**▶ Live demo:** https://madhuritechx.github.io/ats-resume-optimizer/

Built with **React + TypeScript + TailwindCSS + Vite**. No backend — everything runs in your browser.

---

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

## Truthfulness guarantee

The optimizer is prompt-locked so the AI may **only** rewrite, reorganize, strengthen wording, surface genuinely-supported keywords, and fix grammar/clarity. It will **never** invent experience, projects, certifications, companies, metrics, promotions, or technologies. Genuinely-missing keywords are surfaced as honest gaps in the report — never fabricated into the resume.

## How the AI works (no API key!)

This app uses **Puter.js**, which provides free, keyless access to Claude directly from the browser under a "user-pays" model:

- **You** (the developer): nothing to configure — no API key, no billing.
- **Each user**: a one-time, free Puter sign-in popup appears the first time they click *Optimize Resume*. After that it just works.

## Getting started

### Option 1 — Standalone file (zero setup)
Open [`standalone.html`](standalone.html) directly in your browser. It's fully self-contained (loads React, Tailwind, and Puter.js from CDNs). Or just use the [live demo](https://madhuritechx.github.io/ats-resume-optimizer/).

### Option 2 — Dev mode
```bash
npm install
npm run dev
```
Open the printed local URL (usually http://localhost:5173/).

### Option 3 — Production build
```bash
npm run build      # type-check + build to dist/
npm run preview    # preview the built app
```

## Usage

1. Paste a job description on the left (or click **Example**).
2. Paste your resume on the right (or click **Example**).
3. Click **Optimize Resume** (complete the free Puter sign-in on first use).
4. Review the four tabs and export your optimized resume as PDF, DOCX, or Markdown.

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
    MarkdownView.tsx          # markdown renderer w/ keyword highlight
    Icons.tsx                 # inline SVG icons
    tabs/                     # the four output tabs
  lib/
    claude.ts                 # Puter.js AI call + result normalization
    prompt.ts                 # system + user prompt (truthfulness rules)
    export.ts                 # PDF / DOCX / Markdown / clipboard
    examples.ts               # sample job description + resume
    types.ts                  # shared types
  hooks/
    useTheme.ts               # light/dark theme

standalone.html               # single-file, buildless version of the whole app
docs/index.html               # copy of standalone.html served by GitHub Pages
```

The model returns a single structured JSON payload (optimized resume, ATS report, keyword comparison, change log, scores) that drives the UI. The truthfulness rules live in [`src/lib/prompt.ts`](src/lib/prompt.ts).

## Tech stack

React · TypeScript · TailwindCSS · Vite · Puter.js (Claude) · react-markdown · jsPDF · docx · FileSaver

## License

[MIT](LICENSE) © madhuritechx
