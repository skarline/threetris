declare namespace Threetris {
  interface Block {
    x: number
    y: number
    type: number
  }

  interface Matrix {
    width: number
    height: number
    blocks: Block[]
  }

  interface Tetrimino {
    width: number
    height: number
    facings: Matrix[]
  }

  interface Piece {
    x: number
    y: number
    tetrimino: Tetrimino
    rotation: PieceRotation
  }

  type Action =
    | "MoveLeft"
    | "MoveRight"
    | "HardDrop"
    | "SoftDrop"
    | "RotateCW"
    | "RotateCCW"
    | "Hold"
}
