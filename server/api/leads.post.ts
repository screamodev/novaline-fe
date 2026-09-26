import { leadErrors, leadSchema, MIN_FILL_MS } from '#shared/schemas/lead'
import { clientIp, hitRateLimit } from '../utils/rate-limit'

const LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000

/**
 * Creates a lead (connection request, issue or callback) in Strapi.
 * Order: validate → silent bot filter (honeypot, too fast) → idempotency → per-IP rate limit → Strapi.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null)
  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid lead', data: { errors: leadErrors(parsed.error) } })
  }
  const lead = parsed.data

  // Bots get a normal-looking success and nothing is stored.
  if (lead.website || Date.now() - lead.renderedAt < MIN_FILL_MS) return { ok: true }

  const storage = useStorage('rate')
  const idempotencyKey = getHeader(event, 'idempotency-key')?.slice(0, 64)
  if (idempotencyKey && (await storage.getItem(`idem:${idempotencyKey}`))) return { ok: true }

  const ip = clientIp(getHeader(event, 'x-forwarded-for'), getRequestIP(event))
  if (!(await hitRateLimit(storage, `lead:${ip}`, LIMIT, WINDOW_MS))) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }

  const { website: _honeypot, renderedAt: _renderedAt, ...data } = lead
  try {
    await strapiPost('/leads', { data })
  } catch (error) {
    console.error('[leads] Strapi create failed', (error as Error).message)
    throw createError({ statusCode: 502, statusMessage: 'Lead could not be saved' })
  }
  if (idempotencyKey) await storage.setItem(`idem:${idempotencyKey}`, 1)
  return { ok: true }
})
