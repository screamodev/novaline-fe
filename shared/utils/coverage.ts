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
