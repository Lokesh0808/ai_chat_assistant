/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'glass': 'rgba(255, 255, 255, 0.15)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      animation: {
        'pulse-active': 'pulse-active 2s infinite',
      },
    },
  },
  plugins: [],
};
