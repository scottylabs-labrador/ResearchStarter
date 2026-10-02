const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      // Whole-pixel sizes and leading; tracking tightens as size grows, following Geist's own scale.
      fontSize: {
        display: ["36px", { lineHeight: "40px", letterSpacing: "-0.03em", fontWeight: "600" }],
        title: ["28px", { lineHeight: "32px", letterSpacing: "-0.025em", fontWeight: "600" }],
        heading: ["18px", { lineHeight: "24px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "card-title": ["16px", { lineHeight: "22px", letterSpacing: "-0.01em", fontWeight: "600" }],
        lead: ["15px", { lineHeight: "22px" }],
        body: ["14px", { lineHeight: "20px" }],
        small: ["13px", { lineHeight: "18px" }],
        meta: ["12px", { lineHeight: "16px" }],
      },
      maxWidth: {
        // About 85 characters of Geist at any size; `ch` overshoots because Geist's zero is wide.
        measure: "40em",
      },
      colors: {
        canvas: token("canvas"),
        surface: { DEFAULT: token("surface"), muted: token("surface-muted") },
        hairline: { DEFAULT: token("hairline"), strong: token("hairline-strong") },
        ink: { DEFAULT: token("ink"), secondary: token("ink-secondary"), muted: token("ink-muted") },
        accent: {
          DEFAULT: token("accent"),
          strong: token("accent-strong"),
          muted: token("accent-muted"),
          bg: token("accent-bg"),
        },
        positive: { DEFAULT: token("positive"), bg: token("positive-bg") },
        warning: { DEFAULT: token("warning"), bg: token("warning-bg") },
        danger: { DEFAULT: token("danger"), bg: token("danger-bg") },
      },
      borderRadius: {
        surface: "14px",
        control: "10px",
        chip: "6px",
      },
      boxShadow: {
        "card-hover":
          "0 1px 2px rgb(98 132 158 / 0.06), 0 4px 18px rgb(98 132 158 / 0.10), 0 12px 32px rgb(164 186 204 / 0.14)",
        popover: "0 8px 24px rgb(24 24 27 / 0.10), 0 2px 6px rgb(24 24 27 / 0.06)",
        accent: "0 1px 2px rgb(72 107 132 / 0.12)",
      },
      spacing: {
        nav: "var(--nav-h)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
        drawer: "var(--ease-drawer)",
      },
      keyframes: {
        dropIn: {
          "0%": { opacity: "0", transform: "translateY(-6px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        dropIn: "dropIn 160ms var(--ease-out) forwards",
        fadeIn: "fadeIn 150ms var(--ease-out) forwards",
      },
    },
  },
  plugins: [],
};
