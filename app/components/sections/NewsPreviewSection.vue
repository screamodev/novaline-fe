<script setup lang="ts">
import type { HomeVM } from '#shared/types/home'

defineProps<{ data: HomeVM['news'] }>()
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <section id="news" class="section-anchor bg-bg" aria-labelledby="news-title">
    <div class="container-page reveal py-[84px] max-sm:py-[52px]">
      <div class="flex flex-wrap items-end justify-between gap-5">
        <SectionHeading v-if="data.heading" v-bind="data.heading" heading-id="news-title" />
        <BaseButton :to="localePath('/news')" variant="white" pill class="!text-[14.5px]">{{ t('news.all') }}</BaseButton>
      </div>
      <ul class="mt-9 grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
        <li v-for="article in data.items" :key="article.slug">
          <ArticleCard :article="article" />
        </li>
      </ul>
    </div>
  </section>
</template>
