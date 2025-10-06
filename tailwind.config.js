/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burrow: {
          primary: '#3A5BA0',
          secondary: '#C58B4E',
          accent: '#F0B860',
          background: '#F7F5F8',
          surface: '#FFFFFF',
          border: '#E3E3E3',
          muted: '#F4EFEA',
          text: {
            primary: '#2D2A32',
            secondary: '#5F5B62'
          }
        }
      },
      boxShadow: {
        burrow: '0 20px 45px -20px rgba(58, 91, 160, 0.35)',
        'burrow-soft': '0 14px 35px -18px rgba(197, 139, 78, 0.25)'
      }
    },
  },
  plugins: [],
};
