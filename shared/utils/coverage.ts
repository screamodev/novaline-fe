import type { CoverageTreeVM, SettlementEntry } from '../types/coverage'

export function buildIndex(tree: CoverageTreeVM | null | undefined): SettlementEntry[] {
  if (!tree) return []
  return tree.regions.flatMap((r) =>
    r.districts.flatMap((d) =>
      d.settlements.map((s) => ({ ...s, regionSlug: r.slug, regionName: r.name, districtSlug: d.slug, districtName: d.name })),
    ),
  )
}

/** Lower-case and drop apostrophes, so "дубовяз" finds "Дубов’язівка". */
export const normalizeQuery = (s: string) => s.toLowerCase().replace(/['’ʼ`]/g, '').trim()

/** Substring search over settlement names; prefix matches rank first. */
export function searchSettlements(query: string, index: SettlementEntry[], limit = 7): SettlementEntry[] {
  const q = normalizeQuery(query)
  if (!q) return []
  const scored = index
    .map((s) => ({ s, pos: normalizeQuery(s.name).indexOf(q) }))
    .filter((x) => x.pos !== -1)
    .sort((a, b) => Number(a.pos !== 0) - Number(b.pos !== 0) || a.s.name.localeCompare(b.s.name))
  return scored.slice(0, limit).map((x) => x.s)
}

/** Base plan price adjusted by the neighbourhood modifier; never negative. */
export const planPrice = (base: number | null, modifier: number): number | null =>
  base === null ? null : Math.max(0, base + modifier)

/** Great-circle distance in km. */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = (d: number) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

/** The `limit` closest settlements with coordinates (excluding the settlement itself). */
export function nearestSettlements(entry: SettlementEntry, index: SettlementEntry[], limit = 6): SettlementEntry[] {
  if (entry.lat == null || entry.lng == null) return index.filter((s) => s.districtSlug === entry.districtSlug && s.slug !== entry.slug).slice(0, limit)
  const origin = { lat: entry.lat, lng: entry.lng }
  return index
    .filter((s) => s.slug !== entry.slug && s.lat != null && s.lng != null)
    .map((s) => ({ s, d: distanceKm(origin, { lat: s.lat!, lng: s.lng! }) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map((x) => x.s)
}
