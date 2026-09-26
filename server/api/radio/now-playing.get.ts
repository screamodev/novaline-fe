import type { StrapiSingleResponse } from '#shared/types/cms'
import { type NowPlaying, pickNowPlaying } from '#shared/utils/icecast'

/** Live track title from the Icecast status JSON (URL kept server-side in the CMS), cached briefly. */
const getNowPlaying = defineCachedFunction(
  async (streamUrl: string): Promise<NowPlaying | null> => {
    const radio = await strapiGet<StrapiSingleResponse<{ statusUrl?: string; streams?: { url: string }[] }>>('/radio', {
      'fields[0]': 'statusUrl',
      'populate[streams][fields][0]': 'url',
    }).catch(() => null)
    const statusUrl = radio?.data?.statusUrl
    // Only streams configured in the CMS can be queried.
    if (!statusUrl || !radio?.data?.streams?.some((s) => s.url === streamUrl)) return null
    const status = await $fetch<unknown>(statusUrl, { timeout: 4000 }).catch(() => null)
    return pickNowPlaying(status, streamUrl)
  },
  { name: 'radio-now-playing', maxAge: 10, getKey: (url: string) => url.replace(/[^a-zA-Z0-9]/g, '_') },
)

export default defineEventHandler(async (event) => {
  const stream = String(getQuery(event).stream ?? '').slice(0, 300)
  return { nowPlaying: stream ? await getNowPlaying(stream) : null }
})
