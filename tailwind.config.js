module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      scale: {
        '150': '1.5',
        '200': '2',
        '250': '2.5',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s linear infinite',
        'fade-in': 'fadeIn 1s ease-in forwards',
        'border-tl': 'border-tl 3s infinite',
        'border-tr': 'border-tr 3s infinite',
        'border-bl': 'border-bl 3s infinite',
        'border-br': 'border-br 3s infinite',
        'spin-slow': 'spin 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float-card': 'floatCard 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { 
            transform: 'translateY(0) translateX(0)',
            opacity: '0.5'
          },
          '50%': { 
            transform: 'translateY(-20px) translateX(10px)',
            opacity: '0.8'
          },
        },
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'border-tl': {
          '0%, 100%': { transform: 'translate(-100%, -100%)' },
          '50%': { transform: 'translate(0, 0)' },
        },
        'border-tr': {
          '0%, 100%': { transform: 'translate(100%, -100%)' },
          '50%': { transform: 'translate(0, 0)' },
        },
        'border-bl': {
          '0%, 100%': { transform: 'translate(-100%, 100%)' },
          '50%': { transform: 'translate(0, 0)' },
        },
        'border-br': {
          '0%, 100%': { transform: 'translate(100%, 100%)' },
          '50%': { transform: 'translate(0, 0)' },
        },
        glow: {
          '0%': { filter: 'brightness(1) blur(3px)' },
          '100%': { filter: 'brightness(1.2) blur(4px)' },
        },
        floatCard: {
          '0%, 100%': { 
            transform: 'translateY(0) scale(1)',
            boxShadow: '0 0 20px rgba(0, 255, 163, 0.1)'
          },
          '50%': { 
            transform: 'translateY(-10px) scale(1.02)',
            boxShadow: '0 10px 30px rgba(0, 255, 163, 0.2)'
          },
        },
      },
      maxWidth: {
        '9xl': '140rem',
      },
    },
  },
  plugins: [
    require('daisyui'),
    require("@tailwindcss/typography")
  ],
  daisyui: {
    styled: true,
    themes: [
      {
        'solana': {
          fontFamily: {
            display: ['PT Mono, monospace'],
            body: ['Inter, sans-serif'],
          },
          'primary': '#2a2a2a',
          'primary-focus': '#9945FF',
          'primary-content': '#ffffff',
          'secondary': '#f6d860',
          'secondary-focus': '#f3cc30',
          'secondary-content': '#ffffff',
          'accent': '#33a382',
          'accent-focus': '#2aa79b',
          'accent-content': '#ffffff',
          'neutral': '#2b2b2b',
          'neutral-focus': '#2a2e37',
          'neutral-content': '#ffffff',
          'base-100': '#181818',
          'base-200': '#35363a',
          'base-300': '#222222',
          'base-content': '#f9fafb',
          'info': '#2094f3',
          'success': '#009485',
          'warning': '#ff9900',
          'error': '#ff5724',
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
}
