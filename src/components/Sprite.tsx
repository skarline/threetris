import type { MeshProps } from "@react-three/fiber"

export interface SpriteProps extends MeshProps {
  size: [number, number]
  color: string
}

export function Sprite({ size, color, ...rest }: SpriteProps) {
  return (
    <mesh {...rest}>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
