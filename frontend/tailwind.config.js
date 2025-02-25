/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'rethink-sans': ['Rethink Sans', 'sans-serif'],
      },
    },
  },
  corePlugins: {
    preflight: true, // Ensures base styles apply correctly
  },
  plugins: [],
}