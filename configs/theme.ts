import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import red from '@material-ui/core/colors/red'

// Create a theme instance.
const theme = createMuiTheme({
  spacing: (factor) => `${0.25 * factor}rem`,
  palette: {
    primary: red,
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  shape: {
    borderRadius: 0,
  },
})

export default theme
