import { useState, useEffect } from "react"

export function useHideCursor(timeout = 3000) {
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    const onMouseMove = () => {
      setIsHidden(false)
      
      clearTimeout(timer)
      timer = setTimeout(() => setIsHidden(true), timeout)
    }

    window.addEventListener("mousemove", onMouseMove)

    timer = setTimeout(() => setIsHidden(true), timeout)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      clearTimeout(timer)
    }
  }, [timeout])

  return isHidden
}
