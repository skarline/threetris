import { GroupProps } from "@react-three/fiber"

import { Block } from "./Block"

const BLOCK_SIZE = 20

export interface MatrixProps extends Threetris.Matrix, GroupProps {}

export function Matrix({ blocks, ...rest }: MatrixProps) {
  return (
    <group {...rest}>
      {blocks.map(({ x, y, type }, index) => {
        if (!type) return null

        const xPosition = x * BLOCK_SIZE
        const yPosition = y * BLOCK_SIZE

        return (
          <Block
            key={index}
            type={type}
            size={BLOCK_SIZE}
            position={[xPosition, yPosition, 0]}
          />
        )
      })}
    </group>
  )
}
