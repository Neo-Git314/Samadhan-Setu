/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        portal: {
          navy: '#123B67',
          blue: '#2F6FA8',
          lightBlue: '#EEF5FA',
          softBg: '#F5F9FC',
          text: '#17324D',
          muted: '#60758A',
          border: '#D9E4ED',
          orange: '#F58220',
          orangeHover: '#E06D0C',
        },
        gov: {
          navy: '#12345B',
          darknavy: '#0B2440',
          blue: '#1D4E89',
          saffron: '#F58220',
          saffronHover: '#E06D0C',
          bg: '#F5F7FA',
          white: '#FFFFFF',
          text: '#1F2937',
          muted: '#667085',
          border: '#D9E0E7',
        },
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#627D98',
          500: '#1D4E89', // Government Blue
          600: '#194276',
          700: '#153864',
          800: '#12345B', // Primary Navy
          900: '#0E2845',
          950: '#0B2440', // Dark Navy
        },
        saffron: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F58220', // Official Saffron
          600: '#E06D0C',
          700: '#C25308',
          800: '#9A3412',
          900: '#7C2D12',
        },
        civic: {
          green: '#2E7D32',
          'green-light': '#4CAF50',
          'green-dark': '#1B5E20',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.7' },
        }
      }
    }
  },
  plugins: [],
};
