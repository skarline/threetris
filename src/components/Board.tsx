import { useCallback, useState } from "react"

import { Matrix } from "./Matrix"
import { Piece, PieceRotation } from "./Piece"
import { Tetriminos } from "../constants/tetriminos"
import { useActionPress } from "../hooks/input"

const blockSize = 20

function usePosition(initialValue: [number, number] = [0, 0]) {
  const [position, setPosition] = useState<[number, number]>(initialValue)

  const moveLeft = useCallback(() => {
    setPosition(([x, y]) => [x - 1, y])
  }, [])

  const moveRight = useCallback(() => {
    setPosition(([x, y]) => [x + 1, y])
  }, [])

  return {
    position,
    moveLeft,
    moveRight,
  }
}

function useRotation(initialValue: PieceRotation = 0) {
  const [rotation, setRotation] = useState<PieceRotation>(initialValue)

  const rotateClockwise = useCallback(() => {
    setRotation((rotation) =>
      rotation === 3 ? 0 : ((rotation + 1) as PieceRotation)
    )
  }, [])

  const rotateCounterClockwise = useCallback(() => {
    setRotation((rotation) =>
      rotation === 0 ? 3 : ((rotation - 1) as PieceRotation)
    )
  }, [])

  return {
    rotation,
    rotateClockwise,
    rotateCounterClockwise,
  }
}

export function Board() {
  const [tetrimino] = useState<Threetris.Tetrimino | null>(Tetriminos.L)
  const { position, moveLeft, moveRight } = usePosition()
  const { rotation, rotateClockwise, rotateCounterClockwise } = useRotation(0)

  useActionPress("moveleft", moveLeft)
  useActionPress("moveright", moveRight)
  useActionPress("rotatecw", rotateClockwise)
  useActionPress("rotateccw", rotateCounterClockwise)

  const [x, y] = position.map((n) => n * blockSize)

  return (
    <group>
      <Matrix size={[10, 20]} blocks={[]} />
      {tetrimino && (
        <Piece tetrimino={tetrimino} rotation={rotation} position={[x, y, 0]} />
      )}
    </group>
  )
}
