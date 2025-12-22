"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface ImageOverlaySlideProps {
  title: string
  subtitle?: string
  imageUrl: string
  imageAlt: string
  position?: "left" | "right" | "center"
}

export function ImageOverlaySlide({ title, subtitle, imageUrl, imageAlt, position = "right" }: ImageOverlaySlideProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image src={imageUrl || "/placeholder.svg"} alt={imageAlt} fill className="object-cover" />
        <div
          className={`absolute inset-0 ${
            position === "left"
              ? "bg-gradient-to-l from-background via-background/95 to-background/50"
              : position === "right"
                ? "bg-gradient-to-r from-background via-background/95 to-background/50"
                : "bg-background/80"
          }`}
        />
      </div>

      <div
        className={`relative z-10 h-full flex flex-col justify-center px-16 lg:px-32 ${
          position === "left"
            ? "items-end text-right"
            : position === "center"
              ? "items-center text-center"
              : "items-start"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          {subtitle && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block"
            >
              {subtitle}
            </motion.span>
          )}
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">{title}</h2>
        </motion.div>
      </div>
    </div>
  )
}
