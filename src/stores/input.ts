import { create } from "zustand"

interface InputStore {
  actions: Partial<Record<InputAction, boolean>>
  toggleAction: (action: InputAction, value: boolean) => void
}

export const useInputStore = create<InputStore>((set) => ({
  actions: {},
  toggleAction: (action: InputAction, value: boolean) =>
    set((state) => ({ actions: { ...state.actions, [action]: value } })),
}))
