<script setup lang="ts">
import type { HomeVM } from '#shared/types/home'

defineProps<{ data: HomeVM['addons'] }>()
const fmt = useFormat()
</script>

<template>
  <div class="mt-11">
    <template v-if="data.heading">
      <h3 class="font-display text-[22px] font-bold text-navy">{{ data.heading.title }}</h3>
      <p v-if="data.heading.subtitle" class="mt-2.5 max-w-[560px] text-[15px] leading-[1.6] text-muted">{{ data.heading.subtitle }}</p>
    </template>
    <ul class="mt-[22px] grid grid-cols-2 gap-5 max-md:grid-cols-1">
      <li
        v-for="addon in data.items"
        :key="addon.key"
        class="flex items-start justify-between gap-[18px] rounded-[18px] border bg-white p-6 max-sm:flex-col max-sm:gap-3"
        :class="addon.highlighted ? 'border-coral/40' : 'border-line'"
      >
        <div>
          <div class="text-[16px] font-bold text-navy">{{ addon.title }}</div>
          <p class="mt-[7px] text-[13.5px] leading-[1.55] text-muted">{{ addon.description }}</p>
        </div>
        <div class="shrink-0 text-right max-sm:flex max-sm:items-baseline max-sm:gap-1.5 max-sm:text-left">
          <div class="whitespace-nowrap font-display text-[22px] font-extrabold" :class="addon.highlighted ? 'text-coral' : 'text-violet'">
            {{ fmt.price(addon.price, { plus: true }) }}
          </div>
          <div v-if="addon.unitLabel && addon.price.amount !== null" class="text-[11.5px] text-muted">{{ addon.unitLabel }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
