"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"

interface TitleSlideProps {
  badge?: string
  title: string
  highlight?: string
  subtitle?: string
  showLogo?: boolean
  showMaiLogo?: boolean
}

export function TitleSlide({
  badge,
  title,
  highlight,
  subtitle,
  showLogo = true,
  showMaiLogo = false,
}: TitleSlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 overflow-hidden">
      {/* Gradient accent behind text */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, #2563E8 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">
        
        {/* Logos Section - Centered above title */}
        <motion.div
          className="flex items-center justify-center gap-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {showLogo && (
            <Image 
              src="/logo.svg" 
              alt="Typst GOST" 
              width={60} 
              height={60} 
              className="h-24 w-auto" // 64px высота
            />
          )}
          
          <motion.div
            className="w-12 h-12 flex items-center justify-center text-gray-400"
            animate={{
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: ["easeOut", "easeIn", "easeOut", "easeIn", "easeOut"],
              times: [0, 0.2, 0.5, 0.8, 1],
            }}
          >
            {/* Исправлено: размер крестика соответствует контейнеру */}
            <X className="h-12 w-12" /> 
          </motion.div>
          
          {showMaiLogo && (
            <Image 
              src="/mai-logo.svg" 
              alt="МАИ" 
              width={60} 
              height={60} 
              className="h-24 w-auto opacity-90" // 64px высота
            />
          )}
        </motion.div>

        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-sm font-medium tracking-wide">{badge}</span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
        >
          {title}
          {highlight && (
            <>
              <br />
              <span className="bg-linear-to-r from-primary to-[#60a5fa] bg-clip-text text-transparent">
                {highlight}
              </span>
            </>
          )}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-xl md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Bottom Navigation Hint */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-xs text-muted-foreground tracking-[0.2em] uppercase">Нажмите для продолжения</span>
        <motion.div
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="w-10 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center"
        >
          <motion.div
            animate={{ x: [0, 4, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="w-2 h-2 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
