"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { X, ExternalLink } from "lucide-react"
import Image from "next/image"

interface GalleryImage {
  src: string
  alt: string
  title?: string
  size?: "small" | "medium" | "large"
}

interface GallerySlideProps {
  title: string
  subtitle?: string
  images: GalleryImage[]
  qrCode?: string
  qrLabel?: string
  link?: string
  linkLabel?: string
  autoAdvance?: boolean
}

export function GallerySlide({
  title,
  subtitle,
  images,
  qrCode,
  qrLabel,
  link,
  linkLabel,
  autoAdvance = true,
}: GallerySlideProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [hasStarted, setHasStarted] = useState(false)

  const getSizeClass = (size?: "small" | "medium" | "large") => {
    switch (size) {
      case "small":
        return "w-40 h-28"
      case "large":
        return "w-72 h-48"
      default:
        return "w-56 h-36"
    }
  }

  const advanceImage = useCallback(() => {
    if (!autoAdvance) return

    if (!hasStarted) {
      setHasStarted(true)
      setSelectedIndex(0)
    } else if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    } else {
      // Signal that we want to go to next slide
      setSelectedIndex(null)
    }
  }, [autoAdvance, hasStarted, selectedIndex, images.length])

  // Listen for navigation events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        if (selectedIndex !== null || !hasStarted) {
          e.stopPropagation()
          advanceImage()
        }
      }
      if (e.key === "Escape" && selectedIndex !== null) {
        setSelectedIndex(null)
      }
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("button") && !target.closest("a") && !target.closest("[data-no-advance]")) {
        if (selectedIndex !== null || !hasStarted) {
          e.stopPropagation()
          advanceImage()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown, true)
    window.addEventListener("click", handleClick, true)
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true)
      window.removeEventListener("click", handleClick, true)
    }
  }, [advanceImage, selectedIndex, hasStarted])

  return (
    <div className="relative w-full h-full flex flex-col px-12 lg:px-20 py-8" data-no-advance>
      {/* Header with QR */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-6"
      >
        <div>
          {subtitle && (
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-2 block">{subtitle}</span>
          )}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-xl shadow-lg">
            {qrCode ? (
              <Image src={qrCode || "/placeholder.svg"} alt="QR Code" width={80} height={80} className="rounded-lg" />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-sm ${Math.random() > 0.5 ? "bg-gray-800" : "bg-transparent"}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 text-primary hover:bg-primary/20 transition-colors text-sm"
            >
              <span className="font-medium">{linkLabel || link}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>

      {/* Floating gallery */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 p-4">
          {images.map((image, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 50, rotate: Math.random() * 10 - 5 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: Math.random() * 6 - 3,
              }}
              transition={{
                delay: 0.2 + index * 0.1,
                duration: 0.5,
              }}
              whileHover={{
                scale: 1.05,
                rotate: 0,
                zIndex: 10,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
              onClick={() => setSelectedIndex(index)}
              className={`${getSizeClass(image.size)} relative rounded-xl overflow-hidden border-2 border-border/50 bg-card shadow-xl cursor-pointer`}
              style={{
                transform: `translateY(${Math.sin(index) * 15}px)`,
              }}
            >
              <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <span className="text-white text-xs font-medium">{image.title}</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Hint */}
      {!hasStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-sm text-muted-foreground"
        >
          Нажмите для просмотра галереи
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl max-h-[80vh] w-full mx-8"
            >
              <Image
                src={images[selectedIndex].src || "/placeholder.svg"}
                alt={images[selectedIndex].alt}
                width={1200}
                height={800}
                className="w-full h-auto rounded-2xl border border-border shadow-2xl"
              />
              {images[selectedIndex].title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 rounded-b-2xl">
                  <span className="text-white text-xl font-medium">{images[selectedIndex].title}</span>
                </div>
              )}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Progress indicator */}
              <div className="absolute bottom-4 right-4 bg-black/50 rounded-full px-3 py-1 text-white text-sm">
                {selectedIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
