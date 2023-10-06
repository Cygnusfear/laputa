/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        ascent: ["Anton", "sans"],
      },
      fontSize: {
        xxs: "0.625rem",
      },
    },
  },
  plugins: [],
};
