import IconButton from '@mui/material/IconButton'
import { useState, memo, useEffect } from 'react'
import InputBase from '@mui/material/InputBase'
import MuiDrawer from '@mui/material/Drawer'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import List from '@mui/material/List'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import PersonIcon from '@mui/icons-material/Person'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import useSidebarStore from './faaz/hooks/useSidebarStore'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import theme from '../configs/theme'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import DraftsIcon from '@mui/icons-material/Drafts'
import Avatar from '@mui/material/Avatar'
import LogoutIcon from '@mui/icons-material/Logout';

export default function Drawer() {
  const [open, _toggle, _set] = useSidebarStore((store) => [
    store.open,
    store._toggle,
    store._set,
  ])
  const { push, pathname } = useRouter()

  const pc = useMediaQuery(theme.breakpoints.up('md'))
  const tablet = useMediaQuery(theme.breakpoints.up('sm'))

  useEffect(() => {
    if (tablet && !pc) {
      _set(false)
    }

    if (pc) {
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
      <List sx={{ marginTop: 1, flex: 1 }} open={open}>
        <DrawerItem
          button
          selected={pathname == '/'}
          onClick={() => push('/')}
          secondaryAction={<Chip label="1" size="small" color="error" />}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="User" />
        </DrawerItem>
        <DrawerItem
          button
          selected={pathname == '/user'}
          onClick={() => push('/user')}
        >
          <ListItemIcon>
            <ChatBubbleIcon />
          </ListItemIcon>
          <ListItemText primary="Modal" />
        </DrawerItem>

        <Divider />

        <DrawerItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </DrawerItem>
        <DrawerItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </DrawerItem>
      </List>
      <Divider />
      <Box>
        <ListItem
          onClick={() => push('/')}
          secondaryAction={
            <IconButton edge="end" onClick={()=> push('/account/login')}>
              <LogoutIcon />
            </IconButton>
          }
        >
          <ListItemIcon>
            <Avatar
              variant="circular"
              alt="Remy Sharp"
              src="/static/images/avatar/2.jpg"
            />
          </ListItemIcon>
          <ListItemText primary="Peter Parker" secondary="Administrator" />
        </ListItem>
      </Box>
    </DrawerContainer>
  )
}

function DrawerContainer({ open, children }) {
  return (
    <>
      <DrawerCustom
        sx={{ display: { xs: 'none', sm: 'flex' } }}
        variant="permanent"
        open={open}
      >
        {children}
      </DrawerCustom>
      <MuiDrawer
        open={open}
        sx={{ display: { sm: 'none', xs: 'flex' }, width: 400 }}
      >
        <Box sx={{ width: drawerWidth }}>{children}</Box>
      </MuiDrawer>
    </>
  )
}

const drawerWidth = 210

const DrawerItem = styled(ListItem)(({ theme }) => ({
  // marginLeft: '0.8em',
  // marginRight: '0.8em',
  width: 'auto',
  // borderRadius: '4px',
  '&.Mui-selected': {
    borderLeft: '4px solid ' + theme.palette.primary.dark,
    // background: theme.palette.primary.main,
    color: theme.palette.text.primary,
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.dark,
  },
  '& .MuiListItemIcon-root': {
    minWidth: '2.7em',
  },
  '& .MuiChip-root': {
    borderRadius: '20px',
  },
}))

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
  ...(!open && {
    '& .MuiChip-root': {
      marginTop: '-20px',
      marginLeft: '20px',
      width: '20px',
      height: '20px',
      position: 'relative',
      zIndex: 1000,
    },
  }),
}))
