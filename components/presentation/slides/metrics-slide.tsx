"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

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

export function MetricsSlide({ title, subtitle, metrics }: MetricsSlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-center px-16 lg:px-24">
      <div className="text-center mb-20">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto w-full">
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
