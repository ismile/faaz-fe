import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import queryString from 'query-string'
import React, { useEffect, useRef } from 'react'
import BaseTable from 'react-base-table'
import 'react-base-table/styles.css'
import FDataTableSortIndicator from './FDataTableSortIndicator'
import FDataTableHeaderCell from './FDataTableHeaderCell'
import useElementSize from '../hooks/useElementSize'
import FDataTableCellActionRenderer from '../../faaz/table/FDataTableCellActionRenderer'
import FDataTableCellCheckboxRenderer, {
  FDataTableHeaderCheckboxRenderer,
} from '../../faaz/table/FDataTableCellCheckboxRenderer'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const FDataTable = ({ useStore, rowActions, colCheckbox, columns }) => {
  const data = useStore(
    (state) => state.data,
    (o, n) => JSON.stringify(o) == JSON.stringify(n)
  )

  const [sort, order] = useStore(
    (state) => [state.sort, state.order],
    (o, n) => JSON.stringify(o) == JSON.stringify(n)
  )

  const loading = useStore(
    (state) => state.loading,
    (o, n) => o == n
  )

  const columnsStore = useStore(
    (state) => state.columns,
    (o, n) => JSON.stringify(o) == JSON.stringify(n)
  )

  const _setColumns = useStore(
    (state) => state._setColumns,
    (o, n) => true
  )

  const _onSort = (a) => {
    var query = queryString.parse(window.location.hash)
    if (!query) query = {}
    query.sort = a.key
    query.order = a.order
    window.location.hash = '#' + queryString.stringify(query)
  }

  const squareRef = useRef(null)
  const { width, height } = useElementSize(squareRef)

  useEffect(() => {
    _columnGenerator({
      useStore: useStore,
      columns: columns ? columns : [],
      colCheckbox:
        colCheckbox != null || colCheckbox != undefined ? colCheckbox : true,
      rowActions: rowActions
        ? rowActions
        : [
            {
              label: 'Edit',
              icon: EditIcon,
              action: ({ data, router }) => {
                router.push(`${useStore.getState().apiPath}/${data.id}`)
              },
            },
            {
              type: 'divider',
            },
            {
              label: 'Delete',
              icon: DeleteIcon,
              action: async ({
                data,
                openModal,
                closeMenu,
                enqueueSnackbar,
              }) => {
                var d = await openModal({
                  body: 'Apakah anda yakin akan menghapus data ini?',
                })
                closeMenu()
                if (d) {
                  var res = await useStore.getState()._delete(data.id, true)
                  enqueueSnackbar('Data telah berhasil di hapus.', {
                    variant: 'success',
                  })
                }
              },
            },
          ],
    })
  }, [])

  return (
    <Box sx={{ flex: 1 }} ref={squareRef}>
      <Box
        sx={{ display: 'block', width, height, position: 'fixed', zIndex: 0 }}
      >
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
        <BaseTable
          fixed
          columns={columnsStore}
          data={data}
          sortBy={{ key: sort, order: order.toLowerCase() }}
          onColumnSort={_onSort}
          width={width}
          height={height}
          usestore={useStore}
          components={{
            SortIndicator: FDataTableSortIndicator,
            TableHeaderCell: FDataTableHeaderCell,
          }}
          // headerCellProps={{usestore:config.useStore}}
        />
      </Box>
    </Box>
  )
}

function _columnGenerator(config) {
  var columns = [...config.columns]
  var rowKey = config.useStore.getState().rowKey

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

  if (config.rowActions.length > 0) {
    columns.unshift({
      title: '',
      dataKey: 'action',
      key: 'action_',
      width: 60,
      frozen: 'left',
      cellRenderer: ({ rowData, rowIndex }) => {
        return (
          <FDataTableCellActionRenderer
            rowData={rowData}
            rowIndex={rowIndex}
            actions={config.rowActions}
          />
        )
      },
    })
  }

  if (config.colCheckbox) {
    columns.unshift({
      title: 'Checkbox',
      key: 'check_',
      dataKey: 'check',
      width: 60,
      frozen: 'left',
      headerRenderer: ({ column, columnIndex }) => (
        <FDataTableHeaderCheckboxRenderer
          column={column}
          useStore={config.useStore}
        />
      ),
      cellRenderer: ({ rowData, rowIndex }) => (
        <FDataTableCellCheckboxRenderer
          rowData={rowData}
          rowIndex={rowIndex}
          useStore={config.useStore}
          rowKey={rowKey}
        />
      ),
    })
  }

  config.useStore.getState()._setColumns(columns)
  return columns
}

export default FDataTable
