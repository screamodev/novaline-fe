import type { StrapiSingleResponse } from '#shared/types/cms'
import type { BlockNode } from '#shared/types/blocks'
import { toSeo } from '#shared/utils/cms-normalize'

interface RawPrivacy {
  title?: string
  body?: BlockNode[]
  seo?: Parameters<typeof toSeo>[0]
}

const getPrivacy = cachedCms('privacy', async (locale: string) => {
  const res = await strapiLocalized<StrapiSingleResponse<RawPrivacy>>(
    '/privacy-page',
    { 'populate[seo][populate]': 'ogImage' },
    parseLocale(locale),
  )
  if (!res.data) return null
  return { title: res.data.title ?? '', body: res.data.body ?? [], seo: toSeo(res.data.seo, useRuntimeConfig().strapiUrl) }
})

export default defineEventHandler(async (event) => {
  const page = await getPrivacy(parseLocale(getQuery(event).locale))
  if (!page) throw createError({ statusCode: 404, statusMessage: 'Privacy page not found' })
  return page
})
