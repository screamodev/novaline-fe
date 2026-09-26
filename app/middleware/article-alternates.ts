import type { ArticleVM } from '#shared/types/articles'

/**
 * Resolves the article before the page (and the header above it) renders, so the language switch
 * links to the translated slug already in the server-rendered HTML. The page re-reads the article
 * from the Nitro cache.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp()
  const locale = nuxtApp.$i18n.locale.value as 'uk' | 'en'
  const article = await $fetch<ArticleVM>(`/api/cms/articles/${String(to.params.slug)}`, { query: { locale } }).catch(() => null)
  if (!article) return
  const localePath = useLocalePath()
  const other = article.locale === 'uk' ? 'en' : 'uk'
  useAlternatePaths().value = {
    [article.locale]: localePath(`/news/${article.slug}`, article.locale as 'uk' | 'en'),
    [other]: article.alternate ? localePath(`/news/${article.alternate.slug}`, other) : localePath('/news', other),
  }
})
