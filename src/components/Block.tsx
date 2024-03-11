export interface BlockProps {
  type: number
}

const ColorMap = [
  "#000000", // empty
  "#ffcb11", // O
  "#11c6ff", // I
  "#8d58ff", // T
  "#ff4b11", // L
  "#3970ff", // J
  "#2edf35", // S
  "#f32670", // Z
]

export function Block({ type }: BlockProps) {
  return (
    <div
      css={{
        backgroundColor: ColorMap[type],
        width: "100%",
        height: "100%",
      }}
    />
  )
}
