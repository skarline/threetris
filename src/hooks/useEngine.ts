import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

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

function spawnPiece(tetrimino: Threetris.Tetrimino) {
  const { matrix, setPiece } = getGameState()

  const piece = {
    x: Math.floor((matrix.width - tetrimino.width) / 2),
    y: matrix.height,
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
    let testPiece = movePiece(piece, dx, dy)

    if (!checkCollision(testPiece, matrix)) {
      setPiece(testPiece)
    }
  }
}

function rotateAndCollide(delta: number) {
  const { piece, matrix, setPiece } = getGameState()

  if (piece) {
    const testPiece = rotatePiece(piece, delta)

    if (!checkCollision(testPiece, matrix)) {
      setPiece(testPiece)
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
  const { matrix, setHitList } = getGameState()

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
  const lockingPiece = useRef<Threetris.Piece | null>(null)

  useFrame((_, delta) => {
    const {
      piece,
      hitList,
      matrix,
      fallingTime,
      lockDownTime,
      setPiece,
      setFallingTime,
      setLockDownTime,
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
    } else if (lockingPiece.current === piece) {
      let time = lockDownTime - delta

      if (time <= 0) {
        lockPiece()
      }

      setLockDownTime(time)
    } else {
      lockingPiece.current = piece
      setLockDownTime(Ruleset.LockDownDelay)
    }
  })

  useActionPress("MoveLeft", () => moveAndCollide(-1, 0), true)
  useActionPress("MoveRight", () => moveAndCollide(1, 0), true)

  useActionPress("RotateCW", () => rotateAndCollide(1))
  useActionPress("RotateCCW", () => rotateAndCollide(-1))

  useActionPress("SoftDrop", () => moveAndCollide(0, -1), true)
  useActionPress("HardDrop", hardDrop)

  useActionPress("Hold", holdPiece)
}
