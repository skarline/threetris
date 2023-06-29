import { Canvas } from "@react-three/fiber"

import { Board } from "./components/Board"

function App() {
  return (
    <Canvas orthographic>
      <ambientLight />
      <Board />
    </Canvas>
  )
}

export default App
