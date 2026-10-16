import { describe, expect, it } from 'vitest'
import { blocksToParagraphs, businessPlans, isActive, kyivToday, normalizeHome, toCta, type HomeRaw } from '../shared/utils/home-normalize'

const emptyRaw = (): HomeRaw => ({
  page: null, slides: [], services: [], plans: [], addons: [], tvPackages: [], tvCategories: [], tvChannels: [], promos: [],
  dcServices: [], dcFacts: [], shopItems: [], paymentMethods: [], paymentDetails: null, articles: [],
})

describe('businessPlans', () => {
  it('keeps only business plans and negotiable prices as labels', () => {
    const plans = businessPlans([
      { key: 'a', segment: 'private', name: 'Старт', price: '210.00', features: [{ text: 'x' }] },
      { key: 'b', segment: 'business', name: 'Бізнес', price: '450', pricePrefix: 'від' },
      { key: 'c', segment: 'business', name: 'Індивідуально', price: null, priceLabel: 'договірна' },
      { key: 'd', segment: 'unknown', name: '?' },
    ])
    expect(plans.map((p) => p.key)).toEqual(['b', 'c'])
    expect(plans.map((p) => p.price)).toEqual([
      { amount: 450, prefix: 'від', label: null },
      { amount: null, prefix: null, label: 'договірна' },
    ])
  })
})

describe('normalizeHome', () => {
  it('drops expired promos and channels without a category', () => {
    const raw = emptyRaw()
    raw.promos = [
      { key: 'old', title: 'Old', validUntil: '2026-01-01' },
      { key: 'new', title: 'New', validUntil: '2026-12-31', accent: 'coral' },
      { key: 'forever', title: 'Forever', validUntil: null },
    ]
    raw.tvChannels = [
      { key: '1', name: '1+1', tier: 'min', category: { key: 'ukrainian' } },
      { key: '2', name: 'Orphan', tier: 'min', category: null },
    ]
    const vm = normalizeHome(raw, 'http://cms:1337', '2026-09-26')
    expect(vm.promos.items.map((p) => p.key)).toEqual(['new', 'forever'])
    expect(vm.promos.items[0]!.accent).toBe('coral')
    expect(vm.tv.channels.map((c) => c.key)).toEqual(['1'])
  })

  it('survives a completely empty CMS', () => {
    const vm = normalizeHome(emptyRaw(), '', '2026-09-26')
    expect(vm.slides).toEqual([])
    expect(vm.services.heading).toBeNull()
    expect(vm.plans.business).toEqual([])
  })
})

describe('hero slides', () => {
  const slide = (key: string, extra: Record<string, unknown> = {}) => ({ key, title: `Title ${key}`, ...extra })

  it('maps a slide with media, highlight and CTAs', () => {
    const raw = emptyRaw()
    raw.slides = [
      slide('pon', {
        theme: 'navy',
        kicker: 'GPON',
        titleAccent: 'PON',
        image: { url: '/uploads/a.png', width: 1400, height: 900, alternativeText: 'lib alt' },
        imageAlt: 'page alt',
        highlightValue: '1000',
        highlightUnit: 'Mbps',
        primaryCta: { label: 'Check', action: 'coverage', url: 'ignored', variant: 'coral' },
        secondaryCta: { label: 'Talk', action: 'callback' },
      }),
    ]
    const [vm] = normalizeHome(raw, 'http://cms:1337', '2026-10-16').slides
    expect(vm).toMatchObject({
      key: 'pon',
      theme: 'navy',
      titleAccent: 'PON',
      image: { src: 'http://cms:1337/uploads/a.png', alt: 'page alt' },
      highlight: { value: '1000', unit: 'Mbps', caption: null },
      primaryCta: { label: 'Check', action: 'coverage', url: null, variant: 'coral' },
      secondaryCta: { label: 'Talk', action: 'callback', variant: 'white' },
    })
  })

  it.each([
    [{}, true],
    [{ activeFrom: '2026-10-16' }, true],
    [{ activeFrom: '2026-10-17' }, false],
    [{ activeUntil: '2026-10-16' }, true],
    [{ activeUntil: '2026-10-15' }, false],
    [{ activeFrom: '2026-10-01', activeUntil: '2026-10-31' }, true],
  ])('activity window %o → %s', (dates, expected) => {
    expect(isActive(dates, '2026-10-16')).toBe(expected)
  })

  it('drops inactive and untitled slides, keeping CMS order', () => {
    const raw = emptyRaw()
    raw.slides = [slide('a'), slide('expired', { activeUntil: '2026-01-01' }), { key: 'untitled', title: '  ' }, slide('b')]
    expect(normalizeHome(raw, '', '2026-10-16').slides.map((s) => s.key)).toEqual(['a', 'b'])
  })

  it('falls back to the home-page hero when no slide is active', () => {
    const raw = emptyRaw()
    raw.page = { hero: { kicker: 'K', titleLine1: 'Fast', titleLine2: 'fibre', primaryCta: 'Check', secondaryCta: 'Consult', speedValue: '1000' } }
    raw.slides = [slide('future', { activeFrom: '2027-01-01' })]
    const slides = normalizeHome(raw, '', '2026-10-16').slides
    expect(slides).toHaveLength(1)
    expect(slides[0]).toMatchObject({
      key: 'hero',
      title: 'Fast',
      titleAccent: 'fibre',
      highlight: { value: '1000' },
      primaryCta: { action: 'coverage', label: 'Check' },
      secondaryCta: { action: 'order', label: 'Consult', variant: 'white' },
    })
  })

  it('rejects CTAs without a label or links without a URL', () => {
    expect(toCta({ action: 'order' })).toBeNull()
    expect(toCta({ label: 'Go', action: 'link', url: ' ' })).toBeNull()
    expect(toCta({ label: 'Go', action: 'link', url: '/radio' })).toEqual({ label: 'Go', action: 'link', url: '/radio', variant: 'violet' })
    expect(toCta({ label: 'Go', action: 'weird', variant: 'pink' })).toEqual({ label: 'Go', action: 'order', url: null, variant: 'violet' })
  })
})

describe('helpers', () => {
  it('extracts paragraph text from blocks', () => {
    expect(blocksToParagraphs([
      { type: 'paragraph', children: [{ type: 'text', text: 'Hello ' }, { type: 'text', text: 'world' }] },
      { type: 'heading', children: [{ type: 'text', text: 'skip' }] },
    ])).toEqual(['Hello world'])
  })
  it('computes the Kyiv date', () => {
    expect(kyivToday(new Date('2026-09-26T22:30:00Z'))).toBe('2026-09-27')
  })
})
