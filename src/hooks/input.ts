import { useCallback, useEffect } from "react"

import { useInputStore } from "../stores/input"

const ActionMap: Record<InputAction, string[]> = {
  moveleft: ["ArrowLeft"],
  moveright: ["ArrowRight"],
  rotatecw: ["x"],
  rotateccw: ["z"],
}

function getActionFromKey(key: string) {
  return Object.entries(ActionMap).find(([, keys]) =>
    keys.includes(key)
  )?.[0] as InputAction | undefined
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

export function useActionPress(actionKey: InputAction, callback: () => void) {
  const action = useInputStore((store) => store.actions[actionKey])

  useEffect(() => {
    if (action) callback()
  }, [action])
}

export function useActionRelease(actionKey: InputAction, callback: () => void) {
  const action = useInputStore((store) => store.actions[actionKey])

  useEffect(() => {
    if (!action) callback()
  }, [action])
}
