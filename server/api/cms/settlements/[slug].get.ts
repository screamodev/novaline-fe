import type { StrapiListResponse } from '#shared/types/cms'
import type { SettlementExtraVM } from '#shared/types/coverage'
import { toSeo } from '#shared/utils/cms-normalize'

type Raw = Record<string, any>

/** Optional per-settlement CMS overrides (intro text, SEO). The page works without them. */
const getExtra = cachedCms('settlement', async (locale: string, slug: string): Promise<SettlementExtraVM> => {
  const res = await strapiLocalized<StrapiListResponse<Raw>>(
    '/settlements',
    { 'filters[slug][$eq]': slug, 'populate[seo][populate]': 'ogImage', 'fields[0]': 'intro' },
    parseLocale(locale),
  )
  const raw = res.data[0]
  return { intro: Array.isArray(raw?.intro) ? raw.intro : [], seo: toSeo(raw?.seo, useRuntimeConfig().strapiUrl) }
})

export default defineEventHandler((event) => {
  const slug = (getRouterParam(event, 'slug') ?? '').replace(/[^a-z0-9-]/g, '').slice(0, 120)
  return getExtra(parseLocale(getQuery(event).locale), slug)
})
