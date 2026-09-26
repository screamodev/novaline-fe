import type { MediaVM, SeoVM } from './cms'

export type PlanSegment = 'private' | 'apartment' | 'business'
export const PLAN_SEGMENTS: readonly PlanSegment[] = ['private', 'apartment', 'business'] as const
export type TvTier = 'min' | 'mid' | 'max'
export type TrustIcon = 'support' | 'engineer' | 'power' | 'award'
export type ServiceIcon = 'net' | 'tv' | 'install' | 'consult' | 'ip4' | 'ip6'
export type Accent = 'violet' | 'coral'
export type StatTone = 'glass' | 'coral' | 'violet'

export interface HeadingVM {
  kicker: string | null
  title: string
  subtitle: string | null
}

/** Price as the CMS stores it; rendering (prefix, label, units) happens in PriceTag. */
export interface PriceVM {
  amount: number | null
  prefix: string | null
  label: string | null
}

export interface PlanVM {
  key: string
  segment: PlanSegment
  name: string
  speedLabel: string
  price: PriceVM
  periodLabel: string
  popular: boolean
  features: string[]
  availableForCoverage: boolean
  coverageCaption: string | null
}

export interface AddonVM {
  key: string
  title: string
  description: string
  price: PriceVM
  unitLabel: string | null
  highlighted: boolean
}

export interface TvPackageVM {
  key: string
  name: string
  channelsLabel: string
  price: number
  popular: boolean
  features: string[]
}

export interface TvChannelVM {
  key: string
  name: string
  categoryKey: string
  tier: TvTier
}

export interface PromoVM {
  key: string
  title: string
  tag: string
  description: string
  terms: string
  validUntil: string | null
  accent: Accent
}

export interface DcServiceVM {
  key: string
  title: string
  description: string
  price: number | null
  unitLabel: string | null
}

export interface ShopItemVM {
  key: string
  name: string
  categoryLabel: string
  description: string
  price: number
  image: MediaVM | null
}

export interface PaymentMethodVM {
  key: string
  name: string
  meta: string
  steps: string[]
}

export interface ArticleCardVM {
  slug: string
  title: string
  excerpt: string
  categoryName: string | null
  publishedDate: string
}

export interface HomeVM {
  seo: SeoVM
  hero: {
    kicker: string | null
    titleLine1: string
    titleLine2: string | null
    subtitle: string | null
    promoText: string | null
    primaryCta: string | null
    secondaryCta: string | null
    image: MediaVM | null
    speedValue: string | null
    speedUnit: string | null
    speedCaption: string | null
  }
  trust: { icon: TrustIcon; title: string; text: string }[]
  coverage: {
    heading: HeadingVM | null
    hint: string | null
    resultTitle: string | null
    technology: string | null
    speedValue: string | null
    resultNote: string | null
    mapTitle: string | null
    nodesCount: number | null
    nodesLabel: string | null
    legendCity: string | null
    legendVillage: string | null
    mapHint: string | null
  }
  services: { heading: HeadingVM | null; items: { key: string; icon: ServiceIcon; title: string; description: string }[] }
  plans: {
    heading: HeadingVM | null
    connectionNote: string | null
    bySegment: Record<PlanSegment, PlanVM[]>
  }
  addons: { heading: HeadingVM | null; items: AddonVM[] }
  tv: {
    heading: HeadingVM | null
    chips: string[]
    packages: TvPackageVM[]
    channelsTitle: string | null
    channelsSubtitle: string | null
    channelsNote: string | null
    categories: { key: string; name: string }[]
    channels: TvChannelVM[]
  }
  promos: { heading: HeadingVM | null; items: PromoVM[] }
  dataCentre: { heading: HeadingVM | null; facts: { key: string; title: string; text: string }[]; services: DcServiceVM[] }
  shop: { heading: HeadingVM | null; routerNote: string | null; orderNote: string | null; items: ShopItemVM[] }
  payment: {
    heading: HeadingVM | null
    accountNote: string | null
    stepsTitle: string | null
    methods: PaymentMethodVM[]
    detailsTitle: string | null
    details: { label: string; value: string }[]
  }
  news: { heading: HeadingVM | null; items: ArticleCardVM[] }
  about: { heading: HeadingVM | null; paragraphs: string[]; stats: { value: string; label: string; tone: StatTone }[] }
  lead: { heading: HeadingVM | null }
}
