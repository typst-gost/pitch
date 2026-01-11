"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { codeToHtml } from 'shiki'
import { motion, AnimatePresence } from "framer-motion"

interface TypstEditorProps {
  code: string
  onChange?: (code: string) => void
  readOnly?: boolean
  isTyping?: boolean 
  wordWrap?: boolean
  fileName?: string
  className?: string
}

export function TypstEditor({
  code,
  onChange,
  readOnly = false,
  isTyping = false,
  wordWrap = true,
  fileName = "main.typ",
  className
}: TypstEditorProps) {
  const [highlightedCode, setHighlightedCode] = useState(() => {
    return `<pre style="color: #e6edf3; background-color: transparent"><code>${code}</code></pre>`
  })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let mounted = true
    
    async function highlight() {
      try {
        const html = await codeToHtml(code, {
          lang: 'typst',
          theme: 'github-dark',
          defaultColor: false,
        })
        
        if (!mounted) return

        if (readOnly) {
          const cursorHtml = '<span class="typst-cursor"></span>'
          const htmlWithCursor = html.replace('</code>', `${cursorHtml}</code>`)
          setHighlightedCode(htmlWithCursor)
        } else {
          setHighlightedCode(html)
        }
      } catch (e) {
        if (mounted) {
           setHighlightedCode(`<pre style="color: #e6edf3"><code>${code}</code></pre>`)
        }
      }
    }
    
    highlight()
    return () => { mounted = false }
  }, [code, readOnly])

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(scrollToBottom, 50)
      return () => clearTimeout(timer)
    }
  }, [highlightedCode, scrollToBottom, isTyping])

  const commonStyles: React.CSSProperties = {
    whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
    wordBreak: wordWrap ? 'break-word' : 'normal',
    overflowWrap: wordWrap ? 'anywhere' : 'normal',
    fontFamily: 'monospace', 
    lineHeight: '1.5rem',
    fontSize: '0.875rem', 
    padding: '1rem',
    margin: 0,
  }

  return (
    <div className={`flex flex-col min-w-0 relative bg-[#0d1117] rounded-xl border border-border/50 overflow-hidden ${className || ''}`}>
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
        /* Стили для shiki, чтобы убрать дефолтные отступы */
        .shiki-transparent pre, 
        .shiki-transparent code {
          background-color: transparent !important;
          white-space: inherit !important;
          word-break: inherit !important;
          overflow-wrap: inherit !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: inherit !important;
          line-height: inherit !important;
          font-size: inherit !important;
        }
      `}</style>

      <div className="bg-[#0d1117] border-b border-border/50 px-4 py-2 flex items-center gap-2 select-none shrink-0">
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

      <div 
        ref={containerRef}
        className="flex-1 bg-[#0d1117] overflow-auto relative scrollbar-hide"
      >
        <div className="grid min-h-full">
          
          <div 
            className="shiki-transparent pointer-events-none select-none"
            style={{ 
              ...commonStyles, 
              gridArea: '1 / 1',
              zIndex: 0 
            }}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />

          {!readOnly && (
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => onChange?.(e.target.value)}
              className="w-full bg-transparent text-transparent caret-white resize-none outline-none overflow-hidden"
              style={{ 
                ...commonStyles, 
                gridArea: '1 / 1',
                zIndex: 1 
              }}
              spellCheck={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}
