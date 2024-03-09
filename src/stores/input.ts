import { create } from "zustand"

interface InputStore {
  actions: Partial<Record<Threetris.Action, boolean>>
  toggleAction: (action: Threetris.Action, value: boolean) => void
}

const state = create<InputStore>((set) => ({
  actions: {},
  toggleAction: (action: Threetris.Action, value: boolean) => {
    set((state) => ({
      actions: { ...state.actions, [action]: value },
      previousActions: { ...state.actions },
    }))
  },
}))

export const getInputState = () => state.getState()

export const getAction = (action: Threetris.Action) =>
  getInputState().actions[action] ?? false
