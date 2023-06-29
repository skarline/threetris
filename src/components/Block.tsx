import { Sprite, SpriteProps } from "./Sprite"

export interface BlockProps
  extends Omit<SpriteProps, "type" | "size" | "color"> {
  size: number
  type: number
}

const colors = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#FFFFFF",
]

export function Block({ type, size, ...rest }: BlockProps) {
  return <Sprite {...rest} color={colors[type]} size={[size, size]} />
}
