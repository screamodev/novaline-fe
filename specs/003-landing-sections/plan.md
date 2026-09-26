# Implementation Plan: Landing Page Sections

**Branch**: main (constitution 1.0.1) | **Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

## Summary

Render the full Direction 1 landing from CMS data: one aggregated BFF route (`/api/cms/home`) fetches every collection the page needs in parallel, normalises them into a typed `HomeVM`, and caches it (60 s SWR, purged by the webhook). `app/pages/index.vue` makes one `useFetch`, then renders section components in prototype order. `#coverage` and `#lead` are heading-only placeholders until features 004/005.

## Technical Context

**Language/Version**: TypeScript 5.9 strict, Vue 3.5, Nuxt 4.5

**Primary Dependencies**: existing stack from 002 (Tailwind tokens, i18n, @nuxt/image, nuxt-schema-org)

**Storage**: N/A (Nitro cache)

**Testing**: Vitest unit tests for `shared/utils/home-normalize.ts`; curl/SSR checks; visual diff vs prototype when browser tooling is available

**Target Platform**: SSR Node in Docker

**Performance Goals**: Lighthouse mobile Perf ≥ 90, CLS < 0.05; hero image preloaded with `fetchpriority=high`

**Constraints**: all inactive/collapsed content (plan segments, TV channels, payment steps) present in SSR HTML; no raw colours

**Scale/Scope**: 12 section components, 1 server route, ~40 i18n keys

## Constitution Check

| Principle | Gate | Status |
|---|---|---|
| I | Section copy from `home-page`; lists from collections; micro-copy (buttons, tier names, "Діє до") in i18n | ✅ |
| II | Only theme classes; `lint:colors` in quality gate | ✅ |
| III | Sizes/paddings/radii copied from prototype inline styles | ✅ |
| IV | One H1 (hero); H2 per section; Service+Offer, HowTo, ItemList JSON-LD | ✅ |
| V | Tabs = `tablist` + arrow keys; accordion `aria-expanded`; filter chips `aria-pressed` | ✅ |
| VI | Single BFF route, token server-side | ✅ |
| VII | `HomeVM` types in `shared/types/home.ts` | ✅ |
| VIII | No new dependencies | ✅ |

## Project Structure

```text
shared/types/home.ts              # HomeVM and item view models
shared/utils/home-normalize.ts    # raw Strapi → HomeVM (pure, unit-tested)
server/api/cms/home.get.ts        # parallel fetch R2–R14, cached
app/composables/useHome.ts        # useFetch('/api/cms/home') keyed by locale
app/composables/useLeadContext.ts # CTA → lead form topic (consumed by 005)
app/composables/useFormat.ts      # locale date/price formatting
app/components/sections/          # HeroSection … AboutSection, CoverageTeaser, LeadTeaser
app/components/ui/PriceTag.vue    # price / prefix / label rendering shared by cards
app/pages/index.vue
tests/home-normalize.test.ts
```

## Key Design Decisions

1. **One aggregated route** instead of per-section fetches: one cache entry per locale, one purge.
2. **Expired promos** are filtered in Strapi (`validUntil >= today` in Europe/Kyiv) and again in the normaliser.
3. **Hidden empty sections**: `index.vue` publishes the list of empty sections through `useHiddenSections()`; header/drawer/footer skip those nav items.
4. **Structured data**: plans/TV/add-ons/DC services as `Service` nodes with `Offer`s (price in UAH); payment methods as `HowTo`; news preview as `ItemList`.
5. **Reveal animation**: sections get `.reveal`; the hero never animates (LCP).

## Complexity Tracking

None.
