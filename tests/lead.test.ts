import { describe, expect, it } from 'vitest'
import { leadErrors, leadSchema } from '../shared/schemas/lead'
import { normalizeUaPhone } from '../shared/utils/phone'
import { clientIp, hitRateLimit } from '../server/utils/rate-limit'

describe('normalizeUaPhone', () => {
  it.each([
    ['+380985060609', '+380985060609'],
    ['098 506 06 09', '+380985060609'],
    ['(098) 506-06-09', '+380985060609'],
    ['380985060609', '+380985060609'],
  ])('%s → %s', (raw, out) => expect(normalizeUaPhone(raw)).toBe(out))
  it('rejects non-UA numbers', () => {
    expect(normalizeUaPhone('+4915112345678')).toBeNull()
    expect(normalizeUaPhone('12345')).toBeNull()
  })
})

const base = { phone: '098 506 06 09', renderedAt: 1 }

describe('leadSchema', () => {
  it('accepts a connection lead and normalises the phone', () => {
    const r = leadSchema.parse({ ...base, type: 'connect', name: 'Олена', reasonKey: 'internet', reasonLabel: 'Підключення інтернету' })
    expect(r.phone).toBe('+380985060609')
    expect(r.type === 'connect' && r.settlement).toBe('')
  })
  it('accepts a callback with only a phone', () => {
    expect(leadSchema.safeParse({ ...base, type: 'callback' }).success).toBe(true)
  })
  it('reports field errors', () => {
    const r = leadSchema.safeParse({ type: 'issue', name: 'A', phone: '123', reasonKey: 'internet', reasonLabel: '', renderedAt: 1 })
    expect(r.success).toBe(false)
    if (!r.success) expect(leadErrors(r.error)).toMatchObject({ name: 'name', phone: 'phone', reasonKey: 'reason' })
  })
  it('limits the message length', () => {
    const r = leadSchema.safeParse({ ...base, type: 'connect', name: 'Олена', reasonKey: 'tv', reasonLabel: 'x', message: 'a'.repeat(1001) })
    expect(r.success).toBe(false)
  })
})

describe('hitRateLimit', () => {
  const store = () => {
    const m = new Map<string, unknown>()
    return { getItem: async <T>(k: string) => (m.get(k) as T) ?? null, setItem: async (k: string, v: unknown) => void m.set(k, v) }
  }
  it('allows `limit` hits per window, then blocks until reset', async () => {
    const s = store()
    for (let i = 0; i < 5; i++) expect(await hitRateLimit(s, 'ip', 5, 1000, 0)).toBe(true)
    expect(await hitRateLimit(s, 'ip', 5, 1000, 500)).toBe(false)
    expect(await hitRateLimit(s, 'ip', 5, 1000, 1001)).toBe(true)
  })
})

describe('clientIp', () => {
  it('uses the proxy-appended (right-most) forwarded address', () => {
    expect(clientIp('1.1.1.1, 203.0.113.9', '172.18.0.5')).toBe('203.0.113.9')
    expect(clientIp(undefined, '172.18.0.5')).toBe('172.18.0.5')
    expect(clientIp('', undefined)).toBe('unknown')
  })
})

describe('leadErrors for missing fields', () => {
  it('maps every field to a translatable key', () => {
    const r = leadSchema.safeParse({ type: 'connect', phone: '12', renderedAt: 1 })
    expect(r.success).toBe(false)
    if (!r.success) expect(leadErrors(r.error)).toMatchObject({ name: 'name', phone: 'phone', reasonKey: 'reason' })
  })
})
