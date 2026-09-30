/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#faf7f2',
          100: '#f3ede2',
          200: '#e6dac4',
          300: '#d5c09f',
          400: '#c1a279',
          500: '#b08b5c',
          600: '#9b734c',
          700: '#7d593d',
          800: '#674a35',
          900: '#553e2e',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 25px -5px rgba(34, 197, 94, 0.25)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.25)',
      }
    },
  },
  plugins: [],
}
