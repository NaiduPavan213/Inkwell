/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        border: "rgb(var(--input-border) / <alpha-value>)",
        input: "rgb(var(--input-bg) / <alpha-value>)",
        ring: "var(--link-color)",
        background: "rgb(var(--bg-color) / <alpha-value>)",
        foreground: "rgb(var(--text-color) / <alpha-value>)",
        primary: {
          DEFAULT: "var(--button-primary-bg)",
          foreground: "var(--button-primary-text)",
        },
        secondary: {
          DEFAULT: "rgb(var(--input-bg) / <alpha-value>)",
          foreground: "rgb(var(--text-color) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "rgb(var(--input-bg) / <alpha-value>)",
          foreground: "var(--secondary-text)",
        },
        accent: {
          DEFAULT: "rgb(var(--input-bg) / <alpha-value>)",
          foreground: "rgb(var(--text-color) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--card-bg) / <alpha-value>)",
          foreground: "rgb(var(--text-color) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius, 8px)",
        md: "calc(var(--radius, 8px) - 2px)",
        sm: "calc(var(--radius, 8px) - 4px)",
      },
    },
  },
  plugins: [],
}
