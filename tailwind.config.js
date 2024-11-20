/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0eefe',
          200: '#b9ddfd',
          300: '#7cc2fc',
          400: '#36a5f8',
          500: '#0c87eb',
          600: '#006aca',
          700: '#0055a4',
          800: '#004887',
          900: '#003f71',
        },
        dark: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d4d9e3',
          300: '#adb5c7',
          400: '#808da6',
          500: '#5f6c85',
          600: '#4a5469',
          700: '#3d4557',
          800: '#343b4a',
          900: '#1a1d24',
          950: '#14161c',
        }
      },
    },
  },
  plugins: [],
}