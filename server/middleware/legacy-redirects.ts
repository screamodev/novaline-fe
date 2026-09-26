import { legacyRedirect } from '#shared/utils/legacy-redirects'

/** 301s for URLs of the previous novaline.net site (see shared/utils/legacy-redirects.ts). */
export default defineEventHandler((event) => {
  if (event.method !== 'GET' && event.method !== 'HEAD') return
  const target = legacyRedirect(event.path.split('?')[0]!)
  if (target) return sendRedirect(event, target, 301)
})
