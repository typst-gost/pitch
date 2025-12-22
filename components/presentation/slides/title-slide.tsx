"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface TitleSlideProps {
  badge?: string
  title: string
  highlight?: string
  subtitle?: string
  showLogo?: boolean
  showMaiLogo?: boolean
}

export function TitleSlide({
  badge,
  title,
  highlight,
  subtitle,
  showLogo = true,
  showMaiLogo = false,
}: TitleSlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 overflow-hidden">
      {/* Gradient accent behind text */}
      <motion.div
        className="absolute w-[600px] h-[300px] rounded-full blur-[100px] opacity-30"
        style={{ background: "linear-gradient(135deg, #2563E8, #1441A4)" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Logos */}
      <motion.div
        className="absolute top-8 left-8 flex items-center gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {showLogo && <Image src="/logo.svg" alt="Typst GOST" width={48} height={58} className="h-12 w-auto" />}
        {showMaiLogo && (
          <Image src="/mai-logo.svg" alt="МАИ" width={40} height={40} className="h-10 w-auto opacity-80" />
        )}
      </motion.div>

      <div className="relative z-10 text-center max-w-5xl">
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-sm font-medium tracking-wide">{badge}</span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-balance"
        >
          {title}
          {highlight && (
            <>
              <br />
              <span className="bg-gradient-to-r from-primary to-[#60a5fa] bg-clip-text text-transparent">
                {highlight}
              </span>
            </>
          )}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-xs text-muted-foreground tracking-[0.3em] uppercase">Листайте</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="w-1 h-2 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
