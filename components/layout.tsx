import Box from '@mui/material/Box'
import Drawer from './Drawer'
import Topbar from './Topbar'

export default function Layout({ children }) {
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
        <Topbar />
        <Drawer />
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
                height: '3.8rem',
              }}
            ></Box>
            <Box sx={{ flex: 1 }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
