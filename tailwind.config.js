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
        bg: {
          primary: '#080B0D',
          secondary: '#101418',
          card: '#171C22',
          cardHover: '#1C232B',
          input: '#12161B',
        },
        text: {
          primary: '#F5F7F5',
          secondary: '#92999F',
          muted: '#62686F',
        },
        accent: {
          green: '#8BF58D',
          greenLight: '#B4FFB4',
          greenDark: '#4CAF50',
          glow: 'rgba(139, 245, 141, 0.25)',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(139, 245, 141, 0.4)',
          active: 'rgba(255, 255, 255, 0.16)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(139, 245, 141, 0.2)',
        'glow-md': '0 0 30px rgba(139, 245, 141, 0.35)',
        'glow-lg': '0 0 60px rgba(139, 245, 141, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
