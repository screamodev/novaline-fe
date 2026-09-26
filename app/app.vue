<script setup lang="ts">
const { t } = useI18n()
const head = useLocaleHead()

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
})
useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs?.lang },
  link: head.value.link,
  meta: head.value.meta,
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
