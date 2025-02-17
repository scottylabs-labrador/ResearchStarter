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
        'transparent-white': 'rgba(239, 239, 239, 0.7)',
        'transparent-white-md': 'rgba(239, 239, 239, 0.9)',
      },
      backgroundImage: {
        'hippo-bg': "url(/src/assets/images/Hippo_Planet.png)"
      }
    }
  },
  plugins: [],
}