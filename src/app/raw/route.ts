import { decompressFromEncodedURIComponent } from "lz-string"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"
import { detectLanguage } from "@/lib/language"

export const runtime = "edge"

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    return redirect("/")
  }

  const decompressed = decompressFromEncodedURIComponent(code)
  const ext = detectLanguage(decompressed)

  const fileName = `gist.${crypto.randomUUID()}.${ext}`

  const blob = new Blob([decompressed], {
    type: `text/plain;charset=UTF-8;name=${fileName}`,
  })

  return new Response(blob, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
