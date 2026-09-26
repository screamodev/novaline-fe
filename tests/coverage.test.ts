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
