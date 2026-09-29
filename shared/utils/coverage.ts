import type { CoverageTreeVM, NeighbourhoodVM, OfferVM, SettlementEntry, Technology } from '../types/coverage'

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

/**
 * Offers for a coverage selection: a neighbourhood's own terms when one is chosen (Kharkiv),
 * otherwise the settlement's. Empty until the choice is complete.
 */
export function offersFor(entry: SettlementEntry | undefined, neighbourhood?: NeighbourhoodVM): OfferVM[] {
  if (!entry) return []
  if (entry.neighbourhoods.length) return neighbourhood?.offers ?? []
  return entry.offers
}

/** Every offer of a settlement including all of its neighbourhoods (locality pages, SEO). */
export const allOffers = (entry: SettlementEntry): OfferVM[] => [...entry.offers, ...entry.neighbourhoods.flatMap((n) => n.offers)]

/** Cheapest monthly price across offers, or null. */
export function minPrice(offers: OfferVM[]): number | null {
  const prices = offers.flatMap((o) => o.tariffs.map((t) => t.price))
  return prices.length ? Math.min(...prices) : null
}

/** Highest speed across offers (Mbit/s), or null. */
export function maxSpeed(offers: OfferVM[]): number | null {
  const speeds = offers.flatMap((o) => o.tariffs.map((t) => t.speed))
  return speeds.length ? Math.max(...speeds) : null
}

/** Distinct technologies in offer order, e.g. ["GPON", "EPON"]. */
export const technologies = (offers: OfferVM[]): Technology[] => [...new Set(offers.map((o) => o.technology))]

/** Other settlements of the same district (internal links on locality pages). */
export function districtNeighbours(entry: SettlementEntry, index: SettlementEntry[], limit = 6): SettlementEntry[] {
  return index.filter((s) => s.districtSlug === entry.districtSlug && s.slug !== entry.slug).slice(0, limit)
}
