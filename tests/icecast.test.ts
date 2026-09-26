import { describe, expect, it } from 'vitest'
import { pickNowPlaying } from '../shared/utils/icecast'

const status = {
  icestats: {
    source: [
      { listenurl: 'http://stream.novaline.fm:8001/Novaline_128', title: 'ONUKA - Vidlik' },
      { listenurl: 'http://stream.novaline.fm:8001/Novaline_320', title: 'Jamala - 1944' },
    ],
  },
}

describe('pickNowPlaying', () => {
  it('matches the source by mount point regardless of host/port', () => {
    expect(pickNowPlaying(status, 'https://stream.novaline.net.ua/Novaline_320')).toEqual({ title: '1944', artist: 'Jamala' })
  })
  it('falls back to any source with a title and handles a single source object', () => {
    expect(pickNowPlaying({ icestats: { source: { title: 'Live mix' } } }, 'x')).toEqual({ title: 'Live mix', artist: null })
  })
  it('returns null for unexpected payloads', () => {
    expect(pickNowPlaying(null, 'x')).toBeNull()
    expect(pickNowPlaying({ icestats: {} }, 'x')).toBeNull()
  })
})
