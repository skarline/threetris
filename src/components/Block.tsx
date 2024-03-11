export interface BlockProps {
  type: number
}

const COLORS = [
  "transparent", // empty
  "yellow", // O
  "cyan", // I
  "purple", // T
  "orange", // L
  "blue", // J
  "green", // S
  "red", // Z
]

export function Block({ type }: BlockProps) {
  return (
    <div
      css={{
        backgroundColor: COLORS[type],
        width: "100%",
        height: "100%",
      }}
    />
  )
}
