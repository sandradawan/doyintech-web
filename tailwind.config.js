/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        background: "#0B0E14",
        surface: "#121826",
        primary: "#3B82F6",
        accent: "#22D3EE",
      },
    },
  },
  plugins: [],
};
