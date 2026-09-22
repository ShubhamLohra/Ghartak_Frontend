/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0F0F14",
          surface: "#181822",
          card: "#1E1E2A",
          border: "#2A2A3C",
          gold: "#F59E0B",
          yellow: "#EAB308",
          amber: "#F59E0B",
          goldLight: "#FBBF24",
          accent: "#FFB703"
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        goldGlow: "0 0 25px rgba(245, 158, 11, 0.3)",
        cardGlow: "0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 15px rgba(245, 158, 11, 0.1)"
      }
    },
  },
  plugins: [],
}
