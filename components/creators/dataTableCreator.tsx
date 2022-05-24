import RCTable from 'rc-table'
import { useEffect, useRef, useState } from 'react'
import useElementSize from '../hooks/useElementSize'
import tableComponentCreator from './tableComponentCreator'
import { dataTableFilterCreator } from './dataTableFilterCreator'
import TablePaginationMaterial from '@mui/material/TablePagination'
import MenuIcon from '@mui/icons-material/Menu'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import FilterListIcon from '@mui/icons-material/FilterList'
import useModal, { IOpenModalFunctionType } from '../hooks/useModal'
import { useSnackbar, ProviderContext } from 'notistack'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useRouter, NextRouter } from 'next/dist/client/router'
import React from 'react'
import { UseBoundStore, State } from 'zustand'
import { IStoreState } from './storeCreator'
import { useHash } from '../../components/others/react-use/useHash'
import queryString from 'query-string'
import Box from '@mui/material/Box'

interface ITableMenuActionParams<IData> {
  data: IData
  router: NextRouter
  closeMenu: Function
  openModal: IOpenModalFunctionType
  enqueueSnackbar: ProviderContext['enqueueSnackbar']
}

export interface IDataTableCreatorConfig<IData> {
  rowKey?: string
  useStore?: UseBoundStore<IStoreState<IData>>
  dataTableFilterCreator?: Function
  colCheckbox?: Boolean
  actions?: Array<{
    label: String
    icon?: any
    disabled?: boolean | ((d: IData, i: number) => boolean)
    action: (d: ITableMenuActionParams<IData>) => any
  }>
  columns?: Array<any>
}

const defaultConfig = {
  rowKey: 'id',
  dataTableFilterCreator: dataTableFilterCreator,
  colCheckbox: true,
  ActionElement: () => {},
  columns: [],
}

function dataTableCreator<IData>(
  config: IDataTableCreatorConfig<IData> = defaultConfig
) {
  config = {
    ...defaultConfig,
    ...config,
  }

  var columns = _columnGenerator(config)
  var TableComponents = tableComponentCreator(config)

  const TableWatcher = () => {
    const [hash, setHash] = useHash()
    const [_fetch] = config.useStore(
      (state) => [state._fetch],
      (ps, ns) => true
    )
    useEffect(() => {
      var query = queryString.parse(hash)

      _fetch(query)
    }, [hash])

    return <div />
  }

  const DataTable = () => {
    const data = config.useStore(
      (state) => state.data,
      (o, n) => JSON.stringify(o) == JSON.stringify(n)
    )

    const loading = config.useStore(
      (state) => state.loading,
      (o, n) => o == n
    )

    const columns = config.useStore(
      (state) => state.columns,
      (o, n) => JSON.stringify(o) == JSON.stringify(n)
    )

    const squareRef = useRef(null)
    const { width, height } = useElementSize(squareRef)

    return (
      <Box sx={{ height: '100%', width: '100%' }} ref={squareRef}>
        <Box sx={{ display: 'block' }} style={{ width, height }}>
          {loading && (
            <LinearProgress
              sx={{
                position: 'absolute',
                marginTop: '52px',
                zIndex: 200,
                width: '100%',
              }}
            />
          )}
          <RCTable
            // tableLayout="fixed"
            // sticky
            // style={{ width: width, height: height }}
            columns={columns}
            data={data}
            scroll={{ x: width-17, y: height - 50 }}
            rowKey={config.rowKey}
            components={TableComponents}
          />
        </Box>
      </Box>
    )
  }

  const CustomView = ({ ItemTemplate, ItemContainer=({children})=> <div>{children}</div> }) => {
    const data = config.useStore(
      (state) => state.data,
      (o, n) => JSON.stringify(o) == JSON.stringify(n)
    )

    const loading = config.useStore(
      (state) => state.loading,
      (o, n) => o == n
    )

    const squareRef = useRef(null)
    const { width, height } = useElementSize(squareRef)

    return (
      <Box sx={{ height: '100%', width: '100%' }} ref={squareRef}>
        <Box
          sx={{ position: 'fixed', overflow: 'auto' }}
          style={{ width, height }}
        >
          {loading && (
            <LinearProgress
              sx={{
                position: 'absolute',
                marginTop: '0px',
                zIndex: 200,
                width: '100%',
              }}
            />
          )}

          <ItemContainer>
            {data.map((d) => (
              <ItemTemplate key={d[config.rowKey]} data={d} />
            ))}
          </ItemContainer>
        </Box>
      </Box>
    )
  }

  const TablePagination = () => {
    const router = useRouter()

    const { page, total, limit } = config.useStore(
      (state) => ({ page: state.page, total: state.total, limit: state.limit }),
      (oldData, newData) => JSON.stringify(oldData) == JSON.stringify(newData)
    )

    const _fetch = config.useStore(
      (state) => state._fetch,
      () => true
    )

    const _onChangePage = async (e, p) => {
      var query = queryString.parse(window.location.hash)
      if (!query) query = {}
      query.page = p + 1
      window.location.hash = '#' + queryString.stringify(query)
    }

    const _onChangeRowsPerPage = async (e: any) => {
      var query = queryString.parse(window.location.hash)
      if (!query) query = {}
      query.limit = e.target.value
      window.location.hash = '#' + queryString.stringify(query)
    }

    return (
      <TablePaginationMaterial
        component="div"
        count={total}
        page={page - 1}
        onPageChange={_onChangePage}
        rowsPerPage={limit}
        onRowsPerPageChange={_onChangeRowsPerPage}
      />
    )
  }

  const TableFilter = dataTableFilterCreator(config.useStore)

  const DefaultTopAction = () => {
    const [_toggleFilterOpen, _fetch, routerPath] = config.useStore(
      (state) => [state._toggleFilterOpen, state._fetch, state.routerPath],
      (ps, ns) => true
    )

    const router = useRouter()

    const _handleReload = () => _fetch()
    const _handleNewButton = () => router.push(`${routerPath}/new`)

    return (
      <>
        <Button
          variant="text"
          // color="secondary"
          onClick={_handleReload}
          sx={{
            marginRight: '0.5rem',
            color: 'text.primary',
          }}
          startIcon={<RefreshIcon />}
        >
          Refresh
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={_handleNewButton}
          startIcon={<AddIcon />}
          sx={{
            color: 'text.primary',
          }}
        >
          Tambah
        </Button>
        {/* <Button
          variant="contained"
          color="secondary"
          onClick={_toggleFilterOpen}
        >
          <FilterListIcon />
        </Button> */}
      </>
    )
  }

  return {
    CustomView,
    DataTable,
    TableFilter,
    TablePagination,
    DefaultTopAction,
    TableWatcher,
  }
}

