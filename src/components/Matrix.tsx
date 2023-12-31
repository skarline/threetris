import { GroupProps } from "@react-three/fiber"

import { Block } from "./Block"

const blockSize = 20

export interface MatrixProps extends Threetris.Matrix, GroupProps {
  opacity?: number
}

export function Matrix({ blocks, opacity = 1, ...rest }: MatrixProps) {
  return (
    <group {...rest}>
      {blocks.map(({ x, y, type }, index) => {
        if (!type) return null

        const xPosition = x * blockSize
        const yPosition = y * blockSize

        return (
          <Block
            key={index}
            type={type}
            size={blockSize}
            position={[xPosition, yPosition, 0]}
            opacity={opacity}
          />
        )
      })}
    </group>
  )
}
