import immer from 'immer';
import zustand from 'zustand'

const useSettingStore = zustand<{
  mode: string,
  _set: (value: string) => void,
}>(set => ({
  mode: 'light',
  _set: (mode) => {
    return set(state => ({ mode: mode}))
  },
}))


export default useSettingStore
