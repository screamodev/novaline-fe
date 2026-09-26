<script setup lang="ts">
import type { AssistantAction, AssistantPublicVM } from '#shared/types/assistant'
import { ASSISTANT_MAX_CHARS } from '#shared/schemas/assistant'
import { parseActions } from '#shared/utils/assistant'

const emit = defineEmits<{ close: [] }>()
const { t, locale } = useI18n()
const sectionLink = useSectionLink()
const callbackOpen = useCallbackDialog()
const { messages, demo, pending, send, restore } = useAssistantChat()

const { data: settings } = useFetch<AssistantPublicVM>('/api/cms/assistant', { query: { locale }, server: false })

const input = ref('')
const inputEl = ref<HTMLInputElement | null>(null)
const list = ref<HTMLElement | null>(null)

/** Assistant answers are split into text + action buttons; user messages and errors are shown as is. */
const rendered = computed(() =>
  messages.value.map((m) => ({
    ...m,
    ...(m.role === 'assistant' && !m.error ? parseActions(m.content, { streaming: m.streaming }) : { text: m.content, actions: [] as AssistantAction[] }),
  })),
)
const showQuick = computed(() => !messages.value.some((m) => m.role === 'user'))

const scrollToEnd = () => nextTick(() => list.value?.scrollTo({ top: list.value.scrollHeight }))
watch(() => messages.value.map((m) => m.content.length).join(), scrollToEnd)

onMounted(() => {
  restore()
  scrollToEnd()
  inputEl.value?.focus()
})

const submit = (text = input.value) => {
  if (!text.trim() || pending.value) return
  send(text)
  input.value = ''
}

const ACTION_ICON: Record<AssistantAction, IconName> = { lead: 'send', callback: 'phone', coverage: 'search' }
async function runAction(action: AssistantAction) {
  emit('close')
  if (action === 'callback') callbackOpen.value = true
  else await navigateTo(sectionLink(action === 'lead' ? 'lead' : 'coverage'))
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <section
    role="dialog"
    aria-modal="false"
    aria-labelledby="assistant-title"
    class="fixed bottom-6 right-6 z-[75] flex max-h-[min(620px,calc(100dvh-48px))] w-[min(392px,calc(100vw-32px))] animate-rise flex-col overflow-hidden rounded-[22px] bg-white shadow-dialog max-xs:bottom-4 max-xs:right-4"
    @keydown="onKeydown"
  >
    <header class="flex shrink-0 items-center gap-[13px] bg-navy px-5 py-[18px] text-white">
      <span class="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-grad-violet-coral">
        <AppIcon name="bot" :size="21" :stroke-width="2" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 id="assistant-title" class="font-display text-[15.5px] font-semibold">{{ settings?.title || t('fab.assistant') }}</h2>
        <p v-if="settings?.subtitle" class="mt-0.5 text-[12px] text-on-dark-dim">{{ settings.subtitle }}</p>
      </div>
      <button
        type="button"
        :aria-label="t('menu.close')"
        class="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-glass-strong text-white hover:bg-glass-line"
        @click="emit('close')"
      >
        <AppIcon name="close" :size="17" :stroke-width="2.4" />
      </button>
    </header>

    <div ref="list" class="flex min-h-[200px] flex-1 flex-col gap-[11px] overflow-y-auto p-[18px]" aria-live="polite" aria-relevant="additions text" :aria-busy="pending">
      <div v-if="settings?.greeting" class="flex justify-start">
        <p class="max-w-[82%] whitespace-pre-line rounded-2xl rounded-bl-[5px] bg-bg px-[15px] py-3 text-[14px] leading-[1.55] text-ink">{{ settings.greeting }}</p>
      </div>

      <div v-for="(m, i) in rendered" :key="i" class="flex flex-col" :class="m.role === 'user' ? 'items-end' : 'items-start'">
        <span class="sr-only">{{ m.role === 'user' ? t('assistant.you') : t('assistant.bot') }}:</span>
        <p
          v-if="m.text"
          class="max-w-[82%] whitespace-pre-line break-words rounded-2xl px-[15px] py-3 text-[14px] leading-[1.55]"
          :class="
            m.role === 'user'
              ? 'rounded-br-[5px] bg-violet text-white'
              : m.error
                ? 'rounded-bl-[5px] bg-coral/[.08] text-ink'
                : 'rounded-bl-[5px] bg-bg text-ink'
          "
        >
          {{ m.text }}
        </p>
        <p v-else-if="m.streaming" class="rounded-2xl rounded-bl-[5px] bg-bg px-[15px] py-3" :aria-label="t('assistant.typing')">
          <span class="flex gap-1" aria-hidden="true">
            <span v-for="n in 3" :key="n" class="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" :style="{ animationDelay: `${n * 150}ms` }" />
          </span>
        </p>
        <div v-if="!m.streaming && m.actions.length" class="mt-2 flex flex-wrap gap-2">
          <button
            v-for="action in m.actions"
            :key="action"
            type="button"
            class="inline-flex items-center gap-2 rounded-full bg-violet px-3.5 py-2 text-[13px] font-bold text-white hover:brightness-110"
            @click="runAction(action)"
          >
            <AppIcon :name="ACTION_ICON[action]" :size="14" :stroke-width="2.2" />
            {{ t(`assistant.actions.${action}`) }}
          </button>
        </div>
      </div>

      <div v-if="showQuick && settings?.quickQuestions.length" class="mt-1 flex flex-wrap gap-2">
        <button
          v-for="q in settings.quickQuestions"
          :key="q"
          type="button"
          class="rounded-full border border-line bg-white px-[13px] py-[9px] text-[12.5px] font-semibold text-violet hover:border-violet"
          @click="submit(q)"
        >
          {{ q }}
        </button>
      </div>
    </div>

    <form class="flex shrink-0 items-center gap-[9px] border-t border-line p-3.5" @submit.prevent="submit()">
      <label for="assistant-input" class="sr-only">{{ t('assistant.placeholder') }}</label>
      <input
        id="assistant-input"
        ref="inputEl"
        v-model="input"
        type="text"
        autocomplete="off"
        :maxlength="ASSISTANT_MAX_CHARS"
        :placeholder="t('assistant.placeholder')"
        class="min-w-0 flex-1 rounded-full border-[1.5px] border-line px-[17px] py-[13px] text-[14.5px] outline-none focus:border-violet"
      />
      <button
        type="submit"
        :disabled="pending || !input.trim()"
        :aria-label="t('assistant.send')"
        class="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-violet text-white transition disabled:opacity-50"
      >
        <AppIcon name="send" :size="19" :stroke-width="2.2" />
      </button>
    </form>
    <p v-if="demo" class="shrink-0 px-3.5 pb-3 text-center text-[11px] text-muted">{{ t('assistant.demo') }}</p>
  </section>
</template>
