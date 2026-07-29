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
        cream: "#F7F2E9",
        ivory: "#FFFDF7",
        ink: "#241F18",
        muted: "#6B6256",
        deepgreen: "#1E3A2A",
        gold: "#C19A3D",
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
