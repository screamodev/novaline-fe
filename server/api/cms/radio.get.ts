import type { StrapiSingleResponse } from '#shared/types/cms'
import type { RadioVM } from '#shared/types/radio'
import { toMedia, toSeo } from '#shared/utils/cms-normalize'

type Raw = Record<string, any>
export const getRadio = cachedCms('radio', async (locale: string): Promise<RadioVM | null> => {
  const res = await strapiLocalized<StrapiSingleResponse<Raw>>(
    '/radio',
    { 'populate[genres]': true, 'populate[streams]': true, 'populate[background]': true, 'populate[artwork]': true, 'populate[seo][populate]': 'ogImage' },
    parseLocale(locale),
  )
  const r = res.data
  if (!r) return null
  const base = useRuntimeConfig().strapiUrl
  return {
    title: r.title ?? 'NovaLine Radio',
    subtitle: r.subtitle ?? '',
    liveLabel: r.liveLabel ?? '',
    genres: (r.genres ?? []).map((g: Raw) => g.text).filter(Boolean),
    nowPlayingTitle: r.nowPlayingTitle ?? '',
    nowPlayingArtist: r.nowPlayingArtist ?? '',
    streams: (r.streams ?? []).filter((s: Raw) => s.url).map((s: Raw) => ({ label: s.label, bitrate: s.bitrate, url: s.url })),
    background: toMedia(r.background, base),
    artwork: toMedia(r.artwork, base),
    hint: r.hint ?? '',
    indexable: !!r.indexable,
    hasStatus: !!r.statusUrl,
    seo: toSeo(r.seo, base),
  }
})

export default defineEventHandler(async (event) => {
  const radio = await getRadio(parseLocale(getQuery(event).locale))
  if (!radio) throw createError({ statusCode: 404, statusMessage: 'Radio not configured' })
  return radio
})
