import { useState } from "react"
import { Vector3, GroupProps, useFrame } from "@react-three/fiber"

import { Block } from "./Block"

const columns = 10
const rows = 20
const blockSize = 20

function blockToPosition(index: number): [number, number] {
  const x = (index % columns) * blockSize
  const y = Math.floor(index / columns) * blockSize

  return [x, y]
}

const matrixGroupPosition: Vector3 = [
  -0.5 * blockSize * columns,
  -0.5 * blockSize * rows,
  0,
]

export interface MatrixProps extends GroupProps {}

export function Matrix({ ...rest }: MatrixProps) {
  const [data, setData] = useState<number[]>([])

  useFrame(() => {
    setData(new Array(200).fill(null).map((_) => Math.floor(Math.random() * 9)))
  })

  return (
    <group {...rest} position={matrixGroupPosition}>
      {data.map((type, index) => {
        if (!type) return null

        const [x, y] = blockToPosition(index)

        return (
          <Block
            key={index}
            type={type}
            size={blockSize}
            position={[x, y, 0]}
          />
        )
      })}
    </group>
  )
}
