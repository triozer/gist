import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "gist",
  description: `A (very) simple code editor.\nMainly for sharing code snippets with others and use it in an iframe.`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Suspense fallback={<Skeleton className="h-screen w-screen" />}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
