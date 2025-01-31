/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "logo-blue": "#012869",
        "logo-red": "#C00A30",
        "logo-yellow": "#CFFD72",
        "light-gray": "#F7F7F7",
        "primary-gray": "#B3B3B3",
        "border-primary": "#6D6D6D",
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

