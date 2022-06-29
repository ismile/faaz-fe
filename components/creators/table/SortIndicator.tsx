import React from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import IconButton from '@mui/material/IconButton'

export default function SortIndicator({ sortOrder, className }) {
  return sortOrder === 'asc' ? (
    <div className={className}>
      <IconButton size="small">
        <ArrowUpwardIcon />
      </IconButton>
    </div>
  ) : (
    <div className={className}>
      <IconButton size="small">
        <ArrowDownwardIcon />
      </IconButton>
    </div>
  )
}
