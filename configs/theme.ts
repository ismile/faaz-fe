import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import color from '@material-ui/core/colors/lightBlue'
import colorSec from '@material-ui/core/colors/amber'

// Create a theme instance.
const theme = createMuiTheme({
  spacing: (factor) => `${0.25 * factor}rem`,
  palette: {
    primary: color,
    secondary: colorSec,
    background: {
      default: '#fff',
    },
  },
  shape: {
    borderRadius: 0,
  },
})

export default theme
