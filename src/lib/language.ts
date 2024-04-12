import hljs from "highlight.js"

export function detectLanguage(source: string) {
  hljs.unregisterLanguage("haskell")

  return hljs.highlightAuto(source).language ?? "txt"
}
