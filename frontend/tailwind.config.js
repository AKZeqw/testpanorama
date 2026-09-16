/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crime: {
          950: '#07090e',
          900: '#0d1117',
          850: '#131822',
          800: '#1b2230',
          700: '#283347',
          red: '#dc2626',
          darkred: '#991b1b',
          crimson: '#e11d48'
        }
      }
    },
  },
  plugins: [],
}
