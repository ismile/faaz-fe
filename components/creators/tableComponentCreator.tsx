import React, { memo, useEffect, useRef, useState } from 'react'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import queryString from 'query-string'
import { useHash } from '../../components/others/react-use/useHash'
import IconButtonMenu from '../mui/IconButtonMenu'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import immer from 'immer'

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

      const [columnSetting, _toggleColumn, columnMap, _setColumns] = config.useStore(
        (state) => [state.columnSetting[keyid], state._toggleColumn, state.columnMap, state._setColumns],
        (ps, ns) => JSON.stringify(ps[2]) == JSON.stringify(ns[2]),
      )
      const [hash, setHash] = useHash()
      const [order, setOrder] = useState(null)

      useEffect(() => {
        let query = queryString.parse(hash)
        if (query.sort === keyid) {
          setOrder(query.order)
        } else {
          setOrder(null)
        }
      }, [hash])

      const handleSetOrder = (order) => {
        let query = queryString.parse(hash)
        query.sort = keyid
        query.order = order
        setHash(queryString.stringify(query))
      }

      const setPin = (pin) => {
        const map = immer(columnMap, (d) => {
          d[keyid].fixed = pin
        })
        _setColumns(Object.keys(map).map(k => map[k]))
      }

      if (Element) {
        return (
          <TableCell
            sx={{
              height: '4em',
              display: !columnSetting ? 'none' : 'auto',
            }}
            className={className}
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
            height: '4em',
            display: !columnSetting ? 'none' : 'auto',
          }}
          className={className}
          {...restProps}
          width={width}
        >
          <Box
            sx={{
              display: 'flex',
              '& .hidden-button': {
                display: 'none',
              },
              '&:hover .hidden-button': {
                display: 'flex',
              },
              lineHeight: '2em',
            }}
          >
            {children}
            <Box sx={{ flex: 1 }} />
            <Stack
              direction="row"
              alignItems="right"
              spacing={0}
              sx={{ position: 'absolute', right: 0 }}
            >
              <SortButton value={order} onChange={handleSetOrder} />
              <IconButtonMenu
                size="small"
                className="hidden-button"
                dense={true}
                Menus={({ onClose }) => {
                  return (
                    <>
                      <IconButtonMenu.Item
                        onClick={() => {
                          handleSetOrder('ASC')
                          onClose()
                        }}
                        disabled={order === 'ASC'}
                      >
                        <IconButtonMenu.ListItemIcon>
                          <ArrowUpwardIcon fontSize="inherit" />
                        </IconButtonMenu.ListItemIcon>
                        <IconButtonMenu.ListItemText>
                          Sort Ascending
                        </IconButtonMenu.ListItemText>
                      </IconButtonMenu.Item>
                      <IconButtonMenu.Item
                        onClick={() => {
                          handleSetOrder('DESC')
                          onClose()
                        }}
                        disabled={order === 'DESC'}
                      >
                        <IconButtonMenu.ListItemIcon>
                          <ArrowDownwardIcon fontSize="inherit" />
                        </IconButtonMenu.ListItemIcon>
                        <IconButtonMenu.ListItemText>
                          Sort Descending
                        </IconButtonMenu.ListItemText>
                      </IconButtonMenu.Item>
                      <IconButtonMenu.Divider />
                      <IconButtonMenu.Item onClick={()=> {
                        setPin('left');
                        onClose();
                      }} disabled={columnMap[keyid].fixed == 'left'}>
                        <IconButtonMenu.ListItemIcon>
                          <ArrowCircleLeftIcon fontSize="inherit" />
                        </IconButtonMenu.ListItemIcon>
                        <IconButtonMenu.ListItemText>
                          Pin Left
                        </IconButtonMenu.ListItemText>
                      </IconButtonMenu.Item>
                      <IconButtonMenu.Item onClick={()=> {
                        setPin('right');
                        onClose();
                      }} disabled={columnMap[keyid].fixed == 'right'}>
                        <IconButtonMenu.ListItemIcon>
                          <ArrowCircleRightIcon fontSize="inherit" />
                        </IconButtonMenu.ListItemIcon>
                        <IconButtonMenu.ListItemText>
                          Pin Right
                        </IconButtonMenu.ListItemText>
                      </IconButtonMenu.Item>
                      <IconButtonMenu.Item onClick={()=> {
                        setPin(null);
                        onClose();
                      }} disabled={!columnMap[keyid].fixed}>
                        <IconButtonMenu.ListItemIcon>
                          <RemoveCircleIcon fontSize="inherit" />
                        </IconButtonMenu.ListItemIcon>
                        <IconButtonMenu.ListItemText>
                          No Pin
                        </IconButtonMenu.ListItemText>
                      </IconButtonMenu.Item>
                    </>
                  )
                }}
              >
                <MoreVertIcon fontSize="inherit" />
              </IconButtonMenu>
            </Stack>
          </Box>
        </TableCell>
      )
    }),
  },
  body: {
    wrapper: memo((props) => <TableBody {...props} />),
    row: memo((props) => <TableRow {...props} />),
    cell: memo((props) => {
      const [columnSetting] = config.useStore(
        (state) => [state.columnSetting[props.keyid], state._toggleColumn],
        (ps, ns) => ps[0] == ns[0]
      )
      return (
        <TableCell
          {...props}
          sx={{
            display: !columnSetting ? 'none' : 'auto',
          }}
        />
      )
    }),
  },
})

const SortButton = ({ value, onChange }) => {
  return (
    <IconButton
      size="small"
      className={value != null ? null : 'hidden-button'}
      onClick={() => {
        switch (value) {
          case 'ASC':
            onChange('DESC')
            return
          case 'DESC':
            onChange('ASC')
            return
          default:
            onChange('DESC')
            return
        }
      }}
    >
      {value == 'DESC' ? (
        <ArrowUpwardIcon fontSize="inherit" />
      ) : (
        <ArrowDownwardIcon fontSize="inherit" />
      )}
    </IconButton>
  )
}

export default tableComponentCreator
