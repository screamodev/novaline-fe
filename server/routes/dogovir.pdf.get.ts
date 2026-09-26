import type { GlobalVM } from '#shared/types/cms'

/**
 * Stable URL of the public offer agreement (also used by the legacy novaline.net site and printed documents).
 * Redirects to the file currently uploaded in the CMS, so replacing the PDF never breaks the link.
 */
export default defineEventHandler(async (event) => {
  const global = await $fetch<GlobalVM>('/api/cms/global', { query: { locale: 'uk' } })
  if (!global.offerUrl) throw createError({ statusCode: 404 })
  return sendRedirect(event, global.offerUrl, 302)
})
