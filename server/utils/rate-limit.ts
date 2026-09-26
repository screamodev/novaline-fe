interface CounterStorage {
  getItem: <T = unknown>(key: string) => Promise<T | null>
  setItem: (key: string, value: unknown) => Promise<void>
}

/** Fixed-window limiter: `limit` hits per `windowMs` per key. Returns whether this hit is allowed. */
export async function hitRateLimit(storage: CounterStorage, key: string, limit: number, windowMs: number, now = Date.now()) {
  const entry = await storage.getItem<{ count: number; resetAt: number }>(key)
  if (!entry || entry.resetAt <= now) {
    await storage.setItem(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  await storage.setItem(key, { count: entry.count + 1, resetAt: entry.resetAt })
  return true
}

/**
 * Client IP behind our reverse proxy: the right-most X-Forwarded-For entry is the one Caddy observed
 * (left-most entries are client-supplied and spoofable); falls back to the socket address.
 */
export function clientIp(forwardedFor: string | undefined, remoteAddress: string | undefined): string {
  const last = forwardedFor?.split(',').map((s) => s.trim()).filter(Boolean).pop()
  return last || remoteAddress || 'unknown'
}
