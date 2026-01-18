import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          background: "#FAFAFA",
          foreground: "#1D1D1F",
          primary: {
            50: "#E8F5E9",
            100: "#C8E6C9",
            200: "#A5D6A7",
            300: "#81C784",
            400: "#66BB6A",
            500: "#4CAF50",
            600: "#43A047",
            700: "#388E3C",
            800: "#2E7D32",
            900: "#1B5E20",
            DEFAULT: "#34C759",
            foreground: "#FFFFFF",
          },
          secondary: {
            DEFAULT: "#007AFF",
            foreground: "#FFFFFF",
          },
        },
      },
      dark: {
        colors: {
          background: "#000000",
          foreground: "#F5F5F7",
          primary: {
            DEFAULT: "#30D158",
            foreground: "#000000",
          },
          secondary: {
            DEFAULT: "#0A84FF",
            foreground: "#FFFFFF",
          },
        },
      },
    },
  })],
};
