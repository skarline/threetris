import { useCallback, useEffect, useRef } from "react"

import { useInputStore } from "../stores/input"
import { useFrame } from "@react-three/fiber"

const actionMap: Record<Threetris.Action, string[]> = {
  moveleft: ["ArrowLeft"],
  moveright: ["ArrowRight"],
  softdrop: ["ArrowDown"],
  rotatecw: ["x"],
  rotateccw: ["z"],
}

const autoRepeatDelay = 0.3
const autoRepeatInterval = 0.05

function getActionFromKey(key: string) {
  return Object.entries(actionMap).find(([, keys]) =>
    keys.includes(key)
  )?.[0] as Threetris.Action | undefined
}

export function useInput() {
  const toggleAction = useInputStore((store) => store.toggleAction)

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const action = getActionFromKey(event.key)
    if (action) toggleAction(action, true)
  }, [])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const action = getActionFromKey(event.key)
    if (action) toggleAction(action, false)
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
  repeat = false
) {
  const action = useInputStore((store) => store.actions[actionKey])
  const repeatTime = useRef<number | null>(null)

  useEffect(() => {
    if (action) {
      callback()

      if (repeat) {
        repeatTime.current = autoRepeatDelay
      }
    }
  }, [action])

  useFrame((_, delta) => {
    if (!action) return
    if (!repeatTime.current) return

    repeatTime.current -= delta

    if (repeatTime.current <= 0) {
      repeatTime.current += autoRepeatInterval
      callback()
    }
  })
}

export function useActionRelease(
  actionKey: Threetris.Action,
  callback: () => void
) {
  const action = useInputStore((store) => store.actions[actionKey])

  useEffect(() => {
    if (!action) callback()
  }, [action])
}
