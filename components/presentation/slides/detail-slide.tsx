"use client"

import type React from "react"
import { motion } from "framer-motion"
import Image from "next/image"

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
  variant?: "default" | "mockup"
  accent?: boolean
  edge?: "none" | "right" | "left" | "bottom"
  imageScale?: number
  offset?: { x?: number; y?: number }
}

export function DetailSlide({
  heading,
  subheading,
  content,
  layout = "text-left-image-right",
  image,
  imageAlt = "Illustration",
  accent = true,
  variant = "default",
  edge = "none",
  imageScale = 1,
  offset = { x: 0, y: 0 },
}: DetailSlideProps) {
  const isHorizontal = layout.includes("left") || layout.includes("right")
  const imageFirst = layout.includes("image-left") || layout.includes("image-top")
  const textOnly = layout.includes("text-only")
  const isMockup = variant === "mockup"

  const getPaddingClass = () => {
    let xPadding = "px-16 lg:px-24"
    let yPadding = "py-16"
    
    if (edge === "right") xPadding = "pl-16 lg:pl-24 pr-0"
    if (edge === "left") xPadding = "pl-0 pr-16 lg:pr-24"
    if (edge === "bottom") yPadding = "pt-16 pb-0"

    return `${xPadding} ${yPadding}`
  }

  const getImageAlignment = () => {
    if (edge === "right") return "justify-end"
    if (edge === "left") return "justify-start"
    return "justify-center"
  }

  const TextBlock = (
    <motion.div
      initial={{ opacity: 0, x: imageFirst ? 30 : -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className={`flex flex-col justify-center ${
        textOnly ? "items-center text-center max-w-3xl mx-auto" : ""
      } ${
        edge === "right" && !imageFirst ? "pr-12" : ""
      } ${
        edge === "left" && imageFirst ? "pl-12" : ""
      }`}
    >
      {subheading && (
        <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
          {subheading}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight leading-tight">
        {heading}
      </h2>
      <div className="text-lg md:text-xl text-muted-foreground leading-relaxed">
        {content}
      </div>
    </motion.div>
  )

  const ImageBlock = image ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className={`relative w-full flex items-center ${getImageAlignment()}`}
      style={{ 
        height: isHorizontal ? "100%" : "auto",
        minHeight: isHorizontal ? "auto" : "300px",
      }}
    >
      <div 
        className={`relative transition-transform duration-300 ease-out
          ${!isMockup ? "rounded-2xl overflow-hidden border border-border/50" : ""} 
        `}
        style={{
          width: "100%", // Фиксируем ширину контейнера, чтобы он занимал всю колонку
          // ИСПОЛЬЗУЕМ SCALE ЗДЕСЬ
          transform: `translate(${offset.x || 0}px, ${offset.y || 0}px) scale(${imageScale})`,
          // Чтобы scale не смещал центр непропорционально, можно задать origin, 
          // но по дефолту center обычно ок. Если надо прижать к краю при скейле:
          transformOrigin: edge === "right" ? "right center" : edge === "left" ? "left center" : "center center",
          
          aspectRatio: isMockup ? "auto" : undefined,
          height: "100%", 
          minHeight: "300px"
        }}
      >
        <Image 
          src={image || "/placeholder.svg"} 
          alt={imageAlt} 
          fill 
          className={isMockup ? "object-contain" : "object-cover"} 
          style={{
             objectPosition: edge === "right" ? "right center" : edge === "left" ? "left center" : "center"
          }}
        />
        
        {accent && !isMockup && (
          <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent" />
        )}
      </div>
    </motion.div>
  ) : null

  if (textOnly) {
    return (
      <div className="relative w-full h-full flex items-center justify-center px-16 lg:px-32">
        {TextBlock}
      </div>
    )
  }

  return (
    <div
      className={`relative w-full h-full flex overflow-hidden ${
        isHorizontal ? "flex-row" : "flex-col"
      } items-center gap-12 ${getPaddingClass()}`}
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
          <div className={`${isHorizontal ? "flex-1" : "w-full"} ${isHorizontal ? "h-full" : "h-1/2"}`}>
            {ImageBlock}
          </div>
        </>
      )}
    </div>
  )
}
