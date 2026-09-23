import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'var(--border-color)',
        input: 'var(--border-color)',
        ring: 'var(--border-focus)',
        background: 'var(--bg-color)',
        foreground: 'var(--text-main)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: '#FFFFFF',
          hover: 'var(--primary-hover)',
          light: 'var(--primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--text-main)',
        },
        destructive: {
          DEFAULT: 'var(--danger)',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: 'var(--card-bg)',
          foreground: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--cyan)',
          foreground: '#FFFFFF',
        },
        popover: {
          DEFAULT: 'var(--card-bg)',
          foreground: 'var(--text-main)',
        },
        card: {
          DEFAULT: 'var(--card-bg)',
          foreground: 'var(--text-main)',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: '#FFFFFF',
        },
        error: {
          DEFAULT: 'var(--danger)',
          foreground: '#FFFFFF',
        },
        info: {
          DEFAULT: 'var(--info)',
          foreground: '#FFFFFF',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar-bg)',
          foreground: 'var(--sidebar-text)',
          border: 'var(--border-color)',
          active: 'var(--sidebar-active)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