function _columnGenerator<IData>(config: IDataTableCreatorConfig<IData>) {
  var columns = [...config.columns]
  var rowKey = config.rowKey
  const useStore = config.useStore

  columns.forEach((v) => {
    v.onHeaderCell = (record) => {
      return {
        keyid: v.key,
      }
    }
    v.onCell = (record) => ({
      keyid: v.key,
    })
  })

  // set column settings
  config.useStore.getState()._setColumnSetting(
    columns.reduce(
      (pv, cv) => {
        pv[cv.key] = !cv.hide
        return pv
      },
      { action_: true, check_: true }
    )
  )

  if (config.actions) {
    columns.unshift({
      title: '',
      dataIndex: 'action',
      key: 'action_',
      width: 60,
      fixed: 'left',
      onHeaderCell: (column) => ({
        keyid: 'action_',
      }),
      onCell: (column) => ({
        keyid: 'action_',
      }),
      render: (data, row, index) => {
        const [anchorEl, setAnchorEl] = useState(null)
        const handleClick = (event) => {
          setAnchorEl(event.currentTarget)
        }
        const handleClose = () => {
          setAnchorEl(null)
        }

        const { _openModal } = useModal(
          (state) => ({ _openModal: state._openModal }),
          () => true
        )
        const { enqueueSnackbar, closeSnackbar } = useSnackbar()
        const router = useRouter()

        return (
          <>
            <IconButton
              size="small"
              color="inherit"
              aria-label="open drawer"
              onClick={handleClick}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {config.actions.map((d, i) => {
                let disabled: boolean = false
                if (typeof d.disabled == 'function')
                  disabled = d.disabled(row, index)

                return (
                  <MenuItem
                    key={i}
                    disabled={disabled}
                    onClick={() =>
                      d.action({
                        data: row,
                        openModal: _openModal,
                        closeMenu: handleClose,
                        enqueueSnackbar,
                        router,
                      })
                    }
                  >
                    <ListItemIcon>
                      <d.icon fontSize="small" />
                    </ListItemIcon>
                    {d.label}
                  </MenuItem>
                )
              })}
            </Menu>
          </>
        )
      },
    })
  }
  if (config.colCheckbox) {
    columns.unshift({
      title: 'Checkbox',
      key: 'check_',
      dataIndex: 'check',
      width: 60,
      fixed: 'left',
      onCell: (column) => ({
        keyid: 'check_',
      }),
      onHeaderCell: (column) => ({
        width: column.width,
        type: 'checkbox',
        keyid: 'check_',
        Element: () => {
          const [isAllSelected, _handleSelectAll] = useStore((state) => [
            state.isAllSelected,
            state._handleSelectAll,
          ])
          return (
            <Checkbox
              key={`check-all`}
              sx={{ padding: 0 }}
              checked={isAllSelected}
              onChange={_handleSelectAll}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          )
        },
      }),
      render: (v, d) => {
        const [selected, _handleSingleSelect] = useStore((state) => [
          state.selected,
          state._handleSingleSelect,
        ])
        return (
          <Checkbox
            key={`checkbox-${d[rowKey]}`}
            sx={{ padding: 0 }}
            checked={!!selected[d[rowKey]]}
            onChange={function (ev, val) {
              _handleSingleSelect(d, val)
            }}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        )
      },
    })
  }

  config.useStore.getState()._setColumns(columns)
  return columns
}

export default dataTableCreator
