/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        baky: {
          burgundy: '#5c162e',
          red: '#8b2b3a',
          cream: '#fdfbf5',
          dark: '#2c2c2c',
          gray: '#f4f4f5'
        }
      }
    },
  },
  plugins: [],
}
