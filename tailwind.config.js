/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mcw: {
          red: '#FF0000',
          black: '#000000',
          gray: '#666666',
          lightgray: '#f5f5f5',
          darkgray: '#333333',
        },
      },
      fontFamily: {
        verdana: ['Verdana', 'sans-serif'],
        calibri: ['Calibri', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

