"use client"

import { motion, AnimatePresence } from "framer-motion"

interface AnimatedBackgroundProps {
  isWorkshop?: boolean
}

// Компонент одной бегущей строки
function MarqueeLine({ 
  children, 
  direction = "left", 
  duration = 100,
  initialOffset = 0 // Добавили параметр смещения (0-50)
}: { 
  children: React.ReactNode, 
  direction?: "left" | "right", 
  duration?: number,
  initialOffset?: number
}) {
  
  const start = direction === "left" ? -initialOffset : -50 + initialOffset
  const end = direction === "left" ? -50 - initialOffset : 0 + initialOffset

  return (
    <div className="flex overflow-hidden w-full">
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        // Важно: начальное состояние задаем жестко через style или initial
        initial={{ x: `${start}%` }} 
        animate={{ x: `${end}%` }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        {/* Рендерим 4 раза для запаса */}
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  )
}

export function AnimatedBackground({ isWorkshop = false }: AnimatedBackgroundProps) {
  const wordsGroup = (
    <div className="flex gap-16 items-center">
      <span>LIVE</span>
      <span className="text-primary/30">•</span>
      <span>ПРЕВЬЮ</span>
      <span className="text-primary/30">•</span>
      <span>ДЕМО</span>
      <span className="text-primary/30">•</span>
      <span>TYPST</span>
      <span className="text-primary/30">•</span>
    </div>
  )

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        {isWorkshop ? (
          <motion.div
            key="workshop-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Darker background */}
            <div className="absolute inset-0 bg-[#050810]" />
            
            <div className="absolute inset-0 flex flex-col justify-center gap-24 -rotate-12 scale-150 opacity-[0.02] select-none">
              {[...Array(8)].map((_, i) => {
                 // Генерируем псевдо-случайное смещение от 0 до 40%
                 // Используем индекс i, чтобы результат был стабильным при ререндере (не дергался), но разным для строк
                 const randomOffset = (i * 17) % 40 

                 return (
                  <div key={i} className="text-7xl md:text-9xl font-black text-white uppercase tracking-widest">
                    <MarqueeLine 
                      direction={i % 2 === 0 ? "left" : "right"} 
                      duration={300 + (i * 20)}
                      initialOffset={randomOffset} // <-- Передаем смещение
                    >
                      {wordsGroup}
                    </MarqueeLine>
                  </div>
                )
              })}
            </div>

            {/* ... (остальной код без изменений) ... */}
            <motion.div
              className="absolute w-150 h-150 rounded-full opacity-10"
              style={{
                background: "radial-gradient(circle, #1a2744 0%, transparent 70%)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
                backgroundSize: "50px 25px",
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="default-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
             {/* ... (код дефолтного фона без изменений) ... */}
            <motion.div
              className="absolute w-250 h-250 rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, #2563E8 0%, transparent 70%)",
                left: "-200px",
                top: "-200px",
              }}
              animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-200 h-200 rounded-full opacity-15"
              style={{
                background: "radial-gradient(circle, #1441A4 0%, transparent 70%)",
                right: "-150px",
                bottom: "-150px",
              }}
              animate={{ x: [0, -80, 0], y: [0, -60, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(#2563E8 1px, transparent 1px), linear-gradient(90deg, #2563E8 1px, transparent 1px)`,
                backgroundSize: "100px 100px",
              }}
            />
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ y: [0, -100, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 5,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
