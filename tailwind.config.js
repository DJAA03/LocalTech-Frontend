/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#DC2626', // Red-600
        'primary-hover': '#B91C1C', // Red-700
      },
      // --- INICIO DE LA SECCIÓN DE ANIMACIÓN ---
      keyframes: {
        fadeInUp: {
          'from': { 
            opacity: '0',
            transform: 'translateY(10px)' 
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0)' 
          },
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out',
      }
      // --- FIN DE LA SECCIÓN DE ANIMACIÓN ---
    },
  },
  plugins: [],
}
