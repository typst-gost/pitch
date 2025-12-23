import { AnimatePresence, motion } from "framer-motion"

export function SlideCounter({
  current,
  total,
  position
}: {
  current: number
  total: number
  position: "left" | "center" | "right"
}) {
  const positionClasses = {
    left: "left-8",
    center: "left-1/2 -translate-x-1/2",
    right: "right-8"
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed bottom-6 z-40 flex items-center gap-1 font-mono text-3xl font-medium text-primary pointer-events-none select-none mix-blend-difference ${positionClasses[position]}`}
    >
      <div className="h-[1.2em] min-w-[2ch] mx-1 overflow-hidden relative leading-none">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
            }}
            className="absolute inset-0 flex items-center justify-center leading-none"
          >
            {current}
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="opacity-30 leading-none">/</span>
      <span className="opacity-50 ml-1 leading-none">{total}</span>
    </motion.div>
  )
}
