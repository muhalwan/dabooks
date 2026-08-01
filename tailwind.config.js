/** @type {import('tailwindcss').Config} */
// ponytail: colors are CSS vars defined in index.css that swap on .dark — lets
// components write `bg-surface` once instead of `bg-white dark:bg-gray-800`.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper:  'var(--color-paper)',
        ink:    'var(--color-ink)',
        surface:'var(--color-surface)',
        line:   'var(--color-line)',
        muted:  'var(--color-muted)',
        accent: 'var(--color-accent)',
        star:   'var(--color-star)',
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
      letterSpacing: {
        tightish: '-0.015em',
      },
    },
  },
  plugins: [],
}
