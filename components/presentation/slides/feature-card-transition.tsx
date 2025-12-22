"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { useState, useEffect } from "react"

interface FeatureCard {
  icon: LucideIcon
  title: string
  description: string
  workshop?: React.ReactNode // Workshop content for this feature
}

interface FeatureCardTransitionProps {
  features: FeatureCard[]
  currentIndex: number
  onComplete?: () => void
}

export function FeatureCardTransition({ features, currentIndex, onComplete }: FeatureCardTransitionProps) {
  const [showWorkshop, setShowWorkshop] = useState(false)
  const currentFeature = features[currentIndex]

  useEffect(() => {
    // Transition from card to workshop
    const timer = setTimeout(() => {
      setShowWorkshop(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [currentIndex])

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        {!showWorkshop ? (
          // Card zoom in animation
          <motion.div
            key={`card-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.5,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              layoutId={`feature-card-${currentIndex}`}
              className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-12 max-w-lg text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8">
                <currentFeature.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-4">{currentFeature.title}</h3>
              <p className="text-lg text-muted-foreground">{currentFeature.description}</p>
            </motion.div>
          </motion.div>
        ) : (
          // Workshop content
          <motion.div
            key={`workshop-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            {currentFeature.workshop}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
