import type { AssistantFallbackResponse, AssistantMessage } from '#shared/types/assistant'
import { ASSISTANT_MAX_HISTORY } from '#shared/schemas/assistant'

export interface ChatMessage extends AssistantMessage {
  /** true while the answer is still streaming in. */
  streaming?: boolean
  /** Error notice rendered in place of an answer (not sent back to the server). */
  error?: boolean
}

const STORAGE_KEY = 'nl-assistant'

/** Chat state for the assistant widget; kept in sessionStorage so it survives navigation within the tab. */
export function useAssistantChat() {
  const { t, locale } = useI18n()
  const { track } = useAnalytics()
  const messages = useState<ChatMessage[]>('assistant-messages', () => [])
  const demo = useState('assistant-demo', () => false)
  const pending = ref(false)

  const persist = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: messages.value.filter((m) => !m.streaming), demo: demo.value }))
    } catch {
      /* storage unavailable: history simply is not kept */
    }
  }
  const restore = () => {
    if (messages.value.length) return
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null')
      if (Array.isArray(saved?.messages)) messages.value = saved.messages
      demo.value = !!saved?.demo
    } catch {
      /* ignore corrupt or blocked storage */
    }
  }

  async function send(text: string) {
    const content = text.trim()
    if (!content || pending.value) return
    pending.value = true
    messages.value.push({ role: 'user', content })
    track('assistant_message')

    const history = messages.value
      .filter((m) => !m.error && !m.streaming)
      .slice(-ASSISTANT_MAX_HISTORY)
      .map(({ role, content: c }) => ({ role, content: c }))
    const answer = reactive<ChatMessage>({ role: 'assistant', content: '', streaming: true })
    messages.value.push(answer)

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ locale: locale.value, messages: history }),
      })
      if (!res.ok) throw new Error(res.status === 429 ? 'rate' : 'http')

      if (res.headers.get('content-type')?.includes('application/json')) {
        const data = (await res.json()) as AssistantFallbackResponse
        answer.content = data.text
        demo.value = true
      } else {
        demo.value = false
        const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader()
        for (;;) {
          const { value, done } = await reader.read()
          if (done) break
          answer.content += value
        }
      }
      if (!answer.content) throw new Error('empty')
    } catch (error) {
      answer.error = true
      answer.content = (error as Error).message === 'rate' ? t('assistant.rateLimited') : t('assistant.error')
    } finally {
      answer.streaming = false
      pending.value = false
      persist()
    }
  }

  return { messages, demo, pending, send, restore }
}
