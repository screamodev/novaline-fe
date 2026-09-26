<script setup lang="ts">
// Placeholder until feature 003 (landing-sections) is implemented per spec.
const { t } = useI18n()
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-container flex-col items-start justify-center gap-6 px-7">
    <img src="/images/novaline-logo.svg" alt="NovaLine" class="h-[50px] w-auto">
    <h1 class="text-h1 text-navy">
      NovaLine <span class="text-violet">PON</span>
    </h1>
    <p class="text-lg text-muted">{{ t('brand_tag') }}</p>
  </main>
</template>
