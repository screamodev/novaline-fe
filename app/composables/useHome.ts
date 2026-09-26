import type { HomeVM } from '#shared/types/home'

/** All landing-page content for the current locale (one cached BFF call). */
export function useHome() {
  const { locale } = useI18n()
  return useFetch<HomeVM>('/api/cms/home', { key: 'cms-home', query: { locale }, dedupe: 'defer' })
}
