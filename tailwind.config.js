/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "logo-blue": "#012869",
        "logo-red": "#C00A30",
        "logo-yellow": "#CFFD72",
        cyan: "#79FFE1",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

