import { assistantRequestSchema } from '#shared/schemas/assistant'
import type { AssistantFallbackResponse } from '#shared/types/assistant'
import { matchFallback } from '#shared/utils/assistant'
import { clientIp, hitRateLimit } from '../utils/rate-limit'

const LIMIT = 20
const WINDOW_MS = 10 * 60 * 1000

/**
 * Online assistant: streams an OpenAI answer grounded in live CMS data as `text/plain`,
 * or returns a keyword-based CMS reply as JSON (`mode: 'fallback'`) when OpenAI is unavailable.
 * Message texts are never logged.
 */
export default defineEventHandler(async (event) => {
  const parsed = assistantRequestSchema.safeParse(await readBody(event).catch(() => null))
  if (!parsed.success) throw createError({ statusCode: 422, statusMessage: 'Invalid request' })
  const { locale, messages } = parsed.data

  const ip = clientIp(getHeader(event, 'x-forwarded-for'), getRequestIP(event))
  if (!(await hitRateLimit(useStorage('rate'), `assistant:${ip}`, LIMIT, WINDOW_MS))) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }

  const fallback = async (): Promise<AssistantFallbackResponse> => {
    const settings = await getAssistantSettings(locale)
    const question = messages.at(-1)!.content
    const answer = matchFallback(question, settings.fallbackReplies)
    return { mode: 'fallback', text: answer ?? `${settings.fallbackMessage} [[lead]]` }
  }

  const { openaiApiKey, openaiModel } = useRuntimeConfig()
  if (isPlaceholderKey(openaiApiKey)) return fallback()

  try {
    const system = await getAssistantPrompt(locale)
    const stream = await streamOpenAi({ apiKey: openaiApiKey, model: openaiModel, system, messages })
    setResponseHeaders(event, {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-accel-buffering': 'no',
    })
    return sendStream(event, stream)
  } catch (error) {
    console.error('[assistant] OpenAI unavailable, using fallback:', (error as Error).message)
    return fallback()
  }
})
