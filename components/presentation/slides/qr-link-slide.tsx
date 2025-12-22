"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

interface QRLinkSlideProps {
  title: string
  subtitle?: string
  description?: string | React.ReactNode
  qrCode?: string // QR code image path
  qrPlaceholder?: boolean // Show placeholder QR
  link: string
  linkLabel?: string
  image?: string // Optional background or side image
  layout?: "centered" | "with-image"
}

export function QRLinkSlide({
  title,
  subtitle,
  description,
  qrCode,
  qrPlaceholder = true,
  link,
  linkLabel,
  image,
  layout = "centered",
}: QRLinkSlideProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-16 lg:px-24">
      <div className={`flex ${layout === "with-image" ? "gap-16" : ""} items-center max-w-5xl`}>
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col ${layout === "centered" ? "items-center text-center" : ""}`}
        >
          {subtitle && (
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">{subtitle}</span>
          )}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">{title}</h2>

          {description && (
            <div className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">{description}</div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Large QR Code */}
            <div className="bg-white p-6 rounded-3xl shadow-2xl">
              {qrCode ? (
                <Image
                  src={qrCode || "/placeholder.svg"}
                  alt="QR Code"
                  width={240}
                  height={240}
                  className="rounded-xl"
                />
              ) : qrPlaceholder ? (
                <div className="w-60 h-60 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${Math.random() > 0.5 ? "bg-gray-800" : "bg-transparent"}`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Smaller link button */}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-5 py-2.5 rounded-full font-medium text-sm hover:bg-primary/20 transition-colors"
            >
              {linkLabel || link}
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>

        {/* Optional side image */}
        {layout === "with-image" && image && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-96 h-96 rounded-2xl overflow-hidden border border-border"
          >
            <Image src={image || "/placeholder.svg"} alt="Illustration" fill className="object-cover" />
          </motion.div>
        )}
      </div>
    </div>
  )
}
