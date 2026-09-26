# Feature Specification: Frontend Foundation (tokens, layout shell, i18n, SEO base, CMS access)

**Feature Branch**: `002-foundation`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "Nuxt landing for the NovaLine ISP with Tailwind, colours as reusable constants that are easy to change at any time, SEO best practices, UA/EN, content from Strapi, packaged in Docker. Build the shared shell from the prototype: top bar, sticky header with 'More' menu, mobile drawer, footer, floating callback/assistant buttons."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor sees a consistent, fast shell on every page (Priority: P1)

A visitor opens any page and sees the navy top bar with phone numbers (Viber badge), "Радіо" and "Особистий кабінет" links and the UA/EN switch; a sticky translucent header with logo + tagline, section navigation, a "Ще" dropdown (Дата-центр, Магазин, Оплата, Про нас), the coral "Радіо" link and the "Замовити" CTA; and the navy footer with phones, email, section links, socials and copyright.

**Why this priority**: Every other feature renders inside this shell.

**Independent Test**: Load `/` with CMS running; compare header/footer at 1280px and 390px with the prototype; all phone/email/link values come from the CMS `global` type.

**Acceptance Scenarios**:

1. **Given** desktop ≥ 1081px, **When** the page loads, **Then** full nav is visible and the burger hidden; **Given** ≤ 1080px, **Then** nav and "Замовити" collapse and the burger shows.
2. **Given** the "Ще" button, **When** clicked or activated by keyboard, **Then** the dropdown opens with `aria-expanded=true`, closes on Escape, outside click or item selection.
3. **Given** a section link (e.g. "Тарифи"), **When** clicked, **Then** the page smooth-scrolls to `#plans` with the sticky header offset (80px) and the URL hash updates.
4. **Given** phones in the CMS, **When** rendered, **Then** they are `tel:` links; the first is emphasised.

---

### User Story 2 - Mobile visitor navigates with the drawer (Priority: P1)

On a phone the visitor taps the burger; a right-side drawer (max 390px / 92vw) slides in over a blurred overlay with all sections, Radio, phone list and the "Замовити" CTA.

**Independent Test**: At 390px width open/close drawer by burger, overlay, close button, Escape, and by choosing a link.

**Acceptance Scenarios**:

1. **Given** the drawer is open, **When** Tab is pressed, **Then** focus stays trapped inside; body scroll is locked.
2. **Given** the drawer is open, **When** a section link is chosen, **Then** the drawer closes and the page scrolls to the section.

---

### User Story 3 - Visitor switches language (Priority: P1)

The visitor clicks EN in the top bar; the URL becomes `/en` (or `/en/<same page>`), all UI micro-copy and CMS content switch to English, `<html lang>` updates, and hreflang links point to the counterpart pages.

**Independent Test**: Toggle UA/EN on `/` and on a news article; verify URL, `lang`, content and hreflang tags.

**Acceptance Scenarios**:

1. **Given** `/`, **When** EN is chosen, **Then** navigate to `/en` with EN content and `lang="en-US"`.
2. **Given** an EN translation is missing for a CMS entry, **When** `/en` renders, **Then** the UA content is shown (fallback) and the page is still valid.

---

### User Story 4 - Search engines get complete, correct metadata (Priority: P1)

A crawler fetching any page receives server-rendered HTML with title, description, canonical, OG/Twitter tags, hreflang alternates, Organization/LocalBusiness JSON-LD, and discovers all pages via `sitemap.xml`; `robots.txt` points to it.

**Independent Test**: `curl` `/`, `/en`, `/sitemap.xml`, `/robots.txt` with JS disabled; validate JSON-LD in Rich Results Test.

**Acceptance Scenarios**:

1. **Given** a page with CMS SEO fields, **When** fetched, **Then** meta tags use them; **Given** empty fields, **Then** global defaults are used.
2. **Given** production env, **When** `/robots.txt` is fetched, **Then** it allows indexing and lists the sitemap; **Given** a non-production site URL, **Then** indexing is disallowed.

---

### User Story 5 - Content edits appear without a deploy (Priority: P2)

After a manager publishes a change in Strapi, the site shows it within 60 s; pages are otherwise served from cache.

**Independent Test**: Publish a change → Strapi webhook hits `/api/revalidate` with the secret → next request returns fresh content.

