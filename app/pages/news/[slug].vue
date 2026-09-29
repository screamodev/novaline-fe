<script setup lang="ts">
import type { ArticleVM } from '#shared/types/articles'

definePageMeta({ middleware: ['article-alternates'] })

const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const sectionLink = useSectionLink()
const { openOrder } = useOrderDialog()
const fmt = useFormat()
const siteUrl = useRuntimeConfig().public.siteUrl
const slug = computed(() => String(route.params.slug))

const { data: article, error } = await useFetch<ArticleVM>(() => `/api/cms/articles/${slug.value}`, {
  key: `cms-article-${slug.value}`,
  query: { locale },
})
if (error.value || !article.value) {
  throw createError({ statusCode: error.value?.statusCode ?? 404, statusMessage: 'Article not found', fatal: true })
}

// The slug belongs to the other locale: send visitors to the right URL (or the news list if untranslated).
if (article.value.locale !== locale.value) {
  const target = article.value.alternate?.locale === locale.value ? `/news/${article.value.alternate.slug}` : '/news'
  await navigateTo(localePath(target), { redirectCode: target === '/news' ? 302 : 301 })
}

// hreflang uses the translated slug; the language switch gets it from the `article-alternates` middleware.
const setI18nParams = useSetI18nParams()
setI18nParams({
  [article.value.locale]: { slug: article.value.slug },
  ...(article.value.alternate ? { [article.value.alternate.locale]: { slug: article.value.alternate.slug } } : {}),
})

const a = article.value
useSeo(
  () => ({
    title: a.seo.title || `${a.title} | NovaLine`,
    description: a.seo.description || a.excerpt,
    image: a.seo.image || a.cover,
    noIndex: a.seo.noIndex,
  }),
  { type: 'article' },
)
useSeoMeta({ articlePublishedTime: a.publishedDate, articleModifiedTime: a.updatedAt ?? undefined })
useSchemaOrg([
  defineArticle({
    headline: a.title,
    description: a.excerpt,
    datePublished: a.publishedDate,
    dateModified: a.updatedAt ?? undefined,
    image: a.cover?.src ? `${siteUrl}${useImage()(a.cover.src, { width: 1200 })}` : undefined,
    inLanguage: a.locale === 'en' ? 'en-US' : 'uk-UA',
  }),
])
</script>

<template>
  <article v-if="article" class="container-page max-w-[860px] py-[60px] max-sm:py-10">
    <Breadcrumbs
      :items="[
        { label: t('breadcrumbs.home'), to: localePath('/') },
        { label: t('breadcrumbs.news'), to: localePath('/news') },
        { label: article.title },
      ]"
    />
    <header class="mt-7">
      <div class="flex flex-wrap items-center gap-2.5">
        <NuxtLink
          v-if="article.category"
          :to="{ path: localePath('/news'), query: { category: article.category.slug } }"
          class="rounded-full bg-violet/[.09] px-[11px] py-[5px] text-[11.5px] font-bold uppercase tracking-[.05em] text-violet"
        >
          {{ article.category.name }}
        </NuxtLink>
        <span class="text-[13px] text-muted">
          {{ t('news.published') }} <time :datetime="article.publishedDate">{{ fmt.date(article.publishedDate) }}</time>
        </span>
      </div>
      <h1 class="mt-4 text-h2 text-navy">{{ article.title }}</h1>
      <p class="mt-4 text-[18px] leading-[1.6] text-muted">{{ article.excerpt }}</p>
    </header>

    <NuxtImg
      v-if="article.cover"
      :src="article.cover.src"
      :alt="article.cover.alt"
      width="860"
      sizes="100vw md:860px"
      format="webp"
      class="mt-8 w-full rounded-[22px] object-cover"
    />

    <RichText :blocks="article.body" class="mt-8" />

    <aside class="mt-12 rounded-[22px] bg-lead-card p-8 text-white max-sm:p-6">
      <h2 class="font-display text-[22px] font-bold">{{ t('news.ctaTitle') }}</h2>
      <p class="mt-2.5 max-w-[560px] text-[15px] leading-[1.6] text-white/90">{{ t('news.ctaText') }}</p>
      <div class="mt-5 flex flex-wrap gap-3">
        <BaseButton :to="sectionLink('coverage')" variant="white" class="!rounded-[14px]">{{ t('news.ctaCoverage') }}</BaseButton>
        <BaseButton
          variant="coral"
          class="!rounded-[14px] !shadow-none"
          @click="openOrder({ context: { kind: 'article', key: article!.slug, label: article!.title } })"
        >
          {{ t('news.ctaLead') }}
        </BaseButton>
      </div>
    </aside>

    <section v-if="article.related.length" class="mt-14" aria-labelledby="related-title">
      <h2 id="related-title" class="font-display text-[22px] font-bold text-navy">{{ t('news.related') }}</h2>
      <ul class="mt-5 grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
        <li v-for="r in article.related" :key="r.slug"><ArticleCard :article="r" /></li>
      </ul>
    </section>
  </article>
</template>
