/** @type {import('tailwindcss').Config} */
import iconify from '@iconify/tailwind4'
// const { addIconSelectors } = require('@iconify/tailwind');

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {},
  },
  plugins: [iconify({
    prefixes: ['solar',"mdi-light"],
  })]
}