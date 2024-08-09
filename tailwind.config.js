/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./views/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        //"login-pattern": "url('/assets/bg-login.jpg')",
      },
    },
  },
  plugins: [],
};
