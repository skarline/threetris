declare namespace Threetris {
  interface Block {
    x: number
    y: number
    type: number
  }

  interface Matrix {
    size: [number, number]
    blocks: Block[]
  }

  interface Tetrimino {
    size: [number, number]
    facings: Matrix[]
  }

  interface Piece {
    x: number
    y: number
    tetrimino: Tetrimino
    rotation: PieceRotation
  }

  type Action = "moveleft" | "moveright" | "softdrop" | "rotatecw" | "rotateccw"
}
