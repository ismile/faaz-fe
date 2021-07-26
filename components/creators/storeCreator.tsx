import immer from 'immer'
import zustand from 'zustand'

import Table from 'rc-table'
interface IStoreCreatorConfig {
  rowKey?: String
}

const defaultConfig = {
  rowKey: 'id',
}

function storeCreator(config: IStoreCreatorConfig = defaultConfig) {
  config = {
    ...defaultConfig,
    ...config,
  }

  const rowKey = config.rowKey

  const useStore = zustand((set) => ({
    data: [
      { name: 'Jack', age: 28, address: 'some where', id: '1' },
      { name: 'Rose', age: 36, address: 'some where', id: '2' },
      { name: 'Jack', age: 28, address: 'some where', id: '3' },
      { name: 'Rose', age: 36, address: 'some where', id: '4' },
      { name: 'Jack', age: 28, address: 'some where', id: '5' },
      { name: 'Rose', age: 36, address: 'some where', id: '6' },
      { name: 'Jack', age: 28, address: 'some where', id: '7' },
      { name: 'Rose', age: 36, address: 'some where', id: '8' },
      { name: 'Jack', age: 28, address: 'some where', id: '9' },
      { name: 'Rose', age: 36, address: 'some where', id: '10' },
      { name: 'Jack', age: 28, address: 'some where', id: '11' },
      { name: 'Rose', age: 36, address: 'some where', id: '12' },
      { name: 'Jack', age: 28, address: 'some where', id: '13' },
      { name: 'Rose', age: 36, address: 'some where', id: '14' },
      { name: 'Jack', age: 28, address: 'some where', id: '15' },
      { name: 'Rose', age: 36, address: 'some where', id: '16' },
      { name: 'Jack', age: 28, address: 'some where', id: '17' },
      { name: 'Rose', age: 36, address: 'some where', id: '18' },
    ],
    columns: [],
    isAllSelected: false,
    selected: {},
    selectedArr: [],

    filterOpen: false,

    _setColumns: (columns) => {
      return set(
        immer((draft) => {
          draft.columns = columns
        })
      )
    },

    _toggleFilterOpen: () => {
      if (window) window.dispatchEvent(new Event('resize'))
      return set(
        immer((draft) => {
          draft.filterOpen = !draft.filterOpen
        })
      )
    },

    _handleSingleSelect: (d, val) =>
      set(
        immer((draft) => {
          if (draft.selected[d[rowKey]]) {
            delete draft.selected[d[rowKey]]
          } else {
            draft.selected[d[rowKey]] = d
          }

          draft.selectedArr = Object.keys(draft.selected).map((key) => {
            return draft.selected[key]
          })
        })
      ),
    _handleSelectAll: () =>
      set(
        immer((draft) => {
          draft.isAllSelected = !draft.isAllSelected
          if (draft.isAllSelected) {
            draft.data.forEach((d, i) => {
              draft.selected[d[rowKey]] = d
            })
          } else {
            draft.data.forEach((d, i) => {
              delete draft.selected[d[rowKey]]
            })
          }

          draft.selectedArr = Object.keys(draft.selected).map((key) => {
            return draft.selected[key]
          })
        })
      ),
  }))

  return {
    useStore,
  }
}

export default storeCreator
