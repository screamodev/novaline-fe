import type { MediaVM, SeoVM } from './cms'

export interface RadioVM {
  title: string
  subtitle: string
  liveLabel: string
  genres: string[]
  nowPlayingTitle: string
  nowPlayingArtist: string
  streams: { label: string; bitrate: string; url: string }[]
  background: MediaVM | null
  artwork: MediaVM | null
  hint: string
  indexable: boolean
  hasStatus: boolean
  seo: SeoVM
}
