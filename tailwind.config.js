/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html", // Vue CLIのプロジェクトではpublicフォルダのindex.htmlを指定
    "./src/**/*.{vue,js,ts,jsx,tsx}", // srcフォルダ内のVueファイルやJavaScriptファイル
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
