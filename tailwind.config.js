/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        cardShadow: "0 0 10px 1px rgba(0, 0, 0, 0.25)",
        buttonShadow:
          "0 0 5px #47aeee,0 0 6px #47aeee,0 0 26px #47aeee,0 0 28px #47aeee",
      },
    },
  },
  plugins: [],
};