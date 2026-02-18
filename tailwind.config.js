/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E65555",
        "text-dark": "#1A1A1A",
        "text-light": "#666666",
      },
    },
  },
  plugins: [],
};
