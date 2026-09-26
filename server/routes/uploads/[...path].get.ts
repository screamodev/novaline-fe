/**
 * Read-only proxy for Strapi uploads (e.g. PDF documents linked from the site).
 * Strapi itself is not exposed publicly; images go through @nuxt/image instead.
 */
const SAFE_PATH = /^[\w.-]+(?:\/[\w.-]+)*$/

export default defineEventHandler((event) => {
  const path = getRouterParam(event, 'path') ?? ''
  if (!SAFE_PATH.test(path) || path.includes('..')) {
    throw createError({ statusCode: 404 })
  }
  // Strapi file names carry a content hash, so they can be cached for long.
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400')
  return proxyRequest(event, `${useRuntimeConfig().strapiUrl}/uploads/${path}`)
})
