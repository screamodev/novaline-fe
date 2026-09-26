import type { GlobalVM, MediaVM, SeoVM, StrapiGlobal, StrapiMedia, StrapiSeo } from '../types/cms'

/** Turns a Strapi media relation into an absolute, server-reachable image descriptor. */
export function toMedia(media: StrapiMedia | null | undefined, mediaBase: string, fallbackAlt = ''): MediaVM | null {
  if (!media?.url) return null
  const src = /^https?:\/\//.test(media.url) ? media.url : `${mediaBase.replace(/\/$/, '')}${media.url}`
  return {
    src,
    alt: media.alternativeText || fallbackAlt,
    width: media.width ?? null,
    height: media.height ?? null,
  }
}

export function toSeo(seo: StrapiSeo | null | undefined, mediaBase: string): SeoVM {
  return {
    title: seo?.metaTitle || null,
    description: seo?.metaDescription || null,
    image: toMedia(seo?.ogImage, mediaBase),
    noIndex: !!seo?.noIndex,
  }
}

export function normalizeGlobal(raw: StrapiGlobal | null, mediaBase: string): GlobalVM {
  const g = raw ?? {}
  const phones = (g.phones ?? []).map((p) => ({
    display: p.display,
    tel: p.tel,
    primary: !!p.primary,
    viber: !!p.viber,
  }))
  // The primary number always comes first (it is emphasised in the top bar).
  phones.sort((a, b) => Number(b.primary) - Number(a.primary))

  return {
    taglineLines: (g.brandTagline ?? '').split('\n').map((l) => l.trim()).filter(Boolean),
    phones,
    email: g.email || null,
    socials: (g.socials ?? []).filter((s) => s.url),
    cabinetUrl: g.cabinetUrl || null,
    footerTagline: g.footerTagline ?? '',
    copyright: g.copyright ?? '',
    currencyLabel: g.currencyLabel ?? '',
    perMonthLabel: g.perMonthLabel ?? '',
    seo: toSeo(g.defaultSeo, mediaBase),
    organization: {
      legalName: g.orgLegalName || null,
      foundingYear: g.orgFoundingYear ?? null,
      areaServed: g.orgAreaServed || null,
      logo: toMedia(g.logo, mediaBase, 'NovaLine'),
    },
  }
}
