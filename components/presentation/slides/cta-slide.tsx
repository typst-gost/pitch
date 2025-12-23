"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ExternalLink, Mail } from "lucide-react"
import { QRCodeImage } from "@/components/ui/qr-generator"

interface QRItem {
  label: string
  url: string
}

interface CTASlideProps {
  title: string
  subtitle?: string
  showLogo?: boolean
  author?: {
    name: string
    email: string
    avatar?: string
    role?: string
  }
  qrCodes?: QRItem[]
  links?: { label: string; url: string }[]
  footerText?: string | React.ReactNode // Добавил проп для текста в футере
}

export function CTASlide({ 
  title, 
  subtitle, 
  showLogo = true, 
  author, 
  qrCodes, 
  links,
  footerText 
}: CTASlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 lg:p-16 overflow-hidden">
      {/* Background Ambient Light */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-16 items-center flex-grow">
        
        {/* === LEFT COLUMN: Content & QR === */}
        <div className="flex flex-col items-start text-left space-y-8">
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Image src="/logo.svg" alt="Logo" width={60} height={72} className="h-16 w-auto" />
            </motion.div>
          )}

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight"
            >
              {title}
            </motion.h2>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-muted-foreground max-w-lg"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {/* Links List */}
          {links && links.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-3"
            >
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Полезные ссылки</h3>
              <div className="flex flex-wrap gap-4">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                  >
                    <span className="border-b border-transparent group-hover:border-primary/50 transition-colors">
                      {link.label}
                    </span>
                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          {/* QR Codes */}
          {qrCodes && qrCodes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <div className="flex flex-wrap gap-8">
                {qrCodes.map((qr, index) => (
                  <div key={index} className="flex flex-col items-start gap-3">
                    <div className="bg-white p-3 rounded-2xl shadow-lg border border-border/50">
                      <QRCodeImage data={qr.url} size={140} />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground pl-1">{qr.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* === CENTER: Divider === */}
        <div className="hidden lg:flex justify-center h-full min-h-[400px]">
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "100%", opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="w-[1px] bg-gradient-to-b from-transparent via-primary/40 to-transparent"
          />
        </div>

        {/* === RIGHT COLUMN: Author === */}
        {author && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center text-center lg:items-center justify-center h-full"
          >
            <span className="text-primary/60 font-semibold tracking-[0.2em] uppercase text-sm mb-8">
              Автор проекта
            </span>

            {/* Big Avatar with Glow */}
            <div className="relative mb-8 group">
              <motion.div
                className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              />
              <div className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden bg-muted">
                {author.avatar ? (
                  <Image
                    src={author.avatar || "/placeholder.svg"}
                    alt={author.name}
                    fill
                    className="object-cover transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-6xl font-bold text-gray-700">
                    {author.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-3xl lg:text-4xl font-bold mb-2">{author.name}</h3>
            
            {author.role && (
              <p className="text-lg text-primary mb-4">{author.role}</p>
            )}

            <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
              <Mail className="w-4 h-4" />
              <span className="text-lg">{author.email}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* === FOOTER TEXT === */}
      {footerText && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-6 left-0 right-0 text-center px-8 z-20"
        >
          <p className="text-sm text-muted-foreground/40 font-medium tracking-widest uppercase">
            {footerText}
          </p>
        </motion.div>
      )}
    </div>
  )
}
