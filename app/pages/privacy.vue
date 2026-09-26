<script setup lang="ts">
const { locale } = useI18n()
const { data: page, error } = await useFetch('/api/cms/privacy', { key: 'cms-privacy', query: { locale } })
if (error.value && !page.value) {
  throw createError({ statusCode: error.value.statusCode ?? 503, statusMessage: error.value.statusMessage, fatal: true })
}
useSeo(() => ({ ...page.value?.seo, title: page.value?.seo.title || page.value?.title }))
</script>

<template>
  <article v-if="page" class="container-page max-w-[820px] py-[84px] max-sm:py-[52px]">
    <h1 class="text-h2 text-navy">{{ page.title }}</h1>
    <RichText :blocks="page.body" class="mt-8" />
  </article>
</template>
