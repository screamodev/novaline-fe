---
description: "Tasks for 003-landing-sections"
---

# Tasks: Landing Page Sections

**Input**: `/specs/003-landing-sections/` (plan.md, spec.md); contract R2–R14 in `novaline-be/specs/001-content-model/contracts/rest-api.md`

## Phase 1: Foundational (blocking)

- [x] T001 `HomeVM` + item types in `shared/types/home.ts`
- [x] T002 Normalisers (plans by segment, prices, TV channels by category, promo expiry, blocks → paragraphs) in `shared/utils/home-normalize.ts` + `tests/home-normalize.test.ts`
- [x] T003 `server/api/cms/home.get.ts` (parallel fetch, locale fallback, cached)
- [x] T004 `useHome`, `useFormat` (dates dd.mm.yyyy, prices), `useLeadContext`, `useHiddenSections` composables
- [x] T005 i18n micro-copy for sections in `i18n/locales/{uk,en}.json`
- [x] T006 Price rendering via `useFormat().price()` (a component was unnecessary)

## Phase 2: US1 — Hero & trust (P1) 🎯 MVP

- [x] T007 [US1] `sections/HeroSection.vue` (NuxtImg preload/fetchpriority, scrim + glows, promo card, CTAs, speed chip hidden ≤ 640px, ≤ 820px layout)
- [x] T008 [US1] `sections/TrustStrip.vue` (4 → 2 → 1 columns)

## Phase 3: US2 — Plans (P1)

- [x] T009 [US2] `sections/ServicesSection.vue` (6 cards, icons by key)
- [x] T010 [US2] `sections/PlansSection.vue` (tablist with arrow keys, all segments in SSR, popular card style, connection note)
- [x] T011 [US2] `sections/AddonsList.vue` (highlighted add-on)
- [x] T012 [US2] Service/Offer JSON-LD for plans and add-ons

## Phase 4: US5 — Payment (P1)

- [x] T013 [US5] `sections/PaymentSection.vue` (account note, accordion one-open, details panel) + HowTo JSON-LD

## Phase 5: US3 — TV (P2)

- [x] T014 [US3] `sections/TvSection.vue` (chips, packages, category filter with aria-pressed, tier badges, 4→2→1 grid)

## Phase 6: US4 — Promos, data centre, shop (P2)

- [x] T015 [P] [US4] `sections/PromosSection.vue` (accent bar/tag, terms, valid-until)
- [x] T016 [P] [US4] `sections/DataCentreSection.vue` (facts, services with "від"/"за запитом")
- [x] T017 [P] [US4] `sections/ShopSection.vue` (router note, items, order note)

## Phase 7: US6 — News preview & about (P2)

- [x] T018 [P] [US6] `sections/NewsPreviewSection.vue` (6 cards → /news/<slug>, "Всі новини") + ItemList JSON-LD
- [x] T019 [P] [US6] `sections/AboutSection.vue` (text + 4 stat tiles)

## Phase 8: Page assembly

- [x] T020 `sections/CoverageTeaser.vue`, `sections/LeadTeaser.vue` placeholders (headings from CMS, phone/callback CTA)
- [x] T021 `app/pages/index.vue`: order, anchors, hidden empty sections, SEO, reveal
- [x] T022 CTA → `useLeadContext` wiring on plan/TV/shop/DC/promo cards

## Phase 9: Polish & gates

- [x] T023 `pnpm typecheck && pnpm test && pnpm lint:colors && pnpm build`
- [x] T024 SSR checks: all segments/channels/steps in HTML, JSON-LD parses, EN complete, no Cyrillic literals in components
- [x] T025 Visual diff vs prototype 1280/390 (headless Chrome); Lighthouse mobile via Caddy with compression: Perf 90–92, A11y 100, BP 100, SEO 100 except `is-crawlable` (noindex outside production)

## Implementation notes (2026-09-26)

- Route SWR cache is production-only (`$production.routeRules`), so dev always renders fresh.
- `@nuxt/image` domains must include the port (`cms:1337`, `localhost:1337`).
- Schema nodes get explicit `@id`s (`#service-plan-<key>`, `#howto-<key>`), otherwise nuxt-schema-org merges them.
- News cards link to `/news/<slug>`; those pages arrive with feature 006 (phase 4).
- Callback FAB opens an interim dialog with phone numbers; the assistant FAB is behind `runtimeConfig.public.features.assistant` (off) until 009.
- Visual diff done with headless Chrome at 1280 and 390 against the prototype (Chrome extension unavailable); sections match, remaining offsets come from the coverage placeholder height.
- Accessibility: white text on brand coral is 4.1:1, so fills/text use `coral.strong` (#CC406E, 4.6:1); brand coral stays for decoration.
- Lab LCP on simulated slow 4G is 3.0 s (target 2.5 s): remaining cost is render-blocking CSS + two web fonts; revisit with critical-CSS inlining / font subsetting in the final audit (phase 5).
