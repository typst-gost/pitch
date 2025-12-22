"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"

interface SlideWrapperProps {
  children: ReactNode
  slideKey: string | number
  direction?: "up" | "down" | "left" | "right"
  transitionType?: "default" | "zoom-in" | "zoom-out" | "workshop-enter" | "workshop-exit"
}

const getVariants = (transitionType: string) => {
  switch (transitionType) {
    case "zoom-in":
      // Flying into a subslide
      return {
        enter: {
          scale: 2.5,
          opacity: 0,
          filter: "blur(20px)",
        },
        center: {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
        },
        exit: {
          scale: 0.5,
          opacity: 0,
          filter: "blur(10px)",
        },
      }
    case "zoom-out":
      // Flying out of a subslide
      return {
        enter: {
          scale: 0.5,
          opacity: 0,
          filter: "blur(10px)",
        },
        center: {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
        },
        exit: {
          scale: 2.5,
          opacity: 0,
          filter: "blur(20px)",
        },
      }
    case "workshop-enter":
      return {
        enter: {
          y: 100,
          opacity: 0,
          scale: 0.95,
        },
        center: {
          y: 0,
          opacity: 1,
          scale: 1,
        },
        exit: {
          y: -100,
          opacity: 0,
          scale: 0.95,
        },
      }
    case "workshop-exit":
      return {
        enter: {
          y: -100,
          opacity: 0,
          scale: 0.95,
        },
        center: {
          y: 0,
          opacity: 1,
          scale: 1,
        },
        exit: {
          y: 100,
          opacity: 0,
          scale: 0.95,
        },
      }
    default:
      return {
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
  }
}

export function SlideWrapper({
  children,
  slideKey,
  direction = "right",
  transitionType = "default",
}: SlideWrapperProps) {
  const variants = getVariants(transitionType)
  const isCustomTransition = transitionType !== "default"

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
          duration: isCustomTransition ? 0.6 : 0.4,
          ease: [0.25, 0.1, 0.25, 1],
          filter: { duration: 0.5 },
        }}
        className="w-full h-full flex items-center justify-center"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
