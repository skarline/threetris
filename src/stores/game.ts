import { create } from "zustand"

import { TetriminosArray } from "../constants/tetriminos"
import { randomNumberGenerator } from "../utils/random"

interface GameState {
  piece: Threetris.Piece | null
  bag: Threetris.Tetrimino[]
  matrix: Threetris.Matrix
}

interface GameActions {
  reset: () => void
  move: (deltaX: number, deltaY: number) => boolean
  rotate: (clockwise: boolean) => void
  lock: () => void
  nextPiece: () => void
  testPieceMove: (deltaX: number, deltaY: number) => boolean
}

const rng = randomNumberGenerator(Date.now())

const initialState: Readonly<GameState> = {
  piece: null,
  bag: [],
  matrix: {
    size: [10, 20],
    blocks: [],
  },
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

function createBag() {
  return [...TetriminosArray].sort(() => rng.next().value - 0.5)
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,
  reset: () => {
    const state = initialState

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
  move: (deltaX: number, deltaY: number): boolean => {
    const { piece, matrix } = get()
    if (!piece) return false

    const testPiece = { ...piece, x: piece.x + deltaX, y: piece.y + deltaY }

    const collision = checkCollision(testPiece, matrix)

    if (!collision) {
      set({ piece: testPiece })
    }

    return collision
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
  lock: () => {
    const { piece, matrix, bag, nextPiece } = get()
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

    const newBag = bag.length === 0 ? createBag() : bag

    set({
      matrix: newMatrix,
      bag: newBag,
    })

    nextPiece()
  },
  nextPiece: () => {
    const state = get()

    const bag = state.bag.length === 0 ? createBag() : state.bag

    const piece: Threetris.Piece = {
      tetrimino: bag.shift()!,
      rotation: 0,
      x: Math.floor(state.matrix.size[0] / 2),
      y: 20,
    }

    set({ piece, bag })
  },
  testPieceMove: (deltaX: number, deltaY: number): boolean => {
    const { piece, matrix } = get()
    if (!piece) return false

    const testPiece = { ...piece, x: piece.x + deltaX, y: piece.y + deltaY }

    return !checkCollision(testPiece, matrix)
  },
}))

export const getGameState = () => useGameStore.getState()
