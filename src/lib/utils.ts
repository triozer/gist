import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyToClipboard(value: string) {
  let copied = false

  try {
    await navigator.clipboard.writeText(value)
    copied = true
  } catch (err) {
    console.error("Failed to copy text:", err)
    copied = false
  }

  return copied
}
