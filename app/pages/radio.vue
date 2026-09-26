<script setup lang="ts">
// Placeholder until feature 008 (radio) — keeps header/footer links valid; not indexed.
definePageMeta({ layout: 'minimal' })
const localePath = useLocalePath()
const { t } = useI18n()
useSeo({ title: 'NovaLine Radio', noIndex: true })
</script>

<template>
  <section class="grid min-h-screen place-items-center bg-navy px-6 text-center text-on-dark">
    <div>
      <h1 class="text-h1 text-white">NovaLine <span class="text-violet-2">Radio</span></h1>
      <BaseButton :to="localePath('/')" variant="white" pill class="mt-8">{{ t('error.home') }}</BaseButton>
    </div>
  </section>
</template>
