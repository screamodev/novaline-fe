<script setup lang="ts">
import type { HomeVM, PlanVM } from '#shared/types/home'
import { planPrice } from '#shared/utils/coverage'
import type { SettlementEntry } from '#shared/types/coverage'

defineProps<{ copy: HomeVM['coverage']; plans: PlanVM[]; locality: string; modifier: number; settlement?: SettlementEntry }>()
const emit = defineEmits<{ change: []; lead: [] }>()
const { t } = useI18n()
const fmt = useFormat()
const localePath = useLocalePath()
</script>

<template>
  <div class="mt-[22px] animate-rise rounded-[18px] bg-white p-6 text-ink max-sm:p-5" role="status" aria-live="polite">
    <div class="flex flex-wrap items-center gap-3.5">
      <span class="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-success-soft text-success">
        <AppIcon name="check" :size="24" :stroke-width="2.6" />
      </span>
      <div>
        <div class="font-display text-[19px] font-bold text-navy">{{ copy.resultTitle }}</div>
        <div class="mt-0.5 text-[14px] text-muted">{{ locality }}</div>
      </div>
      <button
        type="button"
        class="ml-auto rounded-full border border-line px-[15px] py-[9px] text-[13px] font-semibold text-muted hover:text-navy"
        @click="emit('change')"
      >
        {{ t('coverage.change') }}
      </button>
    </div>

    <dl class="mt-[18px] flex flex-wrap gap-[26px]">
      <div v-if="copy.technology" class="border-l-[3px] border-violet pl-3">
        <dt class="text-[12px] font-semibold text-muted">{{ t('coverage.technology') }}</dt>
        <dd class="font-display text-[18px] font-bold text-navy">{{ copy.technology }}</dd>
      </div>
      <div v-if="copy.speedValue" class="border-l-[3px] border-coral pl-3">
        <dt class="text-[12px] font-semibold text-muted">{{ t('coverage.speed') }}</dt>
        <dd class="font-display text-[18px] font-bold text-navy">{{ copy.speedValue }}</dd>
      </div>
    </dl>

    <template v-if="plans.length">
      <div v-if="copy.resultNote" class="mb-3 mt-[22px] text-[14px] font-semibold text-navy">{{ copy.resultNote }}</div>
      <ul class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        <li
          v-for="plan in plans"
          :key="plan.key"
          class="relative flex items-center justify-between rounded-[14px] px-[18px] py-4"
          :class="plan.popular ? 'border-[1.5px] border-violet' : 'border border-line'"
        >
          <span
            v-if="plan.popular"
            class="absolute -top-2.5 left-4 rounded-full bg-coral-strong px-[9px] py-[3px] text-[10.5px] font-bold text-white"
          >
            {{ t('common.popular') }}
          </span>
          <div>
            <div class="font-display text-[17px] font-bold text-navy">{{ plan.speedLabel }}</div>
            <div class="text-[12.5px] text-muted">{{ plan.coverageCaption ?? plan.name }}</div>
          </div>
          <div class="text-right">
            <span class="font-display text-[22px] font-bold text-violet">{{ fmt.amount(planPrice(plan.price.amount, modifier) ?? 0) }}</span>
            <div class="text-[11.5px] text-muted">{{ plan.periodLabel }}</div>
          </div>
        </li>
      </ul>
    </template>

    <BaseButton variant="coral" block class="mt-3.5 !py-[15px] !text-[15.5px] !shadow-none" @click="emit('lead')">
      {{ t('coverage.leave') }}<AppIcon name="arrowRight" :size="17" :stroke-width="2.4" />
    </BaseButton>
    <NuxtLink
      v-if="settlement"
      :to="localePath(`/internet/${settlement.slug}`)"
      class="mt-3 block text-center text-[13.5px] font-semibold text-violet hover:text-coral-strong"
    >
      {{ t('locality.more', { place: settlement.nameLocative || t('locality.placeFallback', { name: settlement.name }) }) }} →
    </NuxtLink>
  </div>
</template>
