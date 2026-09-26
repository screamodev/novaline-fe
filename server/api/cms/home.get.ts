import type { Locale, StrapiListResponse, StrapiSingleResponse } from '#shared/types/cms'
import { type HomeRaw, kyivToday, normalizeHome } from '#shared/utils/home-normalize'

type Raw = Record<string, any>
const ALL = { 'pagination[pageSize]': 500, sort: 'order:asc' }

const HOME_POPULATE = {
  'populate[hero][populate]': 'image',
  'populate[trustItems]': true,
  'populate[coverage][populate]': 'heading',
  'populate[services]': true,
  'populate[plans]': true,
  'populate[addons]': true,
  'populate[tv]': true,
  'populate[tvChips]': true,
  'populate[promos]': true,
  'populate[dataCentre]': true,
  'populate[shop]': true,
  'populate[payment]': true,
  'populate[news]': true,
  'populate[about][populate]': '*',
  'populate[lead]': true,
  'populate[seo][populate]': 'ogImage',
}

const list = async (path: string, query: Record<string, string | number | boolean>, locale: Locale) =>
  (await strapiLocalized<StrapiListResponse<Raw>>(path, { ...ALL, ...query }, locale)).data
const single = async (path: string, query: Record<string, string | number | boolean>, locale: Locale) =>
  (await strapiLocalized<StrapiSingleResponse<Raw>>(path, query, locale)).data

const getHome = cachedCms('home', async (localeArg: string) => {
  const locale = parseLocale(localeArg)
  const today = kyivToday()
  const [page, services, plans, addons, tvPackages, tvCategories, tvChannels, promos, dcServices, dcFacts, shopItems, paymentMethods, paymentDetails, articles] =
    await Promise.all([
      single('/home-page', HOME_POPULATE, locale),
      list('/services', {}, locale),
      list('/plans', { populate: 'features' }, locale),
      list('/addons', {}, locale),
      list('/tv-packages', { populate: 'features' }, locale),
      list('/tv-categories', {}, locale),
      list('/tv-channels', { 'populate[category][fields]': 'key' }, locale),
      list('/promos', { 'filters[validUntil][$gte]': today }, locale),
      list('/dc-services', {}, locale),
      list('/dc-facts', {}, locale),
      list('/shop-items', { populate: 'image' }, locale),
      list('/payment-methods', { populate: 'steps' }, locale),
      single('/payment-details', { populate: 'items' }, locale),
      list('/articles', { sort: 'publishedDate:desc', 'pagination[pageSize]': 6, 'populate[category][fields]': 'name' }, locale),
    ])
  const raw: HomeRaw = { page, services, plans, addons, tvPackages, tvCategories, tvChannels, promos, dcServices, dcFacts, shopItems, paymentMethods, paymentDetails, articles }
  return normalizeHome(raw, useRuntimeConfig().strapiUrl, today)
})

export default defineEventHandler((event) => getHome(parseLocale(getQuery(event).locale)))
