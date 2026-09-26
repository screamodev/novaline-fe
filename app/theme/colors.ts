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
  glassOnDarkStrong: 'rgba(255,255,255,.10)',
  lineOnDarkSoft: 'rgba(255,255,255,.18)',
  overlay: 'rgba(20,18,50,.55)',
  headerGlass: 'rgba(255,255,255,.92)',
  violetSoft: 'rgba(110,44,243,.10)',
  coralSoft: 'rgba(219,69,118,.12)',
  successSoft: 'rgba(31,180,120,.14)',
} as const

/** Elevation shadows — tinted with brand colours, so they live next to the palette. */
export const shadows = {
  card: '0 20px 50px -24px rgba(45,40,120,.35)',
  popular: '0 30px 70px -30px rgba(60,40,140,.6)',
  float: '0 22px 44px -20px rgba(33,30,72,.5)',
  lead: '0 40px 90px -40px rgba(90,50,200,.6)',
  'btn-violet': `0 16px 34px -14px ${palette.violet}`,
  'btn-coral': `0 10px 24px -10px ${palette.coral}`,
  'fab-coral': `0 16px 34px -12px ${palette.coral}`,
  fab: '0 18px 40px -16px rgba(20,18,50,.45)',
  pill: '0 6px 16px -6px rgba(0,0,0,.5)',
  chip: '0 8px 20px -12px rgba(33,30,72,.35)',
  drawer: '-30px 0 70px -30px rgba(20,18,50,.6)',
  menu: '0 24px 60px -20px rgba(33,30,72,.4)',
  dialog: '0 40px 90px -30px rgba(20,18,50,.6)',
} as const

/** Gradients built from the palette. */
export const gradients = {
  'grad-violet': `linear-gradient(150deg, ${palette.violet}, ${palette.violet2})`,
  'grad-violet-coral': `linear-gradient(150deg, ${palette.violet}, ${palette.coral})`,
} as const

export type PaletteColor = keyof typeof palette
