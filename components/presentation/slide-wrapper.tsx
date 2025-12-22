"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"

interface SlideWrapperProps {
  children: ReactNode
  slideKey: string | number
  direction?: "up" | "down" | "left" | "right"
}

const variants = {
  enter: (direction: string) => ({
    x: direction === "left" ? 1000 : direction === "right" ? -1000 : 0,
    y: direction === "up" ? 1000 : direction === "down" ? -1000 : 0,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: string) => ({
    x: direction === "left" ? -1000 : direction === "right" ? 1000 : 0,
    y: direction === "up" ? -1000 : direction === "down" ? 1000 : 0,
    opacity: 0,
    scale: 0.95,
  }),
}

export function SlideWrapper({ children, slideKey, direction = "right" }: SlideWrapperProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={slideKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          y: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.4 },
          scale: { duration: 0.4 },
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
