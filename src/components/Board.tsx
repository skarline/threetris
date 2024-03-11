import { UI } from "@/constants/ui"
import { useGameGhostPiece, useGameStore } from "@/stores/game"

import { HoldQueue } from "./HoldQueue"
import { Matrix } from "./Matrix"
import { NextQueue } from "./NextQueue"
import { Piece } from "./Piece"
import { PropsWithChildren } from "react"

function BoardMatrix() {
  const { width, height, blocks } = useGameStore((state) => state.matrix)

  return (
    <Matrix
      className="absolute"
      width={width}
      height={height}
      blocks={blocks}
    />
  )
}

function BoardPiece() {
  const piece = useGameStore((state) => state.piece)
  if (!piece) return null

  return (
    <div
      css={{
        position: "absolute",
        left: piece.x * UI.BlockSize,
        bottom: piece.y * UI.BlockSize,
      }}
    >
      <Piece tetrimino={piece.tetrimino} rotation={piece.rotation} />
    </div>
  )
}

export function BoardGhostPiece() {
  const ghostPiece = useGameGhostPiece()
  if (!ghostPiece) return null

  return (
    <div
      css={{
        position: "absolute",
        left: ghostPiece.x * UI.BlockSize,
        bottom: ghostPiece.y * UI.BlockSize,
        opacity: 0.5,
      }}
    >
      <Piece tetrimino={ghostPiece.tetrimino} rotation={ghostPiece.rotation} />
    </div>
  )
}

function BoardStatContainer({
  label,
  children,
}: PropsWithChildren<{ label: string }>) {
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        gap: "8px",
        height: "min-content",
        width: "100px",
      }}
    >
      <span>{label}</span>
      {children}
    </div>
  )
}

export function Board() {
  const { width, height } = useGameStore((state) => state.matrix)

  return (
    <div
      css={{
        display: "flex",
        gap: "24px",
      }}
    >
      <BoardStatContainer label="Hold">
        <HoldQueue />
      </BoardStatContainer>
      <div
        css={{
          position: "relative",
          width: width * UI.BlockSize,
          height: height * UI.BlockSize,
        }}
      >
        <BoardMatrix />
        <BoardPiece />
        <BoardGhostPiece />
      </div>
      <BoardStatContainer label="Next">
        <NextQueue />
      </BoardStatContainer>
    </div>
  )
}
