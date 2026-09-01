/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Confident, sturdy breeder palette (was a pastel animal-rescue theme).
        forest: {
          50: '#eef3f6',
          100: '#dbe6ec',
          200: '#a7c1d1',
          300: '#7aa4bb',
          400: '#4d7c99',
          500: '#33607d',
          DEFAULT: '#33607d',
          600: '#284d66',
          700: '#213e53',
          800: '#1c3345',
          900: '#162836',
        },
        sky: {
          DEFAULT: '#c99a3d',
          500: '#c99a3d',
          600: '#a87d2c',
          700: '#8a6624',
        },
        ember: {
          50: '#fbf1ec',
          100: '#f5ded1',
          200: '#e8b89d',
          300: '#dc9670',
          400: '#c96f49',
          500: '#b5502e',
          DEFAULT: '#b5502e',
          600: '#8f3e22',
          700: '#6f3019',
        },
        cream: '#f4efe6',
        sand: '#e6dcc9',
        ink: '#211f1c',
        muted: '#69625a',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(33, 31, 28, 0.18)',
        lift: '0 22px 45px -18px rgba(33, 31, 28, 0.30)',
        glow: '0 0 0 4px rgba(181, 80, 46, 0.18)',
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
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(181, 80, 46, 0.45)' },
          '50%': { transform: 'scale(1.04)', boxShadow: '0 0 0 12px rgba(181, 80, 46, 0)' },
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
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%2333607d' fill-opacity='0.06'%3E%3Ccircle cx='30' cy='34' r='8'/%3E%3Ccircle cx='18' cy='22' r='3.5'/%3E%3Ccircle cx='30' cy='18' r='3.5'/%3E%3Ccircle cx='42' cy='22' r='3.5'/%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
