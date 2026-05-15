/** @type {import('tailwindcss').Config} */
const { addIconSelectors } = require('@iconify/tailwind');

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {},
  },
  plugins: [addIconSelectors(['solar'])]
}