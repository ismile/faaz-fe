import RCTable from 'rc-table'
import { useRef, useState } from 'react'
import useElementSize from '../hooks/useElementSize'
import TableComponents from '../TableComponents'
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

  const DataTable = ({ data, columns }) => {
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
          />
        </div>
      </div>
    )
  }

  const TablePagination = () => {
    return (
      <TablePaginationMaterial
        component="div"
        count={100}
        page={1}
        onPageChange={() => {}}
        rowsPerPage={10}
        onRowsPerPageChange={() => {}}
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
  if (config.ActionElement) {
    columns.unshift({
      title: 'Action',
      dataIndex: 'action',
      key: 'name',
      width: 80,
      fixed: 'left',
      render: (d) => {
        const [anchorEl, setAnchorEl] = useState(null);
        const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
          setAnchorEl(null);
        };

        return <config.ActionElement data={d} anchorEl={anchorEl} handleClick={handleClick} handleClose={handleClose} />
      },
    })
  }
  if (config.colCheckbox) {
    columns.unshift({
      title: 'Checkbox',
      key: 'check',
      dataIndex: 'check',
      width: 60,
      fixed: 'left',
      onHeaderCell: (column) => ({
        width: column.width,
        type: 'checkbox',
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
