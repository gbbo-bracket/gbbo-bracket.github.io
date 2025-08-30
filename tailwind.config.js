/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.js",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'gbbo': {
          'cream': '#fdf6e3',
          'warm-cream': '#f5e6d3',
          'soft-blue': '#e8f4f8',
          'rustic-brown': '#8b4513',
          'deep-brown': '#654321',
          'accent-blue': '#4a90a4',
          'text-dark': '#2c1810',
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'source-sans': ['Source Sans Pro', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
} 