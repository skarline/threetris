import { useEffect, useRef } from "react"

import { Matrix } from "./Matrix"
import { Piece } from "./Piece"
import { useActionPress } from "../hooks/input"
import { useGameStore } from "../stores/game"
import { useFrame } from "@react-three/fiber"

const blockSize = 20

function BoardMatrix() {
  const { size, blocks } = useGameStore((state) => state.matrix)

  return <Matrix position={[0, 0, 0]} size={size} blocks={blocks} />
}

function BoardPiece() {
  const [piece, move, rotate] = useGameStore((state) => [
    state.piece,
    state.move,
    state.rotate,
  ])

  const fallingTime = useRef(1)

  useActionPress("moveleft", () => move(-1, 0), true)
  useActionPress("moveright", () => move(1, 0), true)
  useActionPress("rotatecw", () => rotate(true))
  useActionPress("rotateccw", () => rotate(false))

  useActionPress(
    "softdrop",
    () => {
      fallingTime.current = 1
      move(0, -1)
    },
    true
  )

  useFrame((_, delta) => {
    fallingTime.current -= delta

    if (fallingTime.current <= 0) {
      fallingTime.current += 1
      move(0, -1)
    }
  })

  if (!piece) return null

  const xPosition = piece.x * blockSize
  const yPosition = piece.y * blockSize

  return (
    <Piece
      position={[xPosition, yPosition, 1]}
      tetrimino={piece.tetrimino}
      rotation={piece.rotation}
    />
  )
}

export function Board() {
  const reset = useGameStore((state) => state.reset)

  useEffect(() => {
    reset()
  }, [])

  return (
    <group>
      <BoardMatrix />
      <BoardPiece />
    </group>
  )
}
