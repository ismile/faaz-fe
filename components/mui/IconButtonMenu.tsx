import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import Divider from '@mui/material/Divider'
import MenuList from '@mui/material/MenuList'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

export default function IconButtonMenu({
  children,
  Menus,
  sx,
  size,
  className,
  dense,
  style,
  menus = [],
  data,
}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (event) => {
    event.stopPropagation()
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={sx}
        size={size}
        className={className}
        style={style}
      >
        {children}
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        dense={dense}
      >
        {Menus && <Menus onClose={handleClose} />}

        {menus.map((d, i) => {
          let disabled: boolean = false
          if (typeof d.disabled == 'function') disabled = d.disabled(data)
          if (d.type === 'divider') return <Divider/>
          return (
            <MenuItem
              key={i}
              disabled={disabled}
              onClick={() => d.action(data)}
            >
              <ListItemIcon>
                <d.icon fontSize="small" />
              </ListItemIcon>
              {d.label}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

IconButtonMenu.Item = MenuItem
IconButtonMenu.Divider = Divider
IconButtonMenu.ListItemIcon = ListItemIcon
IconButtonMenu.ListItemText = ListItemText
