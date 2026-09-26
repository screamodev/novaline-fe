<script setup lang="ts">
import { CONNECT_TOPICS, ISSUE_TOPICS, type LeadDraft, type LeadTopic, MESSAGE_MAX } from '#shared/schemas/lead'
import type { HeadingVM } from '#shared/types/home'
import type { LeadContext } from '~/composables/useLeadContext'

defineProps<{ heading: HeadingVM | null }>()
const { t } = useI18n()
const localePath = useLocalePath()
const { data: global } = useGlobal()
const { context } = useLeadContext()
const type = useLeadType()
const address = useLeadAddress()
const cascade = useAddressCascade(address)
const { state, errors, formError, submit } = useLeadSubmit()

const name = ref('')
const phone = ref('')
const reasonKey = ref<LeadTopic | ''>('')
const message = ref('')
const website = ref('')
const topics = computed(() => (type.value === 'connect' ? CONNECT_TOPICS : ISSUE_TOPICS))

function setType(next: 'connect' | 'issue') {
  type.value = next
  reasonKey.value = ''
}

/** CTAs elsewhere on the page preselect the topic (or explain themselves in the message). */
const TOPIC_BY_KIND: Partial<Record<LeadContext['kind'], LeadTopic>> = {
  plan: 'internet',
  addon: 'internet',
  consultation: 'internet',
  tv: 'tv',
  shop: 'equipment',
}
watch(
  context,
  (ctx) => {
    if (!ctx) return
    type.value = 'connect'
    const topic = TOPIC_BY_KIND[ctx.kind]
    reasonKey.value = topic ?? 'internet'
    if (!topic && !message.value.includes(ctx.label)) message.value = `${ctx.label}\n${message.value}`.trim()
  },
  { immediate: true },
)

const fieldError = (field: string) => (errors.value[field] ? t(`lead.errors.${errors.value[field]}`) : '')
const form = ref<HTMLFormElement | null>(null)

async function onSubmit() {
  const ok = await submit({
    type: type.value,
    name: name.value,
    phone: phone.value,
    reasonKey: reasonKey.value as LeadTopic,
    reasonLabel: reasonKey.value ? t(`lead.topics.${reasonKey.value}`) : '',
    message: message.value,
    ...cascade.labels.value,
    context: context.value,
    website: website.value,
    // type and topic are validated together by the shared schema (client here, server again).
  } as LeadDraft)
  if (!ok) {
    await nextTick()
    form.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }
}

const inputClass = (field: string) => [
  'mt-1.5 w-full rounded-xl border-[1.5px] bg-white px-4 py-3.5 text-[15px] text-ink outline-none focus:border-violet',
  errors.value[field] ? 'border-coral-strong' : 'border-line',
]
</script>

