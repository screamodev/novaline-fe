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
  url: string | null
}

export interface ArticleCardVM {
  slug: string
  title: string
  excerpt: string
  categoryName: string | null
  publishedDate: string
}

export type CtaAction = 'order' | 'callback' | 'coverage' | 'link'
export type CtaVariant = 'violet' | 'coral' | 'white'
export type SlideTheme = 'light' | 'violet' | 'navy'

/** A CMS-driven button: the label plus what clicking it does. */
export interface CtaVM {
  label: string
  action: CtaAction
  /** Only for `link`: a site path (`/radio`, `/#tv`) or an absolute https URL. */
  url: string | null
  variant: CtaVariant
}

export interface HeroSlideVM {
  key: string
  theme: SlideTheme
  kicker: string | null
  title: string
  titleAccent: string | null
  subtitle: string | null
  image: MediaVM | null
  highlight: { value: string; unit: string | null; caption: string | null } | null
  primaryCta: CtaVM | null
  secondaryCta: CtaVM | null
}

export interface HomeVM {
  seo: SeoVM
  /** Active hero slides in display order; never empty when the CMS has a home page (falls back to `home-page.hero`). */
  slides: HeroSlideVM[]
  trust: { icon: TrustIcon; title: string; text: string }[]
  coverage: {
    heading: HeadingVM | null
    hint: string | null
    resultTitle: string | null
    resultNote: string | null
  }
  services: { heading: HeadingVM | null; items: { key: string; icon: ServiceIcon; title: string; description: string }[] }
  plans: {
    heading: HeadingVM | null
    /** Static business plans (home prices depend on the locality, see coverage offers). */
    business: PlanVM[]
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
