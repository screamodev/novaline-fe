import { describe, expect, it } from 'vitest'
import { allOffers, buildIndex, districtNeighbours, maxSpeed, minPrice, offersFor, searchSettlements, technologies } from '../shared/utils/coverage'
import type { CoverageTreeVM, OfferVM } from '../shared/types/coverage'

const offer = (technology: OfferVM['technology'], prices: [number, number][]): OfferVM => ({
  technology,
  audience: 'private',
  tariffs: prices.map(([speed, price]) => ({ speed, price, extra: null })),
  connectionPrice: 1500,
  connectionPriceOld: null,
  connectionPromo: false,
  note: null,
  noteEn: null,
})
const s = (slug: string, name: string, offers: OfferVM[] = [offer('GPON', [[100, 210], [1000, 270]])]) => ({
  slug,
  name,
  nameLocative: null,
  lat: null,
  lng: null,
  isRegionalCentre: false,
  offers,
  neighbourhoods: [] as { name: string; offers: OfferVM[] }[],
})
const kharkiv = { ...s('kharkiv', 'Харків', []), neighbourhoods: [{ name: 'Салтівка', offers: [offer('EPON', [[150, 200]])] }] }
const tree: CoverageTreeVM = {
  settlementCount: 4,
  regions: [
    {
      slug: 'kharkivska',
      name: 'Харківська область',
      districts: [{ slug: 'kharkivskyi', name: 'Харківський район', settlements: [kharkiv, s('pisochyn', 'Пісочин')] }],
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

describe('offers', () => {
  const [kh, pisochyn] = index
  it('uses the neighbourhood terms in Kharkiv and nothing until one is chosen', () => {
    expect(offersFor(kh)).toEqual([])
    expect(offersFor(kh, kh!.neighbourhoods[0])[0]!.technology).toBe('EPON')
    expect(offersFor(pisochyn)[0]!.tariffs).toHaveLength(2)
    expect(offersFor(undefined)).toEqual([])
  })
  it('summarises prices, speeds and technologies', () => {
    const all = [...allOffers(kh!), ...allOffers(pisochyn!)]
    expect(minPrice(all)).toBe(200)
    expect(maxSpeed(all)).toBe(1000)
    expect(technologies(all)).toEqual(['EPON', 'GPON'])
    expect(minPrice([])).toBeNull()
  })
  it('links other settlements of the same district', () => {
    expect(districtNeighbours(pisochyn!, index).map((x) => x.slug)).toEqual(['kharkiv'])
  })
})
