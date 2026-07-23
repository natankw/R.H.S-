/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        secondary: '#a78bfa',
        dark: '#0f0a1a',
        glass: 'rgba(255,255,255,0.05)',
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        neon: '0 0 10px #7c3aed, 0 0 20px #7c3aed',
      },
    },
  },
  plugins: [],
}
