/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-ivory': {
          50: '#FCFAF6',
          100: '#F8F4EC',
          200: '#F4EFE4',
          DEFAULT: '#F8F4EC',
        },
        pearl: {
          50: '#FBF9F5',
          100: '#F4EFE7',
          200: '#ECE5D8',
          300: '#DFD5C4',
          400: '#D0C3AE',
          DEFAULT: '#ECE5D8',
        },
        sand: {
          50: '#F7F4EE',
          100: '#EFE8DC',
          200: '#DDD2C0',
          DEFAULT: '#DDD2C0',
        },
        champagne: {
          50: '#FAF6ED',
          100: '#F3EBDB',
          200: '#E7D8BC',
          300: '#D8C39A',
          400: '#C2A875',
          500: '#A48A54',
          DEFAULT: '#D8C39A',
        },
        rose: {
          muted: '#CDB7AE',
          50: '#FBF7F5',
          100: '#F4EAE7',
          200: '#E5D3CC',
          DEFAULT: '#CDB7AE',
        },
        taupe: {
          warm: '#8A7A6E',
          100: '#A8978A',
          200: '#8A7A6E',
          DEFAULT: '#8A7A6E',
        },
        espresso: {
          deep: '#1A1613',
          charcoal: '#28231F',
          900: '#120F0D',
          DEFAULT: '#1A1613',
        },
        ivory: {
          50: '#FCFAF6',
          100: '#F8F4EC',
          200: '#F4EFE4',
          DEFAULT: '#F8F4EC',
        },
        gold: {
          light: '#E5D3B0',
          DEFAULT: '#9E7E45',
          dark: '#7A5B28',
        },
        obsidian: {
          50: '#7A726A',
          100: '#5C544D',
          soft: '#423C36',
          muted: '#5C544D',
          200: '#332D28',
          DEFAULT: '#1E1A17',
          900: '#120F0D',
        }
      },
      fontFamily: {
        sans: ['"Montserrat"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Montserrat"', 'Cinzel', '"Cormorant Garamond"', 'serif'],
        display: ['"Montserrat"', 'Cinzel', 'sans-serif'],
      },
      letterSpacing: {
        'widest-luxury': '0.25em',
        'ethereal': '0.35em',
        'monumental': '0.45em',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'spin-very-slow': 'spin 40s linear infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1.5deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'pearl-glow': '0 20px 50px -10px rgba(216, 195, 154, 0.25)',
        'luxury-soft': '0 25px 60px -15px rgba(30, 26, 23, 0.10)',
        'inner-glow': 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(216, 195, 154, 0.2)',
      }
    },
  },
  plugins: [],
}
