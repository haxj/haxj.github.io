const colors = require('tailwindcss/colors')

module.exports = {
  prefix: "tw-",
  corePlugins: {
    preflight: false,
  },
  content: [
    "./_posts/**/*",
    "./_layouts/**/*",
    "./_includes/**/*",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "dark",
      "light"
    ]
  },
  theme: {
    extend: {
      colors: {
        neutral: colors.neutral,
      },
    },
  },
  darkMode: ['selector', '[data-mode="dark"]'],
}
