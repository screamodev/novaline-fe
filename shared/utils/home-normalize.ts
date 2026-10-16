import type {
  AddonVM,
  ArticleCardVM,
  CtaAction,
  CtaVM,
  CtaVariant,
  HeroSlideVM,
  SlideTheme,
  DcServiceVM,
  HeadingVM,
  HomeVM,
  PaymentMethodVM,
  PlanSegment,
  PlanVM,
  PriceVM,
  PromoVM,
  ShopItemVM,
  TvChannelVM,
  TvPackageVM,
} from '../types/home'
import { PLAN_SEGMENTS } from '../types/home'
import { toArticleCard } from './articles'
import { toMedia, toSeo } from './cms-normalize'

/** Raw Strapi documents are loosely typed here; the normaliser is the single place that knows their shape. */
type Raw = Record<string, any>

/** Everything `/api/cms/home` fetched, in raw form. */
export interface HomeRaw {
  page: Raw | null
  slides: Raw[]
  services: Raw[]
  plans: Raw[]
  addons: Raw[]
  tvPackages: Raw[]
  tvCategories: Raw[]
  tvChannels: Raw[]
  promos: Raw[]
  dcServices: Raw[]
  dcFacts: Raw[]
  shopItems: Raw[]
  paymentMethods: Raw[]
  paymentDetails: Raw | null
  articles: Raw[]
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const opt = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v : null)
const num = (v: unknown): number | null => (v === null || v === undefined || v === '' ? null : Number(v))
/** The page-level alt text (edited with the copy) wins over the media library alt. */
const withAlt = <T extends { alt: string }>(media: T | null, alt: string | null): T | null => (media && alt ? { ...media, alt } : media)
const texts = (list: unknown): string[] => (Array.isArray(list) ? list.map((f) => str(f?.text)).filter(Boolean) : [])

export function toHeading(h: Raw | null | undefined): HeadingVM | null {
  if (!h?.title) return null
  return { kicker: opt(h.kicker), title: h.title, subtitle: opt(h.subtitle) }
}

export function toPrice(amount: unknown, prefix?: unknown, label?: unknown): PriceVM {
  return { amount: num(amount), prefix: opt(prefix), label: opt(label) }
}

/** Plain text of Strapi Blocks paragraphs (used for simple rich-text fields such as the about text). */
export function blocksToParagraphs(blocks: unknown): string[] {
  if (!Array.isArray(blocks)) return []
  return blocks
    .filter((b) => b?.type === 'paragraph')
    .map((b) => (Array.isArray(b.children) ? b.children.map((c: Raw) => str(c?.text)).join('') : ''))
    .filter((p) => p.trim())
}

/** Today's date (YYYY-MM-DD) in Kyiv, the business timezone for promo validity. */
export function kyivToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv' }).format(now)
}

const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback

const CTA_ACTIONS: readonly CtaAction[] = ['order', 'callback', 'coverage', 'link']
const CTA_VARIANTS: readonly CtaVariant[] = ['violet', 'coral', 'white']
const SLIDE_THEMES: readonly SlideTheme[] = ['light', 'violet', 'navy']

/** A CMS button; dropped when it has no label or is a link without a URL. */
export function toCta(c: Raw | null | undefined, fallbackVariant: CtaVariant = 'violet'): CtaVM | null {
  const label = opt(c?.label)
  if (!c || !label) return null
  const action = oneOf(c.action, CTA_ACTIONS, 'order')
  const url = opt(c.url)?.trim() ?? null
  if (action === 'link' && !url) return null
  return { label, action, url: action === 'link' ? url : null, variant: oneOf(c.variant, CTA_VARIANTS, fallbackVariant) }
}

/** Whether `today` (YYYY-MM-DD) is inside the slide's optional activeFrom…activeUntil window. */
export const isActive = (s: Raw, today: string): boolean =>
  (!s.activeFrom || s.activeFrom <= today) && (!s.activeUntil || s.activeUntil >= today)

export function toSlide(s: Raw, mediaBase: string): HeroSlideVM {
  const value = opt(s.highlightValue)
  return {
    key: str(s.key),
    theme: oneOf(s.theme, SLIDE_THEMES, 'light'),
    kicker: opt(s.kicker),
    title: str(s.title),
    titleAccent: opt(s.titleAccent),
    subtitle: opt(s.subtitle),
    image: withAlt(toMedia(s.image, mediaBase), opt(s.imageAlt)),
    highlight: value ? { value, unit: opt(s.highlightUnit), caption: opt(s.highlightCaption) } : null,
    primaryCta: toCta(s.primaryCta),
    secondaryCta: toCta(s.secondaryCta, 'white'),
  }
}

/** The legacy single hero (`home-page.hero`) as one slide: shown when no slide is active. */
export function heroAsSlide(hero: Raw, mediaBase: string): HeroSlideVM {
  return toSlide(
    {
      key: 'hero',
      theme: 'light',
      kicker: hero.kicker,
      title: hero.titleLine1,
      titleAccent: hero.titleLine2,
      subtitle: hero.subtitle,
      image: hero.image,
      imageAlt: hero.imageAlt,
      highlightValue: hero.speedValue,
      highlightUnit: hero.speedUnit,
      highlightCaption: hero.speedCaption,
      primaryCta: hero.primaryCta ? { label: hero.primaryCta, action: 'coverage' } : null,
      secondaryCta: hero.secondaryCta ? { label: hero.secondaryCta, action: 'order', variant: 'white' } : null,
    },
    mediaBase,
  )
}

