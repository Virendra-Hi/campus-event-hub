/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#12213D',
          50: '#EEF1F6',
          100: '#D8DFEB',
          200: '#B2C0D6',
          400: '#4C628C',
          600: '#233A63',
          700: '#182B4B',
          900: '#0B1424',
        },
        amber: {
          DEFAULT: '#EFA435',
          50: '#FDF4E4',
          100: '#FBE7C4',
          300: '#F4C577',
          500: '#EFA435',
          600: '#D6871A',
          700: '#A9690F',
        },
        moss: {
          DEFAULT: '#2E6B4F',
          50: '#E9F3EE',
          100: '#CBE4D8',
          500: '#2E6B4F',
          600: '#235539',
        },
        brick: {
          DEFAULT: '#B8452F',
          50: '#FBEAE6',
          100: '#F3CBC1',
          500: '#B8452F',
          600: '#96351F',
        },
        paper: '#F6F4EF',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,33,61,0.06), 0 8px 24px -8px rgba(18,33,61,0.12)',
        lift: '0 12px 32px -12px rgba(18,33,61,0.28)',
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
}
