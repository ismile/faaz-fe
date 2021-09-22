import RCTable from 'rc-table'
import { useRef, useState } from 'react'
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
import tw, { css } from 'twin.macro'
import React from 'react'
import {UseStore, State} from 'zustand'
import { IStoreState } from './storeCreator'
interface ITableMenuActionParams<IData> {
  data: IData
  router: NextRouter
  closeMenu: Function
  openModal: IOpenModalFunctionType
  enqueueSnackbar: ProviderContext['enqueueSnackbar']
}

export interface IDataTableCreatorConfig<IData> {
  rowKey?: string
  useStore?: UseStore<IStoreState<IData>>
  dataTableFilterCreator?: Function
  colCheckbox?: Boolean
  actions?: Array<{
    label: String
    icon?: any
    disabled?: boolean | ((d: IData, i: number) => boolean)
    action: (d:ITableMenuActionParams<IData>) => any
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

  const DataTable = () => {
    const data = config.useStore(
      (state) => state.data,
      (oldTreats, newTreats) =>
        JSON.stringify(oldTreats) == JSON.stringify(newTreats)
    )

    const loading = config.useStore(
      (state) => state.loading,
      (oldTreats, newTreats) => oldTreats == newTreats
    )

    const squareRef = useRef(null)
    const { width, height } = useElementSize(squareRef)

    return (
      <div tw="h-full w-full" ref={squareRef}>
        <div tw="fixed" style={{ width, height }}>
          {loading && (
            <LinearProgress
              style={{
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
            scroll={{ x: width, y: height - 53 }}
            rowKey={config.rowKey}
            components={TableComponents}
          />
        </div>
      </div>
    )
  }

  const TablePagination = () => {
    const { page, total, limit } = config.useStore(
      (state) => ({ page: state.page, total: state.total, limit: state.limit }),
      (oldTreats, newTreats) =>
        JSON.stringify(oldTreats) == JSON.stringify(newTreats)
    )

    const _fetch = config.useStore(
      (state) => state._fetch,
      () => true
    )

    const _onChangePage = async (e, p) => {
      await _fetch({
        page: p + 1,
        limit: limit,
      })
    }

    const _onChangeRowsPerPage = async (e) => {
      await _fetch({
        page: page,
        limit: e.target.value,
      })
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
          tw="mr-2 text-black"
          startIcon={<RefreshIcon />}
        >
          Refresh
        </Button>
        <Button
          variant="text"
          // color="secondary"
          onClick={_handleNewButton}
          startIcon={<AddIcon />}
          tw="mr-2 text-black"
        >
          Tambah
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={_toggleFilterOpen}
        >
          <FilterListIcon />
        </Button>
      </>
    )
  }

  return {
    DataTable,
    TableFilter,
    TablePagination,
    DefaultTopAction,
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
              tw="p-0"
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
            tw="p-0"
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
