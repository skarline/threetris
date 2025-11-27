import { Board } from "./components/Board"
import { useInput } from "./hooks/input"
import { useEngine } from "@/hooks/useEngine"
import { AnimatedBackground } from "./components/AnimatedBackground"
import { useGameStore } from "./stores/game"

function Game() {
  useEngine()
  useInput()

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatedBackground />
      <Board />
    </div>
  )
}

export default Game
