import { useGameStore } from "@/stores/game"
import { useEngine } from "@/hooks/useEngine"

import { Matrix } from "./Matrix"
import { Piece } from "./Piece"

const blockSize = 20

function BoardMatrix() {
  const { width, height, blocks } = useGameStore((state) => state.matrix)

  return (
    <Matrix
      position={[0, 0, 0]}
      width={width}
      height={height}
      blocks={blocks}
    />
  )
}

function BoardPiece() {
  const piece = useGameStore((state) => state.piece)
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
  useEngine()

  return (
    <group>
      <BoardMatrix />
      <BoardPiece />
    </group>
  )
}
