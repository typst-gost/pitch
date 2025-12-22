"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { ReactNode } from "react"

interface SlideOverviewProps {
  slides: ReactNode[]
  currentSlide: number
  onSelect: (index: number) => void
  onClose: () => void
  isOpen: boolean
}

export function SlideOverview({ slides, currentSlide, onSelect, onClose, isOpen }: SlideOverviewProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-auto"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Обзор слайдов</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {slides.map((slide, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    onSelect(index)
                    onClose()
                  }}
                  className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                    index === currentSlide
                      ? "border-primary ring-4 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="absolute inset-0 bg-background scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none">
                    {slide}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-card/90 px-2 py-1 rounded text-xs font-medium">
                    {index + 1}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
