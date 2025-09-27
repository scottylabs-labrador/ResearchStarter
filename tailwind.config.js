import { Opacity } from "@mui/icons-material";

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
        "light-color": "#EBDEFF;",
        "dark-color": "#D3B7FF",
        "shadow-color": "#C5A2FF",
        "search-bar-color": "#C9C9C9",
        "filter-section-color": "#E2CFFF",
        "tag-dark-color": "#9E63FF",
        "bookmark-color": "#21272A",
        "grey-blue-color": "#6D758F",
        "nav-border-color": "#DDE1E6",
        "learn-more-color": "#c9c8c8",
      },
      backgroundImage: {
        "hippo-bg": "url(/src/assets/images/Hippo_Planet.png)",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        slidingIn: "slideIn 0.5s linear",
      },
    },
  },
  plugins: [],
};
