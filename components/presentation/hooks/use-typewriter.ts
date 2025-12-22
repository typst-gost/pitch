"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface TypewriterStep {
  action: "type" | "delete" | "replace" | "pause" | "clear"
  text?: string
  position?: number // For replace: where to start
  length?: number // For delete/replace: how many chars
  delay?: number // Override default delay for this step
}

export interface TypewriterConfig {
  initialText?: string
  steps: TypewriterStep[]
  typeSpeed?: number // ms per character when typing
  deleteSpeed?: number // ms per character when deleting
  humanize?: boolean // Add random variation to speed
  humanizeRange?: number // Variation range in ms
  loop?: boolean
  autoStart?: boolean
}

export function useTypewriter(config: TypewriterConfig) {
  const {
    initialText = "",
    steps,
    typeSpeed = 50,
    deleteSpeed = 30,
    humanize = true,
    humanizeRange = 30,
    loop = false,
    autoStart = false,
  } = config

  const [text, setText] = useState(initialText)
  const [isTyping, setIsTyping] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isRunningRef = useRef(false)

  const getDelay = useCallback(
    (baseDelay: number) => {
      if (!humanize) return baseDelay
      const variation = (Math.random() - 0.5) * 2 * humanizeRange
      // Simulate human typing: occasional longer pauses
      const extraPause = Math.random() < 0.1 ? Math.random() * 150 : 0
      return Math.max(10, baseDelay + variation + extraPause)
    },
    [humanize, humanizeRange],
  )

  const runStep = useCallback(() => {
    if (!isRunningRef.current || stepIndex >= steps.length) {
      if (loop && steps.length > 0) {
        setStepIndex(0)
        setText(initialText)
      } else {
        setIsTyping(false)
        isRunningRef.current = false
      }
      return
    }

    const step = steps[stepIndex]
    const baseDelay = step.delay ?? typeSpeed

    switch (step.action) {
      case "type":
        if (step.text && charIndex < step.text.length) {
          setText((prev) => prev + step.text![charIndex])
          setCharIndex((prev) => prev + 1)
          timeoutRef.current = setTimeout(runStep, getDelay(baseDelay))
        } else {
          setCharIndex(0)
          setStepIndex((prev) => prev + 1)
          timeoutRef.current = setTimeout(runStep, 100)
        }
        break

      case "delete":
        const deleteCount = step.length ?? 1
        if (charIndex < deleteCount) {
          setText((prev) => prev.slice(0, -1))
          setCharIndex((prev) => prev + 1)
          timeoutRef.current = setTimeout(runStep, getDelay(step.delay ?? deleteSpeed))
        } else {
          setCharIndex(0)
          setStepIndex((prev) => prev + 1)
          timeoutRef.current = setTimeout(runStep, 100)
        }
        break

      case "replace":
        const pos = step.position ?? 0
        const len = step.length ?? 0
        setText((prev) => prev.slice(0, pos) + (step.text ?? "") + prev.slice(pos + len))
        setCharIndex(0)
        setStepIndex((prev) => prev + 1)
        timeoutRef.current = setTimeout(runStep, getDelay(baseDelay))
        break

      case "pause":
        timeoutRef.current = setTimeout(() => {
          setStepIndex((prev) => prev + 1)
          runStep()
        }, step.delay ?? 1000)
        break

      case "clear":
        setText("")
        setCharIndex(0)
        setStepIndex((prev) => prev + 1)
        timeoutRef.current = setTimeout(runStep, 100)
        break
    }
  }, [stepIndex, charIndex, steps, typeSpeed, deleteSpeed, getDelay, loop, initialText])

  const start = useCallback(() => {
    if (isRunningRef.current) return
    isRunningRef.current = true
    setIsTyping(true)
    setStepIndex(0)
    setCharIndex(0)
    setText(initialText)
    timeoutRef.current = setTimeout(runStep, 500)
  }, [initialText, runStep])

  const stop = useCallback(() => {
    isRunningRef.current = false
    setIsTyping(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const reset = useCallback(() => {
    stop()
    setText(initialText)
    setStepIndex(0)
    setCharIndex(0)
  }, [stop, initialText])

  // Trigger next step (for manual control)
  const next = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true
      setIsTyping(true)
    }
    runStep()
  }, [runStep])

  useEffect(() => {
    if (autoStart) {
      start()
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isTyping && isRunningRef.current) {
      runStep()
    }
  }, [stepIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    text,
    isTyping,
    stepIndex,
    start,
    stop,
    reset,
    next,
    setText,
  }
}
