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
  violetMid: '#8A47E8',
  coral: '#DB4576',
  /** Coral darkened 7% for fills behind white text (WCAG AA 4.6:1; brand coral is 4.1:1). */
  coralStrong: '#CC406E',
  navy: '#1F1D46',
  navy2: '#2A2860',
  navyDeep: '#100E2C',
  navyPanel: '#17153A',
  navyPanel2: '#241F52',
  radioNight: '#181436',
  radioNightDeep: '#120F2A',
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
  pink: '#F3A9C1',
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

/** `#RRGGBB` + alpha → `rgba(...)`, so derived tints stay tied to the palette. */
export function withAlpha(hex: string, a: number): string {
  const n = Number.parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

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
  dropdown: '0 20px 44px -18px rgba(10,8,40,.7)',
  'radio-card': '0 40px 90px -40px rgba(0,0,0,.7)',
  'radio-art': '0 16px 34px -14px rgba(0,0,0,.7)',
} as const

/** Gradients built from the palette (section backgrounds, cards, glows). */
export const gradients = {
  'grad-violet': `linear-gradient(150deg, ${palette.violet}, ${palette.violet2})`,
  'grad-violet-coral': `linear-gradient(150deg, ${palette.violet}, ${palette.coral})`,
  'icon-tile': `linear-gradient(150deg, ${withAlpha(palette.violet, 0.12)}, ${withAlpha(palette.coral, 0.12)})`,
  'hero-scrim': `linear-gradient(90deg, ${palette.hero} 0%, ${palette.hero} 34%, ${withAlpha(palette.hero, 0.85)} 48%, ${withAlpha(palette.hero, 0.3)} 62%, ${withAlpha(palette.hero, 0)} 74%)`,
  'hero-scrim-mobile': `linear-gradient(180deg, ${withAlpha(palette.hero, 0.72)}, ${withAlpha(palette.hero, 0.5)} 52%, ${withAlpha(palette.hero, 0.92)})`,
  'hero-glow': `radial-gradient(680px 480px at 6% 18%, ${withAlpha(palette.violet, 0.12)}, transparent 60%), radial-gradient(560px 420px at 2% 98%, ${withAlpha(palette.coral, 0.1)}, transparent 58%)`,
  'glow-coverage': `radial-gradient(700px 400px at 85% 0%, ${withAlpha(palette.violet2, 0.28)}, transparent 60%), radial-gradient(600px 400px at 0% 100%, ${withAlpha(palette.coral, 0.16)}, transparent 55%)`,
  'glow-dc': `radial-gradient(700px 420px at 90% 0%, ${withAlpha(palette.violet2, 0.26)}, transparent 60%), radial-gradient(600px 400px at 0% 100%, ${withAlpha(palette.coral, 0.14)}, transparent 55%)`,
  'glow-about': `radial-gradient(700px 400px at 100% 100%, ${withAlpha(palette.violet2, 0.22)}, transparent 60%)`,
  'popular-card': `linear-gradient(160deg, ${palette.navy}, ${palette.violetDeep})`,
  'lead-card': `linear-gradient(135deg, ${palette.violet}, ${palette.violetMid} 60%, ${palette.coral})`,
  'radio-bg': `linear-gradient(180deg, ${withAlpha(palette.radioNight, 0.78)}, ${withAlpha(palette.radioNight, 0.86)} 40%, ${withAlpha(palette.radioNightDeep, 0.96)}), radial-gradient(900px 500px at 82% 8%, ${withAlpha(palette.coral, 0.28)}, transparent 55%), radial-gradient(800px 520px at 10% 90%, ${withAlpha(palette.violet, 0.3)}, transparent 55%)`,
  'radio-base': `linear-gradient(160deg, ${palette.navy2}, ${palette.radioNightDeep})`,
  'radio-art': `linear-gradient(160deg, ${withAlpha(palette.violet, 0.9)}, ${withAlpha(palette.coral, 0.85)})`,
  'radio-art-tint': `linear-gradient(160deg, ${withAlpha(palette.violet, 0.35)}, ${withAlpha(palette.coral, 0.35)})`,
  'plans-bg': `linear-gradient(180deg, ${palette.white}, ${palette.bg})`,
} as const

export type PaletteColor = keyof typeof palette
