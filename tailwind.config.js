/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          dark: '#0C1E10',     // Vert très sombre pour fonds premium / glassmorphic
          green: '#1E5128',    // Vert forêt profond principal (stabilité, terre)
          light: '#4E9F3D',    // Vert vibrant (croissance, innovation, succès)
          gold: '#F9A826',     // Or/Jaune (soleil, récolte abondante, premium)
          sand: '#D8B4F8',     // Couleur d'accompagnement
          bg: '#F8F9FA',       // Fond clair principal
          card: '#FFFFFF',     // Fond de carte clair
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.03)', opacity: '0.95' },
        }
      }
    },
  },
  plugins: [],
}
