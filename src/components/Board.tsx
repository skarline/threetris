import { useGameGhostPiece, useGameStore } from "@/stores/game"
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

function BoardGhostPiece() {
  const ghostPiece = useGameGhostPiece()
  if (!ghostPiece) return null

  const xPosition = ghostPiece.x * blockSize
  const yPosition = ghostPiece.y * blockSize

  return (
    <Piece
      position={[xPosition, yPosition, 0]}
      tetrimino={ghostPiece.tetrimino}
      rotation={ghostPiece.rotation}
      opacity={0.5}
    />
  )
}

export function Board() {
  useEngine()

  const boardWidth = useGameStore((state) => state.matrix.width * blockSize)
  const boardHeight = useGameStore((state) => state.matrix.height * blockSize)

  return (
    <group position={[-boardWidth / 2, -boardHeight / 2, 0]}>
      <BoardMatrix />
      <BoardGhostPiece />
      <BoardPiece />
    </group>
  )
}
