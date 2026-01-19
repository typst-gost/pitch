"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useTypstCompiler } from "@/hooks/use-typst-compiler"

interface TypstPreviewProps {
  code: string
  activeFile?: string
  files?: Record<string, string>
  assets?: string[]
  hiddenPrefix?: string
  hiddenSuffix?: string
  placeholder?: string
  className?: string
}

export function TypstPreview({
  code,
  activeFile = "main.typ",
  files = {},
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
  
  const fileExt = activeFile.split('.').pop() || "txt"
  const isTypst = fileExt === "typ"

  const loadAssets = useCallback(async () => {
    if (!compiler || assets.length === 0) return

    try {
      await Promise.all(assets.map(async (assetName) => {
        const response = await fetch(`compile/${assetName}`)
        if (!response.ok) throw new Error(`Asset ${assetName} not found`)
        
        const buffer = await response.arrayBuffer()
        compiler.mapShadow(`/${assetName}`, new Uint8Array(buffer))
      }))
    } catch (error) {
      console.error("Failed to load Typst assets:", error)
    }
  }, [compiler, assets])

  const syncFiles = useCallback(() => {
    if (!compiler) return

    const encoder = new TextEncoder()

    Object.entries(files).forEach(([filename, content]) => {
      if (filename !== activeFile) {
        compiler.mapShadow(`/${filename}`, encoder.encode(content))
      }
    })

    compiler.mapShadow(`/${activeFile}`, encoder.encode(code))

  }, [compiler, files, code, activeFile])

  const handleCompile = useCallback(async () => {
    if (!compile || !compiler) return

    syncFiles()
    
    if (!isReady && assets.length > 0) {
      await loadAssets()
      setIsReady(true)
    }

    try {
      let sourceToCompile = ""

      if (isTypst) {
        sourceToCompile = `${hiddenPrefix}\n${code}\n${hiddenSuffix}`
      } else {
        sourceToCompile = `
          ${hiddenPrefix}
          #set page(margin: (x: 20pt, y: 20pt)) // Опционально: сброс полей для кода, если нужно
          #raw(read("/${activeFile}"), lang: "${fileExt}", block: true)
          ${hiddenSuffix}
        `
      }
      
      const svg = await compile(sourceToCompile)

      if (svg && typeof svg === 'string' && svg.trim().startsWith('<svg')) {
        const processed = svg
          .trim()
          .replace(/width="[\d.]+pt"/g, 'width="100%"')
          .replace(/height="[\d.]+pt"/g, 'height="100%"')
        
        setCompiledSvg(processed)
        lastValidSvgRef.current = processed
      }
    } catch (error) {
      console.warn("Typst compile error:", error)
    }
  }, [compile, compiler, code, hiddenPrefix, hiddenSuffix, isReady, loadAssets, syncFiles, isTypst, activeFile, fileExt])

  useEffect(() => {
    handleCompile()
  }, [handleCompile])

  const currentSvg = compiledSvg || lastValidSvgRef.current

  return (
    <div className={`flex flex-col min-w-0 rounded-xl border border-border/50 overflow-hidden ${className || ''}`}>
      <div className="bg-muted/30 border-b border-border/50 px-4 py-2 flex items-center justify-between select-none shrink-0">
        <span className="text-xs text-muted-foreground font-medium">
          {isTypst ? "Предпросмотр" : `Просмотр: ${activeFile}`}
        </span>
        {isLoading && (
          <span className="text-[10px] text-muted-foreground animate-pulse">Загрузка компилятора...</span>
        )}
      </div>
      
      <div className="flex-1 bg-muted/20 overflow-hidden relative">
        {currentSvg ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div 
               className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain shadow-sm"
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
