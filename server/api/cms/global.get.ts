import type { StrapiGlobal, StrapiSingleResponse } from '#shared/types/cms'
import { normalizeGlobal } from '#shared/utils/cms-normalize'

const getGlobal = cachedCms('global', async (locale: string) => {
  const res = await strapiLocalized<StrapiSingleResponse<StrapiGlobal>>(
    '/global',
    {
      'populate[phones]': true,
      'populate[socials]': true,
      'populate[defaultSeo][populate]': 'ogImage',
      'populate[logo]': true,
    },
    parseLocale(locale),
  )
  return normalizeGlobal(res.data, useRuntimeConfig().strapiUrl)
})

export default defineEventHandler((event) => getGlobal(parseLocale(getQuery(event).locale)))
