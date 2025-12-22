"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"

interface QuoteSlideProps {
  quote: string
  author?: string
  role?: string
}

export function QuoteSlide({ quote, author, role }: QuoteSlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-16 lg:px-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Quote className="w-16 h-16 text-primary/30 mx-auto" />
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl md:text-5xl font-medium leading-tight text-balance"
        >
          {quote}
        </motion.blockquote>

        {(author || role) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12">
            {author && <div className="text-xl font-semibold text-primary">{author}</div>}
            {role && <div className="text-muted-foreground mt-1">{role}</div>}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
