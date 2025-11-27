import { useGameStore } from "@/stores/game"
import { Piece } from "./Piece"

export function HoldQueue() {
  const holdTetrimino = useGameStore((state) => state.holdQueue)
  const canHold = useGameStore((state) => state.canHold)

  if (!holdTetrimino) return null

  return (
    <div
      style={{
        opacity: canHold ? 1 : 0.5,
      }}
    >
      <Piece tetrimino={holdTetrimino} rotation={0} />
    </div>
  )
}
