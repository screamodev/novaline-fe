import { describe, expect, it } from 'vitest'
import { assistantRequestSchema } from '../shared/schemas/assistant'
import { matchFallback, normalizeAssistantSettings, parseActions } from '../shared/utils/assistant'
import { buildSystemPrompt } from '../shared/utils/assistant-prompt'
import type { GlobalVM } from '../shared/types/cms'
import type { HomeVM, PlanVM } from '../shared/types/home'

describe('normalizeAssistantSettings', () => {
  it('splits keyword stems and drops empty replies', () => {
    const s = normalizeAssistantSettings({
      title: ' Асистент ',
      quickQuestions: [{ text: 'Які є тарифи?' }, { text: '' }],
      fallbackReplies: [{ keywords: 'Тариф, ЦІНА ', answer: 'Від 210 грн' }, { keywords: 'x', answer: '' }],
      promptAddendum: '  ',
    })
    expect(s.title).toBe('Асистент')
    expect(s.quickQuestions).toEqual(['Які є тарифи?'])
    expect(s.fallbackReplies).toEqual([{ keywords: ['тариф', 'ціна'], answer: 'Від 210 грн' }])
    expect(s.promptAddendum).toBeNull()
  })
})

describe('matchFallback', () => {
  const replies = [
    { keywords: ['тариф', 'ціна'], answer: 'plans' },
    { keywords: ['оплат', 'рахунок'], answer: 'payment' },
  ]
  it('picks the reply with most matching stems', () => {
    expect(matchFallback('Яка ціна тарифу?', replies)).toBe('plans')
    expect(matchFallback('Як оплатити рахунок', replies)).toBe('payment')
  })
  it('returns null when nothing matches', () => {
    expect(matchFallback('Привіт', replies)).toBeNull()
  })
})

describe('parseActions', () => {
  it('extracts known tokens once and strips them from text', () => {
    expect(parseActions('Залиште заявку. [[lead]] [[lead]] [[callback]] [[hack]]')).toEqual({
      text: 'Залиште заявку.',
      actions: ['lead', 'callback'],
    })
  })
  it('hides a token that is still streaming in', () => {
    expect(parseActions('Залиште заявку. [[le', { streaming: true }).text).toBe('Залиште заявку.')
  })
})

describe('assistantRequestSchema', () => {
  it('requires the last message to be a short user message', () => {
    expect(assistantRequestSchema.safeParse({ messages: [{ role: 'user', content: 'hi' }] }).success).toBe(true)
    expect(assistantRequestSchema.safeParse({ messages: [{ role: 'assistant', content: 'hi' }] }).success).toBe(false)
    expect(assistantRequestSchema.safeParse({ messages: [{ role: 'user', content: 'a'.repeat(501) }] }).success).toBe(false)
    expect(assistantRequestSchema.safeParse({ messages: Array(11).fill({ role: 'user', content: 'x' }) }).success).toBe(false)
  })
})

describe('buildSystemPrompt', () => {
  const plan = (key: string, name: string, amount: number): PlanVM => ({
    key,
    segment: 'private',
    name,
    speedLabel: '150 Мбіт/с',
    price: { amount, prefix: null, label: null },
    periodLabel: 'грн/міс',
    popular: false,
    features: [],
    availableForCoverage: true,
    coverageCaption: null,
  })
  const home = {
    plans: { heading: null, connectionNote: 'Підключення 1500 грн', bySegment: { private: [plan('s', 'Старт', 210)], apartment: [], business: [] } },
    addons: { heading: null, items: [] },
    tv: { packages: [] },
    promos: { heading: null, items: [] },
    payment: { accountNote: null, methods: [] },
    dataCentre: { services: [] },
    shop: { items: [] },
  } as unknown as HomeVM
  const global = { phones: [{ display: '+38 (098) 506 06 09' }], email: 'support@novaline.net.ua', cabinetUrl: null, currencyLabel: 'грн', perMonthLabel: 'грн/міс' } as unknown as GlobalVM
  const coverage = {
    settlementCount: 1,
    regions: [
      {
        slug: 'kh',
        name: 'Харківська область',
        districts: [{ slug: 'd', name: 'D', settlements: [{ slug: 'kharkiv', name: 'Харків', neighbourhoods: [{ name: 'Салтівка', priceModifier: -10 }] }] }],
      },
    ],
  } as never

  it('grounds the prompt in CMS prices, including precomputed neighbourhood prices', () => {
    const prompt = buildSystemPrompt({
      locale: 'uk',
      today: '2026-09-27',
      home,
      global,
      coverage,
      settings: normalizeAssistantSettings({ promptAddendum: 'Додаткове правило' }),
    })
    expect(prompt).toContain('Старт, 150 Мбіт/с: 210 грн/міс')
    expect(prompt).toContain('Салтівка — Старт 200 грн/міс')
    expect(prompt).toContain('+38 (098) 506 06 09')
    expect(prompt).toContain('Додаткове правило')
    expect(prompt).toContain('[[lead]]')
  })
})
