import React, { useEffect, useRef, useState } from 'react'
import { NextRouter, useRouter } from 'next/dist/client/router'
import queryString from 'query-string'
import TablePaginationMaterial from '@mui/material/TablePagination'

const FDataTablePagination = ({useStore}) => {
  const router = useRouter()

  const { page, total, limit } = useStore(
    (state) => ({ page: state.page, total: state.total, limit: state.limit }),
    (oldData, newData) => JSON.stringify(oldData) == JSON.stringify(newData)
  )

  const _fetch = useStore(
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

export default FDataTablePagination
