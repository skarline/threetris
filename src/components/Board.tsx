import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"

import { Matrix } from "./Matrix"
import { Piece } from "./Piece"
import { useActionPress } from "../hooks/input"
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

function useGeneration() {
  useFrame(() => {
    const { piece, isAnimating, generatePiece } = getGameState()

    if (!piece && !isAnimating) {
      generatePiece()
    }
  })
}

function useControls() {
  useActionPress("MoveLeft", () => getGameState().movePiece(-1, 0), true)
  useActionPress("MoveRight", () => getGameState().movePiece(1, 0), true)
  useActionPress("RotateCW", () => getGameState().rotatePiece(true))
  useActionPress("RotateCCW", () => getGameState().rotatePiece(false))
}

function useFall() {
  const fallingTime = useRef(1)

  useActionPress(
    "SoftDrop",
    () => {
      fallingTime.current = 1
      getGameState().movePiece(0, -1)
    },
    true,
  )

  useActionPress("HardDrop", () => {
    const { testPieceMove, movePiece, lockPiece } = getGameState()

    let delta = 0
    while (testPieceMove(0, delta - 1)) delta--

    movePiece(0, delta)
    lockPiece()
  })

  useFrame((_, delta) => {
    const { movePiece, testPieceMove } = getGameState()

    const canFall = testPieceMove(0, -1)

    if (canFall) {
      if ((fallingTime.current -= delta) <= 0) {
        fallingTime.current += 1
        movePiece(0, -1)
      }
    } else {
      fallingTime.current = 1
    }
  })
}

function useLock() {
  const lockDownTime = useRef(0.5)

  useFrame((_, delta) => {
    const { lockPiece, testPieceMove } = getGameState()

    const canFall = testPieceMove(0, -1)

    if (canFall) {
      lockDownTime.current = 0.5
    } else {
      if ((lockDownTime.current -= delta) <= 0) {
        lockDownTime.current += 0.5
        lockPiece()
      }
    }
  })
}

export function Board() {
  useFall()
  useLock()
  useGeneration()
  useControls()

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
