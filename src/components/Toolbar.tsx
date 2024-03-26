"use client"

import { Query } from "@/lib/route"
import { copyToClipboard } from "@/lib/utils"
import monaco from "monaco-editor"
import { useRouter } from "next/navigation"
import React, { MouseEventHandler, useEffect, useMemo } from "react"

type Props = {
  editor: React.RefObject<monaco.editor.IStandaloneCodeEditor>
  query: Query
}

const generateTools = (
  editor: Props["editor"],
  router: ReturnType<typeof useRouter>
): Record<string, MouseEventHandler<HTMLButtonElement>> => ({
  New: () => {
    router.push("/")
  },
  "Reset to default": () => {
    const url = new URL(location.href)

    const template = url.searchParams.get("template")

    if (!template) {
      return
    }

    url.searchParams.set("code", template)
    url.searchParams.delete("shared")

    router.replace(url.toString())
  },
  "Copy URL": async (e) => {
    if ((e.target as HTMLButtonElement).textContent === "Copied") return

    const url = new URL(location.href)
    url.searchParams.set("template", url.searchParams.get("code")!)
    url.searchParams.set("shared", "true")

    const copied = await copyToClipboard(url.toString())

    ;(e.target as HTMLButtonElement).textContent = copied ? "Copied" : "Failed"

    setTimeout(() => {
      ;(e.target as HTMLButtonElement).textContent = "Copy"
    }, 1000)
  },
  Copy: async (e) => {
    if ((e.target as HTMLButtonElement).textContent === "Copied") return

    const copied = await copyToClipboard(editor.current?.getValue() ?? "")

    ;(e.target as HTMLButtonElement).textContent = copied ? "Copied" : "Failed"

    setTimeout(() => {
      ;(e.target as HTMLButtonElement).textContent = "Copy"
    }, 1000)
  },
  Raw: () => {
    const url = new URL(location.href)
    router.push(`/raw?code=${url.searchParams.get("code")}`)
  },
})

const Toolbar = ({ editor, query }: Props) => {
  const router = useRouter()

  const tools = useMemo(() => generateTools(editor, router), [editor, router])

  return (
    <nav className="flex w-full bg-gray-800 text-white">
      {Object.entries(tools)
        .map(([name, action]) => (
          <button
            key={name}
            className="h-full py-1 px-4 hover:bg-gray-700"
            onClick={action}
          >
            {name}
          </button>
        ))
        .filter(Boolean)}
    </nav>
  )
}

export default Toolbar
