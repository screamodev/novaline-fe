/** Icecast `status-json.xsl` → current track for a given stream URL. */
interface IcecastSource {
  listenurl?: string
  title?: string
  artist?: string
}

export interface NowPlaying {
  title: string
  artist: string | null
}

/** Mount point of a stream URL, e.g. "/Novaline_320". */
const mount = (url: string) => {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

export function pickNowPlaying(status: unknown, streamUrl: string): NowPlaying | null {
  const raw = (status as { icestats?: { source?: IcecastSource | IcecastSource[] } })?.icestats?.source
  const sources = Array.isArray(raw) ? raw : raw ? [raw] : []
  const source = sources.find((s) => s.listenurl && mount(s.listenurl) === mount(streamUrl)) ?? sources.find((s) => s.title)
  const title = source?.title?.trim()
  if (!title) return null
  if (source?.artist) return { title, artist: source.artist }
  // Most stations publish "Artist - Song" in the title field.
  const i = title.indexOf(' - ')
  return i > 0 ? { title: title.slice(i + 3).trim(), artist: title.slice(0, i).trim() } : { title, artist: null }
}
