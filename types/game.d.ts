type MatrixData = number[]

declare interface Tetrimino {
  size: [number, number]
  facings: [MatrixData, MatrixData, MatrixData, MatrixData]
}
