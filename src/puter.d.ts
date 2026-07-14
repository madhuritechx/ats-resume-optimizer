// Puter.js is loaded globally via a <script> tag in index.html.
declare const puter: {
  ai: {
    chat: (
      prompt: string | Array<{ role: string; content: string }>,
      options?: { model?: string; max_tokens?: number; temperature?: number },
    ) => Promise<unknown>
  }
}
