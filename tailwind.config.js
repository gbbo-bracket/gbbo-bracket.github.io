/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
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
        'source': ['Source Sans Pro', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delay-1': 'float 3s ease-in-out infinite 0.5s',
        'float-delay-2': 'float 3s ease-in-out infinite 1s',
        'float-delay-3': 'float 3s ease-in-out infinite 1.5s',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
} 