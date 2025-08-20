/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#2E7D32',
          'light-green': '#4CAF50',
          'dark-green': '#1B5E20',
          'accent-green': '#81C784'
        },
        text: {
          dark: '#212121',
          light: '#757575'
        },
        background: {
          'light-gray': '#F5F5F5',
          'soft-yellow': '#F4E4A1'
        },
        // Additional colors for the footer
        card: '#f8f9fa',
        primary: '#2E7D32',
        'muted-foreground': '#6c757d',
        border: '#e9ecef'
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif']
      },
      boxShadow: {
        'custom': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'card': '0 8px 25px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [],
}
