import { create } from "zustand"

import { TetriminosArray } from "../constants/tetriminos"
import { randomNumberGenerator } from "../utils/random"

interface GameState {
  piece: Threetris.Piece | null
  bag: Threetris.Tetrimino[]
  matrix: Threetris.Matrix
  isAnimating: boolean
}

interface GameActions {
  reset: () => void
  movePiece: (deltaX: number, deltaY: number) => boolean
  testPieceMove: (deltaX: number, deltaY: number) => boolean
  rotatePiece: (clockwise: boolean) => void
  lockPiece: () => void
  generatePiece: () => void
  clearFullLines: () => void
}

const rng = randomNumberGenerator(Date.now())

function getInitialState(): GameState {
  const bag = shuffleTetriminos()

  return {
    piece: {
      tetrimino: bag.shift()!,
      rotation: 0,
      x: Math.floor(10 / 2),
      y: 20,
    },
    bag,
    matrix: {
      size: [10, 20],
      blocks: [],
    },
    isAnimating: false,
  }
}

function checkCollision(
  piece: Threetris.Piece,
  matrix: Threetris.Matrix,
): boolean {
  const facing = piece.tetrimino.facings[piece.rotation]

  return facing.blocks.some((block) => {
    const x = piece.x + block.x
    const y = piece.y + block.y

    // check if block is out of bounds
    if (y < 0) return true
    if (x < 0) return true
    if (x >= matrix.size[0]) return true

    // check if block is colliding with another block
    return matrix.blocks.some((block) => block.x === x && block.y === y)
  })
}

function shuffleTetriminos() {
  return [...TetriminosArray].sort(() => rng.next().value - 0.5)
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...getInitialState(),
  reset: () => {},
  movePiece: (deltaX: number, deltaY: number): boolean => {
    const { piece, matrix } = get()
    if (!piece) return false

    const testPiece = { ...piece, x: piece.x + deltaX, y: piece.y + deltaY }

    const collision = checkCollision(testPiece, matrix)

    if (!collision) {
      set({ piece: testPiece })
    }

    return collision
  },
  rotatePiece: (clockwise: boolean) => {
    const { piece, matrix } = get()
    if (!piece) return

    let rotation = piece.rotation

    if (clockwise) {
      rotation = rotation === 3 ? 0 : rotation + 1
    } else {
      rotation = rotation === 0 ? 3 : rotation - 1
    }

    const testPiece = { ...piece, rotation }

    if (!checkCollision(testPiece, matrix)) {
      set({ piece: testPiece })
    }
  },
  lockPiece: () => {
    const { piece, matrix, clearFullLines } = get()
    if (!piece) return

    const facing = piece.tetrimino.facings[piece.rotation]

    const newBlocks = facing.blocks.map((block) => ({
      x: piece.x + block.x,
      y: piece.y + block.y,
      type: block.type,
    }))

    const newMatrix = {
      ...matrix,
      blocks: matrix.blocks.concat(newBlocks),
    }

    set({
      piece: null,
      matrix: newMatrix,
      isAnimating: true,
    })

    setTimeout(() => {
      set({ isAnimating: false })
      clearFullLines()
    }, 200)
  },
  generatePiece: () => {
    const { matrix, piece, bag } = get()
    if (piece) return

    const newBag = [...bag]
    if (newBag.length < TetriminosArray.length) {
      newBag.push(...shuffleTetriminos())
    }

    const newPiece: Threetris.Piece = {
      tetrimino: newBag.shift()!,
      rotation: 0,
      x: Math.floor(matrix.size[0] / 2),
      y: 20,
    }

    set({ piece: newPiece, bag: newBag })
  },
  clearFullLines: () => {
    const { matrix } = get()

    const blocksPerLine = matrix.blocks.reduce<number[]>((acc, block) => {
      acc[block.y] ??= 0
      acc[block.y]++

      return acc
    }, [])

    const fullLines = blocksPerLine.reduce<number[]>((acc, count, y) => {
      if (count === matrix.size[0]) {
        acc.push(y)
      }

      return acc
    }, [])

    if (fullLines.length > 0) {
      const newBlocks = matrix.blocks
        .filter((block) => !fullLines.includes(block.y))
        .map((block) => ({
          ...block,
          y: block.y - fullLines.filter((line) => line < block.y).length,
        }))

      const newMatrix = {
        ...matrix,
        blocks: newBlocks,
      }

      set({ matrix: newMatrix })
    }
  },
  testPieceMove: (deltaX: number, deltaY: number): boolean => {
    const { piece, matrix } = get()
    if (!piece) return false

    const testPiece = { ...piece, x: piece.x + deltaX, y: piece.y + deltaY }

    return !checkCollision(testPiece, matrix)
  },
}))

export const getGameState = () => useGameStore.getState()
