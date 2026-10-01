import { Opacity } from "@mui/icons-material";

const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        jersey: ['"Jersey 25"', "sans-serif"],
      },
      fontSize: {
        display: ["36px", { lineHeight: "42px", letterSpacing: "-0.02em", fontWeight: "600" }],
        title: ["28px", { lineHeight: "34px", letterSpacing: "-0.02em", fontWeight: "600" }],
        heading: ["18px", { lineHeight: "26px", fontWeight: "600" }],
        "card-title": ["17px", { lineHeight: "24px", fontWeight: "600" }],
        body: ["14px", { lineHeight: "22px" }],
        small: ["13px", { lineHeight: "19px" }],
        meta: ["12px", { lineHeight: "16px" }],
      },
      colors: {
        canvas: token("canvas"),
        surface: { DEFAULT: token("surface"), muted: token("surface-muted") },
        hairline: { DEFAULT: token("hairline"), strong: token("hairline-strong") },
        ink: { DEFAULT: token("ink"), secondary: token("ink-secondary"), muted: token("ink-muted") },
        positive: { DEFAULT: token("positive"), bg: token("positive-bg") },
        warning: { DEFAULT: token("warning"), bg: token("warning-bg") },
        danger: { DEFAULT: token("danger"), bg: token("danger-bg") },
        "pink-hippo": "#fae0eb",
        "magenta-hippo": "#ac316a",
        "magenta-dark-hippo": "#4a152e",
        "transparent-white": "rgba(239, 239, 239, 0.7)",
        "transparent-white-md": "rgba(239, 239, 239, 0.9)",
        "violet-100": "#F1E9FF",
        "magenta-100": "#EADDFF",
        "light-color": "#EBDEFF",
        "violet-300": "#E2CFFF",
        "violet-400": "#DCC5FF",
        "dark-color": "#D3B7FF",
        "violet-600": "#C0A7E8",
        "violet-700": "#9682B5",
        "card-highlight": "#7E55B2",
        "tag-dark-color": "#9E63FF",
        "bookmark-color": "#21272A",
        "grey-blue-color": "#6D758F",
        "nav-border-color": "#DDE1E6",
        "learn-more-color": "#c9c8c8",
        "brand-50": "#f5efff",
        "brand-300": "#be96ff",
        "brand-400": "#b182ff",
        "brand-500": "#9e63ff",
        "brand-600": "#905ae8",
      },
      borderRadius: {
        surface: "14px",
        control: "10px",
        chip: "6px",
      },
      boxShadow: {
        "card-hover": "0 1px 2px rgb(24 24 27 / 0.04), 0 4px 16px rgb(24 24 27 / 0.06)",
        popover: "0 8px 24px rgb(24 24 27 / 0.10), 0 2px 6px rgb(24 24 27 / 0.06)",
        accent: "inset 0 1px 0 rgb(255 255 255 / 0.12), 0 1px 2px rgb(24 24 27 / 0.24), 0 4px 12px rgb(24 24 27 / 0.18)",
      },
      spacing: {
        nav: "var(--nav-h)",
      },
      backgroundImage: {
        accent: "linear-gradient(180deg, #3F3F46 0%, #18181B 100%)",
        "hippo-bg": "url(/src/assets/images/Hippo_Planet.png)",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-100%) scaleY(1.25) scaleX(1.20)" },
          "100%": { transform: "translateX(0%) scaleY(1.25) scaleX(1.20)" },
        },
        dropIn: {
          "0%": { opacity: "0", transform: "translateY(-6px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        slidingIn: "slideIn 0.5s linear",
        dropIn: "dropIn 160ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
