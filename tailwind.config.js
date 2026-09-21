/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Obsidian & Copper: near-black coat as primary, burnt-copper markings as accent.
        forest: {
          50: '#e9eaeb',
          100: '#c9cbce',
          200: '#9a9ea3',
          300: '#6b6f75',
          400: '#404349',
          500: '#1a1b1e',
          DEFAULT: '#1a1b1e',
          600: '#141517',
          700: '#0f1011',
          800: '#0a0a0b',
          900: '#050506',
        },
        sky: {
          DEFAULT: '#9c7530',
          500: '#9c7530',
          600: '#7d5d26',
          700: '#634a1e',
        },
        ember: {
          50: '#f3e6dc',
          100: '#e5c7b0',
          200: '#d19c73',
          300: '#bc7247',
          400: '#a3562b',
          500: '#8a3a15',
          DEFAULT: '#8a3a15',
          600: '#6c2d10',
          700: '#4f210c',
        },
        cream: '#e9e2d6',
        sand: '#cfc3ac',
        ink: '#0d0e0f',
        muted: '#5c574f',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(13, 14, 15, 0.18)',
        lift: '0 22px 45px -18px rgba(13, 14, 15, 0.30)',
        glow: '0 0 0 4px rgba(138, 58, 21, 0.18)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(138, 58, 21, 0.45)' },
          '50%': { transform: 'scale(1.04)', boxShadow: '0 0 0 12px rgba(138, 58, 21, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease forwards',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
      backgroundImage: {
        'paw-pattern':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%231a1b1e' fill-opacity='0.06'%3E%3Ccircle cx='30' cy='34' r='8'/%3E%3Ccircle cx='18' cy='22' r='3.5'/%3E%3Ccircle cx='30' cy='18' r='3.5'/%3E%3Ccircle cx='42' cy='22' r='3.5'/%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
