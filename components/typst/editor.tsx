"use client"

import { useEffect, useState } from "react"
import { codeToHtml } from 'shiki'
import { motion, AnimatePresence } from "framer-motion"

interface TypstEditorProps {
  code: string
  onChange?: (code: string) => void
  readOnly?: boolean
  isTyping?: boolean 
  wordWrap?: boolean
  fileName?: string
}

export function TypstEditor({
  code,
  onChange,
  readOnly = false,
  isTyping = false,
  wordWrap = true,
  fileName = "main.typ"
}: TypstEditorProps) {
  const [highlightedCode, setHighlightedCode] = useState("")

  useEffect(() => {
    async function highlight() {
      try {
        const html = await codeToHtml(code, {
          lang: 'typst',
          theme: 'github-dark',
          defaultColor: false,
        })
        
        if (readOnly) {
          // Используем класс .typst-cursor, определенный в style теге ниже
          const cursorHtml = '<span class="typst-cursor"></span>'
          const htmlWithCursor = html.replace('</code>', `${cursorHtml}</code>`)
          setHighlightedCode(htmlWithCursor)
        } else {
          setHighlightedCode(html)
        }
      } catch (e) {
        setHighlightedCode(`<pre style="color: #e6edf3">${code}</pre>`)
      }
    }
    highlight()
  }, [code, readOnly])

  return (
    <div className="flex-1 h-full max-h-[60vh] flex flex-col min-w-0 relative">
      {/* Встраиваем стили напрямую, чтобы анимация гарантированно работала */}
      <style>{`
        @keyframes typst-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .typst-cursor {
          display: inline-block;
          width: 2px;
          height: 1.2em;
          background-color: white;
          margin-left: 1px;
          vertical-align: text-bottom;
          animation: typst-blink 1s step-end infinite;
        }
        /* Убираем фон у Shiki, чтобы не перекрывал */
        .shiki-transparent pre, 
        .shiki-transparent code {
          background-color: transparent !important;
        }
      `}</style>

      <div className="bg-[#0d1117] rounded-t-xl border border-border/50 px-4 py-2 flex items-center gap-2 select-none">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-muted-foreground ml-2 font-mono">{fileName}</span>

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ml-auto flex items-center gap-2"
            >
              <span className="text-[10px] font-bold text-red-500/60 tracking-wider">REC</span>
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_2px_rgba(220,38,38,0.6)] animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 bg-[#0d1117] rounded-b-xl border-x border-b border-border/50 p-4 overflow-auto relative scrollbar-hide">
        <div 
          className="font-mono text-sm leading-6 shiki-transparent"
          style={{ whiteSpace: wordWrap ? 'pre-wrap' : 'pre' }}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />

        {!readOnly && (
          <textarea
            value={code}
            onChange={(e) => onChange?.(e.target.value)}
            className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white font-mono text-sm leading-6 resize-none outline-none z-10"
            style={{ 
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              wordWrap: wordWrap ? 'break-word' : 'normal',
            }}
            spellCheck={false}
          />
        )}
      </div>
    </div>
  )
}
