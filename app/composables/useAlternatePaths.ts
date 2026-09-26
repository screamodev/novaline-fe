/**
 * Locale → path of the current page's translation (e.g. an article with per-locale slugs).
 * Stored in useState so the header's language switch hydrates with the same links the server rendered.
 */
export const useAlternatePaths = () => useState<Record<string, string> | null>('i18n-alternate-paths', () => null)
