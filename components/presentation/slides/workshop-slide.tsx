"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useTypewriter, type TypewriterStep } from "../hooks/use-typewriter"
import { useEffect } from "react"

interface WorkshopSlideProps {
  title?: string
  subtitle?: string
  initialCode?: string
  steps?: TypewriterStep[]
  typeSpeed?: number
  deleteSpeed?: number
  humanize?: boolean
  // Slot for custom preview component
  preview?: React.ReactNode
  // Or use placeholder preview
  previewPlaceholder?: string
  autoStart?: boolean
}

export function WorkshopSlide({
  title,
  subtitle,
  initialCode = "",
  steps = [],
  typeSpeed = 40,
  deleteSpeed = 25,
  humanize = true,
  preview,
  previewPlaceholder = "Предпросмотр документа",
  autoStart = true,
}: WorkshopSlideProps) {
  const {
    text: code,
    isTyping,
    start,
    reset,
  } = useTypewriter({
    initialText: initialCode,
    steps,
    typeSpeed,
    deleteSpeed,
    humanize,
    autoStart: false,
  })

  useEffect(() => {
    if (autoStart && steps.length > 0) {
      const timer = setTimeout(start, 800)
      return () => clearTimeout(timer)
    }
  }, [autoStart, steps.length, start])

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Header */}
      {(title || subtitle) && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="px-8 lg:px-16 pt-8 pb-4">
          {subtitle && (
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-2 block">{subtitle}</span>
          )}
          {title && <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>}
        </motion.div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex items-center px-8 lg:px-16 pb-24 gap-8">
        {/* Code editor */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 h-full max-h-[60vh] flex flex-col"
        >
          <div className="bg-[#0d1117] rounded-t-xl border border-border/50 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-muted-foreground ml-2">main.typ</span>
            {isTyping && <span className="ml-auto text-xs text-primary animate-pulse">typing...</span>}
          </div>
          <div className="flex-1 bg-[#0d1117] rounded-b-xl border-x border-b border-border/50 p-4 overflow-auto font-mono text-sm">
            <pre className="text-[#e6edf3] whitespace-pre-wrap">
              {code}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                className="inline-block w-2 h-5 bg-primary ml-0.5 align-middle"
              />
            </pre>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 h-full max-h-[60vh] flex flex-col"
        >
          <div className="bg-muted/30 rounded-t-xl border border-border/50 px-4 py-2 flex items-center">
            <span className="text-xs text-muted-foreground">Предпросмотр</span>
          </div>
          <div className="flex-1 bg-white rounded-b-xl border-x border-b border-border/50 overflow-hidden">
            {preview ? (
              preview
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 text-sm bg-white">
                {previewPlaceholder}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Decorative gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
    </div>
  )
}
