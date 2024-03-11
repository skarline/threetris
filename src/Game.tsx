import { Board } from "./components/Board"
import { useInput } from "./hooks/input"
import { useEngine } from "@/hooks/useEngine"

function Game() {
  useEngine()
  useInput()

  return (
    <div
      css={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Board />
    </div>
  )
}

export default Game
