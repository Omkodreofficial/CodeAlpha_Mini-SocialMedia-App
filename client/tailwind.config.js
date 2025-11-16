/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#00A79D",
        like: "#E0245E",
        offwhite: "#F8F9FA",
        textdark: "#212529",
        textgray: "#6C757D",
        bordergray: "#E9ECEF",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};
