/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#15c39a',
        primary_dark: '#259077',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
