"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useTypewriter, type TypewriterStep } from "../hooks/use-typewriter"
import { TypstEditor } from "@/components/typst/editor"
import { TypstPreview } from "@/components/typst/preview"
import { NavHint } from "@/components/ui/navigation-hint"

interface WorkshopSlideProps {
  title?: string
  subtitle?: string
  initialCode?: string | Record<string, string>
  pages?: string[]
  steps?: TypewriterStep[] | Record<string, TypewriterStep[]>
  typeSpeed?: number
  deleteSpeed?: number
  humanize?: boolean
  autoStart?: boolean
  readOnly?: boolean
  hiddenPrefix?: string
  hiddenSuffix?: string
  largePreview?: boolean
  assets?: string[]
}

export function WorkshopSlide({
  title,
  subtitle,
  initialCode = "",
  pages,
  steps = [],
  typeSpeed = 40,
  deleteSpeed = 25,
  autoStart = true,
  readOnly = false,
  hiddenPrefix = '#import "@preview/modern-g7-32:0.2.0": *\n#show: gost.with(hide-title: true)\n#set page(width: 200pt, height: auto, margin: 20pt, fill: white, footer: none)\n',
  hiddenSuffix,
  largePreview = false,
  assets = [],
}: WorkshopSlideProps) {
  const fileList = useMemo(() => pages || ["main.typ"], [pages])
  
  const {
    files: animatedFiles,
    activeFile: animatedActiveFile,
    currentPrefix,
    currentClosing,
    isTyping,
    isWaiting,
    start,
    setActiveFile,
    jumpToFile // Используем новую функцию
  } = useTypewriter({
    initialText: initialCode,
    initialPrefix: hiddenPrefix,
    pages: fileList,
    steps,
    typeSpeed,
    deleteSpeed,
    autoStart: false,
    onStepComplete: () => {
      if (!isUserEditing) {
        setUserFiles(animatedFiles)
        setUserActiveFile(animatedActiveFile)
      }
    }
  })

  const [userFiles, setUserFiles] = useState<Record<string, string>>({})
  const [userActiveFile, setUserActiveFile] = useState(fileList[0])
  const [isUserEditing, setIsUserEditing] = useState(false)

  // Sync user state with animation state when not editing manually
  useEffect(() => {
    if (!isUserEditing) {
      setUserFiles(animatedFiles)
      setUserActiveFile(animatedActiveFile)
    }
  }, [animatedFiles, animatedActiveFile, isUserEditing])

  useEffect(() => {
    if (autoStart && !isUserEditing) {
      const hasSteps = Array.isArray(steps) ? steps.length > 0 : Object.keys(steps).length > 0
      if (hasSteps) {
        const timer = setTimeout(start, 800)
        return () => clearTimeout(timer)
      }
    }
  }, [autoStart, steps, start, isUserEditing])

  const handleCodeChange = (newCode: string) => {
    if (readOnly) return
    setIsUserEditing(true)
    setUserFiles(prev => ({ ...prev, [userActiveFile]: newCode }))
  }

  const handleFileChange = (fileName: string) => {
    if (isUserEditing) {
        // Если пользователь уже редактирует сам, просто меняем файл
        setUserActiveFile(fileName)
    } else {
        // Если мы в режиме презентации, пытаемся прыгнуть к скрипту этого файла
        jumpToFile(fileName)
        // Но визуально переключаем сразу, чтобы не было задержки
        setUserActiveFile(fileName) 
    }
  }

  const codeForPreview = useMemo(() => {
    const currentCode = userFiles[userActiveFile] || ""
    if (isUserEditing) return currentCode
    return currentCode + (currentClosing || "")
  }, [userFiles, userActiveFile, currentClosing, isUserEditing])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 lg:p-16">
        {isWaiting && !isUserEditing && (
          <NavHint text="Нажмите для перехода к следующему примеру" />
        )}
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

      <div className={`w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 h-full z-0 ${
        largePreview ? "max-w-7xl max-h-[90vh]" : "max-w-6xl max-h-[80vh]"
      }`}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`w-full flex flex-col shrink-0 lg:w-1/2 ${
            largePreview ? "h-full max-h-[70vh]" : "h-80 lg:h-full lg:max-h-[60vh]"
          }`}
        >
          <TypstEditor 
            code={userFiles[userActiveFile] || ""}
            files={fileList}
            activeFile={userActiveFile}
            onFileChange={handleFileChange}
            onChange={handleCodeChange}
            readOnly={!isUserEditing && (isTyping || readOnly)}
            isTyping={isTyping && !isUserEditing}
            className="h-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`w-full flex flex-col shrink-0 lg:w-1/2 ${
            largePreview ? "h-full max-h-[70vh]" : "h-80 lg:h-full lg:max-h-[60vh]"
          }`}
        >
          <TypstPreview 
            code={codeForPreview}
            files={userFiles}
            activeFile={userActiveFile}
            assets={assets}
            hiddenPrefix={isUserEditing ? hiddenPrefix : currentPrefix}
            hiddenSuffix={hiddenSuffix}
            className="h-full"
          />
        </motion.div>
      </div>
    </div>
  )
}
