import { useLayoutEffect, useRef } from "react"

export function useFrame(callback: (time: number) => void) {
  const requestRef = useRef<number>(0)
  const previousTimeRef = useRef<number>(0)

  const animate = (ms: number) => {
    if (previousTimeRef.current !== undefined) {
      const delta = (ms - previousTimeRef.current) / 1000
      callback(delta)
    }
    previousTimeRef.current = ms
    requestRef.current = requestAnimationFrame(animate)
  }

  useLayoutEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  })
}
