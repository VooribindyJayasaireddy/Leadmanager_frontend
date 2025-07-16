/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "glass-gradient": "linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0))"
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      colors: {
        primary: "#2563eb",   // nice blue
        accent: "#16a34a",    // green
        warning: "#f59e0b",   // yellow
        danger: "#dc2626",    // red
        background: "#f9fafb",
        card: "#ffffff",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      }
    },
  },
  plugins: [],
}
