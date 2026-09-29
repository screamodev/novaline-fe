<script setup lang="ts">
import type { OfferVM } from '#shared/types/coverage'

const props = defineProps<{
  offers: OfferVM[]
  /** Locality label used in the order context, e.g. "Харків · Салтівка". */
  place: string
  settlement?: string
  neighbourhood?: string
  /** Heading level for each offer title (keeps the page outline valid). */
  titleTag?: 'h3' | 'h4'
  /** Always one offer per row (narrow containers). */
  stack?: boolean
}>()
const { t, locale } = useI18n()
const { openOrder } = useOrderDialog()

const note = (o: OfferVM) => (locale.value === 'en' ? o.noteEn || o.note : o.note)

function order(o: OfferVM) {
  openOrder({
    context: {
      kind: 'offer',
      key: `${props.settlement ?? ''}:${o.technology}:${o.audience}`,
      label: t('offer.orderContext', { place: props.place, technology: o.technology, audience: t(`offer.audience.${o.audience}`) }),
    },
    settlement: props.settlement,
    neighbourhood: props.neighbourhood,
  })
}
</script>

<template>
  <!-- One offer keeps a readable width; two sit side by side unless the container is narrow. -->
  <div class="grid gap-4" :class="offers.length > 1 ? !stack && 'md:grid-cols-2' : 'max-w-[640px]'">
    <article
      v-for="(o, i) in offers"
      :key="`${o.technology}-${o.audience}-${i}`"
      class="flex flex-col rounded-[18px] border border-line bg-white p-5 text-ink max-sm:p-4"
    >
      <component :is="titleTag ?? 'h3'" class="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[15px] font-bold text-navy">
        <span class="rounded-full bg-violet px-2.5 py-1 text-[12px] font-bold tracking-[.03em] text-white">{{ o.technology }}</span>
        <span>{{ t(`offer.medium.${o.technology}`) }} · {{ t(`offer.audience.${o.audience}`) }}</span>
      </component>

      <ul class="mt-4 flex flex-col gap-2" :aria-label="t('offer.tariffsLabel')">
        <li v-for="tariff in o.tariffs" :key="tariff.speed" class="flex items-baseline justify-between gap-3 rounded-xl bg-bg px-4 py-3">
          <span class="text-[16px] font-bold text-navy">
            {{ t('offer.speed', { speed: tariff.speed }) }}<span v-if="tariff.extra" class="font-semibold text-muted"> + {{ tariff.extra }}</span>
          </span>
          <span class="whitespace-nowrap">
            <span class="text-[20px] font-extrabold text-violet">{{ tariff.price }}</span>
            <span class="ml-1 text-[12.5px] text-muted">{{ t('offer.perMonth') }}</span>
          </span>
        </li>
      </ul>

      <div v-if="o.connectionPrice !== null" class="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[14px]">
        <span class="font-semibold text-muted">{{ t('offer.connection') }}:</span>
        <span v-if="o.connectionPriceOld" class="text-muted line-through" :aria-label="t('offer.oldPrice', { price: o.connectionPriceOld })">
          {{ o.connectionPriceOld }} {{ t('offer.uah') }}
        </span>
        <span class="text-[16px] font-extrabold text-navy">{{ o.connectionPrice }} {{ t('offer.uah') }}</span>
        <span v-if="o.connectionPromo" class="rounded-full bg-coral-strong px-2.5 py-1 text-[11.5px] font-bold text-white">{{ t('offer.promo') }}</span>
      </div>
      <p v-if="note(o)" class="mt-2 text-[13px] leading-[1.55] text-muted">{{ note(o) }}</p>

      <div class="mt-auto pt-4">
        <BaseButton variant="coral" block class="!py-3 !shadow-none" @click="order(o)">
          {{ t('offer.order') }}<AppIcon name="arrowRight" :size="16" :stroke-width="2.4" />
        </BaseButton>
      </div>
    </article>
  </div>
</template>
