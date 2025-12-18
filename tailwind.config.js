// tailwind.config.js
/** @type {import('tailwindcss').Config} */
import flowbitePlugin from 'flowbite/plugin'

export default {
  content: [
    './index.html',
    // Crucial: Includes all Vue files in your src directory
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // Crucial: Includes Flowbite-Vue components for styling
    './node_modules/flowbite-vue/**/*.{js,ts}',
    // Crucial: Includes Flowbite's own utilities
    './node_modules/flowbite/dist/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbitePlugin],
}
