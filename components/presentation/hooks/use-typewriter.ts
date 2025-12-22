"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useSlideContext } from "../presentation"

export interface TypewriterStep {
  action: "type" | "delete" | "replace" | "pause" | "clear" | "wait"
  text?: string
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
  // Новые колбэки
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

  // Добавляем начальный wait, чтобы слайд ждал клика перед стартом анимации
  const steps = useMemo(() => {
    return [{ action: "wait" } as TypewriterStep, ...userSteps]
  }, [userSteps])

  const [text, setText] = useState(initialText)
  const [isWaiting, setIsWaiting] = useState(autoStart)
  const [isTyping, setIsTyping] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const getDelay = useCallback(
    (baseDelay: number) => {
      if (!humanize) return baseDelay
      const variation = (Math.random() - 0.5) * 2 * humanizeRange
      const extraPause = Math.random() < 0.1 ? Math.random() * 150 : 0
      return Math.max(10, baseDelay + variation + extraPause)
    },
    [humanize, humanizeRange],
  )

  const next = useCallback(() => {
    setIsWaiting(false)
    setStepIndex((prev) => prev + 1)
    setCharIndex(0)
    setIsTyping(true)
  }, [])

  // Регистрация обработчика клика/нажатия для слайда
  useEffect(() => {
    if (isWaiting) {
      registerStepHandler(() => {
        next()
        return true
      })
      return () => {
        registerStepHandler(null)
      }
    } else {
      registerStepHandler(null)
    }
  }, [isWaiting, next, registerStepHandler])

  // Основная логика анимации
  useEffect(() => {
    if (!isTyping || isWaiting) return

    // Проверка завершения всех шагов
    if (stepIndex >= steps.length) {
      if (loop && steps.length > 0) {
        setStepIndex(0)
        setCharIndex(0)
        if (initialText) setText(initialText)
        // Если зацикливаем, можно вызвать onComplete для цикла, если нужно
      } else {
        setIsTyping(false)
        onComplete?.() // Вызываем колбэк завершения всей цепочки
      }
      return
    }

    const step = steps[stepIndex]

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    const completeCurrentStep = () => {
      onStepComplete?.() // Вызываем колбэк завершения шага
      setCharIndex(0)
      setStepIndex((prev) => prev + 1)
    }

    const processStep = () => {
      switch (step.action) {
        case "wait":
          setIsWaiting(true)
          setIsTyping(false)
          break

        case "type":
          if (step.text && charIndex < step.text.length) {
            timeoutRef.current = setTimeout(() => {
              setText((prev) => prev + step.text![charIndex])
              setCharIndex((prev) => prev + 1)
            }, getDelay(step.delay ?? typeSpeed))
          } else {
            timeoutRef.current = setTimeout(completeCurrentStep, 100)
          }
          break

        case "delete":
          const deleteCount = step.length ?? 1
          if (charIndex < deleteCount) {
            timeoutRef.current = setTimeout(() => {
              setText((prev) => prev.slice(0, -1))
              setCharIndex((prev) => prev + 1)
            }, getDelay(step.delay ?? deleteSpeed))
          } else {
            timeoutRef.current = setTimeout(completeCurrentStep, 100)
          }
          break

        case "replace":
          // Replace обычно происходит мгновенно для пользователя (или с задержкой), 
          // можно было бы разбить на удаление и печать, но тут простая реализация
          timeoutRef.current = setTimeout(() => {
            const pos = step.position ?? 0
            const len = step.length ?? 0
            setText((prev) => prev.slice(0, pos) + (step.text ?? "") + prev.slice(pos + len))
            completeCurrentStep()
          }, getDelay(step.delay ?? typeSpeed))
          break

        case "pause":
          timeoutRef.current = setTimeout(() => {
            completeCurrentStep()
          }, step.delay ?? 1000)
          break

        case "clear":
          timeoutRef.current = setTimeout(() => {
            setText("")
            completeCurrentStep()
          }, 100)
          break
      }
    }

    processStep()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [
    stepIndex, 
    charIndex, 
    isTyping, 
    isWaiting, 
    steps, 
    loop, 
    initialText, 
    getDelay, 
    typeSpeed, 
    deleteSpeed,
    onStepComplete,
    onComplete
  ])

  const start = useCallback(() => {
    setIsWaiting(true)
    setIsTyping(false)
    setStepIndex(0)
    setCharIndex(0)
    setText(initialText)
  }, [initialText])

  const stop = useCallback(() => {
    setIsTyping(false)
    setIsWaiting(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  const reset = useCallback(() => {
    stop()
    setText(initialText)
    setStepIndex(0)
    setCharIndex(0)
  }, [stop, initialText])

  // Автостарт при инициализации (если нужно сбросить на 0 шаг)
  useEffect(() => {
    if (autoStart) {
      setStepIndex(0)
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    text,
    isTyping,
    isWaiting,
    stepIndex,
    start,
    stop,
    reset,
    next,
    setText,
  }
}
