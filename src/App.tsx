import { Canvas } from "@react-three/fiber"

import { Board } from "./components/Board"
import { useInput } from "./hooks/input"

function App() {
  useInput()

  return (
    <Canvas orthographic>
      <ambientLight />
      <Board />
    </Canvas>
  )
}

export default App
