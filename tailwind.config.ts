import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './stores/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        elevated: 'var(--elevated)',
        text: { primary: 'var(--text-primary)', muted: 'var(--text-muted)' },
        accent: { gold: 'var(--accent-gold)' },
        border: 'var(--border)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: { glow: '0 0 0 1px rgba(184,155,94,0.14), 0 24px 80px rgba(0,0,0,0.35)' },
    },
  },
  plugins: [],
};
export default config;
