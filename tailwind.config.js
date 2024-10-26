/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Monospace']
      },
      colors: {
        'pink-hippo': '#fae0eb',
        'magenta-hippo': '#ac316a',
        'magenta-dark-hippo': '#4a152e',
      },
    }
  },
  plugins: [],
}