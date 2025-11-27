import { useCallback, useEffect, useRef } from "react"

import { getAction, getInputState } from "@/stores/input"
import { ActionMap } from "@/constants/input"
import { useAnimationFrame } from "motion/react"

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
  repeatDelay = 300,
  repeatInterval = 100,
) {
  const previousActionRef = useRef<boolean>(false)
  const repeatTimeRef = useRef<number>(0)

  useAnimationFrame((_, delta) => {
    const action = getAction(actionKey)

    const justPressed = action && !previousActionRef.current
    const isRepeating = action && repeatInterval > 0

    if (justPressed) {
      repeatTimeRef.current = repeatDelay
      callback()
    } else if (isRepeating) {
      repeatTimeRef.current -= delta

      if (repeatTimeRef.current <= 0) {
        repeatTimeRef.current += repeatInterval
        callback()
      }
    }

    previousActionRef.current = action
  })
}

function useActionRelease(actionKey: Threetris.Action, callback: () => void) {
  const actionRef = useRef<boolean>(false)

  useAnimationFrame(() => {
    const action = getInputState().actions[actionKey] ?? false

    const justReleased = !action && actionRef.current

    if (justReleased) callback()

    actionRef.current = action
  })
}
