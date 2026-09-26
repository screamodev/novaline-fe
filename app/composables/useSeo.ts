import type { SeoVM } from '#shared/types/cms'

/**
 * Page meta from a CMS SEO component, falling back to the global default SEO and then to i18n defaults.
 * hreflang/canonical links come from `useLocaleHead` in app.vue.
 */
export function useSeo(page?: MaybeRefOrGetter<Partial<SeoVM> | null | undefined>) {
  const { t } = useI18n()
  const { data: global } = useGlobal()
  const img = useImage()
  const siteUrl = useRuntimeConfig().public.siteUrl

  const seo = computed(() => {
    const p = toValue(page)
    const g = global.value?.seo
    return {
      title: p?.title || g?.title || t('meta.title'),
      description: p?.description || g?.description || t('meta.description'),
      image: p?.image || g?.image || null,
      noIndex: !!p?.noIndex,
    }
  })
  const ogImage = computed(() =>
    seo.value.image ? new URL(img(seo.value.image.src, { width: 1200, height: 630, fit: 'cover', format: 'jpg' }), siteUrl).href : undefined,
  )

  useSeoMeta({
    title: () => seo.value.title,
    description: () => seo.value.description,
    ogTitle: () => seo.value.title,
    ogDescription: () => seo.value.description,
    ogType: 'website',
    ogSiteName: 'NovaLine',
    ogImage: () => ogImage.value,
    twitterCard: 'summary_large_image',
    robots: () => (seo.value.noIndex ? 'noindex, nofollow' : undefined),
  })
}
