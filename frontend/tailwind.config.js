/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1'
        },
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        accent: {
          cyan: '#0891B2',
          teal: '#0D9488',
          emerald: '#059669',
          amber: '#D97706',
          rose: '#E11D48',
          purple: '#9333EA',
        },
        border: {
          subtle: '#E2E8F0',
          glow: '#C7D2FE'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 4px 14px 0 rgba(99, 102, 241, 0.18)',
        'glow-md': '0 6px 20px 0 rgba(99, 102, 241, 0.22)',
        'glow-lg': '0 10px 30px 0 rgba(99, 102, 241, 0.28)',
        'glow-cyan': '0 6px 20px 0 rgba(8, 145, 178, 0.20)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
      }
    },
  },
  plugins: [],
}
