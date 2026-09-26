<script setup lang="ts">
import type { SettlementEntry } from '#shared/types/coverage'
import type { PlanVM } from '#shared/types/home'
import { planPrice } from '#shared/utils/coverage'

const props = defineProps<{ settlement: SettlementEntry; plans: PlanVM[]; place: string }>()
const { t } = useI18n()
const fmt = useFormat()
const rows = computed(() =>
  props.settlement.neighbourhoods.length
    ? props.settlement.neighbourhoods.map((n) => ({ label: n.name, modifier: n.priceModifier }))
    : [{ label: t('locality.base'), modifier: 0 }],
)
</script>

<template>
  <section aria-labelledby="prices-title">
    <h2 id="prices-title" class="font-display text-[22px] font-bold text-navy">{{ t('locality.pricesTitle', { place }) }}</h2>
    <div class="mt-5 overflow-x-auto rounded-[18px] border border-line bg-white">
      <table class="w-full min-w-[420px] text-left text-[14.5px]">
        <thead class="bg-bg text-[12px] font-bold uppercase tracking-[.05em] text-muted">
          <tr>
            <th scope="col" class="px-5 py-3.5">{{ settlement.neighbourhoods.length ? t('locality.neighbourhood') : '' }}</th>
            <th v-for="plan in plans" :key="plan.key" scope="col" class="px-5 py-3.5 text-right">
              {{ plan.speedLabel }}<span class="block font-semibold normal-case tracking-normal">{{ plan.coverageCaption ?? plan.name }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.label" class="border-t border-line">
            <th scope="row" class="px-5 py-3.5 font-semibold text-navy">{{ row.label }}</th>
            <td v-for="plan in plans" :key="plan.key" class="px-5 py-3.5 text-right font-display text-[17px] font-bold text-violet">
              {{ fmt.amount(planPrice(plan.price.amount, row.modifier) ?? 0) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="mt-3 text-[13px] text-muted">{{ t('locality.pricesNote') }}</p>
  </section>
</template>
