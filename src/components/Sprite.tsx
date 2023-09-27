import { type MeshProps, useLoader } from "@react-three/fiber"
import { NearestFilter, TextureLoader } from "three"

export interface SpriteProps extends MeshProps {
  size: [number, number]
  url: string
  repeatX?: number
  repeatY?: number
  offsetX?: number
  offsetY?: number
  opacity?: number
}

export function Sprite({
  size,
  url,
  repeatX = 1,
  repeatY = 1,
  offsetX = 0,
  offsetY = 0,
  opacity = 1,
  ...rest
}: SpriteProps) {
  const baseTexture = useLoader(TextureLoader, url)

  const texture = baseTexture.clone()

  texture.magFilter = NearestFilter
  texture.minFilter = NearestFilter

  texture.repeat.set(repeatX, repeatY)
  texture.offset.set(offsetX, offsetY)

  return (
    <mesh {...rest}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        map={texture}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  )
}
