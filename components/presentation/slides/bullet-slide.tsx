"use client"

import { motion } from "framer-motion"

interface BulletSlideProps {
  title: string
  bullets: string[]
  subtitle?: string
}

export function BulletSlide({ title, bullets, subtitle }: BulletSlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-center px-16 lg:px-32">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl"
      >
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
        <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tight">{title}</h2>
      </motion.div>

      <div className="space-y-8 max-w-4xl">
        {bullets.slice(0, 4).map((bullet, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.15, duration: 0.5 }}
            className="flex items-start gap-6 group"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.15, type: "spring" }}
              className="flex-shrink-0 w-3 h-3 mt-3 rounded-full bg-primary group-hover:shadow-[0_0_20px_rgba(37,99,232,0.5)] transition-shadow duration-300"
            />
            <span className="text-2xl md:text-3xl text-foreground/90 leading-relaxed">{bullet}</span>
          </motion.div>
        ))}
      </div>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-16 left-16 lg:left-32 w-24 h-1 bg-gradient-to-r from-primary to-transparent origin-left"
      />
    </div>
  )
}
