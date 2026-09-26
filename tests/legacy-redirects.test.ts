import { describe, expect, it } from 'vitest'
import { legacyRedirect } from '../shared/utils/legacy-redirects'

describe('legacyRedirect', () => {
  it('maps old WordPress pages with or without trailing slash', () => {
    expect(legacyRedirect('/home/tv/')).toBe('/#tv')
    expect(legacyRedirect('/home/radio-2')).toBe('/radio')
    expect(legacyRedirect('/private-cabinet/')).toBe('https://stat.novaline.net/')
    expect(legacyRedirect('/contract-offer/')).toBe('/dogovir.pdf')
  })
  it('decodes percent-encoded Cyrillic slugs', () => {
    expect(legacyRedirect('/%d0%b4%d1%80%d1%83%d0%b3%d0%b8%d0%b5-%d0%b8%d0%bd%d1%81%d1%82%d1%80%d1%83%d0%ba%d1%86%d0%b8%d0%b8/')).toBe('/#payment')
  })
  it('sends unknown Russian pages home and leaves current routes alone', () => {
    expect(legacyRedirect('/ru/something/')).toBe('/')
    expect(legacyRedirect('/ru/privacy-policy/')).toBe('/privacy')
    expect(legacyRedirect('/')).toBeNull()
    expect(legacyRedirect('/news')).toBeNull()
    expect(legacyRedirect('/radio')).toBeNull()
    expect(legacyRedirect('/%E0%A4%A')).toBeNull()
  })
})
