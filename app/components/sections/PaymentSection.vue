<script setup lang="ts">
import type { HomeVM } from '#shared/types/home'

defineProps<{ data: HomeVM['payment'] }>()
const open = ref(0)
const toggle = (i: number) => (open.value = open.value === i ? -1 : i)
</script>

<template>
  <section id="payment" class="section-anchor container-page reveal py-20 max-sm:py-[52px]" aria-labelledby="payment-title">
    <SectionHeading v-if="data.heading" v-bind="data.heading" heading-id="payment-title" />

    <div v-if="data.accountNote" class="mt-6 flex items-start gap-4 rounded-[18px] border border-coral/[.24] bg-coral/[.06] px-6 py-[22px]">
      <AppIcon name="shieldAlert" :size="22" class="mt-px text-coral" />
      <p class="text-[14.5px] leading-[1.65] text-ink">{{ data.accountNote }}</p>
    </div>

    <h3 v-if="data.stepsTitle" class="mt-11 font-display text-[22px] font-bold text-navy">{{ data.stepsTitle }}</h3>
    <div class="mt-5 flex flex-col gap-3">
      <div
        v-for="(method, i) in data.methods"
        :key="method.key"
        class="overflow-hidden rounded-[18px] border bg-white transition-colors duration-200"
        :class="open === i ? 'border-violet' : 'border-line'"
      >
        <h4>
          <button
            :id="`pay-head-${method.key}`"
            type="button"
            class="flex w-full items-center gap-4 px-6 py-5 text-left max-sm:px-4"
            :aria-expanded="open === i"
            :aria-controls="`pay-body-${method.key}`"
            @click="toggle(i)"
          >
            <span
              class="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px] font-display text-[14px] font-bold"
              :class="open === i ? 'bg-violet text-white' : 'bg-bg text-violet'"
            >
              {{ i + 1 }}
            </span>
            <span class="flex-1">
              <span class="block font-display text-[17px] font-semibold text-navy">{{ method.name }}</span>
              <span class="mt-[3px] block text-[13px] text-muted">{{ method.meta }}</span>
            </span>
            <span class="shrink-0 text-[13px] text-violet" aria-hidden="true">{{ open === i ? '▴' : '▾' }}</span>
          </button>
        </h4>
        <!-- Collapsed steps stay in the HTML for crawlers; v-show only hides them. -->
        <div
          v-show="open === i"
          :id="`pay-body-${method.key}`"
          role="region"
          :aria-labelledby="`pay-head-${method.key}`"
          class="pb-6 pl-[74px] pr-6 max-sm:pl-[58px] max-sm:pr-4"
        >
          <ol class="flex list-decimal flex-col gap-2.5 pl-5">
            <li v-for="step in method.steps" :key="step" class="text-[14.5px] leading-[1.6] text-ink">{{ step }}</li>
          </ol>
        </div>
      </div>
    </div>

    <div v-if="data.details.length" class="mt-[34px] rounded-[22px] bg-navy p-[30px] text-white max-sm:p-5">
      <h3 class="font-display text-[19px] font-semibold">{{ data.detailsTitle }}</h3>
      <dl class="mt-5 grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
        <div v-for="item in data.details" :key="item.label" class="rounded-[14px] border border-line-dark bg-glass px-[18px] py-4">
          <dt class="text-[11.5px] font-bold uppercase tracking-[.05em] text-on-dark-faint">{{ item.label }}</dt>
          <dd class="mt-1.5 break-words text-[14.5px] font-semibold text-white">{{ item.value }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>
