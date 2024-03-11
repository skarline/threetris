import { Matrix } from "./Matrix"

export interface PieceProps {
  tetrimino: Threetris.Tetrimino
  rotation?: number
}

export function Piece({ tetrimino, rotation = 0 }: PieceProps) {
  const { width, height, facings } = tetrimino
  const { blocks } = facings[rotation]

  return <Matrix width={width} height={height} blocks={blocks} />
}
