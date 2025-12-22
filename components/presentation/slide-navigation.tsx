"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react"

interface SlideNavigationProps {
  currentSlide: number
  totalSlides: number
  onPrev: () => void
  onNext: () => void
  onGoTo: (index: number) => void
  showOverview: boolean
  onToggleOverview: () => void
}

export function SlideNavigation({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onGoTo,
  showOverview,
  onToggleOverview,
}: SlideNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4"
    >
      <div className="flex items-center gap-2 bg-card/80 backdrop-blur-xl border border-border rounded-full px-4 py-2">
        <button
          onClick={onPrev}
          disabled={currentSlide === 0}
          className="p-2 rounded-full hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 px-4">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => onGoTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          className="p-2 rounded-full hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={onToggleOverview}
        className={`p-3 rounded-full border transition-colors ${
          showOverview
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-card/80 backdrop-blur-xl border-border hover:bg-primary/10"
        }`}
        aria-label="Toggle slide overview"
      >
        <Grid3X3 className="w-5 h-5" />
      </button>

      <div className="bg-card/80 backdrop-blur-xl border border-border rounded-full px-4 py-2 text-sm text-muted-foreground">
        <span className="text-foreground font-medium">{currentSlide + 1}</span>
        <span className="mx-1">/</span>
        <span>{totalSlides}</span>
      </div>
    </motion.div>
  )
}
