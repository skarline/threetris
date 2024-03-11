import { Ruleset } from "@/constants/ruleset"
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { getLandedPiece } from "@/utils/engine"

interface GameState {
  matrix: Threetris.Matrix
  piece: Threetris.Piece | null
  nextQueue: Threetris.Tetrimino[]
  holdQueue: Threetris.Tetrimino | null
  canHold: boolean
  hitList: Threetris.Block[]
  fallingTime: number
  lockDownTime: number
  elapsedTime: number
  completedLines: number
  score: number
}

interface GameActions {
  setMatrix: (matrix: Threetris.Matrix) => void
  setPiece: (piece: Threetris.Piece | null) => void
  setNextQueue: (nextQueue: Threetris.Tetrimino[]) => void
  setHoldQueue: (holdQueue: Threetris.Tetrimino) => void
  setCanHold: (canHold: boolean) => void
  setHitList: (hitList: Threetris.Block[]) => void
  setFallingTime: (fallingTime: number) => void
  setLockDownTime: (lockDownTime: number) => void
  setElapsedTime: (elapsedTime: number) => void
  setCompletedLines: (completedLines: number) => void
  setScore: (score: number) => void
}

const initialState: GameState = {
  matrix: { width: 10, height: 20, blocks: [] },
  piece: null,
  nextQueue: [],
  holdQueue: null,
  canHold: true,
  hitList: [],
  fallingTime: Ruleset.FallingDelay,
  lockDownTime: Ruleset.LockDownDelay,
  elapsedTime: 0,
  completedLines: 0,
  score: 0,
}

export const useGameStore = create<GameState & GameActions>()(
  devtools((set) => ({
    ...initialState,
    setMatrix: (matrix) => set({ matrix }),
    setPiece: (piece) => set({ piece }),
    setNextQueue: (nextQueue) => set({ nextQueue }),
    setHoldQueue: (holdQueue) => set({ holdQueue }),
    setCanHold: (canHold) => set({ canHold }),
    setHitList: (hitList) => set({ hitList }),
    setFallingTime: (fallingTime) => set({ fallingTime }),
    setLockDownTime: (lockDownTime) => set({ lockDownTime }),
    setElapsedTime: (elapsedTime) => set({ elapsedTime }),
    setCompletedLines: (completedLines) => set({ completedLines }),
    setScore: (score) => set({ score }),
  })),
)

export function useGameGhostPiece() {
  const piece = useGameStore((state) => state.piece)
  const matrix = useGameStore((state) => state.matrix)

  if (!piece) return null
  return getLandedPiece(piece, matrix)
}

export const getGameState = () => useGameStore.getState()
export const resetGameState = () => useGameStore.setState(initialState)
