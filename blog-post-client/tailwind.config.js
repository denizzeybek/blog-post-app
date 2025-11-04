/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1800px",
      },
      colors: {
        // Primary Colors - CSS Variables
        primary: {
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
          950: "var(--color-primary-950)",
        },
        // Accent Colors
        accent: {
          50: "var(--color-accent-50)",
          100: "var(--color-accent-100)",
          200: "var(--color-accent-200)",
          300: "var(--color-accent-300)",
          400: "var(--color-accent-400)",
          500: "var(--color-accent-500)",
          600: "var(--color-accent-600)",
          700: "var(--color-accent-700)",
          800: "var(--color-accent-800)",
          900: "var(--color-accent-900)",
        },
        // Semantic Colors
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        warning: "var(--color-warning)",
        info: "var(--color-info)",
        // Legacy Colors (for backward compatibility)
        "f-primary": "var(--color-primary-900)",
        "f-success": "var(--color-success)",
        "f-danger": "var(--color-danger)",
        "f-warn": "var(--color-warning)",
        "f-info": "var(--color-info)",
        "f-green": "var(--color-success)",
        "f-red": "var(--color-danger)",
        "f-yellow": "var(--color-warning)",
        "f-blue": "var(--color-primary-900)",
        "f-secondary": "var(--color-accent-500)",
        "f-stroke": "var(--color-border)",
        "f-off-white": "var(--color-gray-50)",
        "f-gray": "var(--color-gray-400)",
        "f-light-gray": "var(--color-gray-100)",
        "f-dark-gray": "var(--color-gray-500)",
        "f-light-red": "var(--color-danger-light)",
        "f-light-green": "var(--color-success-light)",
        "f-light-yellow": "var(--color-warning-light)",
        "f-black": "var(--color-text-primary)",
        "f-light-black": "var(--color-gray-500)",
        "f-white": "var(--color-white)",
        "f-text-gray": "var(--color-gray-400)",
        "f-primary-hovered": "var(--color-primary-800)",
        "f-body-bg": "var(--color-background)",
        "f-light-purple": "var(--color-primary-100)",
        "f-secondary-purple": "var(--color-primary-50)",
        "f-tertiary-purple": "var(--color-primary-50)",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      keyframes: {
        "shake-x": {
          "0%, 100%": { marginLeft: "0" },
          "25%": { marginLeft: "0.25rem" },
          "75%": { marginLeft: "-0.25rem" },
        },
      },
      animation: {
        "shake-x": "shake-x .2s ease-in-out 0s 2",
        "slide-in-up": "slideInUp 0.5s ease-out",
      },
      gridTemplateColumns: {
        36: "repeat(36, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-14": "span 14 / span 14",
      },
      height: {
        "full-offcanvas": "91%",
      },
      scale: {
        104: "1.04",
        115: "1.15",
      },
    },
  },
};
