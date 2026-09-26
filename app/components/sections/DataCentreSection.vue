<script setup lang="ts">
import type { HomeVM } from '#shared/types/home'

defineProps<{ data: HomeVM['dataCentre'] }>()
const { t } = useI18n()
const fmt = useFormat()
const sectionLink = useSectionLink()
const { set: setLeadContext } = useLeadContext()
</script>

<template>
  <section id="datacenter" class="section-anchor relative overflow-hidden bg-navy text-white" aria-labelledby="dc-title">
    <div class="absolute inset-0 bg-glow-dc" aria-hidden="true" />
    <div class="container-page reveal relative py-[84px] max-sm:py-[52px]">
      <SectionHeading v-if="data.heading" v-bind="data.heading" dark heading-id="dc-title" title-width="max-w-[620px]" />

      <ul v-if="data.facts.length" class="mt-[30px] grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
        <li v-for="fact in data.facts" :key="fact.key" class="rounded-2xl border border-line-dark bg-glass px-[22px] py-5">
          <div class="text-[15px] font-bold text-white">{{ fact.title }}</div>
          <div class="mt-1.5 text-[13px] leading-[1.5] text-on-dark-dim">{{ fact.text }}</div>
        </li>
      </ul>

      <ul class="mt-[26px] grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <li
          v-for="service in data.services"
          :key="service.key"
          class="flex items-start justify-between gap-5 rounded-[18px] border border-line-dark bg-glass p-[26px] max-sm:flex-col max-sm:gap-3 max-sm:p-5"
        >
          <div>
            <h3 class="font-display text-[17px] font-semibold leading-[1.25] text-white">{{ service.title }}</h3>
            <p class="mt-2.5 text-[14px] leading-[1.6] text-on-dark-dim">{{ service.description }}</p>
          </div>
          <div class="shrink-0 text-right max-sm:flex max-sm:items-baseline max-sm:gap-1.5 max-sm:text-left">
            <div class="whitespace-nowrap font-display text-[19px] font-extrabold text-violet-2">
              {{ service.price === null ? t('dc.onRequest') : `${t('dc.from')} ${fmt.amount(service.price)}` }}
            </div>
            <div v-if="service.price !== null" class="text-[11.5px] text-on-dark-faint">{{ service.unitLabel }}</div>
          </div>
        </li>
      </ul>

      <BaseButton
        :to="sectionLink('lead')"
        variant="coral"
        size="lg"
        class="mt-7 !rounded-[14px] !shadow-none"
        @click="setLeadContext({ kind: 'datacenter', key: 'datacenter', label: data.heading?.title ?? '' })"
      >
        {{ t('dc.order') }}<AppIcon name="arrowRight" :size="17" :stroke-width="2.4" />
      </BaseButton>
    </div>
  </section>
</template>
