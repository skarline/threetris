type MatrixData = number[]

declare interface Tetrimino {
  size: [number, number]
  facings: [MatrixData, MatrixData, MatrixData, MatrixData]
}

declare type InputAction = "moveleft" | "moveright" | "rotatecw" | "rotateccw"
