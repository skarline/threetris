import { create } from "zustand"

import { TetriminosArray } from "../constants/tetriminos"
import { randomNumberGenerator } from "../utils/random"
import { initial } from "lodash"

interface GameState {
  piece: Threetris.Piece | null
  bag: Threetris.Tetrimino[]
  matrix: Threetris.Matrix
}

interface GameStore extends GameState {
  reset: () => void
  move: (deltaX: number, deltaY: number) => void
  rotate: (clockwise: boolean) => void
}

const rng = randomNumberGenerator(Date.now())

const defaultState: Readonly<GameState> = {
  piece: null,
  bag: [],
  matrix: {
    size: [10, 20],
    blocks: [],
  },
}

function checkCollision(
  piece: Threetris.Piece,
  matrix: Threetris.Matrix
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

function createBag() {
  return [...TetriminosArray].sort(() => rng.next().value - 0.5)
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...defaultState,
  reset: () => {
    const state = defaultState

    const bag = createBag()

    set({
      ...state,
      piece: {
        tetrimino: bag.shift()!,
        rotation: 0,
        x: Math.floor(state.matrix.size[0] / 2),
        y: 20,
      },
      bag,
    })
  },
  move: (deltaX: number, deltaY: number) => {
    const { piece, matrix } = get()
    if (!piece) return

    const testPiece = { ...piece, x: piece.x + deltaX, y: piece.y + deltaY }

    if (!checkCollision(testPiece, matrix)) {
      set({ piece: testPiece })
    }
  },
  rotate: (clockwise: boolean) => {
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
}))
