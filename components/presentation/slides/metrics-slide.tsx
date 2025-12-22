"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"

interface Metric {
  value: number
  suffix?: string
  prefix?: string
  label: string
  description?: string
}

interface MetricsSlideProps {
  title: string
  subtitle?: string
  metrics: Metric[]
}

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(Math.floor(eased * value))
        if (progress < 1) requestAnimationFrame(animate)
      }
      animate()
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

function AnimatedArrows() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated upward arrows like trading charts */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${8 + i * 8}%`,
            bottom: "-20%",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -window.innerHeight * 1.2],
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.3,
            ease: "linear",
          }}
        >
          <TrendingUp
            className="text-primary"
            style={{
              width: 24 + Math.random() * 24,
              height: 24 + Math.random() * 24,
              opacity: 0.3 + Math.random() * 0.3,
            }}
          />
        </motion.div>
      ))}

      {/* Additional smaller arrows */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`small-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: "-10%",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -window.innerHeight * 1.5],
            opacity: [0, 0.2, 0.2, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        >
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent border-b-primary/30" />
        </motion.div>
      ))}
    </div>
  )
}

export function MetricsSlide({ title, subtitle, metrics }: MetricsSlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-center px-16 lg:px-24">
      <AnimatedArrows />

      <div className="text-center mb-20 relative z-10">
        {subtitle && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block"
          >
            {subtitle}
          </motion.span>
        )}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold tracking-tight"
        >
          {title}
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto w-full relative z-10">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.2 }}
            className="text-center group"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.1 }}
                transition={{ delay: 0.6 + index * 0.2, duration: 0.5 }}
                className="absolute inset-0 bg-primary rounded-full blur-3xl group-hover:opacity-20 transition-opacity"
              />
              <div className="text-6xl md:text-8xl font-bold bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent relative z-10">
                <AnimatedNumber value={metric.value} suffix={metric.suffix} prefix={metric.prefix} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mt-4 text-primary">{metric.label}</h3>
            {metric.description && <p className="text-muted-foreground mt-2">{metric.description}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
