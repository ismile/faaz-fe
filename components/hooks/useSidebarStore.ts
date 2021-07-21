import immer from 'immer';
import zustand from 'zustand'

const useSidebarStore = zustand(set => ({
  open: false,
  _toggle: () => {
    if(window) window.dispatchEvent(new Event('resize'))
    return set(state => ({ open: !state.open}))
  },
}))


export default useSidebarStore
