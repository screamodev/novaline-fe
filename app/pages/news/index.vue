<script setup lang="ts">
import type { ArticleListVM } from '#shared/types/articles'
import { parsePage } from '#shared/utils/articles'

const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const page = computed(() => parsePage(route.query.page))
const category = computed(() => (typeof route.query.category === 'string' ? route.query.category : ''))

const [{ data: home }, { data: list, error }] = await Promise.all([
  useHome(),
  useFetch<ArticleListVM>('/api/cms/articles', { key: 'cms-articles', query: { locale, page, category } }),
])
if (error.value && !list.value) throw createError({ statusCode: 503, statusMessage: 'CMS unavailable', fatal: true })
// Out-of-range pages and unknown categories are real 404s, not empty pages.
const isUnknownCategory = computed(() => !!category.value && !list.value?.categories.some((c) => c.slug === category.value))
if (list.value && ((page.value > 1 && page.value > list.value.pageCount) || isUnknownCategory.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const heading = computed(() => home.value?.news.heading)
const link = (q: { page?: number; category?: string }) => ({
  path: localePath('/news'),
  query: { ...(q.category ? { category: q.category } : {}), ...(q.page && q.page > 1 ? { page: String(q.page) } : {}) },
})
const pages = computed(() => Array.from({ length: list.value?.pageCount ?? 1 }, (_, i) => i + 1))

useSeo(() => ({
  title: `${heading.value?.title ?? t('breadcrumbs.news')}${page.value > 1 ? ` — ${t('news.page', { n: page.value })}` : ''} | NovaLine`,
  description: heading.value?.subtitle ?? undefined,
}))
</script>

<template>
  <section class="container-page py-[60px] max-sm:py-10">
    <Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: localePath('/') }, { label: t('breadcrumbs.news') }]" />
    <div class="mt-6">
      <div v-if="heading?.kicker" class="mb-3.5 flex items-center gap-3">
        <span class="h-1 w-[26px] rounded-sm bg-coral" aria-hidden="true" />
        <span class="text-kicker font-bold uppercase text-violet">{{ heading.kicker }}</span>
      </div>
      <h1 class="text-h2 text-navy">{{ heading?.title ?? t('breadcrumbs.news') }}</h1>
      <p v-if="heading?.subtitle" class="mt-3.5 max-w-[560px] text-[16.5px] leading-[1.6] text-muted">{{ heading.subtitle }}</p>
    </div>

    <nav v-if="list?.categories.length" class="mt-7 flex flex-wrap gap-[9px]" :aria-label="t('news.categoryAll')">
      <NuxtLink
        v-for="c in [{ slug: '', name: t('news.categoryAll') }, ...list.categories]"
        :key="c.slug"
        :to="link({ category: c.slug })"
        :aria-current="category === c.slug ? 'page' : undefined"
        class="whitespace-nowrap rounded-full px-4 py-[9px] text-[13.5px] font-semibold"
        :class="category === c.slug ? 'bg-violet text-white hover:text-white' : 'border border-line bg-white text-muted hover:text-navy'"
      >
        {{ c.name }}
      </NuxtLink>
    </nav>

    <ul v-if="list?.items.length" class="mt-9 grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
      <li v-for="article in list.items" :key="article.slug"><ArticleCard :article="article" heading-level="h2" /></li>
    </ul>
    <p v-else class="mt-9 text-muted">{{ t('news.empty') }}</p>

    <nav v-if="(list?.pageCount ?? 1) > 1" class="mt-10 flex items-center justify-center gap-2" :aria-label="t('a11y.pagination')">
      <NuxtLink v-if="page > 1" :to="link({ page: page - 1, category })" rel="prev" class="rounded-full border border-line bg-white px-4 py-2 text-[14px] font-semibold text-navy">
        {{ t('news.prev') }}
      </NuxtLink>
      <NuxtLink
        v-for="n in pages"
        :key="n"
        :to="link({ page: n, category })"
        :aria-current="n === page ? 'page' : undefined"
        class="grid h-10 w-10 place-items-center rounded-full text-[14px] font-bold"
        :class="n === page ? 'bg-violet text-white hover:text-white' : 'border border-line bg-white text-navy'"
      >
        {{ n }}
      </NuxtLink>
      <NuxtLink v-if="page < (list?.pageCount ?? 1)" :to="link({ page: page + 1, category })" rel="next" class="rounded-full border border-line bg-white px-4 py-2 text-[14px] font-semibold text-navy">
        {{ t('news.next') }}
      </NuxtLink>
    </nav>
  </section>
</template>
