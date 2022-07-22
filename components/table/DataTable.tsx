import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import queryString from 'query-string'
import React, { useRef } from 'react'
import BaseTable from 'react-base-table'
import 'react-base-table/styles.css'
import SortIndicator from '../creators/table/SortIndicator'
import TableHeaderCell from '../creators/table/TableHeaderCell'
import useElementSize from '../hooks/useElementSize'

const DataTable = ({ useStore }) => {
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

  const columns = useStore(
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
        <BaseTable
          fixed
          columns={columns}
          data={data}
          sortBy={{ key: sort, order: order.toLowerCase() }}
          onColumnSort={_onSort}
          width={width}
          height={height}
          usestore={useStore}
          components={{
            SortIndicator: SortIndicator,
            TableHeaderCell: TableHeaderCell,
          }}
          // headerCellProps={{usestore:config.useStore}}
        />
      </Box>
    </Box>
  )
}

export default DataTable;
