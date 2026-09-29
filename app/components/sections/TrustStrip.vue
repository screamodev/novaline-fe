<script setup lang="ts">
import type { HomeVM, TrustIcon } from '#shared/types/home'

defineProps<{ items: HomeVM['trust'] }>()
const ICON: Record<TrustIcon, IconName> = { support: 'headset', engineer: 'wrench', power: 'bolt', award: 'award' }
</script>

<template>
  <section v-if="items.length" class="relative">
    <div class="container-page pb-14 pt-10">
      <ul
        class="grid grid-cols-3 gap-4 rounded-[20px] border border-line bg-white px-7 py-6 shadow-card max-md:grid-cols-1"
      >
        <li
          v-for="(item, i) in items"
          :key="item.title"
          class="flex items-start gap-3.5"
          :class="i < items.length - 1 && 'md:border-r md:border-line md:pr-4'"
        >
          <AppIcon :name="ICON[item.icon] ?? 'check'" :size="30" :stroke-width="1.8" class="text-coral" />
          <div>
            <div class="text-[14.5px] font-bold leading-[1.25] text-navy">{{ item.title }}</div>
            <div class="mt-[3px] text-[12.5px] text-muted">{{ item.text }}</div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
