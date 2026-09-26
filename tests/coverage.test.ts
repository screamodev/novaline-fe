import { describe, expect, it } from 'vitest'
import { buildIndex, planPrice, searchSettlements } from '../shared/utils/coverage'
import type { CoverageTreeVM } from '../shared/types/coverage'

const s = (slug: string, name: string) => ({ slug, name, nameLocative: null, lat: 1, lng: 2, isRegionalCentre: false, neighbourhoods: [] })
const tree: CoverageTreeVM = {
  settlementCount: 4,
  regions: [
    {
      slug: 'kharkivska',
      name: 'Харківська область',
      districts: [{ slug: 'kharkivskyi', name: 'Харківський район', settlements: [s('kharkiv', 'Харків'), s('pisochyn', 'Пісочин')] }],
    },
    {
      slug: 'sumska',
      name: 'Сумська область',
      districts: [{ slug: 'konotopskyi', name: 'Конотопський район', settlements: [s('duboviazivka', 'Дубов’язівка'), s('buryn', 'Буринь')] }],
    },
  ],
}
const index = buildIndex(tree)

describe('coverage index & search', () => {
  it('flattens the tree with region/district context', () => {
    expect(index).toHaveLength(4)
    expect(index[1]).toMatchObject({ slug: 'pisochyn', districtName: 'Харківський район', regionSlug: 'kharkivska' })
  })
  it('is case- and apostrophe-insensitive', () => {
    expect(searchSettlements('ПІС', index).map((x) => x.slug)).toEqual(['pisochyn'])
    expect(searchSettlements('дубовяз', index).map((x) => x.slug)).toEqual(['duboviazivka'])
  })
  it('ranks prefix matches first and respects the limit', () => {
    expect(searchSettlements('р', index).map((x) => x.slug)).toEqual(['buryn', 'kharkiv'])
    expect(searchSettlements('і', index, 1)).toHaveLength(1)
    expect(searchSettlements('  ', index)).toEqual([])
  })
})

describe('planPrice', () => {
  it('applies the neighbourhood modifier and never goes negative', () => {
    expect(planPrice(270, 30)).toBe(300)
    expect(planPrice(210, -10)).toBe(200)
    expect(planPrice(20, -50)).toBe(0)
    expect(planPrice(null, 30)).toBeNull()
  })
})

import { distanceKm, nearestSettlements } from '../shared/utils/coverage'

describe('nearestSettlements', () => {
  const at = (slug: string, lat: number, lng: number, districtSlug = 'd') =>
    ({ slug, name: slug, nameLocative: null, lat, lng, isRegionalCentre: false, neighbourhoods: [], regionSlug: 'r', regionName: 'R', districtSlug, districtName: 'D' })
  const kharkiv = at('kharkiv', 49.9935, 36.2304)
  const idx = [kharkiv, at('pisochyn', 49.9539, 36.1122), at('poltava', 49.5883, 34.5514), at('dergachi', 50.1069, 36.1181)]
  it('orders by distance and excludes itself', () => {
    expect(nearestSettlements(kharkiv, idx, 2).map((s) => s.slug)).toEqual(['pisochyn', 'dergachi'])
  })
  it('computes a sensible distance (Kharkiv–Poltava ≈ 130 km)', () => {
    expect(Math.round(distanceKm(kharkiv, { lat: 49.5883, lng: 34.5514 }) / 10) * 10).toBe(130)
  })
  it('falls back to the same district without coordinates', () => {
    const noGeo = { ...kharkiv, slug: 'x', lat: null, lng: null }
    expect(nearestSettlements(noGeo, idx, 2).map((s) => s.slug)).toEqual(['kharkiv', 'pisochyn'])
  })
})
