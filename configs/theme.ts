import {createTheme} from '@material-ui/core/styles'
import {lightBlue, amber} from '@material-ui/core/colors'

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

