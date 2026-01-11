"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useSlideContext } from "../presentation"

export interface TypewriterStep {
  action: "type" | "delete" | "replace" | "pause" | "clear" | "wait" | "put" | "prefix" | "switch" | "speed"
  text?: string
  closing?: string
  position?: number
  length?: number
  delay?: number
  fileName?: string
  speed?: number
  deleteSpeed?: number
}

export interface TypewriterConfig {
  initialText?: string | Record<string, string>
  initialPrefix?: string
  steps: TypewriterStep[] | Record<string, TypewriterStep[]>
  pages?: string[]
  typeSpeed?: number
  deleteSpeed?: number
  humanize?: boolean
  humanizeRange?: number
  loop?: boolean
  autoStart?: boolean
  onStepComplete?: () => void
  onComplete?: () => void
}

export function useTypewriter(config: TypewriterConfig) {
  const {
    initialText = "",
    initialPrefix = "",
    steps: inputSteps,
    pages = ["main.typ"],
    typeSpeed = 50,
    deleteSpeed = 30,
    humanize = true,
    humanizeRange = 30,
    loop = false,
    autoStart = false,
    onStepComplete,
    onComplete,
  } = config

  const { registerStepHandler } = useSlideContext()

  // Initialize file contents
  const initialFiles = useMemo(() => {
    if (typeof initialText === "string") {
      return { [pages[0]]: initialText }
    }
    return pages.reduce((acc, page) => ({
      ...acc,
      [page]: initialText[page] || ""
    }), {} as Record<string, string>)
  }, [initialText, pages])

  // Flatten steps into a linear sequence
  const steps = useMemo(() => {
    const rawSteps: TypewriterStep[] = [{ action: "wait" }]

    if (Array.isArray(inputSteps)) {
      rawSteps.push(...inputSteps)
    } else {
      pages.forEach((page) => {
        if (inputSteps[page] && inputSteps[page].length > 0) {
          rawSteps.push({ action: "switch", fileName: page })
          rawSteps.push(...inputSteps[page])
        }
      })
    }
    return rawSteps
  }, [inputSteps, pages])

  const [files, setFiles] = useState(initialFiles)
  const [activeFile, setActiveFile] = useState(pages[0])
  const [currentPrefix, setCurrentPrefix] = useState(initialPrefix)
  const [currentClosing, setCurrentClosing] = useState("")
  const [isWaiting, setIsWaiting] = useState(autoStart)
  const [isTyping, setIsTyping] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  const charIndexRef = useRef(0)
  const filesRef = useRef(initialFiles)
  const activeFileRef = useRef(pages[0])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(false)
  
  const stepsRef = useRef(steps)
  
  // Храним базовые настройки (humanize и т.д.)
  const baseConfigRef = useRef({ humanize, humanizeRange })
  // Храним текущие скорости (могут меняться шагами "speed")
  const runtimeSpeedsRef = useRef({ typeSpeed, deleteSpeed })
  
  const callbacksRef = useRef({ onStepComplete, onComplete })

  stepsRef.current = steps
  baseConfigRef.current = { humanize, humanizeRange }
  callbacksRef.current = { onStepComplete, onComplete }
  
  // Обновляем runtimeSpeeds только если animation не идет, 
  // иначе мы перезапишем динамические изменения из steps при ре-рендере
  useEffect(() => {
    if (!isTyping) {
      runtimeSpeedsRef.current = { typeSpeed, deleteSpeed }
    }
  }, [typeSpeed, deleteSpeed, isTyping])

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const getDelay = useCallback((baseDelay: number) => {
    const { humanize, humanizeRange } = baseConfigRef.current
    if (!humanize) return baseDelay
    const variation = (Math.random() - 0.5) * 2 * humanizeRange
    const extraPause = Math.random() < 0.1 ? Math.random() * 150 : 0
    return Math.max(10, baseDelay + variation + extraPause)
  }, [])

  const next = useCallback(() => {
    setIsWaiting(false)
    setIsTyping(true)
    charIndexRef.current = 0
    setStepIndex((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (isWaiting) {
      registerStepHandler(() => {
        next()
        return true
      })
      return () => registerStepHandler(null)
    }
    registerStepHandler(null)
  }, [isWaiting, next, registerStepHandler])

  const updateFileContent = (fileName: string, content: string) => {
    filesRef.current = { ...filesRef.current, [fileName]: content }
    setFiles(filesRef.current)
  }

  // Вспомогательная функция сброса скоростей к начальным значениям пропсов
  const resetSpeeds = () => {
    runtimeSpeedsRef.current = { typeSpeed, deleteSpeed }
  }

  useEffect(() => {
    if (!isTyping || isWaiting) return

    const currentSteps = stepsRef.current
    
    if (stepIndex >= currentSteps.length) {
      if (loop && currentSteps.length > 0) {
        setStepIndex(0)
        charIndexRef.current = 0
        filesRef.current = initialFiles
        activeFileRef.current = pages[0]
        setFiles(initialFiles)
        setActiveFile(pages[0])
        setCurrentPrefix(initialPrefix)
        setCurrentClosing("")
        resetSpeeds() // Сбрасываем скорость при цикле
      } else {
        setIsTyping(false)
        setCurrentClosing("")
        callbacksRef.current.onComplete?.()
      }
      return
    }

    const step = currentSteps[stepIndex]

    if (charIndexRef.current === 0 && step.closing !== undefined) {
      setCurrentClosing(step.closing)
    }

    const completeCurrentStep = () => {
      if (!mountedRef.current) return
      callbacksRef.current.onStepComplete?.()
      charIndexRef.current = 0
      setStepIndex((prev) => prev + 1)
    }

    const tick = () => {
      if (!mountedRef.current) return

      // Используем динамические скорости
      const { typeSpeed: currentTypeSpeed, deleteSpeed: currentDeleteSpeed } = runtimeSpeedsRef.current
      const currentFileName = activeFileRef.current
      const currentText = filesRef.current[currentFileName] || ""

      switch (step.action) {
        case "wait":
          setIsWaiting(true)
          setIsTyping(false)
          break

        case "switch":
           if (step.fileName) {
             activeFileRef.current = step.fileName
             setActiveFile(step.fileName)
           }
           timeoutRef.current = setTimeout(completeCurrentStep, 300)
           break

        case "speed":
           if (step.speed !== undefined) runtimeSpeedsRef.current.typeSpeed = step.speed
           if (step.deleteSpeed !== undefined) runtimeSpeedsRef.current.deleteSpeed = step.deleteSpeed
           completeCurrentStep()
           break

        case "type":
          const textToType = step.text || ""
          if (charIndexRef.current < textToType.length) {
            const char = textToType[charIndexRef.current]
            const newText = currentText + char
            updateFileContent(currentFileName, newText)
            charIndexRef.current++
            timeoutRef.current = setTimeout(tick, getDelay(step.delay ?? currentTypeSpeed))
          } else {
            timeoutRef.current = setTimeout(completeCurrentStep, 100)
          }
          break

        case "delete":
          const countToDelete = step.length ?? 1
          if (charIndexRef.current < countToDelete) {
            const newText = currentText.slice(0, -1)
            updateFileContent(currentFileName, newText)
            charIndexRef.current++
            timeoutRef.current = setTimeout(tick, getDelay(step.delay ?? currentDeleteSpeed))
          } else {
            timeoutRef.current = setTimeout(completeCurrentStep, 100)
          }
          break

        case "replace":
          timeoutRef.current = setTimeout(() => {
            const pos = step.position ?? 0
            const len = step.length ?? 0
            const replacement = step.text ?? ""
            const before = currentText.slice(0, pos)
            const after = currentText.slice(pos + len)
            updateFileContent(currentFileName, before + replacement + after)
            completeCurrentStep()
          }, getDelay(step.delay ?? currentTypeSpeed))
          break

        case "pause":
          timeoutRef.current = setTimeout(completeCurrentStep, step.delay ?? 1000)
          break

        case "clear":
          timeoutRef.current = setTimeout(() => {
            updateFileContent(currentFileName, "")
            completeCurrentStep()
          }, 100)
          break
        
        case "put":
          timeoutRef.current = setTimeout(() => {
            updateFileContent(currentFileName, step.text ?? "")
            completeCurrentStep()
          }, 100)
          break

        case "prefix":
          setCurrentPrefix(step.text ?? "")
          completeCurrentStep()
          break
      }
    }

    tick()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [stepIndex, isTyping, isWaiting, loop, initialFiles, initialPrefix, pages, getDelay])

  const start = useCallback(() => {
    setIsWaiting(true)
    setIsTyping(false)
    setStepIndex(0)
    charIndexRef.current = 0
    filesRef.current = initialFiles
    activeFileRef.current = pages[0]
    setFiles(initialFiles)
    setActiveFile(pages[0])
    setCurrentPrefix(initialPrefix)
    setCurrentClosing("")
    resetSpeeds()
  }, [initialFiles, initialPrefix, pages, typeSpeed, deleteSpeed])

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsTyping(false)
    setIsWaiting(false)
    setStepIndex(0)
    charIndexRef.current = 0
    filesRef.current = initialFiles
    activeFileRef.current = pages[0]
    setFiles(initialFiles)
    setActiveFile(pages[0])
    setCurrentPrefix(initialPrefix)
    setCurrentClosing("")
    resetSpeeds()
  }, [initialFiles, initialPrefix, pages, typeSpeed, deleteSpeed])

  return { 
    files, 
    activeFile, 
    currentPrefix, 
    currentClosing, 
    isTyping, 
    isWaiting, 
    stepIndex, 
    start, 
    reset, 
    next, 
    setFiles, 
    setActiveFile 
  }
}
