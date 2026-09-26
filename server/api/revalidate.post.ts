import { isValidSecret, purgeCmsCache } from '../utils/cache-purge'

/** Strapi webhook target: purges CMS caches so the next request renders fresh content. */
export default defineEventHandler(async (event) => {
  const secret = getHeader(event, 'x-revalidate-secret')
  if (!isValidSecret(secret, useRuntimeConfig().revalidateSecret)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid revalidate secret' })
  }
  const body = await readBody<{ event?: string; model?: string }>(event).catch(() => null)
  const removed = await purgeCmsCache(useStorage('cache'))
  console.info(`[revalidate] ${body?.event ?? 'manual'} ${body?.model ?? ''} → purged ${removed} cache entries`)
  return { ok: true, removed }
})
