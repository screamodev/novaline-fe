---
description: "Tasks for 003-landing-sections"
---

# Tasks: Landing Page Sections

**Input**: `/specs/003-landing-sections/` (plan.md, spec.md); contract R2–R14 in `novaline-be/specs/001-content-model/contracts/rest-api.md`

## Phase 1: Foundational (blocking)

- [ ] T001 `HomeVM` + item types in `shared/types/home.ts`
- [ ] T002 Normalisers (plans by segment, prices, TV channels by category, promo expiry, blocks → paragraphs) in `shared/utils/home-normalize.ts` + `tests/home-normalize.test.ts`
- [ ] T003 `server/api/cms/home.get.ts` (parallel fetch, locale fallback, cached)
- [ ] T004 `useHome`, `useFormat` (dates dd.mm.yyyy, prices), `useLeadContext`, `useHiddenSections` composables
- [ ] T005 i18n micro-copy for sections in `i18n/locales/{uk,en}.json`
- [ ] T006 `ui/PriceTag.vue`

## Phase 2: US1 — Hero & trust (P1) 🎯 MVP

- [ ] T007 [US1] `sections/HeroSection.vue` (NuxtImg preload/fetchpriority, scrim + glows, promo card, CTAs, speed chip hidden ≤ 640px, ≤ 820px layout)
- [ ] T008 [US1] `sections/TrustStrip.vue` (4 → 2 → 1 columns)

## Phase 3: US2 — Plans (P1)

- [ ] T009 [US2] `sections/ServicesSection.vue` (6 cards, icons by key)
- [ ] T010 [US2] `sections/PlansSection.vue` (tablist with arrow keys, all segments in SSR, popular card style, connection note)
- [ ] T011 [US2] `sections/AddonsList.vue` (highlighted add-on)
- [ ] T012 [US2] Service/Offer JSON-LD for plans and add-ons

## Phase 4: US5 — Payment (P1)

- [ ] T013 [US5] `sections/PaymentSection.vue` (account note, accordion one-open, details panel) + HowTo JSON-LD

## Phase 5: US3 — TV (P2)

- [ ] T014 [US3] `sections/TvSection.vue` (chips, packages, category filter with aria-pressed, tier badges, 4→2→1 grid)

## Phase 6: US4 — Promos, data centre, shop (P2)

- [ ] T015 [P] [US4] `sections/PromosSection.vue` (accent bar/tag, terms, valid-until)
- [ ] T016 [P] [US4] `sections/DataCentreSection.vue` (facts, services with "від"/"за запитом")
- [ ] T017 [P] [US4] `sections/ShopSection.vue` (router note, items, order note)

## Phase 7: US6 — News preview & about (P2)

- [ ] T018 [P] [US6] `sections/NewsPreviewSection.vue` (6 cards → /news/<slug>, "Всі новини") + ItemList JSON-LD
- [ ] T019 [P] [US6] `sections/AboutSection.vue` (text + 4 stat tiles)

## Phase 8: Page assembly

- [ ] T020 `sections/CoverageTeaser.vue`, `sections/LeadTeaser.vue` placeholders (headings from CMS, phone/callback CTA)
- [ ] T021 `app/pages/index.vue`: order, anchors, hidden empty sections, SEO, reveal
- [ ] T022 CTA → `useLeadContext` wiring on plan/TV/shop/DC/promo cards

## Phase 9: Polish & gates

- [ ] T023 `pnpm typecheck && pnpm test && pnpm lint:colors && pnpm build`
- [ ] T024 SSR checks: all segments/channels/steps in HTML, JSON-LD parses, EN complete, no Cyrillic literals in components
- [ ] T025 Visual diff vs prototype 1280/820/390; Lighthouse mobile (requires browser tooling)
