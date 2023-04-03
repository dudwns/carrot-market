/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  darkMode: "media", // media: 디바이스의 모드 설정에 따라 자동으로 적용, class: dark mode를 수동으로 전환
  plugins: [require("@tailwindcss/forms")],
};
