<script setup lang="ts">
import type { HomeVM } from '#shared/types/home'

defineProps<{ data: HomeVM['services'] }>()
</script>

<template>
  <section id="services" class="section-anchor container-page reveal py-[84px] max-sm:py-[52px]" aria-labelledby="services-title">
    <SectionHeading v-if="data.heading" v-bind="data.heading" heading-id="services-title" title-width="max-w-[620px]" />
    <ul class="mt-[38px] grid grid-cols-3 gap-5 max-tab:grid-cols-1">
      <li
        v-for="item in data.items"
        :key="item.key"
        class="rounded-[20px] border border-line bg-white p-7 transition duration-200 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-card"
      >
        <div class="grid h-14 w-14 place-items-center rounded-2xl bg-icon-tile text-violet">
          <AppIcon :name="item.icon" :size="26" :stroke-width="1.8" />
        </div>
        <h3 class="mt-5 font-display text-[19px] font-semibold leading-[1.2] text-navy">{{ item.title }}</h3>
        <p class="mt-3 text-[14.5px] leading-[1.6] text-muted">{{ item.description }}</p>
      </li>
    </ul>
  </section>
</template>
