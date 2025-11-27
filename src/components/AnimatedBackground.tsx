import { useEffect, useRef } from "react"
import p5 from "p5"
import { clamp, inRange, range } from "lodash"
import { useGameStore } from "@/stores/game"
import { getMatrixRealHeight } from "@/utils/engine"

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const p5Ref = useRef<p5 | null>(null)

  useEffect(() => {
    function script(p: p5) {
      const MAX_LINES = 50
      const MAX_HEIGHT = 20

      const safeMargin = 100

      let level = 0
      let height = 0
      let targetLevel = 0
      let targetHeight = 0

      const lineCount = 50

      let time = 0

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
        containerRef.current?.appendChild(canvas.elt)

        window.addEventListener("resize", () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight)
        })

        useGameStore.subscribe((store) => {
          targetLevel = clamp(store.completedLines, 0, MAX_LINES)
          targetHeight = clamp(getMatrixRealHeight(store.matrix), 0, MAX_HEIGHT)
        })
      }

      p.draw = () => {
        p.background(0)

        level = p.lerp(level, targetLevel, p.deltaTime * 0.001)
        height = p.lerp(height, targetHeight, p.deltaTime * 0.001)

        const baseGap = p.map(level, 0, MAX_LINES, 100, 50) // game level

        const scale = p.map(height, 0, MAX_HEIGHT, 0.5, 5)
        const amplitude = p.map(height, 0, MAX_HEIGHT, 100, 200)

        const noise = p.noise(time * 0.01)

        const verticalOffset = p.map(noise, 0, 1, -100, 100)
        const gap = baseGap * p.map(noise, 0, 1, 0.8, 1.5)
        const skew = p.map(noise, 0, 1, -1, 1)

        p.strokeWeight(4)
        p.stroke(100, 100, 100)
        p.noFill()

        for (const line of range(-lineCount / 2, lineCount / 2)) {
          const y = p.height / 2 + line * gap

          if (
            !inRange(y + verticalOffset, 0 - amplitude, p.height + amplitude)
          ) {
            return
          }

          p.beginShape()

          for (let i = 0; i < p.width; i++) {
            const x = p.map(i, 0, p.width, -safeMargin, p.width + safeMargin)

            const mx = p.map(x + y * skew, 0, p.width, -1, 1)
            const my = p.map(line, 0, lineCount, -1, 1)

            const noise = p.noise(mx * scale, my * scale, time * 0.1)
            const offset = p.map(noise, 0, 1, -amplitude, amplitude)

            p.splineVertex(x, y + offset + verticalOffset)
          }

          p.endShape()
        }

        time += p.deltaTime / 1000
      }
    }

    if (!p5Ref.current) {
      p5Ref.current = new p5(script)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: -1,
      }}
    />
  )
}
