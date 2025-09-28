/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'theme-toggle': 'themeToggle 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        themeToggle: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        // 自定义主题色彩
        'theme-bg': {
          light: '#f8fafc',
          dark: '#0f172a',
        },
        'theme-surface': {
          light: '#ffffff',
          dark: '#1e293b',
        },
        'theme-text': {
          light: '#1e293b',
          dark: '#f1f5f9',
        },
        'theme-text-secondary': {
          light: '#64748b',
          dark: '#94a3b8',
        },
      },
    },
  },
  plugins: [],
}
