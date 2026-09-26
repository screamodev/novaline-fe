import { timingSafeEqual } from 'node:crypto'

/** Cache key prefixes owned by CMS data: cached CMS functions and SWR-rendered routes. */
export const CMS_CACHE_PREFIXES = ['cms:', 'nitro:routes:'] as const

interface KeyValueStorage {
  getKeys: (base?: string) => Promise<string[]>
  removeItem: (key: string) => Promise<void>
}

/** Removes every CMS-derived cache entry; returns how many were removed. */
export async function purgeCmsCache(storage: KeyValueStorage): Promise<number> {
  const keys = (await Promise.all(CMS_CACHE_PREFIXES.map((prefix) => storage.getKeys(prefix)))).flat()
  await Promise.all(keys.map((key) => storage.removeItem(key)))
  return keys.length
}

/** Constant-time secret comparison; an unset expected secret never matches. */
export function isValidSecret(given: string | undefined | null, expected: string | undefined | null): boolean {
  if (!given || !expected) return false
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}
