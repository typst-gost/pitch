import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-jetbrains" })

const siteUrl = "https://pitch.typst-gost.ru";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Презентация Typst ГОСТ",
  description: "Информация о проекте typst-gost и о шаблоне modern-g7-32",
  openGraph: {
      title: "Презентация Typst ГОСТ",
      description:
        "Шаблон для оформления работ в соответствии с ГОСТ 7.32-2017",
      url: "https://pitch.typst-gost.ru",
      siteName: "Typst GOST",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Презентация Typst GOST — оформление документов автоматически",
        },
      ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typst GOST — Оформляйте документы автоматически",
    description:
      "Шаблон modern-g7-32 для Typst: ГОСТ 7.32-2017 без боли в Word и LaTeX.",
    images: ["/og"],
  },
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
