"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

interface CodeBlock {
  title: string
  code: string
  output?: string
  language?: string
}

interface CodeScrollSlideProps {
  title: string
  blocks: CodeBlock[]
}

export function CodeScrollSlide({ title, blocks }: CodeScrollSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  return (
    <div ref={containerRef} className="relative" style={{ height: `${100 + blocks.length * 100}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="px-16 pt-12 pb-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        </motion.div>

        <div className="flex-1 px-16 pb-12 overflow-hidden">
          <div className="h-full relative">
            {blocks.map((block, index) => {
              const start = index / blocks.length
              const end = (index + 1) / blocks.length

              return (
                <CodeBlockItem
                  key={index}
                  block={block}
                  index={index}
                  scrollYProgress={scrollYProgress}
                  start={start}
                  end={end}
                  isLast={index === blocks.length - 1}
                />
              )
            })}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {blocks.map((_, index) => {
            const start = index / blocks.length
            const end = (index + 1) / blocks.length
            return <ProgressDot key={index} scrollYProgress={scrollYProgress} start={start} end={end} />
          })}
        </div>
      </div>
    </div>
  )
}

function ProgressDot({ scrollYProgress, start, end }: { scrollYProgress: any; start: number; end: number }) {
  const opacity = useTransform(scrollYProgress, [start, start + 0.01, end - 0.01, end], [0.3, 1, 1, 0.3])
  const scale = useTransform(scrollYProgress, [start, start + 0.01, end - 0.01, end], [1, 1.5, 1.5, 1])

  return <motion.div style={{ opacity, scale }} className="w-2 h-2 rounded-full bg-primary" />
}

function CodeBlockItem({
  block,
  index,
  scrollYProgress,
  start,
  end,
  isLast,
}: {
  block: CodeBlock
  index: number
  scrollYProgress: any
  start: number
  end: number
  isLast: boolean
}) {
  const y = useTransform(scrollYProgress, [start, end], ["0%", isLast ? "0%" : "-100%"])
  const opacity = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, isLast ? 1 : 0])

  return (
    <motion.div style={{ y, opacity }} className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Code */}
      <div className="bg-card/50 rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <span className="text-sm text-muted-foreground ml-2">{block.title}</span>
        </div>
        <pre className="p-6 overflow-auto h-full">
          <code className="text-sm font-mono text-foreground/90 leading-relaxed whitespace-pre-wrap">{block.code}</code>
        </pre>
      </div>

      {/* Output */}
      {block.output && (
        <div className="bg-card/30 rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-primary/5">
            <span className="text-sm text-primary font-medium">Результат</span>
          </div>
          <div className="p-6 overflow-auto h-full">
            <pre className="text-sm font-mono text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {block.output}
            </pre>
          </div>
        </div>
      )}
    </motion.div>
  )
}
