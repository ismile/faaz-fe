import {createTheme} from '@mui/material/styles'
import {lightBlue, amber} from '@mui/material/colors'

// Create a theme instance.
export const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', Raleway, Arial",
  },
  spacing: (factor) => `${0.25 * factor}rem`,
  palette: {
    primary: lightBlue,
    secondary: amber,
    background: {
      default: 'rgb(243, 244, 246)',
      paper: '#fff',
    },
  },
  shape: {
    borderRadius: 0,
  },
})

theme.palette.background.default

export const themeDark = createTheme({
  typography: {
    fontFamily: "'Roboto', Raleway, Arial",
  },
  palette: {
    mode: 'dark',
    primary: lightBlue,
    secondary: amber,
    background: {
      // default: '#fff',
    },
  },
  shape: {
    borderRadius: 0,
  },
})



export default theme

