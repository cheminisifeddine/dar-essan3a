import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "rgb(var(--color-bg-rgb, 247 242 233) / <alpha-value>)",
        ivory: "#FFFDF7",
        ink: "rgb(var(--color-text-rgb, 36 31 24) / <alpha-value>)",
        muted: "#6B6256",
        deepgreen: "rgb(var(--color-primary-rgb, 30 58 42) / <alpha-value>)",
        gold: "rgb(var(--color-secondary-rgb, 193 154 61) / <alpha-value>)",
        terracotta: "#B4552D",
      },
      fontFamily: {
        amiri: ["Amiri", "serif"],
        tajawal: ["Tajawal", "sans-serif"],
      },
      borderRadius: {
        arch: "160px 160px 16px 16px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(30,58,42,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
