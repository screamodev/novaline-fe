import type { ArticleVM } from '#shared/types/articles'
import type { Locale, StrapiListResponse } from '#shared/types/cms'
import { toArticle } from '#shared/utils/articles'

type Raw = Record<string, any>
const DETAIL_POPULATE = {
  'populate[category][fields][0]': 'slug',
  'populate[category][fields][1]': 'name',
  'populate[cover]': true,
  'populate[seo][populate]': 'ogImage',
  'populate[localizations][fields][0]': 'slug',
  'populate[localizations][fields][1]': 'locale',
}

const findBySlug = async (slug: string, locale: Locale) =>
  (await strapiGet<StrapiListResponse<Raw>>('/articles', { ...DETAIL_POPULATE, 'filters[slug][$eq]': slug, locale })).data[0]

/**
 * Article by slug in the requested locale. When the slug belongs to the other locale (e.g. after a
 * language switch without a translation), that article is returned and the page redirects accordingly.
 */
const getArticle = cachedCms('article', async (localeArg: string, slug: string): Promise<ArticleVM | null> => {
  const locale = parseLocale(localeArg)
  const other: Locale = locale === 'uk' ? 'en' : 'uk'
  const raw = (await findBySlug(slug, locale)) ?? (await findBySlug(slug, other))
  if (!raw) return null
  const related = raw.category?.slug
    ? (
        await strapiGet<StrapiListResponse<Raw>>('/articles', {
          locale: raw.locale,
          sort: 'publishedDate:desc',
          'pagination[pageSize]': 4,
          'filters[category][slug][$eq]': raw.category.slug,
          'populate[category][fields][0]': 'name',
        })
      ).data
    : []
  return toArticle(raw, useRuntimeConfig().strapiUrl, related)
})

export default defineEventHandler(async (event) => {
  const slug = (getRouterParam(event, 'slug') ?? '').replace(/[^a-z0-9-]/g, '').slice(0, 200)
  const article = slug ? await getArticle(parseLocale(getQuery(event).locale), slug) : null
  if (!article) throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  return article
})
