"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTypewriter, type TypewriterStep } from "../hooks/use-typewriter"
import { TypstEditor } from "@/components/typst/editor"
import { TypstPreview } from "@/components/typst/preview"

interface WorkshopSlideProps {
  title?: string
  subtitle?: string
  initialCode?: string
  steps?: TypewriterStep[]
  typeSpeed?: number
  deleteSpeed?: number
  humanize?: boolean
  autoStart?: boolean
  readOnly?: boolean
  hiddenPrefix?: string
  hiddenSuffix?: string
}

export function WorkshopSlide({
  title,
  subtitle,
  initialCode = "",
  steps = [],
  typeSpeed = 40,
  deleteSpeed = 25,
  autoStart = true,
  readOnly = false,
  hiddenPrefix = "#set page(width: 200pt, height: auto, margin: 20pt, fill: white)\n",
  hiddenSuffix,
}: WorkshopSlideProps) {
  const [userCode, setUserCode] = useState(initialCode)
  const [isUserEditing, setIsUserEditing] = useState(false)

  const {
    text: animatedCode,
    isTyping,
    start,
  } = useTypewriter({
    initialText: initialCode,
    steps,
    typeSpeed: typeSpeed,
    deleteSpeed: deleteSpeed,
    autoStart: false,
    onStepComplete: () => {
      if (!isUserEditing) {
        setUserCode(animatedCode)
      }
    }
  })

  useEffect(() => {
    if (autoStart && steps.length > 0 && !isUserEditing) {
      const timer = setTimeout(start, 800)
      return () => clearTimeout(timer)
    }
  }, [autoStart, steps.length, start, isUserEditing])

  useEffect(() => {
    if (!isUserEditing) {
      setUserCode(animatedCode)
    }
  }, [animatedCode, isUserEditing])

  const handleCodeChange = (newCode: string) => {
    if (readOnly) return
    setIsUserEditing(true)
    setUserCode(newCode)
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 lg:p-16">
      {/* Заголовок */}
      {(title || subtitle) && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-4xl px-8 lg:px-16 pt-8 pb-4 shrink-0 text-center"
        >
          {subtitle && (
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-2 block">
              {subtitle}
            </span>
          )}
          {title && <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>}
        </motion.div>
      )}

      {/* Рабочая область - по центру */}
      <div className="w-full max-w-6xl flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 h-full max-h-[80vh]">
        
        {/* Левая панель: Редактор */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-1/2 h-80 lg:h-full max-h-125 shrink-0"
        >
          <TypstEditor 
            code={userCode}
            onChange={handleCodeChange}
            readOnly={!isUserEditing && (isTyping || readOnly)}
            isTyping={isTyping && !isUserEditing}
          />
        </motion.div>

        {/* Правая панель: Превью */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full lg:w-1/2 h-80 lg:h-full max-h-125 shrink-0"
        >
          <TypstPreview 
            code={userCode}
            hiddenPrefix={hiddenPrefix}
            hiddenSuffix={hiddenSuffix}
          />
        </motion.div>
      </div>

      {/* Декор */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent pointer-events-none" />
    </div>
  )
}
