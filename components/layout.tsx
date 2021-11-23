import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { useState, memo } from 'react'
import InputBase from '@mui/material/InputBase'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import useSidebarStore from './hooks/useSidebarStore'
import Box from '@mui/material/Box'

const MenuItemView = memo(function ({ text, index }) {
  return (
    <ListItem button key={text}>
      <ListItemIcon>
        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  )
})

const MenuView = memo(function ({ menu1, menu2 }) {
  return (
    <>
      <List>
        {menu1.map((text, index) => (
          <MenuItemView key={text} text={text} index={index} />
        ))}
      </List>
      <Divider />
      <List>
        {menu2.map((text, index) => (
          <MenuItemView key={text} text={text} index={index} />
        ))}
      </List>
    </>
  )
})

export default function Layout({ children }) {
  const classes = {}
  const menu1 = ['Inbox', 'Starred', 'Send email', 'Drafts']
  const menu2 = ['All mail', 'Trash', 'Spam']
  const [open, _toggle] = useSidebarStore((store) => [
    store.open,
    store._toggle,
  ])

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '100%',
        position: 'absolute',
        zIndex: 1000,
        top: 0,
        left: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          minHeight: '100%',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <AppBar elevation={0} position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={_toggle}
              edge="start"
              sx={{
                marginLeft: '6px',
                marginRight: '22px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              FAAZ FE
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={_toggle}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
          sx={{
            width: '100%',
            minHeight: '100%',
            background: 'rgb(243, 244, 246)',
            display: 'block',
            padding: '0.75rem',
            paddingLeft: 0,
          }}
        >
          <Box
            sx={{
              width: '100%',
              position: 'fixed',
              top: 0,
              left: 0,
              bgcolor: 'primary.main',
            }}
            style={{ height: 184 }}
          ></Box>
          <Box
            sx={{
              height: '100%',
              position: 'relative',
              marginLeft: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                height: '3.8rem'
              }}
            ></Box>
            <Box sx={{ flex: 1 }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
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
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const BGDiv = styled('div')(({ theme }) => ({
  background: theme.palette.primary.main,
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
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
