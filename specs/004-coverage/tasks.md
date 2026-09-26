# Tasks: Coverage Check & Map

- [x] T001 `CoverageVM` types + `buildIndex`, `searchSettlements`, `planPrice` in `shared/utils/coverage.ts` with tests
- [x] T002 `server/api/cms/coverage.get.ts` (cached, locale fallback)
- [x] T003 Extend `HomeVM.coverage` with all `coverage-copy` fields
- [x] T004 `useCoverage` state + actions + `?settlement=` deep link
- [x] T005 [US2] `CoverageSearch.vue` ARIA combobox
- [x] T006 [US1] `CoverageSelect.vue` + cascade in `CoverageSection.vue`
- [x] T007 [US1] `CoverageResult.vue` (plans × modifier, change address, leave request → `useLeadAddress`)
- [x] T008 [US3] `CoverageMap.client.vue` (lazy, markers from palette, flyTo/tooltip sync, OSM dark)
- [x] T009 i18n strings, analytics events, replace `CoverageTeaser`
- [x] T010 Gates + manual scenarios from the spec + screenshots vs prototype

## Notes (2026-09-26)
- E2E (puppeteer + system Chrome): cascade, +30/−10 price modifiers, live neighbourhood updates, search (case/apostrophe, EN), marker click, deep link `?settlement=`, coverage → lead prefill — all passing.
- Leaflet is a separate chunk loaded when the map scrolls into view (IntersectionObserver + `LazyCoverageMapCanvas`).
- Lighthouse mobile via Caddy: Perf 91, A11y 100, BP 100, CLS 0.023.
