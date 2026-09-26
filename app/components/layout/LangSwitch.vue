<script setup lang="ts">
const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const alternates = useAlternatePaths()
</script>

<template>
  <nav :aria-label="t('a11y.language')" class="ml-1 inline-flex rounded-full bg-glass-strong p-[3px]">
    <NuxtLink
      v-for="l in locales"
      :key="l.code"
      :to="alternates?.[l.code] ?? switchLocalePath(l.code)"
      :hreflang="l.language"
      :aria-current="l.code === locale ? 'true' : undefined"
      class="rounded-full px-[11px] py-1 text-[12px] font-bold"
      :class="l.code === locale ? 'bg-white text-navy hover:text-navy' : 'text-on-dark hover:text-white'"
    >
      {{ l.name }}
    </NuxtLink>
  </nav>
</template>
