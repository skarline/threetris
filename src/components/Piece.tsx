import { Matrix, MatrixProps } from "./Matrix"

export interface PieceProps
  extends Omit<MatrixProps, "width" | "height" | "blocks" | "rotation"> {
  tetrimino: Threetris.Tetrimino
  rotation?: number
}

export function Piece({ tetrimino, rotation = 0, ...rest }: PieceProps) {
  const { width, height, facings } = tetrimino
  const { blocks } = facings[rotation]

  return <Matrix {...rest} width={width} height={height} blocks={blocks} />
}
