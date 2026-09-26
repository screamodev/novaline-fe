import type { CoverageTreeVM } from '#shared/types/coverage'

const getCoverage = cachedCms('coverage', async (locale: string) => {
  const res = await strapiGet<{ data: CoverageTreeVM | null }>('/coverage', { locale: parseLocale(locale) })
  return res.data ?? { regions: [], settlementCount: 0 }
})

export default defineEventHandler((event) => getCoverage(parseLocale(getQuery(event).locale)))
