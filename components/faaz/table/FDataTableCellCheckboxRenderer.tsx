import React from 'react'
import Checkbox from '@mui/material/Checkbox'

export const FDataTableHeaderCheckboxRenderer = ({ column, useStore }) => {
  const [isAllSelected, _handleSelectAll] = useStore((state) => [
    state.isAllSelected,
    state._handleSelectAll,
  ])
  return (
    <Checkbox
      key={`check-all`}
      sx={{ padding: 0 }}
      checked={isAllSelected}
      onChange={_handleSelectAll}
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />
  )
}

export const FDataTableCellCheckboxRenderer = ({ rowData, rowIndex, useStore, rowKey }) => {
  const [selected, _handleSingleSelect] = useStore((state) => [
    state.selected,
    state._handleSingleSelect,
  ])
  return (
    <Checkbox
      key={`checkbox-${rowData[rowKey]}`}
      sx={{ padding: 0 }}
      checked={!!selected[rowData[rowKey]]}
      onChange={function (ev, val) {
        _handleSingleSelect(rowData, val)
      }}
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />
  )
}

export default FDataTableCellCheckboxRenderer
