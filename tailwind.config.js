/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        wa: {
          panel: "#111b21",
          panel2: "#202c33",
          panel3: "#2a3942",
          teal: "#00a884",
          tealdark: "#005c4b",
          bg: "#0b141a",
          bubble: "#005c4b",
          bubbleIn: "#202c33",
          text: "#e9edef",
          dim: "#8696a0",
        },
      },
    },
  },
  plugins: [],
}
