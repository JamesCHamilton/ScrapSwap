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
        scrap: {
          100: "#e8efe7",
          200: "#cddccf",
          500: "#55ab6d",
          600: "#3a8a52",
          700: "#2a7040",
          800: "#1f5a30",
          850: "#1a4b27",
          900: "#164022",
          950: "#12351c",
        },
        cream: {
          50: "#f5f1e8",
          100: "#efe8dc",
          200: "#e4d8c6",
          300: "#d7c6aa",
          400: "#c9b28b",
        },
        ink: {
          300: "#95a39a",
          600: "#3a473f",
          800: "#1d241f",
          950: "#0c0f0d",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
    },
  },
  plugins: [],
};
export default config;
