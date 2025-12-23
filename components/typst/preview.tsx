"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useTypstCompiler } from "@/hooks/use-typst-compiler"

interface TypstPreviewProps {
  code: string
  hiddenPrefix?: string
  hiddenSuffix?: string
  placeholder?: string
}

export function TypstPreview({
  code,
  hiddenPrefix = "",
  hiddenSuffix = "",
  placeholder = "Предпросмотр документа"
}: TypstPreviewProps) {
  const [compiledSvg, setCompiledSvg] = useState<string | null>(null)
  const lastValidSvgRef = useRef<string | null>(null)
  
  const { compile, isLoading } = useTypstCompiler()

  const handleCompile = useCallback(async () => {
    if (!compile) return

    try {
      const fullCode = `${hiddenPrefix}\n${code}\n${hiddenSuffix}`
      const svg = await compile(fullCode)

      if (svg && typeof svg === 'string' && svg.trim().startsWith('<svg')) {
        const processed = svg
          .trim()
          .replace(/width="[\d.]+pt"/g, 'width="100%"')
          .replace(/height="[\d.]+pt"/g, 'height="100%"')
        
        setCompiledSvg(processed)
        lastValidSvgRef.current = processed
      }
    } catch (error) {
    }
  }, [code, compile, hiddenPrefix, hiddenSuffix])

  useEffect(() => {
    handleCompile()
  }, [handleCompile])

  const currentSvg = compiledSvg || lastValidSvgRef.current

  return (
    <div className="flex-1 h-full max-h-[60vh] flex flex-col min-w-0">
      <div className="bg-muted/30 rounded-t-xl border border-border/50 px-4 py-2 flex items-center justify-between select-none">
        <span className="text-xs text-muted-foreground font-medium">Предпросмотр</span>
        {isLoading && (
          <span className="text-[10px] text-muted-foreground animate-pulse">Загрузка ядра...</span>
        )}
      </div>
      
      <div className="flex-1 bg-muted/20 rounded-b-xl border-x border-b border-border/50 overflow-hidden relative">
        {currentSvg ? (
          <div
            className="w-full h-full flex items-center justify-center p-4"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div 
               className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
               dangerouslySetInnerHTML={{ __html: currentSvg }} 
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40 text-sm">
            {isLoading ? "Подготовка..." : placeholder}
          </div>
        )}
      </div>
    </div>
  )
}
