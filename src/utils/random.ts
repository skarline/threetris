// XORShift implementation
export function* createRNG(seed: number): Generator<number> {
  let state = seed

  while (true) {
    state ^= state << 13
    state ^= state >> 17
    state ^= state << 5
    yield (state >>> 0) / 0xffffffff
  }
}
