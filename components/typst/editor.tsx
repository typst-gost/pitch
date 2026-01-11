"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { codeToHtml } from 'shiki'
import { motion, AnimatePresence } from "framer-motion"

interface TypstEditorProps {
  code: string
  files?: string[]
  activeFile?: string
  onFileChange?: (fileName: string) => void
  onChange?: (code: string) => void
  readOnly?: boolean
  isTyping?: boolean 
  wordWrap?: boolean
  className?: string
}

export function TypstEditor({
  code,
  files = ["main.typ"],
  activeFile = "main.typ",
  onFileChange,
  onChange,
  readOnly = false,
  isTyping = false,
  wordWrap = true,
  className
}: TypstEditorProps) {
  const [highlightedCode, setHighlightedCode] = useState("")
  
  const containerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const getLanguage = (fileName: string) => {
    if (fileName.endsWith('.typ')) return 'typst'
    if (fileName.endsWith('.bib')) return 'bibtex'
    if (fileName.endsWith('.json')) return 'json'
    if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) return 'yaml'
    return 'typst'
  }

  useEffect(() => {
    let mounted = true
    
    async function highlight() {
      try {
        // Fallback for simple display before shiki loads
        if (!code) {
          setHighlightedCode('<pre style="color: #e6edf3"><code></code></pre>')
        }

        const html = await codeToHtml(code, {
          lang: getLanguage(activeFile),
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
  }, [code, readOnly, activeFile])

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

      <div className="bg-[#0d1117] border-b border-border/50 flex items-center select-none shrink-0 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 px-4 sticky left-0 bg-[#0d1117] z-10 py-3 mr-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>

        <div className="flex items-center h-full">
          {files.map((file) => (
            <button
              key={file}
              onClick={() => onFileChange?.(file)}
              className={`
                px-4 py-2 text-xs font-mono border-r border-border/30 transition-colors h-full flex items-center
                ${file === activeFile 
                  ? "bg-[#161b22] text-white font-medium border-t-2 border-t-blue-500" 
                  : "text-muted-foreground hover:bg-[#161b22]/50 hover:text-white/80 border-t-2 border-t-transparent"}
              `}
            >
              {file}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ml-auto flex items-center gap-2 pr-4 pl-4 sticky right-0 bg-[#0d1117] z-10"
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
