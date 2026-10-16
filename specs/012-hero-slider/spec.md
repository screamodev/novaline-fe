# Feature Specification: Hero Slider

**Feature Branch**: `012-hero-slider`

**Created**: 2026-10-16

**Status**: Implemented

**Input**: Replace the static home hero with a slider of active offers, each with CTA buttons, fully managed in Strapi. Reference: prosto.net banner slider (mechanics, not visuals).

## Requirements

- **FR-001** `[be]` Collection `hero-slide` (i18n, D&P): key, order, activeFrom / activeUntil (shared dates, empty = no limit), theme (`light | violet | navy`), image, imageAlt, kicker, title, titleAccent, subtitle, highlight value/unit/caption, primaryCta / secondaryCta.
- **FR-002** `[be]` Component `shared.cta`: label, action (`order | callback | coverage | link`), url (for `link`), variant (`violet | coral | white`). Lifecycle rejects `activeFrom > activeUntil` and `link` without URL.
- **FR-003** `[be]` Contract R22 with the active-window filter; `home-page.hero` stays as the fallback slide (R2 unchanged).
- **FR-004** BFF `/api/cms/home` returns `slides: HeroSlideVM[]`; the normaliser re-checks the date window (SWR cache), drops untitled slides and invalid CTAs, and falls back to `home-page.hero` when nothing is active.
- **FR-005** `HeroSlider` (embla-carousel-vue + autoplay): loop, swipe, ←/→ keys, 6 s autoplay paused on hover/focus, no autoplay under `prefers-reduced-motion`, arrows on the slider edges (hidden on phones), progress pills, no controls for a single slide. Revision 2026-10-16: pause button and `01 / 03` counter removed at the client's request.
- **FR-006** A11y: carousel region with `aria-roledescription`, slides as labelled groups, off-screen slides `inert`; only the first slide renders `<h1>`.
- **FR-007** Performance: SSR renders the first slide in place (no CLS); only its photo is preloaded with `fetchpriority=high`.
- **FR-008** CTA actions: `order` opens `OrderDialog` with the slide title as context, `callback` opens `CallbackDialog`, `coverage` links to `#coverage`, `link` → locale-aware internal route or external tab.

## Success Criteria

- Editors create, schedule, reorder, unpublish slides without a deploy; a slide past `activeUntil` disappears within the SWR window (≤ 60 s) or immediately via the revalidate webhook.
- `pnpm test` covers mapping, date window, fallback and CTA validation (`tests/home-normalize.test.ts`).

## Tasks

- [x] T001 `[be]` `shared.cta` component, `hero-slide` API + lifecycle
- [x] T002 `[be]` Seed: media support for collections, 3 slides uk/en
- [x] T003 `[be]` R22 in `rest-api.md` + `verify-contract.ts`, regenerate types
- [x] T004 Types `HeroSlideVM`/`CtaVM`, normaliser + fallback, BFF query
- [x] T005 `HeroSlide`, `HeroSlider`, `CtaButton`; theme gradients in `app/theme/colors.ts`
- [x] T006 i18n `hero.slider.*`, unit tests, browser check (desktop/mobile, uk/en)
- [x] T007 Revision: side arrows, no pause/counter; slides "backup power" (main) and "we're hiring" (→ /vacancies) with Unsplash photos (`scripts/seed-data/media/CREDITS.md`); PON slide removed (stays as the `home-page.hero` fallback)
