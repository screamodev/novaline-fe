/** Landing sections in prototype order; `more` items live under the "Ще" dropdown on desktop. */
export const NAV_PRIMARY = ['services', 'coverage', 'plans', 'tv', 'promos', 'news'] as const
export const NAV_MORE = ['datacenter', 'shop', 'payment', 'about'] as const
export type SectionId = (typeof NAV_PRIMARY)[number] | (typeof NAV_MORE)[number] | 'lead'
