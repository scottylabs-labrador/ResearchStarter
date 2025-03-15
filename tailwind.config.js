/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        sans: ["Monospace"],
      },
      colors: {
        "pink-hippo": "#fae0eb",
        "magenta-hippo": "#ac316a",
        "magenta-dark-hippo": "#4a152e",
        "transparent-white": "rgba(239, 239, 239, 0.7)",
        "transparent-white-md": "rgba(239, 239, 239, 0.9)",
        "light-color": "#D9D9D9;",
        "dark-color": "#b9b9b9",
        "shadow-color": "#a8a8a8",
        "search-bar-color": "#C9C9C9",
        "filter-section-color": "#999898",
        "tag-dark-color": "#767676",
        "bookmark-color": "##21272A",
        "grey-blue-color": "#6D758F",
        "nav-border-color": "#DDE1E6",
      },
      backgroundImage: {
        "hippo-bg": "url(/src/assets/images/Hippo_Planet.png)",
      },
    },
  },
  plugins: [],
};
