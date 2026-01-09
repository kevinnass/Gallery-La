/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f9fa',
        foreground: '#000000',
        muted: '#6B7280',
        card: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', 'sans-serif'],
        display: ['Khand', 'sans-serif'],
      },
      letterSpacing: {
        'nav': '0.1em',
      },
    },
  },
  plugins: [],
}
