import immer from 'immer'
import zustand from 'zustand'
import axios, {AxiosResponse} from 'axios'
interface IStoreCreatorConfig {
  rowKey?: String
  apiPath?: String
  store?: Function,
  routerPath?: String,
}

export interface IStoreState<IData> {
  loading: boolean
  data: Array<IData>
  page: number
  limit: number
  total: number
  sort: string
  order: 'ASC' | 'DSC'
  filter: Object
  columns: Array<Object>
  columnMap: Map<string, Object>
  columnSetting: {action_: boolean, check_: boolean}
  isAllSelected: boolean
  selected: Object
  selectedArr: Array<Object>
  filterOpen: boolean
  apiPath: string
  routerPath: string

  _fetch: (params?: IFetchParams) => AxiosResponse<{
    items: Array<IData>
    page: number
    limit: number
    total: number
  }>
  _getOne: (id: string|string[]) => AxiosResponse<IData>
  _create: (data: IData, fetch?: boolean) => AxiosResponse<IData>
  _update: (data: IData, fetch?: boolean) => AxiosResponse<IData>
  _delete: (id: string, fetch?: boolean) => AxiosResponse<IData>
  _toggleColumn: (key: string)=>void
  _toggleFilterOpen: ()=>void
  _setSort: (sort: string, order: 'ASC' | 'DSC') => void
  _setColumns: (columns:Array<Object>)=>void
  _setColumnSetting: (columnSetting:{action_: boolean, check_: boolean})=> void
  _handleSingleSelect:(d:IData, val: boolean) => void
  _handleSelectAll: ()=>void
}

export interface IFetchParams {
  page?: number
  limit?: number
  order?: 'ASC' | 'DSC'
  sort?: string
}

const defaultConfig = {
  rowKey: 'id',
  apiPath: '/user',
  routerPath: '/user',
  store: (set, get) => {
    return {}
  }
}

function storeCreator<IData>(config: IStoreCreatorConfig = defaultConfig) {
  config = {
    ...defaultConfig,
    ...config,
  }

  const rowKey = config.rowKey

  const useStore = zustand<IStoreState<IData>>((set, get) => ({
    loading: false,
    data: [],
    page: 1,
    limit: 10,
    total: 0,
    sort: 'id',
    order: 'ASC',
    filter: {},
    columns: [],
    columnMap: {},
    columnSetting: { action_: true, check_: true },
    isAllSelected: false,
    selected: {},
    selectedArr: [],
    filterOpen: true,
    apiPath: config.apiPath,
    routerPath: config.routerPath,

    _fetch: async (params:any = {}) => {
      if (params.page == null || params.page == undefined)
        params.page = get().page
      if (params.limit == null || params.limit == undefined)
        params.limit = get().limit

      var query = { ...params }
      if (query.order && query.sort) {
        if (query.order == 'ASC') {
          query.order = '^' + query.sort
        } else {
          query.order = '-' + query.sort
        }
        delete query.sort
      }

      if (query.field && query.criteria) {
        query[query.field + '__' + query.criteria] =
          query.key
      }

      delete query.field
      delete query.criteria
      delete query.key

      set({ loading: true })
      const res = await axios.get(get().apiPath, { params: query })
      set(
        immer((draft) => {
          if (res.data) {
            draft.data = res.data.data
            draft.page = parseInt(res.data.page)
            draft.limit = parseInt(res.data.limit)
            draft.total = parseInt(res.data.total)
            draft.loading = false
            if (params.sort) draft.sort = params.sort
            if (params.order) draft.order = params.order
            if (params.filter) {
              draft.filter = params.filter
            } else {
              draft.filter = {}
            }
          }
        })
      )

      return res
    },

    _getOne: async (id) => {
      const res = await axios.get(get().apiPath + '/' + id)
      return res
    },

    _delete: async (id, fetch = false) => {
      const res = await axios.delete(get().apiPath + '/' + id)
      if (fetch) get()._fetch()
      return res
    },

    _create: async (data, fetch = false) => {
      const res = await axios.post(get().apiPath, data)
      if (fetch) get()._fetch()
      return res;
    },

    _update: async (data, fetch = false) => {
      const res = await axios.put(get().apiPath+"/"+data.id, data)
      if (fetch) get()._fetch()
      return res;
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
          draft.columnMap = columns.reduce((pv, cv)=> {
            pv[cv.key] = cv
            return pv
          }, {})
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
    ...config.store(set, get)
  }))

  return {
    useStore,
  }
}

storeCreator.immer = immer

export default storeCreator
