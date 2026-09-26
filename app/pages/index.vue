<script setup lang="ts">
// Landing sections arrive with feature 003; this page already exercises the shell, SEO and CMS data.
const { t } = useI18n()
const { data: global } = useGlobal()
useSeo()
</script>

<template>
  <section class="container-page flex min-h-[60vh] flex-col items-start justify-center gap-6 py-[96px]">
    <h1 class="text-h1 text-navy">NovaLine</h1>
    <p class="max-w-[520px] text-[18px] leading-[1.6] text-muted">{{ t('meta.description') }}</p>
    <p class="text-[14px] text-muted">{{ global?.footerTagline }}</p>
  </section>
</template>
