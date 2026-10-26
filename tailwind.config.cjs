/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Firm colors
        'dark-blue': '#0F2742',
        'primary-blue': '#1769AA',
        'light-blue': '#38A9E0',
        'bg-light-blue': '#EEF7FC',
        'text-primary': '#1F2937',
        'text-secondary': '#64748B',
        'success-green': '#16A34A',
        'warning-yellow': '#F59E0B',
        'danger-red': '#DC2626',
      },
    },
  },
  plugins: [],
}
