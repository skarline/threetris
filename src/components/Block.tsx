import { Sprite, SpriteProps } from "./Sprite"

export interface BlockProps
  extends Omit<SpriteProps, "type" | "size" | "color"> {
  size: number
  type: number
}

const colors = [
  "#000000",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#FFA500",
  "#0000FF",
  "#00FF00",
  "#FF0000",
]

export function Block({ type, size, ...rest }: BlockProps) {
  return <Sprite {...rest} color={colors[type]} size={[size, size]} />
}
