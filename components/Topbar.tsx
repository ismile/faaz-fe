import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import SearchBar from './others/SearchBar'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import useSidebarStore from './hooks/useSidebarStore'

export default function () {
  const [open, _toggle] = useSidebarStore((store) => [
    store.open,
    store._toggle,
  ])

  return (
    <AppBar elevation={1} position="fixed" open={open} color="secondary">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={_toggle}
          edge="start"
          sx={{
            marginLeft: '6px',
            marginRight: '22px',
            // ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          FAAZ FE
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: { xs: 'none', md: 'flex' }, height: 40 }}>
          <SearchBar />
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex', paddingRight: 2 } }}>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
            sx={{ mx: 2 }}
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Tooltip title="Open settings">
            <IconButton sx={{ p: 0, mx: 2 }}>
              <Avatar
                variant="circular"
                alt="Remy Sharp"
                src="/static/images/avatar/2.jpg"
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

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
    // marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))
