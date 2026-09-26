# Implementation Plan: Coverage Check & Map

**Branch**: main | **Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

## Summary
Replace the `#coverage` placeholder with the full prototype block: name search (ARIA combobox), cascading native selects (region → district → settlement → neighbourhood), a result card with coverage plans priced with the neighbourhood modifier, and a lazily hydrated Leaflet map synced with the selection. Data comes from the cached BFF route over `GET /api/coverage`.

## Technical Context
**Stack**: Nuxt 4 / Vue 3.5 / TS strict, Leaflet 1.9 (client-only, dynamic import) · **Testing**: Vitest for `shared/utils/coverage.ts` · **Performance**: Leaflet not in the initial bundle (`<LazyCoverageMap hydrate-on-visible>`), fixed-height map placeholder (no CLS)

## Constitution Check
I ✅ geography + copy from CMS · II ✅ marker colours from `palette` · III ✅ prototype layout/logic · IV ✅ selects/regions in SSR HTML · V ✅ combobox + native selects, map skippable · VI ✅ BFF route · VII ✅ `CoverageVM` types · VIII ✅ no new deps

## Structure
```text
shared/types/coverage.ts, shared/utils/coverage.ts (+ tests/coverage.test.ts)
server/api/cms/coverage.get.ts
app/composables/useCoverage.ts, useAnalytics.ts
app/components/coverage/CoverageSection.vue, CoverageSearch.vue, CoverageSelect.vue, CoverageResult.vue, CoverageMap.client.vue
```

## Decisions
- One shared `useCoverage()` state (useState) used by search, selects, map and result.
- Search normalises case and apostrophes; matches the current locale's names.
- Deep link `?settlement=<slug>` preselects (for locality pages, 007).
- Tiles: `runtimeConfig.public.map.tileUrl/attribution` (OSM default) + `nl-map-dark` CSS filter.
