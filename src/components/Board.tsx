import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"

import { Matrix } from "./Matrix"
import { Piece } from "./Piece"
import { useActionPress, useActionRelease } from "../hooks/input"
import { getGameState, useGameStore } from "../stores/game"

const blockSize = 20

function BoardMatrix() {
  const { size, blocks } = useGameStore((state) => state.matrix)

  return <Matrix position={[0, 0, 0]} size={size} blocks={blocks} />
}

function BoardPiece() {
  const piece = useGameStore((state) => state.piece)

  if (!piece) return null

  const xPosition = piece.x * blockSize
  const yPosition = piece.y * blockSize

  return (
    <Piece
      position={[xPosition, yPosition, 1]}
      tetrimino={piece.tetrimino}
      rotation={piece.rotation}
    />
  )
}

function useMove() {
  useActionPress("MoveLeft", () => getGameState().move(-1, 0), true)
  useActionPress("MoveRight", () => getGameState().move(1, 0), true)
}

function useRotate() {
  useActionPress("RotateCW", () => getGameState().rotate(true))
  useActionPress("RotateCCW", () => getGameState().rotate(false))
}

function useFall() {
  const fallingTime = useRef(1)

  useActionPress(
    "SoftDrop",
    () => {
      fallingTime.current = 1
      getGameState().move(0, -1)
    },
    true,
  )

  useActionPress("HardDrop", () => {
    const { testPieceMove, move, lock } = getGameState()

    let delta = 0
    while (testPieceMove(0, delta - 1)) delta--

    move(0, delta)
    lock()
  })

  useFrame((_, delta) => {
    const { move, testPieceMove } = getGameState()

    const canFall = testPieceMove(0, -1)

    if (canFall) {
      if ((fallingTime.current -= delta) <= 0) {
        fallingTime.current += 1
        move(0, -1)
      }
    } else {
      fallingTime.current = 1
    }
  })
}

function useLock() {
  const lockDownTime = useRef(0.5)

  useFrame((_, delta) => {
    const { lock, testPieceMove } = getGameState()

    const canFall = testPieceMove(0, -1)

    if (canFall) {
      lockDownTime.current = 0.5
    } else {
      if ((lockDownTime.current -= delta) <= 0) {
        lockDownTime.current += 0.5
        lock()
      }
    }
  })
}

export function Board() {
  useMove()
  useRotate()
  useFall()
  useLock()

  useEffect(() => {
    getGameState().reset()
  }, [])

  return (
    <group>
      <BoardMatrix />
      <BoardPiece />
    </group>
  )
}
