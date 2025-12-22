"use client"

import { useState, useCallback, useEffect, type ReactNode, createContext, useContext } from "react"
import { AnimatedBackground } from "./animated-background"
import { SlideWrapper } from "./slide-wrapper"
import { SlideNavigation } from "./slide-navigation"
import { SlideOverview } from "./slide-overview"

interface SlideContextValue {
  isWorkshop: boolean
  setIsWorkshop: (value: boolean) => void
  transitionType: "default" | "zoom-in" | "zoom-out" | "workshop-enter" | "workshop-exit"
}

export const SlideContext = createContext<SlideContextValue>({
  isWorkshop: false,
  setIsWorkshop: () => {},
  transitionType: "default",
})

export const useSlideContext = () => useContext(SlideContext)

export interface SlideConfig {
  component: ReactNode
  subslides?: ReactNode[]
  type?: "default" | "workshop" | "gallery"
}

interface PresentationProps {
  slides: (ReactNode | SlideConfig)[]
}

// Helper to normalize slides and track types
interface FlatSlide {
  component: ReactNode
  type: "default" | "workshop" | "gallery"
  isSubslide: boolean
  parentIndex?: number
}

function normalizeSlides(slides: (ReactNode | SlideConfig)[]): FlatSlide[] {
  const result: FlatSlide[] = []
  slides.forEach((slide, parentIndex) => {
    if (slide && typeof slide === "object" && "component" in slide) {
      const config = slide as SlideConfig
      result.push({
        component: config.component,
        type: config.type || "default",
        isSubslide: false,
      })
      if (config.subslides) {
        config.subslides.forEach((sub) => {
          result.push({
            component: sub,
            type: config.type || "default",
            isSubslide: true,
            parentIndex,
          })
        })
      }
    } else {
      result.push({
        component: slide as ReactNode,
        type: "default",
        isSubslide: false,
      })
    }
  })
  return result
}

export function Presentation({ slides }: PresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">("right")
  const [transitionType, setTransitionType] = useState<
    "default" | "zoom-in" | "zoom-out" | "workshop-enter" | "workshop-exit"
  >("default")
  const [showOverview, setShowOverview] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isWorkshop, setIsWorkshop] = useState(false)

  const flatSlides = normalizeSlides(slides)

  const getTransitionType = useCallback(
    (fromIndex: number, toIndex: number) => {
      const fromSlide = flatSlides[fromIndex]
      const toSlide = flatSlides[toIndex]

      // Entering subslide from parent (zoom-in effect)
      if (!fromSlide?.isSubslide && toSlide?.isSubslide) {
        return "zoom-in"
      }
      // Exiting subslide to parent (zoom-out effect)
      if (fromSlide?.isSubslide && !toSlide?.isSubslide) {
        return "zoom-out"
      }
      // Between subslides (smoother transition)
      if (fromSlide?.isSubslide && toSlide?.isSubslide) {
        return "default"
      }
      // Entering workshop
      if (toSlide?.type === "workshop" && fromSlide?.type !== "workshop") {
        return "workshop-enter"
      }
      // Exiting workshop
      if (fromSlide?.type === "workshop" && toSlide?.type !== "workshop") {
        return "workshop-exit"
      }

      return "default"
    },
    [flatSlides],
  )

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true)
    if (controlsTimeout) clearTimeout(controlsTimeout)
    const timeout = setTimeout(() => setShowControls(false), 3000)
    setControlsTimeout(timeout)
  }, [controlsTimeout])

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= flatSlides.length) return
      const transition = getTransitionType(currentSlide, index)
      setTransitionType(transition)
      setDirection(index > currentSlide ? "right" : "left")
      setCurrentSlide(index)
      setIsWorkshop(flatSlides[index].type === "workshop")
      showControlsTemporarily()
    },
    [currentSlide, flatSlides, getTransitionType, showControlsTemporarily],
  )

  const nextSlide = useCallback(() => {
    if (currentSlide < flatSlides.length - 1) {
      const transition = getTransitionType(currentSlide, currentSlide + 1)
      setTransitionType(transition)
      setDirection("right")
      setCurrentSlide((prev) => prev + 1)
      setIsWorkshop(flatSlides[currentSlide + 1].type === "workshop")
      showControlsTemporarily()
    }
  }, [currentSlide, flatSlides, getTransitionType, showControlsTemporarily])

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      const transition = getTransitionType(currentSlide, currentSlide - 1)
      setTransitionType(transition)
      setDirection("left")
      setCurrentSlide((prev) => prev - 1)
      setIsWorkshop(flatSlides[currentSlide - 1].type === "workshop")
      showControlsTemporarily()
    }
  }, [currentSlide, flatSlides, getTransitionType, showControlsTemporarily])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      showControlsTemporarily()

      if (showOverview) {
        if (e.key === "Escape") setShowOverview(false)
        return
      }

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "Enter":
          e.preventDefault()
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
          goToSlide(flatSlides.length - 1)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextSlide, prevSlide, goToSlide, showOverview, flatSlides.length, showControlsTemporarily])

  // Touch support
  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      showControlsTemporarily()
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
  }, [nextSlide, prevSlide, showControlsTemporarily])

  // Mouse movement shows controls
  useEffect(() => {
    const handleMouseMove = () => showControlsTemporarily()
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [showControlsTemporarily])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Ignore clicks on buttons, links, and interactive elements
      const target = e.target as HTMLElement
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[data-no-advance]")
      ) {
        return
      }
      nextSlide()
    }
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [nextSlide])

  return (
    <SlideContext.Provider value={{ isWorkshop, setIsWorkshop, transitionType }}>
      <div className="fixed inset-0 bg-background overflow-hidden">
        <AnimatedBackground isWorkshop={isWorkshop} />

        <div className="relative w-full h-full flex items-center justify-center">
          <SlideWrapper slideKey={currentSlide} direction={direction} transitionType={transitionType}>
            {flatSlides[currentSlide].component}
          </SlideWrapper>
        </div>

        <SlideNavigation
          currentSlide={currentSlide}
          totalSlides={flatSlides.length}
          onPrev={prevSlide}
          onNext={nextSlide}
          onGoTo={goToSlide}
          showOverview={showOverview}
          onToggleOverview={() => setShowOverview((prev) => !prev)}
          visible={showControls}
        />

        <SlideOverview
          slides={flatSlides.map((s) => s.component)}
          currentSlide={currentSlide}
          onSelect={goToSlide}
          onClose={() => setShowOverview(false)}
          isOpen={showOverview}
        />
      </div>
    </SlideContext.Provider>
  )
}
