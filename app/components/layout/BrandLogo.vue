<script setup lang="ts">
withDefaults(defineProps<{ tagline?: string[]; variant?: 'header' | 'footer' }>(), { tagline: () => [], variant: 'header' })
const localePath = useLocalePath()
</script>

<template>
  <NuxtLink :to="localePath('/')" class="flex shrink-0 items-center gap-[13px]" aria-label="NovaLine">
    <span v-if="variant === 'footer'" class="grid place-items-center rounded-xl bg-white px-2.5 py-2">
      <img src="/images/novaline-logo.svg" alt="NovaLine" width="52" height="46" class="block h-[46px] w-auto">
    </span>
    <img v-else src="/images/novaline-logo.svg" alt="NovaLine" width="56" height="50" class="block h-[50px] w-auto">
    <span
      v-if="tagline.length"
      class="flex flex-col font-body font-bold leading-[1.22] tracking-[.09em]"
      :class="variant === 'footer' ? 'text-[9px] text-on-dark-faint' : 'text-[9.5px] text-muted'"
    >
      <span v-for="line in tagline" :key="line">{{ line }}</span>
    </span>
  </NuxtLink>
</template>
