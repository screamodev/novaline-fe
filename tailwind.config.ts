import type { Config } from 'tailwindcss'
import { alpha, gradients, onDark, palette, shadows } from './app/theme/colors'

export default <Partial<Config>>{
  content: [
    './app/components/**/*.{vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    extend: {
      colors: {
        violet: { DEFAULT: palette.violet, 2: palette.violet2, deep: palette.violetDeep, soft: alpha.violetSoft },
        coral: { DEFAULT: palette.coral, soft: alpha.coralSoft },
        navy: {
          DEFAULT: palette.navy,
          2: palette.navy2,
          deep: palette.navyDeep,
          panel: palette.navyPanel,
          'panel-2': palette.navyPanel2,
        },
        ink: palette.ink,
        muted: palette.muted,
        bg: { DEFAULT: palette.bg, hero: palette.hero },
        card: palette.white,
        line: { DEFAULT: alpha.line, dark: alpha.lineOnDark, 'dark-strong': alpha.lineOnDarkStrong },
        glass: { DEFAULT: alpha.glassOnDark, strong: alpha.glassOnDarkStrong, line: alpha.lineOnDarkSoft },
        overlay: alpha.overlay,
        header: alpha.headerGlass,
        success: { DEFAULT: palette.success, ink: palette.successInk, soft: alpha.successSoft },
        'on-dark': onDark,
        viber: palette.viber,
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: ['clamp(38px, 4.6vw, 60px)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        h2: ['clamp(28px, 3.4vw, 42px)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'h2-sm': ['clamp(26px, 3vw, 38px)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        kicker: ['13px', { letterSpacing: '0.06em', lineHeight: '1.2' }],
      },
      maxWidth: {
        container: '1240px',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
      },
      boxShadow: shadows,
      screens: {
        // Prototype breakpoints (max-width) mapped to min-width equivalents.
        xs: '521px',
        sm: '641px',
        md: '721px',
        tab: '821px',
        lg: '981px',
        xl: '1081px',
      },
      backgroundImage: gradients,
      keyframes: {
        'nl-rise': { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'none' } },
        'nl-pulse': {
          '0%,100%': { transform: 'scale(1)', opacity: '.85' },
          '50%': { transform: 'scale(1.35)', opacity: '1' },
        },
      },
      animation: {
        rise: 'nl-rise .7s cubic-bezier(.2,.7,.2,1) both',
        pulse: 'nl-pulse 2.2s infinite',
      },
    },
  },
}
