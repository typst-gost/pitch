"use client"

import type React from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ExternalLink, TrendingUp, Users } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { QRCodeImage } from "@/components/ui/qr-generator"

interface QRLinkSlideProps {
  title: string
  subtitle?: string
  description?: string | React.ReactNode
  link: string
  linkLabel?: string
  image?: string
  layout?: "centered" | "with-image"
  showMembersCounter?: boolean
  telegramChatId?: string
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const prevValueRef = useRef(value)

  useEffect(() => {
    if (isInView && displayValue === 0 && value > 0) {
      const startValue = 0
      const endValue = value
      const duration = 1500
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(Math.floor(startValue + (endValue - startValue) * eased))
        if (progress < 1) requestAnimationFrame(animate)
      }
      animate()
    } else if (isInView && displayValue === 0 && value === 0) {
       setDisplayValue(0)
    }
  }, [isInView, value, displayValue])

  useEffect(() => {
    if (prevValueRef.current !== value && displayValue > 0) {
      const startValue = displayValue
      const endValue = value
      const duration = 1000
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(Math.floor(startValue + (endValue - startValue) * eased))
        if (progress < 1) requestAnimationFrame(animate)
      }
      animate()
    }
    prevValueRef.current = value
  }, [value, displayValue])

  return <span ref={ref}>{displayValue}</span>
}

function CelebrationArrows() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${8 + i * 8}%`, bottom: "-20%" }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [0, -window.innerHeight * 1.2], opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: 6 + Math.random() * 4, delay: i * 0.2, ease: "easeOut" }}
        >
          <TrendingUp
            className="text-primary"
            style={{ width: 32 + Math.random() * 24, height: 32 + Math.random() * 24, opacity: 0.4 + Math.random() * 0.4 }}
          />
        </motion.div>
      ))}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`small-${i}`}
          className="absolute"
          style={{ left: `${Math.random() * 100}%`, bottom: "-10%" }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [0, -window.innerHeight * 1.5], opacity: [0, 0.3, 0.3, 0] }}
          transition={{ duration: 8 + Math.random() * 5, delay: Math.random() * 1.5, ease: "easeOut" }}
        >
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-12 border-l-transparent border-r-transparent border-b-primary/40" />
        </motion.div>
      ))}
    </div>
  )
}

export function QRLinkSlide({
  title,
  subtitle,
  description,
  link,
  linkLabel,
  image,
  layout = "centered",
  showMembersCounter = false,
  telegramChatId = "@typst_gost",
}: QRLinkSlideProps) {
  const [membersCount, setMembersCount] = useState<number>(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const prevCountRef = useRef(0)
  const isFirstLoad = useRef(true)

  const fetchMembersCount = async () => {
    try {
      if (!showMembersCounter) return;

      const response = await fetch(
        `/api/telegram-members?chatId=${encodeURIComponent(telegramChatId)}`
      )
      const data = await response.json()

      if (response.ok && typeof data.result === "number") {
        const newCount = data.result
        if (isFirstLoad.current) {
          isFirstLoad.current = false
          setMembersCount(newCount)
          prevCountRef.current = newCount
        } else {
          if (newCount > prevCountRef.current) {
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 12000)
            setMembersCount(newCount)
            prevCountRef.current = newCount
          } else if (newCount !== prevCountRef.current) {
             setMembersCount(newCount)
             prevCountRef.current = newCount
          }
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Ошибка API:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (showMembersCounter) {
      fetchMembersCount()
      const interval = setInterval(fetchMembersCount, 500)
      return () => clearInterval(interval)
    }
  }, [telegramChatId, showMembersCounter])

  return (
    <div className="relative w-full h-full flex items-center justify-center px-16 lg:px-24">
      <AnimatePresence>{showCelebration && <CelebrationArrows />}</AnimatePresence>

      <div className={`flex ${layout === "with-image" ? "gap-16" : ""} items-center max-w-5xl relative z-10`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col ${layout === "centered" ? "items-center text-center" : ""}`}
        >
          {subtitle && (
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">{subtitle}</span>
          )}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">{title}</h2>

          {description && (
            <div className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">{description}</div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            {/* GENERATED QR Code */}
            <div className="bg-white p-6 rounded-3xl shadow-2xl">
               <QRCodeImage data={link} size={240} />
            </div>

            {showMembersCounter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <motion.div
                  animate={{ scale: showCelebration ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-linear-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/30 rounded-2xl px-8 py-5 shadow-xl relative overflow-hidden"
                >
                  <AnimatePresence>
                    {showCelebration && (
                      <motion.div
                        className="absolute inset-0 bg-primary/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.5, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-4 relative z-10">
                    <motion.div
                      animate={{
                        rotate: showCelebration ? [0, -15, 15, -10, 10, 0] : 0,
                        scale: showCelebration ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Users className="w-8 h-8 text-primary" />
                    </motion.div>
                    <div className="flex flex-col">
                      <div className="text-4xl font-bold text-primary tabular-nums">
                        {isLoading ? <span className="opacity-50">--</span> : <AnimatedNumber value={membersCount} />}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">Участников</div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-red-500"
                      animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}

            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-5 py-2.5 rounded-full font-medium text-sm hover:bg-primary/20 transition-colors"
            >
              {linkLabel || link}
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>

        {layout === "with-image" && image && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-96 h-96 rounded-2xl overflow-hidden border border-border"
          >
            <Image src={image || "/placeholder.svg"} alt="Illustration" fill className="object-cover" />
          </motion.div>
        )}
      </div>
    </div>
  )
}
