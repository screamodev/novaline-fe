import { z } from 'zod'
import { normalizeUaPhone } from '../utils/phone'

export const CONNECT_TOPICS = ['internet', 'tv', 'cable', 'equipment', 'public-ip'] as const
export const ISSUE_TOPICS = ['no-internet', 'slow', 'billing', 'move', 'other'] as const
export type LeadTopic = (typeof CONNECT_TOPICS)[number] | (typeof ISSUE_TOPICS)[number]

export const MESSAGE_MAX = 1000
/** Submissions faster than this after render are treated as bots. */
export const MIN_FILL_MS = 2000

const phone = z
  .string()
  .trim()
  .transform((v, ctx) => {
    const n = normalizeUaPhone(v)
    if (!n) ctx.addIssue({ code: 'custom', message: 'phone' })
    return n ?? v
  })
const text = (max: number) => z.string().trim().max(max).optional().default('')

const common = {
  phone,
  locale: z.enum(['uk', 'en']).default('uk'),
  sourcePath: z.string().max(300).optional().default('/'),
  /** Honeypot: humans never fill it. */
  website: z.string().optional().default(''),
  renderedAt: z.number().int().nonnegative(),
  context: z.object({ kind: z.string().max(40), key: z.string().max(120), label: z.string().max(200) }).nullish(),
}

const address = {
  region: text(120),
  district: text(120),
  settlement: text(120),
  neighbourhood: text(120),
}

export const leadSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('connect'),
    name: z.string().trim().min(2, 'name').max(60, 'name'),
    reasonKey: z.enum(CONNECT_TOPICS, { message: 'reason' }),
    reasonLabel: z.string().max(120),
    message: text(MESSAGE_MAX),
    ...address,
    ...common,
  }),
  z.object({
    type: z.literal('issue'),
    name: z.string().trim().min(2, 'name').max(60, 'name'),
    reasonKey: z.enum(ISSUE_TOPICS, { message: 'reason' }),
    reasonLabel: z.string().max(120),
    message: text(MESSAGE_MAX),
    ...address,
    ...common,
  }),
  z.object({ type: z.literal('callback'), ...common }),
])

export type LeadInput = z.input<typeof leadSchema>
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never
/** What forms submit; locale, page and timing are added by `useLeadSubmit`. */
export type LeadDraft = DistributiveOmit<LeadInput, 'locale' | 'sourcePath' | 'renderedAt'>
export type Lead = z.output<typeof leadSchema>

const ERROR_KEY: Record<string, string> = { name: 'name', phone: 'phone', reasonKey: 'reason', message: 'message' }

/** Field → i18n error key (`lead.errors.*`) for every invalid field. */
export function leadErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? 'form')
    if (!out[field]) out[field] = ERROR_KEY[field] ?? 'server'
  }
  return out
}
