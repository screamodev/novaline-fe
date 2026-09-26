<script setup lang="ts">
import type { HomeVM, PromoVM } from '#shared/types/home'

defineProps<{ data: HomeVM['promos'] }>()
const { t } = useI18n()
const fmt = useFormat()
const sectionLink = useSectionLink()
const { set: setLeadContext } = useLeadContext()
const apply = (p: PromoVM) => setLeadContext({ kind: 'promo', key: p.key, label: p.title })
</script>

<template>
  <section id="promos" class="section-anchor container-page reveal py-[84px] max-sm:py-[52px]" aria-labelledby="promos-title">
    <SectionHeading v-if="data.heading" v-bind="data.heading" heading-id="promos-title" title-width="max-w-[620px]" />
    <div class="mt-9 grid grid-cols-2 gap-[22px] max-md:grid-cols-1">
      <article v-for="promo in data.items" :key="promo.key" class="flex flex-col overflow-hidden rounded-[22px] border border-line bg-white">
        <div class="h-1 rounded-full" :class="promo.accent === 'coral' ? 'bg-coral' : 'bg-violet'" />
        <div class="flex flex-1 flex-col p-[30px] max-sm:p-6">
          <span
            class="self-start rounded-full px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[.05em]"
            :class="promo.accent === 'coral' ? 'bg-coral-soft text-coral' : 'bg-violet-soft text-violet'"
          >
            {{ promo.tag }}
          </span>
          <h3 class="mt-4 font-display text-[21px] font-bold leading-[1.25] text-navy">{{ promo.title }}</h3>
          <p class="mt-3 text-[14.5px] leading-[1.6] text-muted">{{ promo.description }}</p>
          <div v-if="promo.terms" class="mt-[18px] rounded-[14px] bg-bg px-[18px] py-4">
            <div class="text-[12px] font-bold uppercase tracking-[.05em] text-muted">{{ t('promo.terms') }}</div>
            <p class="mt-[7px] text-[13.5px] leading-[1.6] text-ink">{{ promo.terms }}</p>
          </div>
          <div class="mt-auto flex flex-wrap items-center justify-between gap-4 pt-[22px]">
            <span v-if="promo.validUntil" class="inline-flex items-center gap-[9px] text-[13.5px] font-bold text-navy">
              <AppIcon name="calendar" :size="16" :stroke-width="2.1" class="text-coral" />
              {{ t('promo.until') }} <time :datetime="promo.validUntil">{{ fmt.date(promo.validUntil) }}</time>
            </span>
            <BaseButton :to="sectionLink('lead')" pill size="sm" class="!py-3 !px-5" @click="apply(promo)">{{ t('promo.cta') }}</BaseButton>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
