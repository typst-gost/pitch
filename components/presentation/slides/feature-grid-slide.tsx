"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface FeatureGridSlideProps {
  title: string
  subtitle?: string
  features: Feature[]
}

export function FeatureGridSlide({ title, subtitle, features }: FeatureGridSlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-center px-16 lg:px-24">
      <div className="text-center mb-16">
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-card/50 border border-border rounded-2xl p-6 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
