import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const FToolbar = ({ title, actions = [] }) => {
  return (
    <Toolbar className="animate__animated animate__delay-200ms animate__faster animate__fadeInDown">
      <Box sx={{ flex: 1, display: { xs: 'none', sm: 'flex' } }} />
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Box sx={{ flex: 1, display: 'flex' }}>
        <Box sx={{ flex: 1 }} />
        {actions.map((d, i) => {
          return (
            <Button
              key={i}
              color={d.color}
              variant={d.variant}
              onClick={d.onClick}
              startIcon={d.icon}
              sx={d.sx}
            >
              {d.text}
            </Button>
          )
        })}
      </Box>
    </Toolbar>
  )
}

export default FToolbar
