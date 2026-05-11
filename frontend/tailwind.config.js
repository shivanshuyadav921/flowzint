/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 20px 50px rgba(15, 23, 42, 0.15)",
      },
      colors: {
        brand: {
          900: "#0b1120",
          800: "#11182b",
          700: "#171f38",
          500: "#5b52ff",
          400: "#7c6dff",
        },
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at top, rgba(91,82,255,0.18), transparent 40%), radial-gradient(circle at right, rgba(124,109,255,0.12), transparent 20%)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
