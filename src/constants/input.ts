export const ActionMap: Record<Threetris.Action, string[]> = {
  MoveLeft: ["ArrowLeft"],
  MoveRight: ["ArrowRight"],
  HardDrop: ["Space"],
  SoftDrop: ["ArrowDown"],
  RotateCW: ["KeyX", "ArrowUp"],
  RotateCCW: ["KeyZ", "ControlLeft", "ControlRight"],
  Hold: ["KeyC", "ShiftLeft", "ShiftRight"],
  Pause: ["Escape"],
}
