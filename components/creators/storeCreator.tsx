import immer from 'immer'
import zustand from 'zustand'
import axios from 'axios'
import Table from 'rc-table'
import { asyncTimeout } from '../../configs/utils'
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

  const useStore = zustand((set, get) => ({
    loading: false,
    data: [],
    page: 1,
    limit: 10,
    total: 0,
    sort: 'id',
    order: 'ASC',
    columns: [],
    columnSetting: {action_: true, check_: true},
    isAllSelected: false,
    selected: {},
    selectedArr: [],
    filterOpen: false,
    apiPath: 'http://localhost:3001/v1/user',

    _fetch: async (params = {}) => {
      if (params.page == null || params.page == undefined)
        params.page = get().page
      if (params.limit == null || params.limit == undefined)
        params.limit = get().limit

      var query = {...params}
      if(query.order && query.sort) {
        if(query.order == 'ASC') {
          query.order = '^'+query.sort
        } else {
          query.order = '-'+query.sort
        }

        delete query.sort
      }

      set({loading: true})
      const res = await axios.get(get().apiPath, { params: query })
       set(
        immer((draft) => {
          if (res.data) {
            draft.data = res.data.items
            draft.page = parseInt(res.data.page)
            draft.limit = parseInt(res.data.limit)
            draft.total = parseInt(res.data.total)
            draft.loading = false
            if(params.sort) draft.sort = params.sort
            if(params.order) draft.order = params.order
          }
        })
      )
    },

    _setSort: (sort, order) => {
      return set(
        immer((draft) => {
          draft.sort = sort
          draft.order = order
        })
      )
    },

    _setColumns: (columns) => {
      return set(
        immer((draft) => {
          draft.columns = columns
        })
      )
    },

    _setColumnSetting: (columnSetting) => {
      return set(
        immer((draft) => {
          draft.columnSetting = columnSetting
        })
      )
    },

    _toggleColumn: (key) => {
      return set(
        immer((draft) => {
          draft.columnSetting[key] = !draft.columnSetting[key]
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
