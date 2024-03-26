import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string"
import { detectLanguage } from "./language"

export type Query = {
  language: string
  code: string
  template: string
  shared: string
  toolbar: string
  theme: string
}

export function extractQuery(
  query: URLSearchParams,
  defaultSource: string
): { query: Query & { toString: () => string }; source: string } {
  const { language, code, template, shared, toolbar, theme } = {
    language: query.get("language") ?? null,
    code: query.get("code") ?? null,
    template: query.get("template") ?? null,
    shared: query.get("shared") ?? "false",
    toolbar: query.get("toolbar") ?? "true",
    theme: query.get("theme") ?? "vs-dark",
  }

  const newQuery = new URLSearchParams()
  const source = code ? decompressFromEncodedURIComponent(code) : defaultSource

  newQuery.set("toolbar", toolbar)

  if (!language) {
    newQuery.set("language", detectLanguage(source))
  } else {
    newQuery.set("language", language)
  }

  newQuery.set("code", code ?? compressToEncodedURIComponent(source))

  if (template) {
    newQuery.set("template", template)
  }

  newQuery.set("shared", shared)
  newQuery.set("theme", theme)

  return {
    query: {
      language: newQuery.get("language")!,
      code: newQuery.get("code")!,
      template: newQuery.get("template")!,
      shared: newQuery.get("shared")!,
      toolbar: newQuery.get("toolbar")!,
      theme: newQuery.get("theme")!,
      toString: () => newQuery.toString(),
    },
    source,
  }
}
