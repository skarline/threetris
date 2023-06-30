import { GroupProps } from "@react-three/fiber"

import { Block } from "./Block"

const BLOCK_SIZE = 20

export interface MatrixProps extends Threetris.Matrix, GroupProps {}

export function Matrix({ size: [columns], blocks, ...rest }: MatrixProps) {
  return (
    <group {...rest}>
      {blocks.map(({ x, y, type }, index) => {
        if (!type) return null

        const xPosition = (x - columns / 2 + 0.5) * BLOCK_SIZE
        const yPosition = (y - 10 / 2 + 0.5) * BLOCK_SIZE

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
