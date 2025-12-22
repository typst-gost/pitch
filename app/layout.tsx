import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-jetbrains" })

export const metadata: Metadata = {
  title: "Typst ГОСТ 7.32 | Презентация",
  description: "Автоматизация оформления отчётов о НИР согласно ГОСТ 7.32-2017",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`font-sans antialiased ${_inter.variable} ${_jetbrainsMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
