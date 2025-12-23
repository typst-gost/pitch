"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useSlideContext } from "../presentation"

export interface TypewriterStep {
  action: "type" | "delete" | "replace" | "pause" | "clear" | "wait"
  text?: string
  closing?: string
  position?: number
  length?: number
  delay?: number
}

export interface TypewriterConfig {
  initialText?: string
  steps: TypewriterStep[]
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
    steps: userSteps,
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

  const steps = useMemo(() => {
    return [{ action: "wait" } as TypewriterStep, ...userSteps]
  }, [userSteps])

  // --- STATE ---
  const [text, setText] = useState(initialText)
  const [currentClosing, setCurrentClosing] = useState("")
  const [isWaiting, setIsWaiting] = useState(autoStart)
  const [isTyping, setIsTyping] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  // --- REFS (State of Truth) ---
  const charIndexRef = useRef(0)
  const textRef = useRef(initialText)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(false)

  // --- LATEST REFS (Для разрыва зависимости от рендера) ---
  // Эти рефы позволяют читать актуальные пропсы внутри useEffect без его перезапуска
  const stepsRef = useRef(steps)
  const configRef = useRef({ typeSpeed, deleteSpeed, humanize, humanizeRange })
  const callbacksRef = useRef({ onStepComplete, onComplete })

  // Синхронизируем рефы с пропсами при каждом рендере
  stepsRef.current = steps
  configRef.current = { typeSpeed, deleteSpeed, humanize, humanizeRange }
  callbacksRef.current = { onStepComplete, onComplete }

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // Расчет задержки (читает из Ref, чтобы не зависеть от пропсов)
  const getDelay = useCallback((baseDelay: number) => {
    const { humanize, humanizeRange } = configRef.current
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

  // --- ГЛАВНЫЙ ЦИКЛ ---
  // Зависит ТОЛЬКО от stepIndex и флагов состояния.
  // НЕ ЗАВИСИТ от steps, config и прочего, что меняется при рендере.
  useEffect(() => {
    if (!isTyping || isWaiting) return

    const currentSteps = stepsRef.current
    
    // Проверка финиша
    if (stepIndex >= currentSteps.length) {
      if (loop && currentSteps.length > 0) {
        setStepIndex(0)
        charIndexRef.current = 0
        textRef.current = initialText
        setText(initialText)
        setCurrentClosing("")
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

      const { typeSpeed, deleteSpeed } = configRef.current

      switch (step.action) {
        case "wait":
          setIsWaiting(true)
          setIsTyping(false)
          break

        case "type":
          const textToType = step.text || ""
          if (charIndexRef.current < textToType.length) {
            const char = textToType[charIndexRef.current]
            textRef.current += char
            setText(textRef.current)
            charIndexRef.current++
            timeoutRef.current = setTimeout(tick, getDelay(step.delay ?? typeSpeed))
          } else {
            timeoutRef.current = setTimeout(completeCurrentStep, 100)
          }
          break

        case "delete":
          const countToDelete = step.length ?? 1
          if (charIndexRef.current < countToDelete) {
            textRef.current = textRef.current.slice(0, -1)
            setText(textRef.current)
            charIndexRef.current++
            timeoutRef.current = setTimeout(tick, getDelay(step.delay ?? deleteSpeed))
          } else {
            timeoutRef.current = setTimeout(completeCurrentStep, 100)
          }
          break

        case "replace":
          timeoutRef.current = setTimeout(() => {
            const pos = step.position ?? 0
            const len = step.length ?? 0
            const replacement = step.text ?? ""
            const before = textRef.current.slice(0, pos)
            const after = textRef.current.slice(pos + len)
            
            textRef.current = before + replacement + after
            setText(textRef.current)
            completeCurrentStep()
          }, getDelay(step.delay ?? typeSpeed))
          break

        case "pause":
          timeoutRef.current = setTimeout(completeCurrentStep, step.delay ?? 1000)
          break

        case "clear":
          timeoutRef.current = setTimeout(() => {
            textRef.current = ""
            setText("")
            completeCurrentStep()
          }, 100)
          break
      }
    }

    tick()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  // В зависимостях НЕТ steps, config, getDelay. Только управляющие сигналы.
  }, [stepIndex, isTyping, isWaiting, loop, initialText, getDelay])

  const start = useCallback(() => {
    setIsWaiting(true)
    setIsTyping(false)
    setStepIndex(0)
    charIndexRef.current = 0
    textRef.current = initialText
    setText(initialText)
    setCurrentClosing("")
  }, [initialText])

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsTyping(false)
    setIsWaiting(false)
    setStepIndex(0)
    charIndexRef.current = 0
    textRef.current = initialText
    setText(initialText)
    setCurrentClosing("")
  }, [initialText])

  return { text, currentClosing, isTyping, isWaiting, stepIndex, start, reset, next, setText }
}