const plan = (p: Raw): PlanVM => ({
  key: str(p.key),
  segment: p.segment as PlanSegment,
  name: str(p.name),
  speedLabel: str(p.speedLabel),
  price: toPrice(p.price, p.pricePrefix, p.priceLabel),
  periodLabel: str(p.periodLabel),
  popular: !!p.popular,
  features: texts(p.features),
})

/** Only business plans are shown statically; home prices come from the coverage offers of the chosen locality. */
export const businessPlans = (plans: Raw[]): PlanVM[] => plans.filter((p) => p.segment === 'business').map(plan)

export function normalizeHome(raw: HomeRaw, mediaBase: string, today = kyivToday()): HomeVM {
  const page = raw.page ?? {}
  const active = raw.slides.filter((s) => isActive(s, today) && opt(s.title)).map((s) => toSlide(s, mediaBase))
  const slides = active.length ? active : page.hero?.titleLine1 ? [heroAsSlide(page.hero, mediaBase)] : []

  const addons: AddonVM[] = raw.addons.map((a) => ({
    key: str(a.key),
    title: str(a.title),
    description: str(a.description),
    price: toPrice(a.price, null, a.priceLabel),
    unitLabel: opt(a.unitLabel),
    highlighted: !!a.highlighted,
  }))

  const tvPackages: TvPackageVM[] = raw.tvPackages.map((p) => ({
    key: str(p.key),
    name: str(p.name),
    channelsLabel: str(p.channelsLabel),
    price: num(p.price) ?? 0,
    popular: !!p.popular,
    features: texts(p.features),
  }))
  const tvChannels: TvChannelVM[] = raw.tvChannels
    .filter((c) => c.category?.key)
    .map((c) => ({ key: str(c.key), name: str(c.name), categoryKey: c.category.key, tier: c.tier }))

  const promos: PromoVM[] = raw.promos
    .filter((p) => !p.validUntil || p.validUntil >= today)
    .map((p) => ({
      key: str(p.key),
      title: str(p.title),
      tag: str(p.tag),
      description: str(p.description),
      terms: str(p.terms),
      validUntil: opt(p.validUntil),
      accent: p.accent === 'coral' ? 'coral' : 'violet',
    }))

  const dcServices: DcServiceVM[] = raw.dcServices.map((d) => ({
    key: str(d.key),
    title: str(d.title),
    description: str(d.description),
    price: num(d.price),
    unitLabel: opt(d.unitLabel),
  }))

  const shopItems: ShopItemVM[] = raw.shopItems.map((s) => ({
    key: str(s.key),
    name: str(s.name),
    categoryLabel: str(s.categoryLabel),
    description: str(s.description),
    price: num(s.price) ?? 0,
    image: toMedia(s.image, mediaBase, str(s.name)),
  }))

  const methods: PaymentMethodVM[] = raw.paymentMethods.map((m) => ({
    key: str(m.key),
    name: str(m.name),
    meta: str(m.meta),
    steps: texts(m.steps),
    url: opt(m.url),
  }))

  const articles: ArticleCardVM[] = raw.articles.map(toArticleCard)

  return {
    seo: toSeo(page.seo, mediaBase),
    slides,
    trust: (page.trustItems ?? []).map((t: Raw) => ({ icon: t.icon, title: str(t.title), text: str(t.text) })),
    coverage: {
      heading: toHeading(page.coverage?.heading),
      hint: opt(page.coverage?.hint),
      resultTitle: opt(page.coverage?.resultTitle),
      resultNote: opt(page.coverage?.resultNote),
    },
    services: {
      heading: toHeading(page.services),
      items: raw.services.map((s) => ({ key: str(s.key), icon: s.icon, title: str(s.title), description: str(s.description) })),
    },
    plans: { heading: toHeading(page.plans), business: businessPlans(raw.plans) },
    addons: { heading: toHeading(page.addons), items: addons },
    tv: {
      heading: toHeading(page.tv),
      chips: texts(page.tvChips),
      packages: tvPackages,
      channelsTitle: opt(page.tvChannelsTitle),
      channelsSubtitle: opt(page.tvChannelsSubtitle),
      channelsNote: opt(page.tvChannelsNote),
      categories: raw.tvCategories.map((c) => ({ key: str(c.key), name: str(c.name) })),
      channels: tvChannels,
    },
    promos: { heading: toHeading(page.promos), items: promos },
    dataCentre: {
      heading: toHeading(page.dataCentre),
      facts: raw.dcFacts.map((f) => ({ key: str(f.key), title: str(f.title), text: str(f.text) })),
      services: dcServices,
    },
    shop: { heading: toHeading(page.shop), routerNote: opt(page.shopRouterNote), orderNote: opt(page.shopOrderNote), items: shopItems },
    payment: {
      heading: toHeading(page.payment),
      accountNote: opt(page.paymentAccountNote),
      stepsTitle: opt(page.paymentStepsTitle),
      methods,
      detailsTitle: opt(page.paymentDetailsTitle),
      details: (raw.paymentDetails?.items ?? []).map((i: Raw) => ({ label: str(i.label), value: str(i.value) })),
    },
    news: { heading: toHeading(page.news), items: articles },
    about: {
      heading: toHeading(page.about?.heading),
      paragraphs: blocksToParagraphs(page.about?.body),
      stats: (page.about?.stats ?? []).map((s: Raw) => ({ value: str(s.value), label: str(s.label), tone: s.tone ?? 'glass' })),
    },
    lead: { heading: toHeading(page.lead) },
  }
}
