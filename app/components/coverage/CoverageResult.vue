<script setup lang="ts">
import type { OfferVM, SettlementEntry } from '#shared/types/coverage'
import type { HomeVM } from '#shared/types/home'

defineProps<{
  copy: HomeVM['coverage']
  offers: OfferVM[]
  locality: string
  place: string
  settlement?: SettlementEntry
  neighbourhood?: string
}>()
const emit = defineEmits<{ change: [] }>()
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="animate-rise rounded-3xl bg-white p-6 text-ink max-sm:p-4" role="status" aria-live="polite">
    <div class="flex flex-wrap items-center gap-3.5">
      <span class="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-success-soft text-success">
        <AppIcon name="check" :size="24" :stroke-width="2.6" />
      </span>
      <div class="min-w-0">
        <h3 class="text-[19px] font-bold text-navy">{{ copy.resultTitle }}</h3>
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

    <p v-if="copy.resultNote" class="mb-3 mt-5 text-[14px] font-semibold text-navy">{{ copy.resultNote }}</p>
    <OfferCards :offers="offers" :place="place" :settlement="settlement?.slug" :neighbourhood="neighbourhood" title-tag="h4" />

    <NuxtLink
      v-if="settlement"
      :to="localePath(`/internet/${settlement.slug}`)"
      class="mt-4 block text-center text-[13.5px] font-semibold text-violet hover:text-coral-strong"
    >
      {{ t('locality.more', { place: settlement.nameLocative || t('locality.placeFallback', { name: settlement.name }) }) }} →
    </NuxtLink>
  </div>
</template>
