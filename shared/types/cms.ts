/**
 * CMS contract types.
 * Raw shapes mirror `novaline-be/specs/001-content-model/contracts/rest-api.md` (Strapi 5 flat format);
 * view models are what server routes return to the app after normalisation.
 */

export type Locale = 'uk' | 'en'
export const LOCALES: readonly Locale[] = ['uk', 'en'] as const
export const DEFAULT_LOCALE: Locale = 'uk'

// ---------- raw Strapi shapes ----------

export interface StrapiMedia {
  url: string
  alternativeText?: string | null
  width?: number | null
  height?: number | null
}

export interface StrapiSeo {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: StrapiMedia | null
  noIndex?: boolean | null
}

export interface StrapiPhone {
  display: string
  tel: string
  primary?: boolean | null
  viber?: boolean | null
}

export type SocialNetwork = 'instagram' | 'telegram' | 'facebook' | 'youtube' | 'viber'

export interface StrapiGlobal {
  brandTagline?: string | null
  phones?: StrapiPhone[] | null
  email?: string | null
  socials?: { network: SocialNetwork; url: string }[] | null
  cabinetUrl?: string | null
  offerDocument?: StrapiMedia | null
  footerTagline?: string | null
  copyright?: string | null
  currencyLabel?: string | null
  perMonthLabel?: string | null
  defaultSeo?: StrapiSeo | null
  orgLegalName?: string | null
  orgFoundingYear?: number | null
  orgAreaServed?: string | null
  logo?: StrapiMedia | null
}

export interface StrapiSingleResponse<T> {
  data: T | null
}

export interface StrapiListResponse<T> {
  data: T[]
  meta?: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } }
}

// ---------- view models ----------

export interface MediaVM {
  /** Absolute URL reachable by the Nuxt server (fed to @nuxt/image). */
  src: string
  alt: string
  width: number | null
  height: number | null
}

export interface SeoVM {
  title: string | null
  description: string | null
  image: MediaVM | null
  noIndex: boolean
}

export interface PhoneVM {
  display: string
  tel: string
  primary: boolean
  viber: boolean
}

export interface GlobalVM {
  taglineLines: string[]
  phones: PhoneVM[]
  email: string | null
  socials: { network: SocialNetwork; url: string }[]
  cabinetUrl: string | null
  /** Public offer agreement (PDF): `/uploads/…` (proxied to Strapi) or an absolute URL. */
  offerUrl: string | null
  footerTagline: string
  copyright: string
  currencyLabel: string
  perMonthLabel: string
  seo: SeoVM
  organization: {
    legalName: string | null
    foundingYear: number | null
    areaServed: string | null
    logo: MediaVM | null
  }
}
