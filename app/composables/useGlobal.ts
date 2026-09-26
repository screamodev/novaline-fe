import type { GlobalVM } from '#shared/types/cms'

/** Site-wide CMS data (contacts, tagline, default SEO) for the current locale. */
export function useGlobal() {
  const { locale } = useI18n()
  return useFetch<GlobalVM>('/api/cms/global', {
    key: 'cms-global',
    query: { locale },
    dedupe: 'defer',
  })
}
