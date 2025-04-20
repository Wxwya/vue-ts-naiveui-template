/** @type {import('tailwindcss').Config} */
import { addIconSelectors} from '@iconify/tailwind'
// const { addIconSelectors,addDynamicIconSelectors } = require('@iconify/tailwind');

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {},
  },
  plugins: [
    addIconSelectors(['solar']),
  ]
}