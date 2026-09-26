<script setup lang="ts">
import type { HomeVM, StatTone } from '#shared/types/home'

defineProps<{ data: HomeVM['about'] }>()
const TONE: Record<StatTone, { tile: string; label: string }> = {
  glass: { tile: 'bg-glass border-white/[.12]', label: 'text-on-dark-dim' },
  coral: { tile: 'bg-coral/[.14] border-coral/30', label: 'text-on-dark-coral' },
  violet: { tile: 'bg-violet/20 border-violet-2/[.35]', label: 'text-on-dark-muted' },
}
</script>

<template>
  <section id="about" class="section-anchor relative overflow-hidden bg-navy text-white" aria-labelledby="about-title">
    <div class="absolute inset-0 bg-glow-about" aria-hidden="true" />
    <div class="container-page reveal relative grid grid-cols-2 items-center gap-14 py-20 max-tab:grid-cols-1 max-sm:py-[52px]">
      <div>
        <SectionHeading v-if="data.heading" v-bind="data.heading" dark size="sm" heading-id="about-title" title-width="max-w-[520px]" />
        <p
          v-for="(paragraph, i) in data.paragraphs"
          :key="i"
          class="text-[15.5px] leading-[1.7] text-on-dark-muted"
          :class="i === 0 ? 'mt-5' : 'mt-3.5'"
        >
          {{ paragraph }}
        </p>
      </div>
      <ul class="grid grid-cols-2 gap-4">
        <li v-for="stat in data.stats" :key="stat.label" class="rounded-[18px] border p-[26px] max-sm:p-5" :class="TONE[stat.tone].tile">
          <div class="font-display text-[40px] font-extrabold text-white max-sm:text-[32px]">{{ stat.value }}</div>
          <div class="mt-1 text-[13.5px]" :class="TONE[stat.tone].label">{{ stat.label }}</div>
        </li>
      </ul>
    </div>
  </section>
</template>
