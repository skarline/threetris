import { Matrix } from "./Matrix"
import { Piece } from "./Piece"
import { useActionPress } from "../hooks/input"
import { useGameStore } from "../stores/game"

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

  useActionPress("moveleft", () => move(-1, 0))
  useActionPress("moveright", () => move(1, 0))
  useActionPress("rotatecw", () => rotate(true))
  useActionPress("rotateccw", () => rotate(false))

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
  return (
    <group>
      <BoardMatrix />
      <BoardPiece />
    </group>
  )
}
