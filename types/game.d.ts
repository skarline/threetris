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

  type Action = "moveleft" | "moveright" | "rotatecw" | "rotateccw"
}
