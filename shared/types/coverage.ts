export interface NeighbourhoodVM {
  name: string
  priceModifier: number
}

export interface SettlementVM {
  slug: string
  name: string
  nameLocative: string | null
  lat: number | null
  lng: number | null
  isRegionalCentre: boolean
  neighbourhoods: NeighbourhoodVM[]
}

export interface CoverageTreeVM {
  regions: { slug: string; name: string; districts: { slug: string; name: string; settlements: SettlementVM[] }[] }[]
  settlementCount: number
}

/** Flat entry used for search, map markers and deep links. */
export interface SettlementEntry extends SettlementVM {
  regionSlug: string
  regionName: string
  districtSlug: string
  districtName: string
}
