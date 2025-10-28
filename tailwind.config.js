/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./platform/templates/**/*.{html,jinja}",
    "./platform/static/**/*.{js,ts,css}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
