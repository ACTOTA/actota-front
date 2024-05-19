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
      backgroundImage: {
        // Define a custom gradient
        'gradient-to-b-from-50': 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 70%, rgba(255, 255, 255, 1) 100%)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

