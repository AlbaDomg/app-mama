/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        gold: {
          50: '#fefdf3',
          100: '#fefbe6',
          200: '#fdf5c0',
          300: '#fae68c',
          400: '#f5ce47',
          500: '#eab318',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-brand': '0 0 15px rgba(168, 85, 247, 0.35), 0 0 5px rgba(168, 85, 247, 0.15)',
        'neon-gold': '0 0 15px rgba(234, 179, 24, 0.35), 0 0 5px rgba(234, 179, 24, 0.15)',
        'neon-green': '0 0 15px rgba(34, 197, 94, 0.35), 0 0 5px rgba(34, 197, 94, 0.15)',
      }
    },
  },
  plugins: [],
}
