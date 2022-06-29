import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import IconButtonMenu from '../../mui/IconButtonMenu'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import queryString from 'query-string'
import immer from 'immer'
import RemoveIcon from '@mui/icons-material/Remove'

export default function TableHeaderCell({
  className,
  column,
  columnIndex,
  container,
  ...props
}) {
  return (
    <>
      <div className={className}>{column.title}</div>
      <IconButtonMenu
        size="small"
        className="header-cell-menu"
        sx={{ order: 2, height: 31 }}
        Menus={({ onClose }) => {
          const [sort, order, columns] =
            container.props.headerCellProps.useStore(
              (state) => [state.sort, state.order, state.columns],
              (ps, ns) => JSON.stringify(ps) == JSON.stringify(ns)
            )
          const _setColumns = container.props.headerCellProps.useStore(
            (state) => state._setColumns,
            (o, n) => true
          )

          const _handleSort = (ev, order) => {
            var query = queryString.parse(window.location.hash)
            if (!query) query = {}
            query.sort = column.key
            query.order = order
            window.location.hash = '#' + queryString.stringify(query)
            onClose(ev)
          }

          const _handeFreeze = (ev, position) => {
            _setColumns(
              immer(columns, (d) => {
                if (position) {
                  d.find((x) => x.key === column.key).frozen = position
                } else {
                  delete d.find((x) => x.key === column.key).frozen
                }
              })
            )
            onClose(ev)
          }

          return (
            <>
              <IconButtonMenu.Item
                disabled={sort === column.key && order === 'asc'}
                onClick={(ev) => _handleSort(ev, 'asc')}
              >
                <IconButtonMenu.ListItemIcon>
                  <ArrowUpwardIcon />
                </IconButtonMenu.ListItemIcon>
                <IconButtonMenu.ListItemText>
                  Sort Ascending
                </IconButtonMenu.ListItemText>
              </IconButtonMenu.Item>
              <IconButtonMenu.Item
                disabled={sort === column.key && order === 'desc'}
                onClick={(ev) => _handleSort(ev, 'desc')}
              >
                <IconButtonMenu.ListItemIcon>
                  <ArrowDownwardIcon />
                </IconButtonMenu.ListItemIcon>
                <IconButtonMenu.ListItemText>
                  Sort Descending
                </IconButtonMenu.ListItemText>
              </IconButtonMenu.Item>
              <IconButtonMenu.Divider />
              <IconButtonMenu.Item
                disabled={column.frozen == 'left'}
                onClick={(ev) => _handeFreeze(ev, 'left')}
              >
                <IconButtonMenu.ListItemIcon>
                  <ArrowLeftIcon />
                </IconButtonMenu.ListItemIcon>
                <IconButtonMenu.ListItemText>
                  Pin Left
                </IconButtonMenu.ListItemText>
              </IconButtonMenu.Item>
              <IconButtonMenu.Item
                disabled={column.frozen == 'right'}
                onClick={(ev) => _handeFreeze(ev, 'right')}
              >
                <IconButtonMenu.ListItemIcon>
                  <ArrowRightIcon />
                </IconButtonMenu.ListItemIcon>
                <IconButtonMenu.ListItemText>
                  Pin Right
                </IconButtonMenu.ListItemText>
              </IconButtonMenu.Item>
              <IconButtonMenu.Item
                disabled={!column.frozen}
                onClick={(ev) => _handeFreeze(ev, null)}
              >
                <IconButtonMenu.ListItemIcon>
                  <RemoveIcon />
                </IconButtonMenu.ListItemIcon>
                <IconButtonMenu.ListItemText>
                  No Pin
                </IconButtonMenu.ListItemText>
              </IconButtonMenu.Item>
            </>
          )
        }}
      >
        <MoreVertIcon />
      </IconButtonMenu>
    </>
  )
}
