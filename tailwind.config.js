/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#15c39a',
        primary_dark: '#259077',
        success_light: '#f0fdf4 ',
        success_dark: '#4ade80',
        error_light: '#fef2f2',
        error_dark: '#f87172 ',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
};
