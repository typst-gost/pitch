"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

interface ComparisonItem {
  title: string
  items: { text: string; positive?: boolean }[]
  highlight?: boolean
}

interface ComparisonSlideProps {
  title: string
  columns: [ComparisonItem, ComparisonItem]
}

export function ComparisonSlide({ title, columns }: ComparisonSlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-center px-16 lg:px-24">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight"
      >
        {title}
      </motion.h2>

      <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
        {columns.map((column, colIndex) => (
          <motion.div
            key={colIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + colIndex * 0.2 }}
            className={`rounded-2xl p-8 border ${
              column.highlight ? "bg-primary/10 border-primary/30" : "bg-card/50 border-border"
            }`}
          >
            <h3 className={`text-2xl font-semibold mb-8 ${column.highlight ? "text-primary" : "text-foreground"}`}>
              {column.title}
            </h3>
            <div className="space-y-5">
              {column.items.map((item, itemIndex) => (
                <motion.div
                  key={itemIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + colIndex * 0.2 + itemIndex * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      item.positive !== false ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {item.positive !== false ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                  <span className="text-lg text-foreground/80">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
