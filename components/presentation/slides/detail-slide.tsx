"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"

// Layouts for content positioning
export type DetailLayout =
  | "text-left-image-right"
  | "image-left-text-right"
  | "text-top-image-bottom"
  | "image-top-text-bottom"
  | "text-only-centered"
  | "text-only-left"

interface DetailSlideProps {
  heading: string
  subheading?: string
  content: string | React.ReactNode
  layout?: DetailLayout
  image?: string
  imageAlt?: string
  accent?: boolean // Show accent gradient
}

export function DetailSlide({
  heading,
  subheading,
  content,
  layout = "text-left-image-right",
  image,
  imageAlt = "Illustration",
  accent = true,
}: DetailSlideProps) {
  const isHorizontal = layout.includes("left") || layout.includes("right")
  const imageFirst = layout.includes("image-left") || layout.includes("image-top")
  const textOnly = layout.includes("text-only")

  const TextBlock = (
    <motion.div
      initial={{ opacity: 0, x: imageFirst ? 30 : -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className={`flex flex-col justify-center ${textOnly ? "items-center text-center max-w-3xl mx-auto" : ""}`}
    >
      {subheading && (
        <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">{subheading}</span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight leading-tight">{heading}</h2>
      <div className="text-lg md:text-xl text-muted-foreground leading-relaxed">{content}</div>
    </motion.div>
  )

  const ImageBlock = image ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden border border-border/50"
    >
      <Image src={image || "/placeholder.svg"} alt={imageAlt} fill className="object-cover" />
      {accent && <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />}
    </motion.div>
  ) : null

  if (textOnly) {
    return (
      <div className="relative w-full h-full flex items-center justify-center px-16 lg:px-32">
        {TextBlock}
        {accent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        )}
      </div>
    )
  }

  return (
    <div
      className={`relative w-full h-full flex ${isHorizontal ? "flex-row" : "flex-col"} items-center gap-12 px-16 lg:px-24 py-16`}
    >
      {imageFirst ? (
        <>
          <div className={`${isHorizontal ? "flex-1" : "w-full"} ${isHorizontal ? "h-full" : "h-1/2"}`}>
            {ImageBlock}
          </div>
          <div className={`${isHorizontal ? "flex-1" : "w-full"}`}>{TextBlock}</div>
        </>
      ) : (
        <>
          <div className={`${isHorizontal ? "flex-1" : "w-full"}`}>{TextBlock}</div>
          {ImageBlock && (
            <div className={`${isHorizontal ? "flex-1" : "w-full"} ${isHorizontal ? "h-full" : "h-1/2"}`}>
              {ImageBlock}
            </div>
          )}
        </>
      )}
    </div>
  )
}
