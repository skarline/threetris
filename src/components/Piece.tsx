import { Matrix, MatrixProps } from "./Matrix"

export type PieceRotation = 0 | 1 | 2 | 3

export interface PieceProps
  extends Omit<MatrixProps, "width" | "height" | "blocks" | "rotation"> {
  tetrimino: Threetris.Tetrimino
  rotation?: PieceRotation
}

export function Piece({ tetrimino, rotation = 0, ...rest }: PieceProps) {
  const { width, height, facings } = tetrimino
  const { blocks } = facings[rotation]

  return <Matrix {...rest} width={width} height={height} blocks={blocks} />
}
