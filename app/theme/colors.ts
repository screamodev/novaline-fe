/**
 * NovaLine brand palette — the single source of truth for every colour on the site.
 *
 * Change a value here and it propagates to Tailwind utilities (`bg-violet`, `text-navy`, …),
 * CSS variables (`var(--color-violet)`) and runtime consumers (e.g. Leaflet markers).
 * Components must never hardcode hex/rgba values — use these tokens instead.
 */

/** Raw brand colours (from the Claude Design prototype `:root`). */
export const palette = {
  violet: '#6E2CF3',
  violet2: '#8674E8',
  violetDeep: '#3A2A7A',
  coral: '#DB4576',
  navy: '#1F1D46',
  navy2: '#2A2860',
  navyDeep: '#100E2C',
  navyPanel: '#17153A',
  navyPanel2: '#241F52',
  ink: '#211E48',
  muted: '#6B688F',
  bg: '#F5F4FB',
  hero: '#EDEAF7',
  white: '#FFFFFF',
  success: '#1FB478',
  successInk: '#1A8F60',
  viber: '#7360F2',
} as const

/** Text tints used on dark (navy) surfaces. */
export const onDark = {
  DEFAULT: '#EDECFB',
  soft: '#C9C7EC',
  muted: '#C7C4EA',
  dim: '#B7B4DE',
  faint: '#8F8CBF',
  footer: '#8B88B8',
  label: '#DAD8F0',
  feature: '#E4E2F5',
  coral: '#F3C6D5',
} as const

/** Translucent colours (borders, overlays, glows). */
export const alpha = {
  line: 'rgba(31,29,70,.10)',
  lineOnDark: 'rgba(255,255,255,.14)',
  lineOnDarkStrong: 'rgba(255,255,255,.22)',
  glassOnDark: 'rgba(255,255,255,.06)',
  overlay: 'rgba(20,18,50,.55)',
  headerGlass: 'rgba(255,255,255,.92)',
  violetSoft: 'rgba(110,44,243,.10)',
  coralSoft: 'rgba(219,69,118,.12)',
  successSoft: 'rgba(31,180,120,.14)',
} as const

export type PaletteColor = keyof typeof palette
