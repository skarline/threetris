function createTetrimino(opts: {
  size: [number, number]
  data: number[][]
}): Threetris.Tetrimino {
  const { size, data } = opts

  const facings: Threetris.Matrix[] = data.map((data) => ({
    size,
    blocks: data.reduce((acc, type, i) => {
      if (type) {
        acc.push({
          x: i % size[0],
          y: Math.floor(i / size[0]),
          type,
        })
      }
      return acc
    }, [] as Threetris.Block[]),
  }))

  return { size, facings }
}

export const Tetriminos: Record<string, Threetris.Tetrimino> = {
  O: createTetrimino({
    size: [3, 3],
    data: [
      [0, 0, 0, 0, 1, 1, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 0, 1, 1],
    ],
  }),
  I: createTetrimino({
    size: [4, 4],
    data: [
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2],
      [0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2],
      [0, 0, 0, 0, 2, 2, 2, 2],
      [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2],
    ],
  }),
  T: createTetrimino({
    size: [3, 3],
    data: [
      [0, 0, 0, 3, 3, 3, 0, 3],
      [0, 3, 0, 0, 3, 3, 0, 3],
      [0, 3, 0, 3, 3, 3],
      [0, 3, 0, 3, 3, 0, 0, 3],
    ],
  }),
  L: createTetrimino({
    size: [3, 3],
    data: [
      [0, 0, 0, 4, 4, 4, 0, 0, 4],
      [0, 4, 4, 0, 4, 0, 0, 4],
      [4, 0, 0, 4, 4, 4],
      [0, 4, 0, 0, 4, 0, 4, 4],
    ],
  }),
  J: createTetrimino({
    size: [3, 3],
    data: [
      [0, 0, 0, 5, 5, 5, 5],
      [0, 5, 0, 0, 5, 0, 0, 5, 5],
      [0, 0, 5, 5, 5, 5],
      [5, 5, 0, 0, 5, 0, 0, 5],
    ],
  }),
  S: createTetrimino({
    size: [3, 3],
    data: [
      [0, 0, 0, 6, 6, 0, 0, 6, 6],
      [0, 0, 6, 0, 6, 6, 0, 6],
      [6, 6, 0, 0, 6, 6],
      [0, 6, 0, 6, 6, 0, 6],
    ],
  }),
  Z: createTetrimino({
    size: [3, 3],
    data: [
      [0, 0, 0, 0, 7, 7, 7, 7],
      [0, 7, 0, 0, 7, 7, 0, 0, 7],
      [0, 7, 7, 7, 7],
      [7, 0, 0, 7, 7, 0, 0, 7],
    ],
  }),
}

export const TetriminosArray = [
  Tetriminos.O,
  Tetriminos.I,
  Tetriminos.T,
  Tetriminos.L,
  Tetriminos.J,
  Tetriminos.S,
  Tetriminos.Z,
]
