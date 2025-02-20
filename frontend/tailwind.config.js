/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      margin: {

        '100': '100px',
        '200': '200px',
        '300': '300px',
        '150': '150px',
        '400': '400px',
        '450': '450px',
      },
    },
  },
  plugins: [],
}