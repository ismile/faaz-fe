import React, { memo, useRef } from 'react'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'

const tableComponentCreator = (config) => ({
  table: memo((props) => <Table {...props} />),
  header: {
    wrapper: memo((props) => <TableHead {...props} />),
    row: memo((props) => {
      return (
        <>
          <TableRow {...props} />
        </>
      )
    }),
    cell: memo((props, d) => {
      const {
        onResize,
        width,
        resizeable,
        children,
        Element,
        className,
        keyid,
        ...restProps
      } = props

      const [columnSetting] = config.useStore(
        (state) => [state.columnSetting[keyid], state._toggleColumn],
        (ps, ns) => ps[0] == ns[0]
      )
      if (Element) {
        return (
          <TableCell
            sx={{
              height: '4rem',
              display: !columnSetting?'none':'auto'
            }}
            {...restProps}
            width={width}
          >
            <Element />
          </TableCell>
        )
      }


      return (
        <TableCell
        sx={{
          height: '4rem',
          display: !columnSetting?'none':'auto'
        }}
          {...restProps}
          width={width}
        >
          <Box sx={{display: 'flex'}}>
            {children}
            <Box sx={{flex:1}} />
            {/* <ExpandLess style={{fontSize:10}} /> */}
          </Box>
        </TableCell>
      )
    }),
  },
  body: {
    wrapper: memo((props) => <TableBody {...props} />),
    row: memo((props) =><TableRow {...props} />),
    cell: memo((props) => {
      const [columnSetting] = config.useStore(
        (state) => [state.columnSetting[props.keyid], state._toggleColumn],
        (ps, ns) => ps[0] == ns[0]
      )
      return (
        <TableCell {...props} sx={{
          display: !columnSetting?'none':'auto'
        }} />
      )
    }),
  },
})

export default tableComponentCreator
