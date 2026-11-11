import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 and Andean Skyline Logistics tokens
        surface: '#f7f9fc',
        'surface-dim': '#d8dadd',
        'surface-bright': '#f7f9fc',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f4f7',
        'surface-container': '#eceef1',
        'surface-container-high': '#e6e8eb',
        'surface-container-highest': '#e0e3e6',
        'surface-variant': '#e0e3e6',
        'on-surface': '#191c1e',
        'on-surface-variant': '#44474c',
        'inverse-surface': '#2d3133',
        'inverse-on-surface': '#eff1f4',
        outline: '#75777d',
        'outline-variant': '#c5c6cd',
        'surface-tint': '#525f75',

        primary: '#000000',
        'on-primary': '#ffffff',
        'primary-container': '#0e1c2f', // Deep Midnight Navy
        'on-primary-container': '#77849c',
        'inverse-primary': '#bac7e1',
        'primary-fixed': '#d6e3fe',
        'primary-fixed-dim': '#bac7e1',
        'on-primary-fixed': '#0e1c2f',
        'on-primary-fixed-variant': '#3a475c',

        secondary: '#00639b', // Electric Aero Blue variant
        'on-secondary': '#ffffff',
        'secondary-container': '#48afff',
        'on-secondary-container': '#004167',
        'secondary-fixed': '#cee5ff',
        'secondary-fixed-dim': '#96cbff',
        'on-secondary-fixed': '#001d33',
        'on-secondary-fixed-variant': '#004a76',

        tertiary: '#000000',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#281900',
        'on-tertiary-container': '#b07900',
        'tertiary-fixed': '#ffdead',
        'tertiary-fixed-dim': '#ffba3c', // Festive Amber Gold
        'on-tertiary-fixed': '#281900',
        'on-tertiary-fixed-variant': '#604100',

        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        background: '#f7f9fc',
        'on-background': '#191c1e',

        // Brand Aliases for ergonomic developer DX
        brand: {
          navy: '#0B192C',
          'navy-dark': '#0A1120',
          blue: '#008DDA',
          'blue-dark': '#0077B8',
          gold: '#FFB200',
          'gold-hover': '#E6A000',
          slate: '#F4F6F9',
        },
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.25rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px',
      },
      spacing: {
        'margin-mobile': '1.25rem',
        margin: '3rem',
        'gutter-mobile': '1rem',
        gutter: '1.5rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],

        // Semantic font aliases matching reference HTML templates
        'display-lg': ['var(--font-plus-jakarta)', 'sans-serif'],
        'display-lg-mobile': ['var(--font-plus-jakarta)', 'sans-serif'],
        'headline-lg': ['var(--font-plus-jakarta)', 'sans-serif'],
        'headline-lg-mobile': ['var(--font-plus-jakarta)', 'sans-serif'],
        'headline-md': ['var(--font-plus-jakarta)', 'sans-serif'],
        'headline-sm': ['var(--font-plus-jakarta)', 'sans-serif'],
        'title-md': ['var(--font-plus-jakarta)', 'sans-serif'],
        'body-lg': ['var(--font-inter)', 'sans-serif'],
        'body-md': ['var(--font-inter)', 'sans-serif'],
        'body-sm': ['var(--font-inter)', 'sans-serif'],
        'label-lg': ['var(--font-inter)', 'sans-serif'],
        'label-md': ['var(--font-inter)', 'sans-serif'],
        'label-mono': ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        'display-lg': ['56px', { lineHeight: '64px', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg-mobile': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-lg': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg-mobile': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-md': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'title-md': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['15px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '20px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-mono': ['12px', { lineHeight: '16px', letterSpacing: '0.04em', fontWeight: '500' }],
      },
      boxShadow: {
        'elevation-1': '0 4px 16px -2px rgba(11, 25, 44, 0.04), 0 2px 6px -1px rgba(11, 25, 44, 0.02)',
        'elevation-2': '0 12px 32px -4px rgba(11, 25, 44, 0.08), 0 4px 12px -2px rgba(0, 141, 218, 0.06)',
        'elevation-3': '0 24px 48px -8px rgba(11, 25, 44, 0.16)',
      },
    },
  },
  plugins: [],
};

export default config;
