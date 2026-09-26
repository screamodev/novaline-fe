import type { StrapiListResponse } from '#shared/types/cms'
import type { CoverageTreeVM } from '#shared/types/coverage'

type Raw = Record<string, any>
const SITEMAP = { uk: 'uk-UA', en: 'en-US' } as const
const path = (locale: 'uk' | 'en', p: string) => (locale === 'uk' ? p : `/en${p}`)

/**
 * Dynamic sitemap entries from the CMS: articles (per-locale slugs with hreflang alternatives),
 * and locality pages (same slug in both locales). /radio comes from the page itself and is filtered in
 * `server/plugins/sitemap-radio.ts` when the CMS marks it non-indexable.
 */
export default defineSitemapEventHandler(async () => {
  const [articles, coverage] = await Promise.all([
    strapiGet<StrapiListResponse<Raw>>('/articles', {
      locale: 'uk',
      'fields[0]': 'slug',
      'fields[1]': 'updatedAt',
      'populate[localizations][fields][0]': 'slug',
      'populate[localizations][fields][1]': 'locale',
      'populate[localizations][fields][2]': 'updatedAt',
      'pagination[pageSize]': 1000,
    }),
    strapiGet<{ data: CoverageTreeVM | null }>('/coverage', { locale: 'uk' }),
  ])

  const articleEntries = articles.data.flatMap((a) => {
    const en = (a.localizations as Raw[] | undefined)?.find((l) => l.locale === 'en')
    const versions = [{ locale: 'uk' as const, slug: a.slug, updatedAt: a.updatedAt }, ...(en ? [{ locale: 'en' as const, slug: en.slug, updatedAt: en.updatedAt }] : [])]
    const alternatives = versions.map((v) => ({ hreflang: SITEMAP[v.locale], href: path(v.locale, `/news/${v.slug}`) }))
    return versions.map((v) => ({
      loc: path(v.locale, `/news/${v.slug}`),
      lastmod: v.updatedAt,
      _sitemap: SITEMAP[v.locale],
      alternatives: [...alternatives, { hreflang: 'x-default', href: `/news/${a.slug}` }],
    }))
  })

  const localityEntries = (coverage.data?.regions ?? [])
    .flatMap((r) => r.districts.flatMap((d) => d.settlements))
    .map((s) => ({ loc: `/internet/${s.slug}`, _i18nTransform: true, changefreq: 'weekly' as const }))

  return [...articleEntries, ...localityEntries]
})
