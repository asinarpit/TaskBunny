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
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#4F46E5', // Primary Brand Color
          600: '#4338CA', // Primary Hover
          700: '#3730A3',
          800: '#312E81',
          900: '#1E1B4B',
        },
        slate: {
          950: '#0F172A', // Heading Text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0px 4px 20px rgba(15, 23, 42, 0.06)',
        'card-hover': '0px 8px 30px rgba(15, 23, 42, 0.10)',
        'modal': '0px 24px 64px rgba(15, 23, 42, 0.18)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.03)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
