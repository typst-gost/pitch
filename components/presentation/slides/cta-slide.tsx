"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight, ExternalLink } from "lucide-react"

interface QRItem {
  label: string
  qrCode?: string // QR image path, if not provided will show placeholder
}

interface CTASlideProps {
  title: string
  subtitle?: string
  ctaText?: string
  showLogo?: boolean
  author?: {
    name: string
    email: string
    avatar?: string
  }
  qrCodes?: QRItem[]
  links?: { label: string; url: string }[]
}

export function CTASlide({ title, subtitle, ctaText, showLogo = true, author, qrCodes, links }: CTASlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, #2563E8 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl h-full py-12">
        {/* Top section: Logo and Title */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Image src="/logo.svg" alt="Logo" width={80} height={97} className="h-20 w-auto mx-auto" />
            </motion.div>
          )}

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-4"
          >
            {title}
          </motion.h2>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-muted-foreground"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {qrCodes && qrCodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-8 mb-8"
          >
            {qrCodes.map((qr, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  {qr.qrCode ? (
                    <Image
                      src={qr.qrCode || "/placeholder.svg"}
                      alt={qr.label}
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <div className="grid grid-cols-5 gap-0.5">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-sm ${Math.random() > 0.5 ? "bg-gray-800" : "bg-transparent"}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{qr.label}</span>
              </div>
            ))}
          </motion.div>
        )}

        {author && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
              {author.avatar ? (
                <Image
                  src={author.avatar || "/placeholder.svg"}
                  alt={author.name}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              ) : (
                <span className="text-primary/50 text-lg font-semibold">
                  {author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              )}
            </div>
            <div className="text-left">
              <div className="font-semibold">{author.name}</div>
              <div className="text-sm text-muted-foreground">{author.email}</div>
            </div>
          </motion.div>
        )}

        {/* Bottom section: Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-4"
        >
          {ctaText && (
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold hover:shadow-[0_0_40px_rgba(37,99,232,0.4)] transition-shadow">
              {ctaText}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {links && links.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-full text-sm hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  {link.label}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
