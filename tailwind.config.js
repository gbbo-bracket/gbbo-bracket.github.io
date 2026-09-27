/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./standings.html",
    "./contestants.html",
    "./rules.html",
    "./vote.html",
    "./components/**/*.js",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'gbbo': {
          // Primary Pastels (Playful + Inviting)
          'icing-pink': '#F7C6D9',
          'buttercream-yellow': '#FBE8A6', 
          'mint-green': '#BEE4D2',
          'powder-blue': '#A9D0F5',
          
          // Secondary Accents (Bold + Festive)
          'berry-red': '#D94C57',
          'royal-blue': '#214177',
          'golden-brown': '#C58940',
          
          // Neutrals (Balancing + Readable)
          'clotted-cream': '#FFFDF5',
          'earl-grey': '#7C7467',
          
          // Legacy colors for backward compatibility
          'cream': '#FFFDF5', // Map to clotted-cream
          'warm-cream': '#FBE8A6', // Map to buttercream-yellow
          'soft-blue': '#A9D0F5', // Map to powder-blue
          'rustic-brown': '#C58940', // Map to golden-brown
          'deep-brown': '#7C7467', // Map to earl-grey
          'accent-blue': '#214177', // Map to royal-blue
          'text-dark': '#7C7467', // Map to earl-grey
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