**Acceptance Scenarios**:

1. **Given** a cached page, **When** the webhook is received with a valid secret, **Then** CMS caches are purged and the next render is fresh.
2. **Given** an invalid secret, **When** the webhook is called, **Then** 401 and nothing is purged.
3. **Given** Strapi is down, **When** a cached page is requested, **Then** the stale cached version is served (SWR) instead of an error.

---

### User Story 6 - Floating actions (Priority: P2)

A coral "Зворотній дзвінок" pill is fixed bottom-right; above it a white "Запитати асистента" pill (label hidden ≤ 520px). They open the callback dialog (feature 005) and the assistant (feature 009); this feature provides the buttons, positions and dialog shell.

### Edge Cases

- CMS unreachable on first (uncached) request → render the shell with i18n fallbacks and a non-indexable 503 page, never a stack trace.
- Very long phone list → wraps in the top bar (≤ 640px the top bar wraps as in the prototype).
- `prefers-reduced-motion` → no smooth scroll or rise animations.
- Hash navigation on page load (`/#tv`) → scroll accounts for the sticky header.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All colours MUST come from `app/theme/colors.ts` via Tailwind theme names; typography (Unbounded display / Manrope body), radii, shadows, container (1240px, 28px gutters, 18px ≤ 640px) and breakpoints come from `tailwind.config.ts`.
- **FR-002**: Fonts MUST be self-hosted via `@nuxt/fonts` with `font-display: swap` and metric fallbacks.
- **FR-003**: Layout components MUST include TopBar, SiteHeader (+ MoreMenu), MobileDrawer, SiteFooter, FloatingActions, SectionHeading (kicker bar + kicker + h2 + subtitle, light/dark variants), BaseDialog (focus trap, Escape, overlay click), and base UI atoms (Button variants: violet, coral, white-outline, ghost; Pill; Chip; Icon set from the prototype SVGs).
- **FR-004**: i18n MUST use `prefix_except_default` with `uk` (default, `uk-UA`) and `en` (`en-US`); UI micro-copy in `i18n/locales/*.json`; CMS content requested with the matching locale and falling back to `uk`.
- **FR-005**: The frontend MUST read Strapi only through server routes (`server/api/cms/*`) using a server-only token, returning typed, normalised view models; responses cached with `defineCachedFunction` (tag-based keys) and purged by `/api/revalidate`.
- **FR-006**: Pages MUST set title/description/canonical/OG/Twitter via `useSeoMeta` from the CMS SEO component with global fallbacks; `useLocaleHead` supplies hreflang; `nuxt-schema-org` supplies Organization/LocalBusiness (name, logo, phones, email, areaServed, foundingDate 2003).
- **FR-007**: `sitemap.xml` MUST include static pages for both locales and dynamic URLs (news, localities) from a server source; `robots.txt` MUST disallow indexing unless `NUXT_PUBLIC_SITE_ENV=production`.
- **FR-008**: `routeRules` MUST apply SWR caching to content pages and `no-store` to API mutations.
- **FR-009**: The app MUST render a branded error page (404/500) in the current locale.
- **FR-010**: Docker image MUST build with `pnpm install --frozen-lockfile`, run as non-root, and be configurable only via env.

### Key Entities

- **GlobalViewModel**: phones, email, socials, cabinet URL, tagline, default SEO, organisation data.
- **SeoViewModel**: title, description, image, noIndex, canonical path.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Changing one hex value in `colors.ts` recolours every usage site-wide (verified by grep: zero raw hex values in `app/components` and `app/pages`).
- **SC-002**: Lighthouse mobile on the shell page: SEO 100, Accessibility ≥ 95, Best Practices ≥ 95, Performance ≥ 90.
- **SC-003**: TTFB for a cached page < 200 ms on the VPS.
- **SC-004**: Header/footer visual diff vs prototype at 1280px and 390px shows no layout differences > 4px.
- **SC-005**: Language switch keeps the visitor on the equivalent page 100% of the time.

## Assumptions

- Feature 001 contract (global, SEO component) is available; until then, server routes return fixtures from the same types.
- "Особистий кабінет" links to the existing external billing (`https://novaline.net/` per prototype, editable in CMS).
- The Radio link targets the internal `/radio` page (feature 008).
