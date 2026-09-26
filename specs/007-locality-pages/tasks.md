# Tasks: Locality Landing Pages
- [x] T001 [be] `nameLocative` for all seeded settlements (uk/en) + refresh
- [x] T002 `nearestSettlements` (haversine) + test; settlement intro/seo BFF route
- [x] T003 `/internet` directory with search → locality page
- [x] T004 `/internet/[slug]`: breadcrumbs, H1, intro template/CMS, facts, neighbourhood prices, plans, map, nearby, lead form prefill
- [x] T005 SEO: unique meta, BreadcrumbList + Service/Place JSON-LD, sitemap entries
- [x] T006 Internal links: coverage result → locality page; footer → /internet
- [x] T007 Gates + crawl all locality pages

## Notes (2026-09-26)
- All 46 pages return 200 with unique titles; vue-i18n needs `{'|'}` for a literal pipe.
- E2E: directory search → page, Kharkiv neighbourhood prices 240/300…200/260, lead prefill, focused map, 6 nearby links, coverage result → locality link. Lighthouse: A11y 100 (after heading-order fix), Perf 87.
