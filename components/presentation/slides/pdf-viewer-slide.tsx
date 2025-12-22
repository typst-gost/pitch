"use client"

import type React from "react"

import { motion } from "framer-motion"

interface PDFViewerSlideProps {
  title: string
  subtitle?: string
  description?: string
  // Slot for PDF viewer component
  children?: React.ReactNode
}

export function PDFViewerSlide({ title, subtitle, description, children }: PDFViewerSlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col px-16 lg:px-24 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        {subtitle && (
          <span className="text-primary text-sm font-medium tracking-wider uppercase mb-2 block">{subtitle}</span>
        )}
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h2>
        {description && <p className="text-muted-foreground text-lg max-w-2xl">{description}</p>}
      </motion.div>

      {/* PDF Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex-1 relative bg-card/30 rounded-2xl border border-border overflow-hidden shadow-2xl"
      >
        {children ? (
          children
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="w-24 h-32 bg-white rounded-lg shadow-lg mx-auto mb-4 flex items-center justify-center border">
                <span className="text-4xl text-muted-foreground/30">PDF</span>
              </div>
              <p className="text-sm">PDF Viewer Placeholder</p>
              <p className="text-xs text-muted-foreground/50 mt-1">Add your PDF component here</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Page indicator hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-4 text-sm text-muted-foreground"
      >
        Используйте стрелки для навигации по страницам
      </motion.div>
    </div>
  )
}
