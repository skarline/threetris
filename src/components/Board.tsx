import { useState } from "react"

import { Matrix } from "./Matrix"
import { Piece, PieceRotation } from "./Piece"
import { Tetriminos } from "../constants/tetriminos"

export function Board() {
  const [tetrimino] = useState<Tetrimino | null>(Tetriminos.S)
  const [rotation] = useState<PieceRotation>(0)

  return (
    <group>
      <Matrix size={[10, 20]} data={[1]} />
      {tetrimino && <Piece tetrimino={tetrimino} rotation={rotation} />}
    </group>
  )
}
