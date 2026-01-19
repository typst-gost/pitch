"use client"

import { motion } from "framer-motion"

interface NavHintProps {
  text?: string
}

export function NavHint({ text = "Нажмите для продолжения" }: NavHintProps) {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 pointer-events-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.5 }}
    >
      <span className="text-xs text-muted-foreground tracking-[0.2em] uppercase whitespace-nowrap">
        {text}
      </span>
      <motion.div
        animate={{ x: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        className="w-10 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center"
      >
        <motion.div
          animate={{ x: [0, 4, 0], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="w-2 h-2 bg-primary rounded-full"
        />
      </motion.div>
    </motion.div>
  )
}
