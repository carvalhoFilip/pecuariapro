import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        verde: {
          50: "var(--verde-50)",
          100: "var(--verde-100)",
          200: "var(--verde-200)",
          500: "var(--verde-500)",
          600: "var(--verde-600)",
          700: "var(--verde-700)",
          800: "var(--verde-800)",
          900: "var(--verde-900)",
        },
        terra: {
          50: "var(--terra-50)",
          100: "var(--terra-100)",
          200: "var(--terra-200)",
          400: "var(--terra-400)",
          600: "var(--terra-600)",
          800: "var(--terra-800)",
          900: "var(--terra-900)",
          950: "var(--terra-950)",
        },
        danger: "var(--danger)",
        warning: "var(--warning)",
        info: "var(--info)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06)",
        sidebar: "4px 0 24px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
