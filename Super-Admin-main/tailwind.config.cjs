/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Montserrat: "Montserrat",
      },
      colors:{
         customColor: 'rgb(35, 31, 32)',
         customColor2:'rgb(36,44,47)',
         customGray: '#27272A',
      }
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
