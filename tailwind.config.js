/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'main-black': '#1D1D1D',
        'secondary-black': '#202020',
        'profile-color': '#FFF200',
        'custom-green': '#06D6A0',
        'custom-yellow': '#FCBF49',
        'custom-pink': '#EF476F',
        'custom-red': '#D90429',
      },
    },
  },
  plugins: [],
}