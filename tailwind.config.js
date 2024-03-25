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
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          "base-100": "#1b1b1e"
        }
      },
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
  darkMode: 'class',
}
