/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B35",
        secondary: "#2EC4B6",
        dark: "#1A1A2E",
        warning: "#E71D36",
      },
    },
  },
  plugins: [],
};
