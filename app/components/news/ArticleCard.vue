<script setup lang="ts">
import type { ArticleCardVM } from '#shared/types/home'

defineProps<{ article: ArticleCardVM; headingLevel?: 'h2' | 'h3' }>()
const { t } = useI18n()
const fmt = useFormat()
const localePath = useLocalePath()
</script>

<template>
  <NuxtLink
    :to="localePath(`/news/${article.slug}`)"
    class="flex h-full flex-col rounded-[20px] border border-line bg-white p-[26px] transition duration-200 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-card"
  >
    <div class="flex flex-wrap items-center gap-2.5">
      <span
        v-if="article.categoryName"
        class="rounded-full bg-violet/[.09] px-[11px] py-[5px] text-[11.5px] font-bold uppercase tracking-[.05em] text-violet"
      >
        {{ article.categoryName }}
      </span>
      <time :datetime="article.publishedDate" class="text-[12.5px] text-muted">{{ fmt.date(article.publishedDate) }}</time>
    </div>
    <component :is="headingLevel ?? 'h3'" class="mt-4 font-display text-[18px] font-semibold leading-[1.3] text-navy">{{ article.title }}</component>
    <p class="mt-[11px] text-[14px] leading-[1.6] text-muted">{{ article.excerpt }}</p>
    <span class="mt-auto inline-flex items-center gap-[7px] pt-5 text-[14px] font-bold text-coral-strong">
      {{ t('news.read') }}<AppIcon name="arrowRight" :size="15" :stroke-width="2.4" />
    </span>
  </NuxtLink>
</template>
