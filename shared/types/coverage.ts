import type { BlockNode } from './blocks'
import type { SeoVM } from './cms'

export type Technology = 'GPON' | 'EPON' | 'Ethernet' | 'WiFi'
export type OfferAudience = 'private' | 'apartment' | 'private_apartment'

export interface TariffVM {
  /** Mbit/s */
  speed: number
  /** UAH per month */
  price: number
  /** Bundled extra shown after the speed, e.g. "IPTV". */
  extra: string | null
}

/** Connection terms at a locality (or Kharkiv neighbourhood), as edited in the CMS. */
export interface OfferVM {
  technology: Technology
  audience: OfferAudience
  tariffs: TariffVM[]
  connectionPrice: number | null
  connectionPriceOld: number | null
  connectionPromo: boolean
  note: string | null
  noteEn: string | null
}

export interface NeighbourhoodVM {
  name: string
  offers: OfferVM[]
}

export interface SettlementVM {
  slug: string
  name: string
  nameLocative: string | null
  lat: number | null
  lng: number | null
  isRegionalCentre: boolean
  offers: OfferVM[]
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

/** Optional per-settlement CMS overrides for locality pages. */
export interface SettlementExtraVM {
  intro: BlockNode[]
  seo: SeoVM
}
