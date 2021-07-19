import immer from 'immer';
import zustand from 'zustand'

const useSidebarStore = zustand(set => ({
  open: false,
  _toggle: () => set(state => ({ open: !state.open})),
}))


export default useSidebarStore
