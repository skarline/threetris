import { useFrame } from "@/hooks/useFrame"
import { useRef } from "react"

import { getGameState } from "@/stores/game"
import { useActionPress } from "@/hooks/input"
import {
  addPieceToMatrix,
  checkCollision,
  getLandedPiece,
  getShuffledTetriminos,
  movePiece,
  rotatePiece,
} from "@/utils/engine"
import { Ruleset } from "@/constants/ruleset"
import { Tetriminos } from "@/constants/tetriminos"
import { IWallKickOffsets, JLSTZWallKickOffsets } from "@/constants/rotation"

const moveRepeatDelay = 0.3
const moveRepeatInterval = 0.05

function spawnPiece(tetrimino: Threetris.Tetrimino) {
  const { matrix, setPiece } = getGameState()

  const piece = {
    x: Math.floor((matrix.width - tetrimino.width) / 2),
    y: matrix.height - 1,
    tetrimino,
    rotation: 0,
  }

  setPiece(piece)
}

function getNextPiece() {
  const { nextQueue, setNextQueue } = getGameState()

  if (nextQueue.length <= Ruleset.NextQueueSize) {
    nextQueue.push(...getShuffledTetriminos())
  }

  const [next, ...rest] = nextQueue
  setNextQueue(rest)

  return next
}

function lockPiece() {
  const {
    piece,
    matrix,
    setPiece,
    setMatrix,
    setCanHold,
    setFallingTime,
    setLockDownTime,
  } = getGameState()

  if (piece) {
    setMatrix(addPieceToMatrix(piece, matrix))
    setPiece(null)
    setCanHold(true)
    setFallingTime(Ruleset.FallingDelay)
    setLockDownTime(Ruleset.LockDownDelay)
    checkPattern()
  }
}

function moveAndCollide(dx: number, dy: number) {
  const { piece, matrix, setPiece } = getGameState()

  if (piece) {
    const testPiece = movePiece(piece, dx, dy)

    if (!checkCollision(testPiece, matrix)) {
      setPiece(testPiece)
    }
  }
}

function rotateAndCollide(delta: number) {
  const { piece, matrix, setPiece } = getGameState()
  const isClockwise = delta > 0

  if (piece) {
    const { tetrimino, rotation } = piece
    const rotatedPiece = rotatePiece(piece, delta)

    const offsetIndex = isClockwise ? rotation : rotation - 1

    const offset = (
      tetrimino === Tetriminos.I ? IWallKickOffsets : JLSTZWallKickOffsets
    ).at(offsetIndex)!

    for (const [dx, dy] of offset) {
      const testPiece = isClockwise
        ? movePiece(rotatedPiece, dx, dy)
        : movePiece(rotatedPiece, -dx, -dy)

      if (!checkCollision(testPiece, matrix)) {
        setPiece(testPiece)
        return
      }
    }
  }
}

function hardDrop() {
  const { piece, matrix, setPiece } = getGameState()

  if (piece) {
    setPiece(getLandedPiece(piece, matrix))
    lockPiece()
  }
}

function holdPiece() {
  const { piece, holdQueue, canHold, setHoldQueue, setCanHold } = getGameState()

  if (piece && canHold) {
    const nextTetrimino = holdQueue ?? getNextPiece()
    setHoldQueue(piece.tetrimino)
    spawnPiece(nextTetrimino)
    setCanHold(false)
  }
}

function checkPattern() {
  const { matrix, completedLines, setHitList, setCompletedLines } =
    getGameState()

  const blocksPerRow = new Map<number, Threetris.Block[]>()

  matrix.blocks.forEach((block) => {
    const blocks = blocksPerRow.get(block.y) ?? []
    blocks.push(block)
    blocksPerRow.set(block.y, blocks)
  })

  const fullRows = Array.from(blocksPerRow.entries()).filter(
    ([, blocks]) => blocks.length === matrix.width,
  )

  const hitList = fullRows.flatMap(([, blocks]) => blocks)

  setHitList(hitList)
  setCompletedLines(completedLines + fullRows.length)
}

function eliminateBlocks() {
  const { matrix, hitList, setMatrix, setHitList } = getGameState()

  const blocks = matrix.blocks
    .filter((block) => !hitList.includes(block))
    .map((block) => {
      const hitBlocksBelow = hitList.filter(
        (hitBlock) => hitBlock.x === block.x && hitBlock.y < block.y,
      )
      return { ...block, y: block.y - hitBlocksBelow.length }
    })

  setMatrix({ ...matrix, blocks })
  setHitList([])
}

export function useEngine() {
  const lockingPieceRef = useRef<Threetris.Piece | null>(null)
  const isPlayingRef = useRef(true)

  useFrame((delta) => {
    if (!isPlayingRef.current) return

    const {
      piece,
      hitList,
      matrix,
      fallingTime,
      lockDownTime,
      elapsedTime,
      setPiece,
      setFallingTime,
      setLockDownTime,
      setElapsedTime,
    } = getGameState()

    if (hitList.length) {
      eliminateBlocks()
    }

    if (!piece) {
      spawnPiece(getNextPiece())
      return
    }

    const testPiece = movePiece(piece, 0, -1)
    const canFall = !checkCollision(testPiece, matrix)

    if (canFall) {
      let time = fallingTime - delta

      if (time <= 0) {
        time += Ruleset.FallingDelay
        setPiece(testPiece)
      }

      setFallingTime(time)
    } else if (lockingPieceRef.current === piece) {
      const time = lockDownTime - delta

      if (time <= 0) {
        lockPiece()
      }

      setLockDownTime(time)
    } else {
      lockingPieceRef.current = piece
      setLockDownTime(Ruleset.LockDownDelay)
    }

    setElapsedTime(elapsedTime + delta)
  })

  useActionPress(
    "MoveLeft",
    () => moveAndCollide(-1, 0),
    moveRepeatDelay,
    moveRepeatInterval,
  )
  useActionPress(
    "MoveRight",
    () => moveAndCollide(1, 0),
    moveRepeatDelay,
    moveRepeatInterval,
  )

  useActionPress("RotateCW", () => rotateAndCollide(1))
  useActionPress("RotateCCW", () => rotateAndCollide(-1))

  useActionPress(
    "SoftDrop",
    () => moveAndCollide(0, -1),
    moveRepeatDelay,
    moveRepeatInterval,
  )
  useActionPress("HardDrop", hardDrop)

  useActionPress("Hold", holdPiece)

  useActionPress("Pause", () => {
    isPlayingRef.current = !isPlayingRef.current
  })
}
