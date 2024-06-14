const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',

  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Arial', 'Helvetica', 'sans-serif']
      },
      textColor: theme => theme('colors'),
      textColor: {
        primary: '#00C2B8',
        secondary: '#828282',
        dark: '#565E6D',
        'green-bar': '#00C2B8',
        'red-bar': '#FD4D4D',
        'blue-bar': '#0095FF',
        'rank-air': '#809DED',
        warning: '#FFBC29',
        orange: '#F2994A',
        green: '#56B00F',
        blue: '#56CCF2',
        'key-card-gray': "#6D6D6D",
        'value-card-gray': "#A9A9A9",
        'yellow-status': "#FFBC29",
        'light-yellow-status': "#FFBC2954",
        'dark-yellow-status': "#F46E23",
        'red-status': '#F03030',
        'light-red-status': "#F0303026",
        'key-card': '#6D6D6D',
        danger: '#F03030'
      },
      backgroundImage: {
        'index-bg': "url('/img/bg_login.png')",
      },
      backgroundColor: {
        primary: '#00C2B8',
        secondary: '#809DED',
        warning: '#F9BE00',
        danger: '#E1221C',
        light: '#F5F5F5',
        dark: '#565E6D',
        'green-bar': '#00C2B8',
        'red-bar': '#FD4D4D',
        'blue-bar': '#0095FF',
        orange: '#F89C22',
        green: '#56B00F',
        blue: '#88D3E6',
        lemon: '#C3D311',
        'light-gray-status': "#F0F0F0",
        'yellow-status': "#FFBC29",
        'light-yellow-status': "#FFBC2954",
        'red-status': '#F03030',
        'light-red-status': "#F0303026",
        table: "#FAFAFA",
        'table-head': "#F0F0F0",
      },
      borderColor: {
        primary: '#00C2B8',
        secondary: '#809DED',
        warning:"#F9BE00"
      },
      screens: {
        'xs': '475px',
        '919': '919px',
        '1050': '1050px',
      }
    },
  },
  plugins: [],
}
