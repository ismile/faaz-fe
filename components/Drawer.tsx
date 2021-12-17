import IconButton from '@mui/material/IconButton'
import { useState, memo, useEffect } from 'react'
import InputBase from '@mui/material/InputBase'
import MuiDrawer from '@mui/material/Drawer'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import TableChartIcon from '@mui/icons-material/TableChart'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import useSidebarStore from './hooks/useSidebarStore'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery';
import theme from '../configs/theme'

export default function Drawer() {
  const [open, _toggle, _set] = useSidebarStore((store) => [
    store.open,
    store._toggle,
    store._set
  ])
  const { push } = useRouter()

  const pc = useMediaQuery(theme.breakpoints.up("md"));
  const tablet = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if(tablet && !pc) {
      _set(false)
    }

    if(pc) {
      _set(true)
    }

  }, [tablet, pc])

  return (
    <DrawerContainer open={open}>
      <DrawerHeader>
        <IconButton onClick={_toggle}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem button onClick={() => push('/')}>
          <ListItemIcon>
            <TableChartIcon />
          </ListItemIcon>
          <ListItemText primary="Data Grid" />
        </ListItem>
        <ListItem button onClick={() => push('/sample-dialog')}>
          <ListItemIcon>
            <ChatBubbleIcon />
          </ListItemIcon>
          <ListItemText primary="Modal" />
        </ListItem>
      </List>
    </DrawerContainer>
  )
}

function DrawerContainer({ open, children }) {
  return (
    <>
      <DrawerCustom
        sx={{ display: { xs: 'none', sm: 'block' } }}
        variant="permanent"
        open={open}
      >
        {children}
      </DrawerCustom>
      <MuiDrawer
        open={open}
        sx={{ display: { sm: 'none', xs: 'block' }, width: 400 }}
      >
        <Box sx={{ width: drawerWidth }}>{children}</Box>
      </MuiDrawer>
    </>
  )
}

const drawerWidth = 210

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `4rem`,
  [theme.breakpoints.up('sm')]: {
    width: `4rem`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  backgroundColor: theme.palette.secondary.main,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const DrawerCustom = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))
