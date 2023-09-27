import { Sprite, SpriteProps } from "./Sprite"
import BlocksSprite from "@/assets/sprites/blocks.png"

export interface BlockProps
  extends Omit<SpriteProps, "url" | "type" | "size" | "color"> {
  size: number
  type: number
}

export function Block({ type, size, ...rest }: BlockProps) {
  return (
    <Sprite
      {...rest}
      url={BlocksSprite}
      repeatX={1 / 8}
      offsetX={(type - 1) / 8}
      size={[size, size]}
    />
  )
}
