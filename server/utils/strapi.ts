import { DEFAULT_LOCALE, type Locale } from '#shared/types/cms'

type Query = Record<string, string | number | boolean>

export const parseLocale = (value: unknown): Locale => (value === 'en' ? 'en' : DEFAULT_LOCALE)

/**
 * Server-side GET to the Strapi REST API with the private token.
 * A 404 (e.g. a single type without an entry in this locale) resolves to `{ data: null }`.
 */
export async function strapiGet<T>(path: string, query: Query = {}): Promise<T> {
  const { strapiUrl, strapiToken } = useRuntimeConfig()
  try {
    return await $fetch<T>(path, {
      baseURL: `${strapiUrl}/api`,
      query,
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : undefined,
      timeout: 8000,
    })
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode === 404) return { data: null } as T
    throw createError({ statusCode: 503, statusMessage: 'CMS unavailable', cause: error })
  }
}

const isEmpty = (res: { data: unknown }) => res.data == null || (Array.isArray(res.data) && res.data.length === 0)

/** Fetches in the requested locale and falls back to the default locale when nothing is published there. */
export async function strapiLocalized<T extends { data: unknown }>(path: string, query: Query, locale: Locale): Promise<T> {
  const res = await strapiGet<T>(path, { ...query, locale })
  if (locale !== DEFAULT_LOCALE && isEmpty(res)) return strapiGet<T>(path, { ...query, locale: DEFAULT_LOCALE })
  return res
}

/** Server-side POST to Strapi with the private token (e.g. creating leads). */
export async function strapiPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const { strapiUrl, strapiToken } = useRuntimeConfig()
  return $fetch<T, string>(path, {
    baseURL: `${strapiUrl}/api`,
    method: 'POST',
    body,
    headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : undefined,
    timeout: 8000,
  })
}
