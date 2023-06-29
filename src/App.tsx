import { Canvas } from "@react-three/fiber"

import { Matrix } from "./components/Matrix"

function App() {
  return (
    <Canvas orthographic>
      <ambientLight />
      <Matrix position={[-100, 0, 0]} />
    </Canvas>
  )
}

export default App
