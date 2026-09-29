<script setup lang="ts">
import type { LeadDraft, LeadTopic } from '#shared/schemas/lead'
import { normalizeQuery } from '#shared/utils/coverage'
import type { LeadContext } from '~/composables/useLeadContext'

const { t } = useI18n()
const localePath = useLocalePath()
const { open, request } = useOrderDialog()
const coverage = useCoverage()
const { index } = useCoverageData()
const { state, errors, formError, submit, reset } = useLeadSubmit()

const name = ref('')
const phone = ref('')
const settlement = ref('')
const street = ref('')
const website = ref('')
const listId = useId()

/** Settlement names for the datalist; Kharkiv neighbourhoods are listed as "Харків · Салтівка". */
const places = computed(() =>
  index.value.flatMap((s) => (s.neighbourhoods.length ? s.neighbourhoods.map((n) => `${s.name} · ${n.name}`) : [s.name])),
)

/** Prefill from the clicked card, else from the coverage check, keeping what the visitor already typed. */
watch(open, (on) => {
  if (!on) return
  reset()
  const slug = request.value.settlement ?? coverage.address.value.settlement
  const neighbourhood = request.value.settlement ? request.value.neighbourhood : coverage.address.value.neighbourhood
  const entry = index.value.find((s) => s.slug === slug)
  if (entry) settlement.value = neighbourhood ? `${entry.name} · ${neighbourhood}` : entry.name
})

const TOPIC_BY_KIND: Partial<Record<LeadContext['kind'], LeadTopic>> = { tv: 'tv', shop: 'equipment' }

/** Maps the typed place back to region/district labels when it matches a covered settlement. */
function addressFields() {
  const [placeName = '', neighbourhood = ''] = settlement.value.split('·').map((x) => x.trim())
  const entry = index.value.find((s) => normalizeQuery(s.name) === normalizeQuery(placeName))
  return {
    region: entry?.regionName ?? '',
    district: entry?.districtName ?? '',
    settlement: entry?.name ?? placeName,
    neighbourhood,
    street: street.value,
  }
}

const form = ref<HTMLFormElement | null>(null)
async function onSubmit() {
  const topic = TOPIC_BY_KIND[request.value.context?.kind ?? 'offer'] ?? 'internet'
  const ok = await submit({
    type: 'connect',
    name: name.value,
    phone: phone.value,
    reasonKey: topic,
    reasonLabel: t(`lead.topics.${topic}`),
    message: '',
    ...addressFields(),
    context: request.value.context ?? null,
    website: website.value,
  } as LeadDraft)
  if (!ok) {
    await nextTick()
    form.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }
}

const inputClass = (field: string) => [
  'mt-1.5 w-full rounded-xl border-[1.5px] bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-violet',
  errors.value[field] ? 'border-coral-strong' : 'border-line',
]
</script>

<template>
  <BaseDialog v-model:open="open" labelledby="order-title" :close-label="t('order.close')">
    <div v-if="state === 'sent'" class="py-4 text-center" role="status">
      <span class="inline-grid h-[58px] w-[58px] place-items-center rounded-full bg-success-soft text-success">
        <AppIcon name="check" :size="30" :stroke-width="2.6" />
      </span>
      <div class="mt-3.5 text-[19px] font-bold text-navy">{{ t('order.success') }}</div>
    </div>
    <template v-else>
      <h2 id="order-title" class="pr-8 text-[21px] font-extrabold text-navy">{{ t('order.title') }}</h2>
      <p class="mt-2 text-[14px] leading-[1.5] text-muted">{{ t('order.sub') }}</p>
      <p v-if="request.context?.label" class="mt-3 rounded-xl bg-bg px-3.5 py-2.5 text-[13.5px] text-ink">
        <span class="font-semibold text-muted">{{ t('order.about') }}:</span> {{ request.context.label }}
      </p>

      <form ref="form" class="mt-4 flex flex-col gap-3" novalidate @submit.prevent="onSubmit">
        <div>
          <label for="order-name" class="text-[13px] font-semibold text-navy">{{ t('lead.name') }}</label>
          <input
            id="order-name"
            v-model="name"
            type="text"
            autocomplete="name"
            :placeholder="t('lead.namePh')"
            :aria-invalid="!!errors.name"
            :aria-describedby="errors.name ? 'order-name-error' : undefined"
            :class="inputClass('name')"
          >
          <p v-if="errors.name" id="order-name-error" class="mt-1 text-[12.5px] text-coral-strong">{{ t(`lead.errors.${errors.name}`) }}</p>
        </div>
        <div>
          <label for="order-phone" class="text-[13px] font-semibold text-navy">{{ t('lead.phone') }}</label>
          <input
            id="order-phone"
            v-model="phone"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            :placeholder="t('lead.phonePh')"
            :aria-invalid="!!errors.phone"
            :aria-describedby="errors.phone ? 'order-phone-error' : undefined"
            :class="inputClass('phone')"
          >
          <p v-if="errors.phone" id="order-phone-error" class="mt-1 text-[12.5px] text-coral-strong">{{ t('lead.errors.phone') }}</p>
        </div>
        <div>
          <label for="order-settlement" class="text-[13px] font-semibold text-navy">
            {{ t('order.settlement') }} <span class="font-normal text-muted">({{ t('order.optional') }})</span>
          </label>
          <input
            id="order-settlement"
            v-model="settlement"
            type="text"
            autocomplete="address-level2"
            :list="listId"
            :placeholder="t('order.settlementPh')"
            :class="inputClass('settlement')"
          >
          <datalist :id="listId">
            <option v-for="p in places" :key="p" :value="p" />
          </datalist>
        </div>
        <div>
          <label for="order-street" class="text-[13px] font-semibold text-navy">
            {{ t('order.street') }} <span class="font-normal text-muted">({{ t('order.optional') }})</span>
          </label>
          <input id="order-street" v-model="street" type="text" autocomplete="street-address" :placeholder="t('order.streetPh')" :class="inputClass('street')">
        </div>
        <input v-model="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 opacity-0">
        <p v-if="formError" class="text-[13px] text-ink" role="alert">{{ t(`lead.errors.${formError}`) }}</p>
        <BaseButton type="submit" variant="coral" block class="mt-1 !py-[15px] !text-[15.5px] !shadow-none" :disabled="state === 'sending'">
          {{ state === 'sending' ? t('lead.sending') : t('order.submit') }}
        </BaseButton>
        <p class="text-center text-[12px] text-muted">
          {{ t('lead.privacyBefore') }}<NuxtLink :to="localePath('/privacy')" class="text-muted underline hover:text-violet" @click="open = false">{{ t('lead.privacyLink') }}</NuxtLink>{{ t('lead.privacyAfter') }}
        </p>
      </form>
    </template>
  </BaseDialog>
</template>
