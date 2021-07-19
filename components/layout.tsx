import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { useState, memo } from 'react'
import clsx from 'clsx'
import InputBase from '@material-ui/core/InputBase'

import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import SettingsIcon from '@material-ui/icons/Settings'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Avatar from '@material-ui/core/Avatar'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Badge from '@material-ui/core/Badge'
import useSidebarStore from './hooks/useSidebarStore'

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
          <MenuItemView text={text} index={index} />
        ))}
      </List>
      <Divider />
      <List>
        {menu2.map((text, index) => (
          <MenuItemView text={text} index={index} />
        ))}
      </List>
    </>
  )
})

export default function Layout({ children }) {
  const classes = useStyles()
  const menu1 = ['Inbox', 'Starred', 'Send email', 'Drafts']
  const menu2 = ['All mail', 'Trash', 'Spam']
  const [open, _toggle] = useSidebarStore((store) => [
    store.open,
    store._toggle,
  ])

  return (
    <div className="flex w-full min-h-full absolute z-1000 top-0 left-0 overflow-hidden">
      <div className="w-full min-h-full z-1 flex flex-row">
        <AppBar
          position="fixed"
          color="primary"
          elevation={0}
          // className="z-3000 ml-60 right-0 left-0"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={_toggle}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">asd</Typography>
            <div className="flex-1" />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <IconButton
              className="ml-2"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx(classes.drawerPaper, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={clsx('flex flex-col')}>
            <div className="flex-1" />
            <List className={clsx('block', { 'mt-20': !open })}>
              <ListItem
                className={clsx({
                  'pl-2': !open,
                })}
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Remy Sharp"
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Arh-avatar.jpg"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Ismail Sunny"
                  secondary="Administrator"
                />
                <ListItemSecondaryAction
                  className={clsx({
                    'hidden ': !open,
                  })}
                >
                  <IconButton edge="end" aria-label="comments">
                    <SettingsIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <MenuView menu1={menu1} menu2={menu2} />
          </div>
          <Divider />
        </Drawer>
        <main className="w-full min-h-full bg-gray-100 block p-3 pl-0">
          <div
            className={clsx('w-full fixed top-0 left-0', classes.bg)}
            style={{ height: 184 }}
          ></div>
          <div className={clsx('h-full relative ml-3 flex flex-col')}>
            <div className="h-15"></div>
            <div className="flex-1">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

const drawerWidth = 210

const useStyles = makeStyles((theme) => ({
  bg: { background: theme.palette.primary.main },
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    // borderRight: 'none',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: '4rem',
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    height: 184,
    background: theme.palette.primary.main,
    // necessary for content to be below app bar
    // ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(255,255,255, .15)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255, .25)',
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    height: 36,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: 32,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))
