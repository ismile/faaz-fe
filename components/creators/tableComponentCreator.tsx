import React, { memo, useRef } from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TinyTransition from 'react-tiny-transition'

import clsx from 'clsx'
import tw, { css } from 'twin.macro'
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
            css={[className, tw`h-16`, !columnSetting && tw`hidden`]}
            {...restProps}
            width={width}
          >
            <Element />
          </TableCell>
        )
      }

      return (
        <TableCell
          css={[className, tw`h-16`, !columnSetting && tw`hidden`]}
          {...restProps}
          width={width}
        >
          <div tw="flex">
            {children}
            <div tw="flex-1" />
            {/* <ExpandLess style={{fontSize:10}} /> */}
          </div>
        </TableCell>
      )
    }),
  },
  body: {
    wrapper: memo((props) => <TableBody {...props} />),
    row: memo((props) => <TinyTransition duration={800}><TableRow {...props} /></TinyTransition>),
    cell: memo((props) => {
      const [columnSetting] = config.useStore(
        (state) => [state.columnSetting[props.keyid], state._toggleColumn],
        (ps, ns) => ps[0] == ns[0]
      )
      return (
        <TableCell {...props} css={[props.className, !columnSetting && tw`hidden`]} />
      )
    }),
  },
})

export default tableComponentCreator
