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
          DEFAULT: '#4F46E5',
          light:   '#6366F1',
          dark:    '#3730A3',
        },
        accent: {
          DEFAULT: '#10B981',
          light:   '#34D399',
          dark:    '#059669',
        },
        danger: {
          DEFAULT: '#F43F5E',
          light:   '#FB7185',
          dark:    '#E11D48',
        },
        bgDark:    '#0F0F1A',
        bgLight:   '#F8FAFC',
        cardDark:  '#1A1A2E',
        cardLight: '#FFFFFF',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':       { transform: 'translateY(-18px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(79,70,229,0.4), 0 0 40px rgba(79,70,229,0.2)' },
          '50%':       { boxShadow: '0 0 40px rgba(79,70,229,0.7), 0 0 80px rgba(79,70,229,0.4)' },
        },
      },
      animation: {
        float:      'float 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
