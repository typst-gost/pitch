"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useTypstCompiler } from "@/hooks/use-typst-compiler"

interface TypstPreviewProps {
  code: string
  assets?: string[]
  hiddenPrefix?: string
  hiddenSuffix?: string
  placeholder?: string
  className?: string
}

export function TypstPreview({
  code,
  assets = [],
  hiddenPrefix = "",
  hiddenSuffix = "",
  placeholder = "Предпросмотр документа",
  className
}: TypstPreviewProps) {
  const [compiledSvg, setCompiledSvg] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const lastValidSvgRef = useRef<string | null>(null)
  
  const { compile, compiler, isLoading } = useTypstCompiler()

  const loadAssets = useCallback(async () => {
    if (!compiler || assets.length === 0) {
      setIsReady(true)
      return
    }

    try {
      await Promise.all(assets.map(async (assetName) => {
        const response = await fetch(`compile/${assetName}`)
        if (!response.ok) throw new Error(`Asset ${assetName} not found`)
        
        const buffer = await response.arrayBuffer()
        compiler.mapShadow(`/${assetName}`, new Uint8Array(buffer))
      }))
      setIsReady(true)
    } catch (error) {
      console.error("Failed to load Typst assets:", error)
      setIsReady(true)
    }
  }, [compiler, assets])

  const handleCompile = useCallback(async () => {
    if (!compile || !isReady) return

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
  }, [code, compile, hiddenPrefix, hiddenSuffix, isReady])

  useEffect(() => {
    if (compiler) {
      loadAssets()
    }
  }, [compiler, loadAssets])

  useEffect(() => {
    handleCompile()
  }, [handleCompile])

  const currentSvg = compiledSvg || lastValidSvgRef.current

  return (
    <div className={`flex flex-col min-w-0 rounded-xl border border-border/50 overflow-hidden ${className || ''}`}>
      <div className="bg-muted/30 border-b border-border/50 px-4 py-2 flex items-center justify-between select-none shrink-0">
        <span className="text-xs text-muted-foreground font-medium">Предпросмотр</span>
        {isLoading && (
          <span className="text-[10px] text-muted-foreground animate-pulse">Загрузка компилятора...</span>
        )}
      </div>
      
      <div className="flex-1 bg-muted/20 overflow-hidden relative">
        {currentSvg ? (
          <div
            className="w-full h-full flex items-center justify-center p-4"
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
