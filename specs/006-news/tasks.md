# Tasks: News & Articles
- [x] T001 [be] Seed `--refresh=<uid>` mode; demo article bodies uk/en; contract R14/R15 localizations
- [x] T002 `shared/utils/articles.ts` normalisers + tests
- [x] T003 BFF list + detail routes (cached, category filter, pagination, related, alternate slug)
- [x] T004 `ArticleCard.vue` (extracted from NewsPreviewSection), `Breadcrumbs.vue`
- [x] T005 `/news` page (chips, grid, pagination, 404 out of range)
- [x] T006 `/news/[slug]` page (breadcrumbs, meta, cover, RichText, CTA, related, i18n params)
- [x] T007 SEO: Article + BreadcrumbList JSON-LD, og:type article, sitemap source with alternatives
- [x] T008 Gates + e2e

## Notes (2026-09-26)
- Demo articles are ~200 words each (not 300–500): enough to exercise layout and SEO; the client replaces them.
- Language switch uses per-page alternate paths in useState (hydration-safe) + useSetI18nParams for hreflang; wrong-locale slugs 301 to the translation.
- E2E: card → article, EN switch keeps the article, category filter; 404 for unknown slug / page / category. Lighthouse (prod+Caddy): A11y 100, BP 100, Perf 89.
