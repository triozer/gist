"use client"

import { Query, extractQuery } from "@/lib/route"
import monaco from "monaco-editor"
import { Editor, OnChange, OnMount } from "@monaco-editor/react"
import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { compressToEncodedURIComponent } from "lz-string"
import Toolbar from "@/components/Toolbar"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const [isEditorMounted, setIsEditorMounted] = useState(false)

  const [source, setSource] = useState("")

  const [query, setQuery] = useState<Query>({
    language: "txt",
    code: "",
    template: "",
    shared: "false",
    toolbar: "true",
    theme: "vs-dark",
  })

  const onMount: OnMount = (editor) => {
    editorRef.current = editor
    setIsEditorMounted(true)

    if (window.self !== window.top) {
      window.parent.postMessage(
        {
          code: editor.getValue(),
          hash: query.code,
        },
        "*"
      )
    } else {
      window.postMessage(
        {
          code: editor.getValue(),
          hash: query.code,
        },
        "*"
      )
    }
  }

  useEffect(() => {
    const { query, source } = extractQuery(searchParams, "")

    if (searchParams.toString() !== query.toString()) {
      router.replace(`/?${query.toString()}`)
    }

    setQuery(query)
    setSource(source)
  }, [router, searchParams])

  const onChange: OnChange = (newValue) => {
    const value = newValue ?? ""

    const url = new URL(location.href)
    url.searchParams.set("code", compressToEncodedURIComponent(value))
    router.replace(url.toString())
  }

  return (
    <Suspense fallback={<Skeleton className="h-screen w-screen" />}>
      <main className="flex h-screen flex-col items-center justify-between">
        {query.toolbar === "true" && (
          <Toolbar query={query} editor={editorRef} />
        )}
        <Editor
          language={query.language}
          theme={query.theme}
          value={source}
          onChange={onChange}
          onMount={onMount}
          options={{
            readOnly: query.shared === "true",
          }}
        />
      </main>
    </Suspense>
  )
}