<template>
  <section id="lead" class="section-anchor container-page py-20 max-sm:py-[52px]" aria-labelledby="lead-title">
    <div class="relative overflow-hidden rounded-[28px] bg-lead-card p-[52px] shadow-lead max-sm:p-7">
      <div class="absolute -right-10 -top-10 h-[280px] w-[280px] rounded-full bg-white/[.08]" aria-hidden="true" />
      <div class="relative grid grid-cols-2 items-center gap-11 max-tab:grid-cols-1">
        <div v-if="heading" class="text-white">
          <div class="text-kicker font-bold uppercase text-white/85">{{ heading.kicker }}</div>
          <h2 id="lead-title" class="mt-3 text-h2-sm">{{ heading.title }}</h2>
          <p v-if="heading.subtitle" class="mt-4 text-[16px] leading-[1.6] text-white/90">{{ heading.subtitle }}</p>
        </div>

        <div class="rounded-[20px] bg-white p-[30px] max-sm:p-6">
          <div v-if="state === 'sent'" class="animate-rise py-6 text-center" role="status">
            <span class="inline-grid h-[60px] w-[60px] place-items-center rounded-full bg-success-soft text-success">
              <AppIcon name="check" :size="32" :stroke-width="2.6" />
            </span>
            <div class="mt-4 font-display text-[20px] font-bold text-navy">{{ t('lead.success') }}</div>
          </div>

          <form v-else ref="form" novalidate @submit.prevent="onSubmit">
            <div class="mb-[18px] flex rounded-full border border-line bg-bg p-[5px]" role="group" :aria-label="t('lead.typeLabel')">
              <button
                v-for="opt in (['connect', 'issue'] as const)"
                :key="opt"
                type="button"
                :aria-pressed="type === opt"
                class="flex-1 rounded-full px-2.5 py-[11px] text-[13.5px] font-bold transition duration-200"
                :class="type === opt ? 'bg-navy text-white' : 'text-muted hover:text-navy'"
                @click="setType(opt)"
              >
                {{ opt === 'connect' ? t('lead.typeConnect') : t('lead.typeIssue') }}
              </button>
            </div>

            <fieldset class="mb-[18px] rounded-2xl border border-line bg-bg p-[18px]">
              <legend class="float-left mb-3 w-full text-[12px] font-bold uppercase tracking-[.05em] text-muted">{{ t('lead.address') }}</legend>
              <div class="clear-both grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                <CoverageSelect
                  :model-value="address.region"
                  variant="light"
                  name="region"
                  :label="t('coverage.region')"
                  :placeholder="t('coverage.selectRegion')"
                  :options="cascade.options.value.regions"
                  @update:model-value="cascade.setRegion"
                />
                <CoverageSelect
                  :model-value="address.district"
                  variant="light"
                  name="district"
                  :label="t('coverage.district')"
                  :placeholder="t('coverage.selectDistrict')"
                  :options="cascade.options.value.districts"
                  :disabled="!address.region"
                  @update:model-value="cascade.setDistrict"
                />
                <CoverageSelect
                  :model-value="address.settlement"
                  variant="light"
                  name="settlement"
                  :label="t('coverage.settlement')"
                  :placeholder="t('coverage.selectSettlement')"
                  :options="cascade.options.value.settlements"
                  :disabled="!address.district"
                  @update:model-value="cascade.setSettlement"
                />
                <CoverageSelect
                  v-if="cascade.options.value.neighbourhoods.length"
                  :model-value="address.neighbourhood"
                  variant="light"
                  name="neighbourhood"
                  :label="t('coverage.neighbourhood')"
                  :placeholder="t('coverage.selectNeighbourhood')"
                  :options="cascade.options.value.neighbourhoods"
                  @update:model-value="cascade.setNeighbourhood"
                />
              </div>
            </fieldset>

            <div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <div>
                <label for="lead-name" class="text-[13px] font-semibold text-navy">{{ t('lead.name') }}</label>
                <input
                  id="lead-name"
                  v-model="name"
                  name="name"
                  autocomplete="name"
                  :placeholder="t('lead.namePh')"
                  :aria-invalid="!!errors.name"
                  :aria-describedby="errors.name ? 'lead-name-error' : undefined"
                  :class="inputClass('name')"
                >
                <p v-if="errors.name" id="lead-name-error" class="mt-1 text-[12.5px] text-coral-strong">{{ fieldError('name') }}</p>
              </div>
              <div>
                <label for="lead-phone" class="text-[13px] font-semibold text-navy">{{ t('lead.phone') }}</label>
                <input
                  id="lead-phone"
                  v-model="phone"
                  name="phone"
                  type="tel"
                  inputmode="tel"
                  autocomplete="tel"
                  :placeholder="t('lead.phonePh')"
                  :aria-invalid="!!errors.phone"
                  :aria-describedby="errors.phone ? 'lead-phone-error' : undefined"
                  :class="inputClass('phone')"
                >
                <p v-if="errors.phone" id="lead-phone-error" class="mt-1 text-[12.5px] text-coral-strong">{{ fieldError('phone') }}</p>
              </div>
            </div>

            <label for="lead-reason" class="mt-4 block text-[13px] font-semibold text-navy">{{ t('lead.reason') }}</label>
            <div class="relative">
              <select
                id="lead-reason"
                v-model="reasonKey"
                name="reason"
                :aria-invalid="!!errors.reasonKey"
                :aria-describedby="errors.reasonKey ? 'lead-reason-error' : undefined"
                :class="[inputClass('reasonKey'), 'cursor-pointer appearance-none pr-10']"
              >
                <option value="">{{ t('lead.reasonPh') }}</option>
                <option v-for="topic in topics" :key="topic" :value="topic">{{ t(`lead.topics.${topic}`) }}</option>
              </select>
              <span class="pointer-events-none absolute right-4 top-[calc(50%+3px)] -translate-y-1/2 text-[11px] text-violet" aria-hidden="true">▾</span>
            </div>
            <p v-if="errors.reasonKey" id="lead-reason-error" class="mt-1 text-[12.5px] text-coral-strong">{{ fieldError('reasonKey') }}</p>

            <label for="lead-message" class="mt-4 flex justify-between text-[13px] font-semibold text-navy">
              {{ t('lead.message') }}
              <span class="font-medium text-muted">{{ t('lead.messageOptional') }} · {{ message.length }}/{{ MESSAGE_MAX }}</span>
            </label>
            <textarea
              id="lead-message"
              v-model="message"
              name="message"
              rows="3"
              :maxlength="MESSAGE_MAX"
              :placeholder="t('lead.messagePh')"
              :aria-invalid="!!errors.message"
              :class="[inputClass('message'), 'resize-y']"
            />

            <!-- Honeypot: hidden from people and assistive tech; bots fill it. -->
            <input v-model="website" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 opacity-0">

            <p v-if="formError" class="mt-4 rounded-xl bg-coral/[.08] px-4 py-3 text-[13.5px] text-ink" role="alert">
              {{ t(`lead.errors.${formError}`) }}
              <a v-if="global?.phones[0]" :href="`tel:${global.phones[0].tel}`" class="font-bold text-navy">{{ global.phones[0].display }}</a>
            </p>

            <BaseButton type="submit" variant="coral" block size="lg" class="mt-5 !shadow-none" :disabled="state === 'sending'">
              {{ state === 'sending' ? t('lead.sending') : t('lead.submit') }}
            </BaseButton>
            <p class="mt-3 text-center text-[12px] text-muted">
              {{ t('lead.privacyBefore') }}<NuxtLink :to="localePath('/privacy')" class="text-muted underline hover:text-violet">{{ t('lead.privacyLink') }}</NuxtLink>{{ t('lead.privacyAfter') }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
