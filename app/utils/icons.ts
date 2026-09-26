/**
 * Icon set copied from the Claude Design prototype (24×24 viewBox).
 * `stroke` icons inherit `currentColor` via stroke; `fill` icons via fill.
 */
export interface IconDef {
  mode: 'stroke' | 'fill'
  body: string
}

export const ICONS = {
  arrowRight: { mode: 'stroke', body: '<path d="M5 12h14M13 6l6 6-6 6"/>' },
  arrowLeft: { mode: 'stroke', body: '<path d="M19 12H5M11 6 5 12l6 6"/>' },
  volume: { mode: 'stroke', body: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/>' },
  play: { mode: 'fill', body: '<path d="M8 5v14l11-7z"/>' },
  pause: { mode: 'fill', body: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>' },
  key: { mode: 'stroke', body: '<circle cx="8" cy="15" r="4"/><path d="M10.85 12.15 19 4M18 5l2 2M15 8l2 2"/>' },
  viber: {
    mode: 'fill',
    body: '<path d="M12 2C6.9 2 3 5.4 3 10.1c0 2 .8 3.9 2.3 5.3-.1 1.6-.5 2.9-1.2 3.9-.2.3 0 .7.4.6 1.7-.4 3.1-1.1 4.2-2 .9.2 1.9.3 2.8.3h.2c5.1 0 9-3.4 9-8.1S17.1 2 12 2z"/>',
  },
  burger: { mode: 'stroke', body: '<path d="M4 7h16M4 12h16M4 17h16"/>' },
  close: { mode: 'stroke', body: '<path d="M6 6l12 12M18 6 6 18"/>' },
  phone: { mode: 'stroke', body: '<path d="M4 5c0 9 6 15 15 15l1.5-3-4-2-2 2c-2.2-1.2-4-3-5.2-5.2l2-2-2-4z"/>' },
  bot: {
    mode: 'stroke',
    body: '<path d="M12 3a5 5 0 0 1 5 5v1a4 4 0 0 1 0 8H7a4 4 0 0 1 0-8V8a5 5 0 0 1 5-5z"/><circle cx="9.5" cy="12.5" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="12.5" r="1" fill="currentColor" stroke="none"/>',
  },
  send: { mode: 'stroke', body: '<path d="M4 12h15M13 6l6 6-6 6"/>' },
  check: { mode: 'stroke', body: '<path d="M5 12.5 10 17l9-10"/>' },
  bolt: { mode: 'stroke', body: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>' },
  headset: { mode: 'stroke', body: '<path d="M4 13a8 8 0 0 1 16 0"/><rect x="2" y="13" width="4" height="7" rx="1.5"/><rect x="18" y="13" width="4" height="7" rx="1.5"/>' },
  wrench: { mode: 'stroke', body: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6 2 2 6-6a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2z"/>' },
  award: { mode: 'stroke', body: '<circle cx="12" cy="9" r="6"/><path d="M9 14.5 8 22l4-2 4 2-1-7.5"/>' },
  search: { mode: 'stroke', body: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/>' },
  info: { mode: 'stroke', body: '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>' },
  calendar: { mode: 'stroke', body: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>' },
  shieldAlert: { mode: 'stroke', body: '<path d="M12 3 3 7v6c0 5 4 8 9 8s9-3 9-8V7z"/><path d="M12 8v4M12 16h.01"/>' },
  instagram: {
    mode: 'stroke',
    body: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/>',
  },
  telegram: { mode: 'fill', body: '<path d="M21.5 4.5 2.5 11.8c-1 .4-1 1.8.05 2.1l4.6 1.4 1.8 5.4c.3.8 1.3 1 1.9.3l2.5-2.6 4.6 3.4c.7.5 1.7.1 1.9-.7L23 6c.25-1.1-.5-1.9-1.5-1.5z"/>' },
  facebook: { mode: 'fill', body: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z"/>' },
  youtube: { mode: 'fill', body: '<path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8zM10 15.2V8.8l5.2 3.2z"/>' },
  // service icons
  net: {
    mode: 'stroke',
    body: '<circle cx="12" cy="12" r="2.5"/><circle cx="4" cy="5" r="2"/><circle cx="20" cy="5" r="2"/><circle cx="4" cy="19" r="2"/><circle cx="20" cy="19" r="2"/><path d="M5.6 6.4 10 10.4M18.4 6.4 14 10.4M5.6 17.6 10 13.6M18.4 17.6 14 13.6"/>',
  },
  tv: { mode: 'stroke', body: '<rect x="2" y="6" width="20" height="13" rx="2.5"/><path d="M8 22h8M12 6 8 2M12 6l4-4"/>' },
  install: { mode: 'stroke', body: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6 2 2 6-6a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2z"/><path d="m15 9 5 5"/>' },
  consult: { mode: 'stroke', body: '<path d="M21 15a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3z"/><path d="M9 9h6M9 12h4"/>' },
  ip4: {
    mode: 'stroke',
    body: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/><text x="12" y="12" font-size="6" font-family="Unbounded" font-weight="700" fill="currentColor" stroke="none" text-anchor="middle">IP</text>',
  },
  ip6: {
    mode: 'stroke',
    body: '<path d="M12 2C7 8 7 13 12 22 17 13 17 8 12 2z"/><path d="M4 12h16"/><text x="12" y="13" font-size="5" font-family="Unbounded" font-weight="700" fill="currentColor" stroke="none" text-anchor="middle">v6</text>',
  },
} satisfies Record<string, IconDef>

export type IconName = keyof typeof ICONS
