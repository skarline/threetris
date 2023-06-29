import { Matrix, MatrixProps } from "./Matrix"

export type PieceRotation = 0 | 1 | 2 | 3

export interface PieceProps
  extends Omit<MatrixProps, "size" | "data" | "rotation"> {
  tetrimino: Tetrimino
  rotation?: PieceRotation
}

export function Piece({ tetrimino, rotation = 0, ...rest }: PieceProps) {
  const { size, facings } = tetrimino
  const data = facings[rotation]

  return <Matrix size={size} data={data} {...rest} />
}
