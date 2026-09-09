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
        'amz-terra': '#5C2C16',
        'amz-terra-dark': '#3D1D0F',
        'amz-terra-light': '#7A4A2E',
        'amz-areia': '#F5F2EB',
        'amz-areia-dark': '#E8E2D5',
        'amz-oceano': '#1A6B7C',
        'amz-oceano-dark': '#0E4F5C',
        'amz-bio': '#2D7A3A',
        'amz-bio-dark': '#1E5528',
        'amz-dourado': '#A36217',
      },
      fontFamily: {
        'maybug': ['"Maybug MS"', 'serif'],
        'maybug-hand': ['"Maybug MS Handwritten"', 'cursive'],
        'maybug-black': ['"Maybug MS Black"', 'serif'],
        'maybug-deco': ['"Maybug MS Decorative"', 'serif'],
        'sans': ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'pattern-acai': "url('/patternsAtivo 8.svg')",
      },
    },
  },
  plugins: [],
}
