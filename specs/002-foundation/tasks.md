---
description: "Tasks for 002-foundation"
---

# Tasks: Frontend Foundation

**Input**: `/specs/002-foundation/` (plan.md, spec.md); contract `novaline-be/specs/001-content-model/contracts/rest-api.md`

## Phase 1: Setup (done in scaffold, verify)

- [x] T001 Nuxt 4 + modules installed, `nuxt.config.ts` with i18n/sitemap/robots/schema-org/image/fonts
- [x] T002 Tokens in `app/theme/colors.ts` wired into `tailwind.config.ts`
- [x] T003 Dockerfile + compose; `.env.example`
- [ ] T004 [P] Add Vitest + `@nuxt/test-utils`, `test` script; add `lint:colors` grep script in `package.json`

## Phase 2: Foundational (blocking)

- [ ] T005 Contract types for Global, Seo, Media in `shared/types/cms.ts`
- [ ] T006 `server/utils/strapi.ts`: runtime-config base URL + token, locale param, uk fallback, typed errors
- [ ] T007 `server/utils/cms-cache.ts`: cached function factory + model→tag registry
- [ ] T008 `server/api/cms/global.get.ts` → GlobalViewModel (normalised phones/socials/SEO)
- [ ] T009 `composables/useGlobal.ts` (`useAsyncData` keyed by locale) + fixture fallback when CMS missing in dev

## Phase 3: US1 — Shell (P1) 🎯 MVP

- [ ] T010 [P] [US1] Icon components from prototype SVGs in `app/components/icons/`
- [ ] T011 [P] [US1] `ui/BaseButton.vue` (violet, coral, white, outline, ghost; sizes), `ui/Pill.vue`, `ui/Chip.vue`, `ui/SectionHeading.vue` (light/dark)
- [ ] T012 [US1] `layout/TopBar.vue` (phones with Viber badge, Radio, Cabinet, LangSwitch; wraps ≤ 640px)
- [ ] T013 [US1] `layout/SiteHeader.vue` + `MoreMenu.vue` (sticky, blur, nav ≥ 1081px, CTA, burger ≤ 1080px, menu a11y)
- [ ] T014 [US1] `layout/SiteFooter.vue` (4 columns → 2 → 1, socials, copyright)
- [ ] T015 [US1] `layouts/default.vue` composition; section anchors + `scroll-margin-top`
- [ ] T016 [US1] i18n UI strings for shell (nav, menu, aria) in `i18n/locales/{uk,en}.json`

## Phase 4: US2 — Mobile drawer (P1)

- [ ] T017 [US2] `composables/useFocusTrap.ts` + body scroll lock
- [ ] T018 [US2] `layout/MobileDrawer.vue` (overlay, slide-in, links, phones, CTA, close on select/Escape)

## Phase 5: US3 — Language switch (P1)

- [ ] T019 [US3] `layout/LangSwitch.vue` using `useSwitchLocalePath`; `<html lang>` via `useLocaleHead` in `app.vue`
- [ ] T020 [US3] Locale-aware CMS fetch (all `/api/cms/*` accept `locale`), fallback verified

## Phase 6: US4 — SEO base (P1)

- [ ] T021 [US4] `composables/useSeo.ts` (CMS SEO → `useSeoMeta` + canonical + OG image absolute URL)
- [ ] T022 [US4] Organization/LocalBusiness via `useSchemaOrg` in `app.vue` from Global
- [ ] T023 [US4] Robots env gate (`NUXT_PUBLIC_SITE_ENV`) + sitemap source route `server/routes/__sitemap__/urls.ts`
- [ ] T024 [US4] `app/error.vue` branded 404/500, `noindex`

## Phase 7: US5 — Revalidation (P2)

- [ ] T025 [US5] `server/api/revalidate.post.ts` (secret header, purge tags + route cache), unit test
- [ ] T026 [US5] SWR `routeRules` verified; stale-on-error behaviour when Strapi down

## Phase 8: US6 — Floating actions & dialog (P2)

- [ ] T027 [US6] `ui/BaseDialog.vue` (focus trap, Escape, overlay, restore focus)
- [ ] T028 [US6] `layout/FloatingActions.vue` (callback FAB, assistant FAB with label hidden ≤ 520px) emitting open events

## Phase 9: Polish

- [ ] T029 `useReveal.ts` rise-on-view (reduced-motion aware), ported from devquorum
- [ ] T030 Lighthouse run on `/` (mobile), fix to targets; `lint:colors` passes
- [ ] T031 Visual check vs prototype at 1280 / 820 / 390 (header, drawer, footer)

## Dependencies

Phase 2 depends on 001 contract (types) but not on 001 implementation (fixtures). US1 → US2/US3/US6; US4 independent after Phase 2; US5 after T007.
