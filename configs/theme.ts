import {createTheme} from '@mui/material/styles'
import {lightBlue, amber} from '@mui/material/colors'

// Create a theme instance.
const theme = createTheme({
  spacing: (factor) => `${0.25 * factor}rem`,
  palette: {
    primary: lightBlue,
    secondary: amber,
    background: {
      default: '#fff',
    },
  },
  shape: {
    borderRadius: 0,
  },
})

export default theme

