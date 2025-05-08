import type React from "react"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Visual Alchemy - Creative Brief & Scene Generator",
  description: "Generate creative briefs and 3D scenes for your visual projects",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <main>{children}</main>
      </body>
    </html>
  )
}
