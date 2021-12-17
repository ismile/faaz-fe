import immer from 'immer';
import zustand from 'zustand'

const useSidebarStore = zustand<{
  open: boolean
}>(set => ({
  open: false,
  _toggle: () => {
    if(window) window.dispatchEvent(new Event('resize'))
    return set(state => ({ open: !state.open}))
  },

  _set: (b) => {
    if(window) window.dispatchEvent(new Event('resize'))
    return set(state => ({ open: b}))
  },
}))


export default useSidebarStore
