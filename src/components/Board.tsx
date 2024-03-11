import { PropsWithChildren } from "react"

import { UI } from "@/constants/ui"
import { useGameGhostPiece, useGameStore } from "@/stores/game"

import { HoldQueue } from "./HoldQueue"
import { Matrix } from "./Matrix"
import { NextQueue } from "./NextQueue"
import { Piece } from "./Piece"

function Stack({ children }: PropsWithChildren) {
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {children}
    </div>
  )
}

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
      key={String(piece.tetrimino.facings[0])}
      css={{
        position: "absolute",
        left: piece.x * UI.BlockSize,
        bottom: piece.y * UI.BlockSize,
        zIndex: piece.y > 0 ? 1 : 0,
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

function BoardElapsedTime() {
  const elapsedTime = useGameStore((state) => state.elapsedTime)

  const formattedSeconds = String(Math.floor(elapsedTime % 60)).padStart(2, "0")
  const formattedMinutes = String(Math.floor(elapsedTime / 60)).padStart(2, "0")

  return (
    <span>
      {formattedMinutes}:{formattedSeconds}
    </span>
  )
}

function BoardScore() {
  const score = useGameStore((state) => state.score)

  return <span>{score}</span>
}

function BoardCompletedLines() {
  const completedLines = useGameStore((state) => state.completedLines)

  return <span>{completedLines}</span>
}

function BoardStatContainer({
  label,
  children,
  align = "start",
  compact = false,
}: PropsWithChildren<{
  label: string
  align?: "start" | "end"
  compact?: boolean
}>) {
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: align,
        fontSize: "1.25rem",
        fontWeight: "lighter",
        gap: compact ? 0 : "1rem",
      }}
    >
      <span
        css={{
          fontSize: "1rem",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  )
}

export function Board() {
  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "5em auto 5rem",
        gridTemplateRows: "1fr",
        gap: "1rem",
      }}
    >
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "1fr",
        }}
      >
        <BoardStatContainer label="Hold" align="end">
          <HoldQueue />
        </BoardStatContainer>
        <BoardStatContainer compact label="Time" align="end">
          <BoardElapsedTime />
        </BoardStatContainer>
      </div>
      <div
        css={{
          backgroundColor: "black",
          position: "relative",
          "&::after": {
            position: "absolute",
            content: "''",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            outline: "0.125em solid white",
            borderRadius: "0.25rem",
          },
        }}
      >
        <div css={{ position: "relative" }}>
          <BoardMatrix />
          <BoardPiece />
          <BoardGhostPiece />
        </div>
      </div>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <BoardStatContainer label="Next">
          <NextQueue />
        </BoardStatContainer>
        <Stack>
          <BoardStatContainer compact label="Lines">
            <BoardCompletedLines />
          </BoardStatContainer>
          <BoardStatContainer compact label="Score">
            <BoardScore />
          </BoardStatContainer>
        </Stack>
      </div>
    </div>
  )
}
