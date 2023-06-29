import { useMemo, useState } from "react"
import { Vector3, GroupProps, useFrame } from "@react-three/fiber"

import { Block } from "./Block"

const BLOCK_SIZE = 20

function blockToPosition(index: number, columns: number): [number, number] {
  const x = (index % columns) * BLOCK_SIZE
  const y = Math.floor(index / columns) * BLOCK_SIZE

  return [x, y]
}

export interface MatrixProps extends GroupProps {
  size: [number, number]
  data: number[]
}

export function Matrix({ size: [columns], data, ...rest }: MatrixProps) {
  return (
    <group {...rest}>
      {data.map((type, index) => {
        if (!type) return null

        const [x, y] = blockToPosition(index, columns)

        return (
          <Block
            key={index}
            type={type}
            size={BLOCK_SIZE}
            position={[x, y, 0]}
          />
        )
      })}
    </group>
  )
}
