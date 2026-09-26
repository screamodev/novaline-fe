import { describe, expect, it } from 'vitest'
import { blocksToParagraphs, groupPlans, kyivToday, normalizeHome, type HomeRaw } from '../shared/utils/home-normalize'

const emptyRaw = (): HomeRaw => ({
  page: null, services: [], plans: [], addons: [], tvPackages: [], tvCategories: [], tvChannels: [], promos: [],
  dcServices: [], dcFacts: [], shopItems: [], paymentMethods: [], paymentDetails: null, articles: [],
})

describe('groupPlans', () => {
  it('groups by segment and keeps negotiable prices as labels', () => {
    const g = groupPlans([
      { key: 'a', segment: 'private', name: 'Старт', price: '210.00', features: [{ text: 'x' }] },
      { key: 'b', segment: 'business', name: 'Бізнес', price: '450', pricePrefix: 'від' },
      { key: 'c', segment: 'business', name: 'Індивідуально', price: null, priceLabel: 'договірна' },
      { key: 'd', segment: 'unknown', name: '?' },
    ])
    expect(g.private[0]).toMatchObject({ key: 'a', price: { amount: 210, prefix: null, label: null }, features: ['x'] })
    expect(g.business.map((p) => p.price)).toEqual([
      { amount: 450, prefix: 'від', label: null },
      { amount: null, prefix: null, label: 'договірна' },
    ])
    expect(g.apartment).toEqual([])
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
    expect(vm.hero.titleLine1).toBe('')
    expect(vm.services.heading).toBeNull()
    expect(vm.plans.bySegment.private).toEqual([])
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
