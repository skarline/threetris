import { useCallback, useLayoutEffect, useRef } from "react"

export function useFrame(callback: (time: number) => void) {
  const requestRef = useRef<number>(0)
  const previousTimeRef = useRef<number>(0)

  const animate = useCallback((ms: number) => {
    if (previousTimeRef.current !== undefined) {
      const delta = (ms - previousTimeRef.current) / 1000
      callback(delta)
    }
    previousTimeRef.current = ms
    requestRef.current = requestAnimationFrame(animate)
  }, [])

  useLayoutEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(requestRef.current)
      } else {
        requestRef.current = requestAnimationFrame(animate)
      }
    }

    requestRef.current = requestAnimationFrame(animate)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      cancelAnimationFrame(requestRef.current)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  })
}
