import hljs from "highlight.js"

export function detectLanguage(source: string) {
  return hljs.highlightAuto(source).language ?? "txt"
}
