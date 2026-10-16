import type { StrapiListResponse, StrapiSingleResponse } from '#shared/types/cms'
import { normalizeCareers } from '#shared/utils/careers'

type Raw = Record<string, any>

const getCareers = cachedCms('careers', async (locale: string) => {
  const loc = parseLocale(locale)
  const [page, vacancies] = await Promise.all([
    strapiLocalized<StrapiSingleResponse<Raw>>(
      '/careers-page',
      {
        'populate[hero]': true,
        'populate[heroImage]': true,
        'populate[benefits]': true,
        'populate[hrPhone]': true,
        'populate[seo][populate]': 'ogImage',
      },
      loc,
    ),
    strapiLocalized<StrapiListResponse<Raw>>(
      '/vacancies',
      {
        sort: 'order:asc',
        'populate[responsibilities]': true,
        'populate[requirements]': true,
        'populate[offer]': true,
        'pagination[pageSize]': 100,
      },
      loc,
    ),
  ])
  return normalizeCareers(page.data, vacancies.data, useRuntimeConfig().strapiUrl)
})

export default defineEventHandler((event) => getCareers(parseLocale(getQuery(event).locale)))
