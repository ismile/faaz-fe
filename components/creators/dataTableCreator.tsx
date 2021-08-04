import RCTable from 'rc-table'
import { useRef, useState } from 'react'
import useElementSize from '../hooks/useElementSize'
import tableComponentCreator from './tableComponentCreator'
import { dataTableFilterCreator } from './DataTableFilterCreator'
import TablePaginationMaterial from '@material-ui/core/TablePagination'
import MenuIcon from '@material-ui/icons/Menu'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'


interface IDataTableCreatorConfig {
  rowKey?: String
  useStore?: any
  dataTableFilterCreator: Function
  colCheckbox?: Boolean
  ActionElement: Function
  columns?: Array<any>
}

const defaultConfig = {
  rowKey: 'id',
  dataTableFilterCreator: dataTableFilterCreator,
  colCheckbox: true,
  ActionElement: () => {},
  columns: [],
}

function dataTableCreator(config: IDataTableCreatorConfig = defaultConfig) {
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
      (oldTreats, newTreats) =>
        oldTreats == newTreats
    )

    const squareRef = useRef(null)
    const { width, height } = useElementSize(squareRef)

    return (
      <div className="h-full w-full" ref={squareRef}>
        <div className="fixed" style={{ width, height }}>
          <RCTable
            // tableLayout="fixed"
            // sticky
            // style={{ width: width, height: height }}
            columns={columns}
            data={data}
            scroll={{ x: width, y: height - 53 }}
            rowKey={config.rowKey}
            components={TableComponents}
            onHeaderRow={()=> ({loading: loading})}
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

    const _onChangePage = async (e, p)=> {
      await _fetch({
        page: p+1,
        limit: limit
      })
    }

    const _onChangeRowsPerPage = async (e, s, d)=> {
      await _fetch({
        page: page,
        limit: e.target.value
      })
    }


    return (
      <TablePaginationMaterial
        component="div"
        count={total}
        page={page-1}
        onChangePage={_onChangePage}
        rowsPerPage={limit}
        onChangeRowsPerPage={_onChangeRowsPerPage}
      />
    )
  }

  const TableFilter = dataTableFilterCreator(config.useStore)

  return {
    DataTable,
    TableFilter,
    TablePagination,
  }
}

function _columnGenerator(config: IDataTableCreatorConfig) {
  var columns = [...config.columns]
  var rowKey = config.rowKey
  const useStore = config.useStore

  columns.forEach(v=> {
    v.onHeaderCell = (record) => {
      return {
        keyId: v.key
      }
    }
    v.onCell = (record) => ({
      keyId: v.key
    })
  })

  // set column settings
  config.useStore.getState()._setColumnSetting(columns.reduce((pv, cv)=> {
    pv[cv.key] = !cv.hide
    return pv
  }, {action_: true, check_: true}))



  if (config.ActionElement) {
    columns.unshift({
      title: 'Action',
      dataIndex: 'action',
      key: 'action_',
      width: 80,
      fixed: 'left',
      onHeaderCell: (column) => ({
        keyId: 'action_',
      }),
      onCell: (column) => ({
        keyId: 'action_',
      }),
      render: (d) => {
        const [anchorEl, setAnchorEl] = useState(null)
        const handleClick = (event) => {
          setAnchorEl(event.currentTarget)
        }
        const handleClose = () => {
          setAnchorEl(null)
        }

        return (
          <config.ActionElement
            data={d}
            anchorEl={anchorEl}
            handleClick={handleClick}
            handleClose={handleClose}
          />
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
        keyId: 'check_',
      }),
      onHeaderCell: (column) => ({
        width: column.width,
        type: 'checkbox',
        keyId: 'check_',
        Element: () => {
          const [isAllSelected, _handleSelectAll] = useStore((state) => [
            state.isAllSelected,
            state._handleSelectAll,
          ])
          return (
            <Checkbox
              key={`check-all`}
              className="p-0"
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
            className="p-0"
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
