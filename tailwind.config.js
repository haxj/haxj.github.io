const colors = require('tailwindcss/colors')

module.exports = {
  prefix: "tw-",
  content: [
    "./_posts/**/*",
    "./_layouts/**/*",
    "./_includes/**/*",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("daisyui")],
  theme: {
    extend: {
      colors: {
        neutral: colors.neutral,
      },
    },
  },
  darkMode: 'class',
}
