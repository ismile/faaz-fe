import React, { memo, useRef } from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import LinearProgress from '@material-ui/core/LinearProgress'
import clsx from 'clsx'

const tableComponentCreator = (config) => ({
  table: memo((props) => <Table {...props} />),
  header: {
    wrapper: memo((props) => <TableHead {...props} />),
    row: memo((props) => {
      return (
        <>
          <TableRow {...props} />
          {props.loading && (
            <LinearProgress
              style={{
                position: 'absolute',
                marginTop: '-4px',
                zIndex: 200,
                width: '100%',
              }}
            />
          )}
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
        keyId,
        ...restProps
      } = props

      const [columnSetting] = config.useStore(
        (state) => [state.columnSetting[keyId], state._toggleColumn],
        (ps, ns) => ps[0] == ns[0]
      )
      if (Element) {
        return (
          <TableCell
            className={clsx(className + ' h-16', { hidden: !columnSetting })}
            {...restProps}
            width={width}
          >
            <Element />
          </TableCell>
        )
      }

      return (
        <TableCell
          className={clsx(className + ' h-16', { hidden: !columnSetting })}
          {...restProps}
          width={width}
        >
          <div className="flex">
            {children}
            <div className="flex-1" />
            {/* <ExpandLess style={{fontSize:10}} /> */}
          </div>
        </TableCell>
      )
    }),
  },
  body: {
    wrapper: memo((props) => <TableBody {...props} className={'asdasdsdad'} />),
    row: memo((props) => <TableRow {...props} />),
    cell: memo((props) => {
      const [columnSetting] = config.useStore(
        (state) => [state.columnSetting[props.keyId], state._toggleColumn],
        (ps, ns) => ps[0] == ns[0]
      )
      return <TableCell {...props} className={clsx(props.className, {'hidden': !columnSetting})} />
    }),
  },
})

export default tableComponentCreator
