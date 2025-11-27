import { useGameStore } from "@/stores/game"
import { Piece } from "./Piece"
import { Ruleset } from "@/constants/ruleset"
import { UI } from "@/constants/ui"

export function NextQueue() {
  const nextTetriminos = useGameStore((state) => state.nextQueue)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: `${UI.BlockSize * 4}px`,
        height: "100%",
      }}
    >
      {nextTetriminos
        .slice(0, Ruleset.NextQueueSize)
        .map((tetrimino, index) => (
          <Piece key={index} tetrimino={tetrimino} rotation={0} />
        ))}
    </div>
  )
}
