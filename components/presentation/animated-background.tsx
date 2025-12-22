"use client"

import { motion, AnimatePresence } from "framer-motion"

interface AnimatedBackgroundProps {
  isWorkshop?: boolean
}

export function AnimatedBackground({ isWorkshop = false }: AnimatedBackgroundProps) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        {isWorkshop ? (
          <motion.div
            key="workshop-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Darker, more focused background for workshops */}
            <div className="absolute inset-0 bg-[#050810]" />
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full opacity-10"
              style={{
                background: "radial-gradient(circle, #1a2744 0%, transparent 70%)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            {/* Subtle code-like grid */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `
                  linear-gradient(#3b82f6 1px, transparent 1px),
                  linear-gradient(90deg, #3b82f6 1px, transparent 1px)
                `,
                backgroundSize: "50px 25px",
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="default-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Gradient orbs */}
            <motion.div
              className="absolute w-[800px] h-[800px] rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, #2563E8 0%, transparent 70%)",
                left: "-200px",
                top: "-200px",
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full opacity-15"
              style={{
                background: "radial-gradient(circle, #1441A4 0%, transparent 70%)",
                right: "-150px",
                bottom: "-150px",
              }}
              animate={{
                x: [0, -80, 0],
                y: [0, -60, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(#2563E8 1px, transparent 1px),
                  linear-gradient(90deg, #2563E8 1px, transparent 1px)
                `,
                backgroundSize: "100px 100px",
              }}
            />

            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 5,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
