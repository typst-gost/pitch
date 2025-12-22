"use client"

import { useState, useCallback, useEffect, type ReactNode } from "react"
import { AnimatedBackground } from "./animated-background"
import { SlideWrapper } from "./slide-wrapper"
import { SlideNavigation } from "./slide-navigation"
import { SlideOverview } from "./slide-overview"

interface PresentationProps {
  slides: ReactNode[]
}

export function Presentation({ slides }: PresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">("right")
  const [showOverview, setShowOverview] = useState(false)

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= slides.length) return
      setDirection(index > currentSlide ? "right" : "left")
      setCurrentSlide(index)
    },
    [currentSlide, slides.length],
  )

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection("right")
      setCurrentSlide((prev) => prev + 1)
    }
  }, [currentSlide, slides.length])

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection("left")
      setCurrentSlide((prev) => prev - 1)
    }
  }, [currentSlide])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showOverview) {
        if (e.key === "Escape") setShowOverview(false)
        return
      }

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "Enter":
          nextSlide()
          break
        case "ArrowLeft":
          prevSlide()
          break
        case "ArrowUp":
          setDirection("up")
          prevSlide()
          break
        case "ArrowDown":
          setDirection("down")
          nextSlide()
          break
        case "Escape":
          setShowOverview((prev) => !prev)
          break
        case "Home":
          goToSlide(0)
          break
        case "End":
          goToSlide(slides.length - 1)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextSlide, prevSlide, goToSlide, showOverview, slides.length])

  // Touch support
  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX < 0) nextSlide()
        else prevSlide()
      }
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchend", handleTouchEnd)
    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [nextSlide, prevSlide])

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      <AnimatedBackground />

      <div className="relative w-full h-full">
        <SlideWrapper slideKey={currentSlide} direction={direction}>
          {slides[currentSlide]}
        </SlideWrapper>
      </div>

      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrev={prevSlide}
        onNext={nextSlide}
        onGoTo={goToSlide}
        showOverview={showOverview}
        onToggleOverview={() => setShowOverview((prev) => !prev)}
      />

      <SlideOverview
        slides={slides}
        currentSlide={currentSlide}
        onSelect={goToSlide}
        onClose={() => setShowOverview(false)}
        isOpen={showOverview}
      />
    </div>
  )
}
