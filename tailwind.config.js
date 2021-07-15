const colors = require('./configs/colors')


module.exports = {
  purge: {
    purge: true,
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: colors,
      zIndex: {
        '1': 1,
        '1000': 1000,
        '3000': 3000
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
