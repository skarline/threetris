import { useGameGhostPiece, useGameStore } from "@/stores/game"
import { useEngine } from "@/hooks/useEngine"

import { Matrix } from "./Matrix"
import { Piece } from "./Piece"
import { Ruleset } from "@/constants/ruleset"

const blockSize = 20

const useBoardSize = () =>
  useGameStore((state) => ({
    width: state.matrix.width * blockSize,
    height: state.matrix.height * blockSize,
  }))

function BoardMatrix() {
  const { width, height, blocks } = useGameStore((state) => state.matrix)

  const boardSize = useBoardSize()

  return (
    <>
      <mesh
        position={[
          boardSize.width / 2 - blockSize / 2,
          boardSize.height / 2 - blockSize / 2,
          0,
        ]}
      >
        <planeGeometry args={[boardSize.width, boardSize.height, 1]} />
        <meshStandardMaterial color="#202020" />
      </mesh>
      <Matrix
        position={[0, 0, 0]}
        width={width}
        height={height}
        blocks={blocks}
      />
    </>
  )
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

function BoardGhostPiece() {
  const ghostPiece = useGameGhostPiece()
  if (!ghostPiece) return null

  const xPosition = ghostPiece.x * blockSize
  const yPosition = ghostPiece.y * blockSize

  return (
    <Piece
      position={[xPosition, yPosition, 0]}
      tetrimino={ghostPiece.tetrimino}
      rotation={ghostPiece.rotation}
      opacity={0.5}
    />
  )
}

function HoldQueue() {
  const holdTetrimino = useGameStore((state) => state.holdQueue)
  const canHold = useGameStore((state) => state.canHold)
  const boardSize = useBoardSize()

  if (!holdTetrimino) return null

  return (
    <Piece
      position={[-boardSize.width / 2, boardSize.height - blockSize * 4, 1]}
      tetrimino={holdTetrimino}
      rotation={0}
      opacity={canHold ? 1 : 0.5}
    />
  )
}

function NextQueue() {
  const nextTetriminos = useGameStore((state) => state.nextQueue)
  const matrix = useGameStore((state) => state.matrix)

  return (
    <>
      {nextTetriminos
        .slice(0, Ruleset.NextQueueSize)
        .map((tetrimino, index) => (
          <Piece
            key={index}
            position={[
              (matrix.width * blockSize) / 2 + blockSize * 6,
              (matrix.height - index * tetrimino.height - 4) * blockSize,
              1,
            ]}
            tetrimino={tetrimino}
            rotation={0}
          />
        ))}
    </>
  )
}

export function Board() {
  useEngine()

  const boardSize = useBoardSize()

  return (
    <group
      position={[
        -boardSize.width / 2 + blockSize / 2,
        -boardSize.height / 2 + blockSize / 2,
        1,
      ]}
    >
      <BoardMatrix />
      <BoardGhostPiece />
      <BoardPiece />
      <HoldQueue />
      <NextQueue />
    </group>
  )
}
