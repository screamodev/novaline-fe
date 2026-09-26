import type { StrapiSingleResponse } from '#shared/types/cms'

/** Drops /radio from the sitemap unless the CMS `radio.indexable` flag is on (the page is noindex then too). */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:resolved', async (ctx) => {
    const res = await strapiGet<StrapiSingleResponse<{ indexable?: boolean }>>('/radio', { 'fields[0]': 'indexable' }).catch(() => null)
    if (res?.data?.indexable) return
    ctx.urls = ctx.urls.filter((u) => !/\/radio\/?$/.test(typeof u === 'string' ? u : u.loc))
  })
})
