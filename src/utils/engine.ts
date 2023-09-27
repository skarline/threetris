import { createRNG } from "@/utils/random"
import { TetriminosArray } from "@/constants/tetriminos"

const rng = createRNG(Date.now())

export function getPieceBlocks(piece: Threetris.Piece): Threetris.Block[] {
  const facing = piece.tetrimino.facings[piece.rotation]

  return facing.blocks.map((block) => ({
    ...block,
    x: piece.x + block.x,
    y: piece.y + block.y,
  }))
}

export function checkCollision(
  piece: Threetris.Piece,
  matrix: Threetris.Matrix,
) {
  return getPieceBlocks(piece).some(({ x, y }) => {
    if (y < 0) return true
    if (x < 0) return true
    if (x >= matrix.width) return true

    return matrix.blocks.some((block) => block.x === x && block.y === y)
  })
}

export function getShuffledTetriminos() {
  return [...TetriminosArray].sort(() => rng.next().value - 0.5)
}

export function movePiece(
  piece: Threetris.Piece,
  dx: number,
  dy: number,
): Threetris.Piece {
  const x = piece.x + dx
  const y = piece.y + dy
  return { ...piece, x, y }
}

export function rotatePiece(
  piece: Threetris.Piece,
  delta: number,
): Threetris.Piece {
  const rotation = (piece.rotation + delta + 4) % 4
  return { ...piece, rotation }
}

export function addPieceToMatrix(
  piece: Threetris.Piece,
  matrix: Threetris.Matrix,
) {
  const blocks = getPieceBlocks(piece)

  return {
    ...matrix,
    blocks: matrix.blocks.concat(blocks),
  }
}
