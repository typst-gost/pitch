"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface Column {
  icon?: LucideIcon
  number?: string
  title: string
  description: string
}

interface ThreeColumnSlideProps {
  title: string
  subtitle?: string
  columns: Column[]
}

export function ThreeColumnSlide({ title, subtitle, columns }: ThreeColumnSlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-center px-16 lg:px-24">
      <div className="text-center mb-20">
        {subtitle && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block"
          >
            {subtitle}
          </motion.span>
        )}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold tracking-tight"
        >
          {title}
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto w-full">
        {columns.map((column, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.15 }}
            className="text-center"
          >
            {column.icon && (
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <column.icon className="w-8 h-8 text-primary" />
              </div>
            )}
            {column.number && (
              <div className="w-16 h-16 rounded-2xl border-2 border-primary/30 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary">{column.number}</span>
              </div>
            )}
            <h3 className="text-2xl font-semibold mb-4">{column.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{column.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
