import type { AssistantMessage, AssistantSettingsVM } from '#shared/types/assistant'
import type { GlobalVM } from '#shared/types/cms'
import type { CoverageTreeVM } from '#shared/types/coverage'
import type { HomeVM } from '#shared/types/home'
import { normalizeAssistantSettings } from '#shared/utils/assistant'
import { buildSystemPrompt } from '#shared/utils/assistant-prompt'

type Locale = ReturnType<typeof parseLocale>

export const getAssistantSettings = cachedCms('assistant-settings', async (locale: Locale): Promise<AssistantSettingsVM> => {
  const res = await strapiLocalized<{ data: Record<string, unknown> | null }>(
    '/assistant-settings',
    { 'populate[quickQuestions]': true, 'populate[fallbackReplies]': true },
    locale,
  )
  return normalizeAssistantSettings(res.data)
})

/** System prompt built from the same cached CMS reads the pages use; purged with them by the webhook. */
export const getAssistantPrompt = cachedCms('assistant-prompt', async (locale: Locale): Promise<string> => {
  const query = { locale }
  const [home, global, coverage, settings] = await Promise.all([
    $fetch<HomeVM>('/api/cms/home', { query }),
    $fetch<GlobalVM>('/api/cms/global', { query }),
    $fetch<CoverageTreeVM>('/api/cms/coverage', { query }),
    getAssistantSettings(locale),
  ])
  return buildSystemPrompt({ locale, today: new Date().toISOString().slice(0, 10), home, global, coverage, settings })
})

export const isPlaceholderKey = (key: string | undefined) => !key || key === 'sk-placeholder'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const FIRST_TOKEN_MS = 15_000
const TOTAL_MS = 60_000

/**
 * Streams an OpenAI chat completion as plain text chunks.
 * Resolves only after the first token arrives, so callers can still fall back when the call fails early.
 */
export async function streamOpenAi(opts: { apiKey: string; model: string; system: string; messages: AssistantMessage[] }) {
  const controller = new AbortController()
  const firstTokenTimer = setTimeout(() => controller.abort(), FIRST_TOKEN_MS)
  const totalTimer = setTimeout(() => controller.abort(), TOTAL_MS)
  const stop = () => {
    clearTimeout(firstTokenTimer)
    clearTimeout(totalTimer)
  }

  try {
    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'content-type': 'application/json', authorization: `Bearer ${opts.apiKey}` },
      body: JSON.stringify({
        model: opts.model,
        stream: true,
        temperature: 0.3,
        max_completion_tokens: 500,
        messages: [{ role: 'system', content: opts.system }, ...opts.messages],
      }),
    })
    if (!res.ok || !res.body) throw new Error(`OpenAI HTTP ${res.status}`)

    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
    let buffer = ''
    /** Reads SSE lines until at least one content delta (or the end) is available. */
    const nextDeltas = async (): Promise<string[] | null> => {
      for (;;) {
        const { value, done } = await reader.read()
        if (done) return null
        buffer += value
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        const deltas: string[] = []
        for (const line of lines) {
          const data = line.startsWith('data:') ? line.slice(5).trim() : ''
          if (!data || data === '[DONE]') continue
          const delta = JSON.parse(data)?.choices?.[0]?.delta?.content
          if (typeof delta === 'string' && delta) deltas.push(delta)
        }
        if (deltas.length) return deltas
      }
    }

    const first = await nextDeltas()
    if (!first) throw new Error('OpenAI returned no content')
    clearTimeout(firstTokenTimer)

    const encoder = new TextEncoder()
    return new ReadableStream<Uint8Array>({
      start(ctrl) {
        ctrl.enqueue(encoder.encode(first.join('')))
      },
      async pull(ctrl) {
        try {
          const deltas = await nextDeltas()
          if (deltas) ctrl.enqueue(encoder.encode(deltas.join('')))
          else {
            stop()
            ctrl.close()
          }
        } catch (error) {
          stop()
          ctrl.error(error)
        }
      },
      cancel() {
        stop()
        controller.abort()
      },
    })
  } catch (error) {
    stop()
    throw error
  }
}
