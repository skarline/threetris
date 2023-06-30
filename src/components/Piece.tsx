import { Matrix, MatrixProps } from "./Matrix"

export type PieceRotation = 0 | 1 | 2 | 3

export interface PieceProps
  extends Omit<MatrixProps, "size" | "blocks" | "rotation"> {
  tetrimino: Threetris.Tetrimino
  rotation?: PieceRotation
}

export function Piece({ tetrimino, rotation = 0, ...rest }: PieceProps) {
  const { size, facings } = tetrimino
  const { blocks } = facings[rotation]

  return <Matrix {...rest} size={size} blocks={blocks} />
}
