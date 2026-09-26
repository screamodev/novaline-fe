import { type LeadDraft, type LeadInput, leadErrors, leadSchema } from '#shared/schemas/lead'

type SubmitState = 'idle' | 'sending' | 'sent'

/**
 * Validation + submission for the lead form and the callback dialog.
 * Field errors are i18n keys under `lead.errors.*`; `formError` covers rate limits and server failures.
 */
export function useLeadSubmit() {
  const { locale } = useI18n()
  const route = useRoute()
  const { track } = useAnalytics()

  const state = ref<SubmitState>('idle')
  const errors = ref<Record<string, string>>({})
  const formError = ref<'rate' | 'server' | null>(null)
  const renderedAt = ref(0)
  let idempotencyKey = ''
  onMounted(() => (renderedAt.value = Date.now()))

  async function submit(input: LeadDraft) {
    if (state.value === 'sending') return false
    formError.value = null
    const payload = { ...input, locale: locale.value, sourcePath: route.fullPath, renderedAt: renderedAt.value } as LeadInput
    const parsed = leadSchema.safeParse(payload)
    if (!parsed.success) {
      errors.value = leadErrors(parsed.error)
      return false
    }
    errors.value = {}
    state.value = 'sending'
    idempotencyKey ||= crypto.randomUUID()
    try {
      await $fetch('/api/leads', { method: 'POST', body: payload, headers: { 'Idempotency-Key': idempotencyKey } })
      state.value = 'sent'
      idempotencyKey = ''
      track(input.type === 'callback' ? 'callback_submit_success' : 'lead_submit_success', { type: input.type })
      return true
    } catch (e) {
      const err = e as { statusCode?: number; data?: { data?: { errors?: Record<string, string> } } }
      if (err.statusCode === 422 && err.data?.data?.errors) errors.value = err.data.data.errors
      else formError.value = err.statusCode === 429 ? 'rate' : 'server'
      state.value = 'idle'
      return false
    }
  }

  const reset = () => {
    state.value = 'idle'
    errors.value = {}
    formError.value = null
    renderedAt.value = Date.now()
  }

  return { state, errors, formError, submit, reset }
}
