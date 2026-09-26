import { describe, expect, it } from 'vitest'
import { isValidSecret, purgeCmsCache } from '../server/utils/cache-purge'

const fakeStorage = (keys: string[]) => {
  const store = new Set(keys)
  return {
    store,
    getKeys: async (base = '') => [...store].filter((k) => k.startsWith(base)),
    removeItem: async (key: string) => void store.delete(key),
  }
}

describe('purgeCmsCache', () => {
  it('removes CMS function and route caches only', async () => {
    const storage = fakeStorage(['cms:global:uk.json', 'cms:home:en.json', 'nitro:routes:_:index.json', 'other:x.json'])
    expect(await purgeCmsCache(storage)).toBe(3)
    expect([...storage.store]).toEqual(['other:x.json'])
  })
})

describe('isValidSecret', () => {
  it('accepts only an exact match', () => {
    expect(isValidSecret('s3cret', 's3cret')).toBe(true)
    expect(isValidSecret('s3cre', 's3cret')).toBe(false)
    expect(isValidSecret('x', 'y')).toBe(false)
  })
  it('rejects when either side is empty', () => {
    expect(isValidSecret('', '')).toBe(false)
    expect(isValidSecret('a', '')).toBe(false)
    expect(isValidSecret(undefined, 'a')).toBe(false)
  })
})
