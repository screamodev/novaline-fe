---
description: "Tasks for 002-foundation"
---

# Tasks: Frontend Foundation

**Input**: `/specs/002-foundation/` (plan.md, spec.md); contract `novaline-be/specs/001-content-model/contracts/rest-api.md`

## Phase 1: Setup (done in scaffold, verify)

- [x] T001 Nuxt 4 + modules installed, `nuxt.config.ts` with i18n/sitemap/robots/schema-org/image/fonts
- [x] T002 Tokens in `app/theme/colors.ts` wired into `tailwind.config.ts`
- [x] T003 Dockerfile + compose; `.env.example`
- [x] T004 [P] Add Vitest + `@nuxt/test-utils`, `test` script; add `lint:colors` grep script in `package.json`

## Phase 2: Foundational (blocking)

- [x] T005 Contract types for Global, Seo, Media in `shared/types/cms.ts`
- [x] T006 `server/utils/strapi.ts`: runtime-config base URL + token, locale param, uk fallback, typed errors
- [x] T007 `server/utils/cms-cache.ts`: cached function factory + model→tag registry
- [x] T008 `server/api/cms/global.get.ts` → GlobalViewModel (normalised phones/socials/SEO)
- [x] T009 `composables/useGlobal.ts` (`useAsyncData` keyed by locale) + fixture fallback when CMS missing in dev

## Phase 3: US1 — Shell (P1) 🎯 MVP

- [x] T010 [P] [US1] Icon components from prototype SVGs in `app/components/icons/`
- [x] T011 [P] [US1] `ui/BaseButton.vue` (violet, coral, white, outline, ghost; sizes), `ui/Pill.vue`, `ui/Chip.vue`, `ui/SectionHeading.vue` (light/dark)
- [x] T012 [US1] `layout/TopBar.vue` (phones with Viber badge, Radio, Cabinet, LangSwitch; wraps ≤ 640px)
- [x] T013 [US1] `layout/SiteHeader.vue` + `MoreMenu.vue` (sticky, blur, nav ≥ 1081px, CTA, burger ≤ 1080px, menu a11y)
- [x] T014 [US1] `layout/SiteFooter.vue` (4 columns → 2 → 1, socials, copyright)
- [x] T015 [US1] `layouts/default.vue` composition; section anchors + `scroll-margin-top`
- [x] T016 [US1] i18n UI strings for shell (nav, menu, aria) in `i18n/locales/{uk,en}.json`

## Phase 4: US2 — Mobile drawer (P1)

- [x] T017 [US2] `composables/useFocusTrap.ts` + body scroll lock
- [x] T018 [US2] `layout/MobileDrawer.vue` (overlay, slide-in, links, phones, CTA, close on select/Escape)

## Phase 5: US3 — Language switch (P1)

- [x] T019 [US3] `layout/LangSwitch.vue` using `useSwitchLocalePath`; `<html lang>` via `useLocaleHead` in `app.vue`
- [x] T020 [US3] Locale-aware CMS fetch (all `/api/cms/*` accept `locale`), fallback verified

## Phase 6: US4 — SEO base (P1)

- [x] T021 [US4] `composables/useSeo.ts` (CMS SEO → `useSeoMeta` + canonical + OG image absolute URL)
- [x] T022 [US4] Organization/LocalBusiness via `useSchemaOrg` in `app.vue` from Global
- [x] T023 [US4] Robots env gate (`NUXT_PUBLIC_SITE_ENV`) + sitemap source route `server/routes/__sitemap__/urls.ts`
- [x] T024 [US4] `app/error.vue` branded 404/500, `noindex`

## Phase 7: US5 — Revalidation (P2)

- [x] T025 [US5] `server/api/revalidate.post.ts` (secret header, purge tags + route cache), unit test
- [x] T026 [US5] SWR `routeRules` verified; stale-on-error behaviour when Strapi down

## Phase 8: US6 — Floating actions & dialog (P2)

- [x] T027 [US6] `ui/BaseDialog.vue` (focus trap, Escape, overlay, restore focus)
- [x] T028 [US6] `layout/FloatingActions.vue` (callback FAB, assistant FAB with label hidden ≤ 520px) emitting open events

## Phase 9: Polish

- [x] T029 `useReveal.ts` rise-on-view (reduced-motion aware), ported from devquorum
- [ ] T030 Lighthouse run on `/` (mobile), fix to targets; `lint:colors` passes
- [ ] T031 (pending: browser tooling unavailable in this session) Visual check vs prototype at 1280 / 820 / 390 (header, drawer, footer)

## Dependencies

Phase 2 depends on 001 contract (types) but not on 001 implementation (fixtures). US1 → US2/US3/US6; US4 independent after Phase 2; US5 after T007.

## Implementation notes (2026-09-26)

- CMS media URLs are absolute to the internal Strapi URL and processed by IPX (`image.domains = ['localhost','cms']`).
- Indexing is controlled by `NUXT_SITE_ENV` (nuxt-site-config): only `production` is indexable.
- Revalidation purges all `cms:*` function caches and `nitro:routes:*` SWR pages (content volume is small; tag-level purge is unnecessary).
- `/radio` is a noindex placeholder until feature 008.
- Organization JSON-LD uses the primary phone; LocalBusiness will be added once a street address exists in the CMS.
