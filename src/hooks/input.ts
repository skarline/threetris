import { useCallback, useEffect, useRef } from "react"

import { getInputState } from "../stores/input"
import { useFrame } from "@react-three/fiber"

const ActionMap: Record<Threetris.Action, string[]> = {
  MoveLeft: ["ArrowLeft"],
  MoveRight: ["ArrowRight"],
  HardDrop: ["Space"],
  SoftDrop: ["ArrowDown"],
  RotateCW: ["KeyX", "ArrowUp"],
  RotateCCW: ["KeyZ"],
}

const autoRepeatDelay = 0.3
const autoRepeatInterval = 0.05

function getActionFromKey(key: string) {
  return Object.entries(ActionMap).find(([, keys]) =>
    keys.includes(key),
  )?.[0] as Threetris.Action | undefined
}

export function useInput() {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const action = getActionFromKey(event.code)
    if (action) getInputState().toggleAction(action, true)
  }, [])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const action = getActionFromKey(event.code)
    if (action) getInputState().toggleAction(action, false)
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  })
}

export function useActionPress(
  actionKey: Threetris.Action,
  callback: () => void,
  repeat = false,
) {
  const actionRef = useRef<boolean>(false)
  const repeatTime = useRef<number>(0)

  useFrame((_, delta) => {
    const action = getInputState().actions[actionKey] ?? false

    const justPressed = action && !actionRef.current
    const isRepeating = action && repeat

    if (justPressed) {
      repeatTime.current = autoRepeatDelay
      callback()
    } else if (isRepeating) {
      if ((repeatTime.current -= delta) <= 0) {
        repeatTime.current += autoRepeatInterval
        callback()
      }
    }

    actionRef.current = action
  })
}

export function useActionRelease(
  actionKey: Threetris.Action,
  callback: () => void,
) {
  const actionRef = useRef<boolean>(false)

  useFrame(() => {
    const action = getInputState().actions[actionKey] ?? false

    const justReleased = !action && actionRef.current

    if (justReleased) callback()

    actionRef.current = action
  })
}
