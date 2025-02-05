/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html", // Specify index.html in the public folder for Vue CLI projects
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Vue files and JavaScript files in the src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
