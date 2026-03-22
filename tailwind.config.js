/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        accent: {
          50:  '#f2ffe0',
          100: '#e3ffb8',
          200: '#caff85',
          300: '#b0ff4d',
          400: '#97ff1a',
          500: '#82f000',
          600: '#64bb00',
          700: '#4a8a00',
          800: '#315c00',
          900: '#192e00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl':  '0.5rem',
        '2xl': '0.625rem',
        '3xl': '0.75rem',
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px 0 rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
