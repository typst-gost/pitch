"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface CTASlideProps {
  title: string
  subtitle?: string
  ctaText?: string
  showLogo?: boolean
  contacts?: { name: string; email: string }[]
  links?: { label: string; url: string }[]
}

export function CTASlide({ title, subtitle, ctaText, showLogo = true, contacts, links }: CTASlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, #2563E8 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative z-10 text-center max-w-4xl">
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Image src="/logo.svg" alt="Logo" width={80} height={97} className="h-20 w-auto mx-auto" />
          </motion.div>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          {title}
        </motion.h2>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-muted-foreground mb-12"
          >
            {subtitle}
          </motion.p>
        )}

        {ctaText && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold hover:shadow-[0_0_40px_rgba(37,99,232,0.4)] transition-shadow"
          >
            {ctaText}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}

        {contacts && contacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-16 flex flex-wrap justify-center gap-12"
          >
            {contacts.map((contact, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-semibold">{contact.name}</div>
                <div className="text-muted-foreground">{contact.email}</div>
              </div>
            ))}
          </motion.div>
        )}

        {links && links.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex flex-wrap justify-center gap-6"
          >
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-border rounded-full text-sm hover:bg-primary/10 hover:border-primary/30 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
