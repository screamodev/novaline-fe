# Feature Specification: Landing Page Sections

**Feature Branch**: `003-landing-sections`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "Implement NovaLine Direction 1 landing pixel-perfectly with content from Strapi: hero, trust strip, services, plans with segment tabs and add-ons, OTT television with channel list, promos, data centre, shop, payment instructions, news preview, about."

Section order (anchors) follows the prototype: hero → trust → `#coverage` (feature 004) → `#services` → `#plans` → `#tv` → `#promos` → `#datacenter` → `#shop` → `#payment` → `#news` → `#about` → `#lead` (feature 005) → footer.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor understands the offer at first glance (Priority: P1)

The visitor lands on `/` and sees the hero: pill kicker ("GPON / EPON · до 10 Гбіт/с"), two-line H1 ("Швидкісний інтернет / за технологією PON" with the second line violet), subtitle, gift promo card (🎁), two CTAs ("Перевірити покриття" → `#coverage`, "Отримати консультацію" → `#lead`), the photo on the right with a lilac gradient scrim, and the floating "1000 Мбіт/с" speed chip (hidden ≤ 640px). Below, the white trust strip lists 4 advantages with coral icons.

**Why this priority**: Hero is the LCP element and the main SEO heading.

**Independent Test**: Render `/` with seeded CMS; compare to prototype at 1280/820/390; LCP element is the hero image or H1 and < 2.5 s on mobile.

**Acceptance Scenarios**:

1. **Given** ≤ 820px, **When** rendered, **Then** the scrim switches to the vertical gradient and min-height becomes 540px as in the prototype.
2. **Given** the CMS hero image, **When** rendered, **Then** it is served as AVIF/WebP with `srcset`, `fetchpriority=high`, and meaningful `alt` from CMS.

---

### User Story 2 - Visitor compares internet plans (Priority: P1)

In `#plans` the visitor switches segment tabs (Приватний сектор / Квартира / Бізнес); 3 cards show name, speed, price + period and features; the "popular" card is dark navy gradient with a coral "Популярний" badge and coral CTA; others white. Under the cards, a dashed violet note shows the connection fee; below that "Додаткові послуги" lists add-ons with prices (the highlighted IPv4 addon has a coral border/price).

**Independent Test**: Switch all tabs; values match CMS; each "Замовити" jumps to `#lead` with the plan preselected as the reason/topic.

**Acceptance Scenarios**:

1. **Given** tab "Бізнес", **When** selected, **Then** cards update without reload; tabs are a proper `tablist` with arrow-key navigation.
2. **Given** a plan with `price = null`, **Then** its `priceLabel` ("договірна") is shown instead of a number.
3. **Given** plan cards, **Then** Offer JSON-LD (price, priceCurrency UAH, name) is emitted for each plan in all segments.
4. **Given** SSR, **Then** all three segments' plans are present in HTML (inactive panels hidden but crawlable).

---

### User Story 3 - Visitor explores TV packages and channels (Priority: P2)

In `#tv` the visitor sees 3 feature chips, 3 package cards (popular one dark), and a "Список каналів" panel with category chips ("Всі" + categories) filtering a 4-column grid of channels, each with a tier badge (Мінімальний green / Середній violet / Максимальний coral).

**Acceptance Scenarios**:

1. **Given** category "Спорт", **When** chosen, **Then** only sport channels show; the chip is violet/active and has `aria-pressed=true`.
2. **Given** 980px / 720px, **Then** grids collapse 4→2→1 columns.

---

### User Story 4 - Visitor reads promos, data centre, shop info (Priority: P2)

`#promos`: 2-column cards with a coloured top bar (violet/coral), tag, title, description, "Умови акції" box, "Діє до <date>" and "Скористатися" CTA. Expired promos are hidden. `#datacenter`: navy section with 4 fact tiles and service cards with "від N грн/міс" or "за запитом" + "Замовити послугу" CTA. `#shop`: info banner about any-brand routers, 3-column item cards with category, name, description, price "грн" and "Замовити" CTA, and a note.

**Acceptance Scenarios**:

1. **Given** a promo with `validUntil` yesterday, **Then** it is not rendered.
2. **Given** promo dates, **Then** they are formatted per locale (`31.12.2026`).
3. **Given** "Замовити" on a shop item or DC service, **Then** the lead form opens with the item preselected as topic.

---

### User Story 5 - Subscriber finds how to pay (Priority: P1)

`#payment`: coral warning about entering the personal account number, an accordion of payment methods (numbered, first open by default, one open at a time), and a navy "Реквізити для переказу" panel with label/value tiles.

**Acceptance Scenarios**:

1. **Given** the accordion, **When** a header is activated (click/Enter/Space), **Then** it toggles with `aria-expanded`, the number badge turns violet, the card border violet.
2. **Given** SSR, **Then** all steps are in HTML (collapsed panels still crawlable) and emitted as HowTo JSON-LD per method.

---

### User Story 6 - Visitor sees news and trusts the company (Priority: P2)

`#news`: latest 6 articles as cards (category pill, date, title, excerpt, "Читати →") linking to `/news/<slug>`, and "Всі новини" → `/news`. `#about`: navy two-column block with text and 4 stat tiles (2003, 20+, 300+, 24/7).

### Edge Cases

- Empty collection (e.g. no promos) → the section and its nav item are hidden, not rendered empty.
- Odd number of cards in 2-column grids → last card spans naturally (no stretched layout).
- Very long channel names → ellipsis in one line (as prototype).
- Missing images → neutral placeholder, no layout shift (fixed aspect ratio).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each section MUST be a standalone component (`HeroSection`, `TrustStrip`, `ServicesSection`, `PlansSection`, `AddonsList`, `TvSection`, `PromosSection`, `DataCentreSection`, `ShopSection`, `PaymentSection`, `NewsPreviewSection`, `AboutSection`) receiving typed view models from one page-level `useAsyncData` call to `/api/cms/home`.
- **FR-002**: Visual specs MUST match the prototype values (sizes, weights, radii, paddings: section 84/80/76px vertical, 52px ≤ 640px; cards radius 20–22px; H2 `clamp(28px,3.4vw,42px)`).
- **FR-003**: Service icons (net, tv, install, consult, ip4, ip6) and trust icons MUST be inline SVG components keyed by CMS `icon` field.
- **FR-004**: All CTAs targeting `#lead` MUST pass context (plan, addon, TV package, promo, shop item, DC service) to the lead form store so the topic is preselected (feature 005 consumes it).
- **FR-005**: Collapsed/hidden content (inactive tabs, accordion bodies, filtered channels) MUST remain in SSR HTML.
- **FR-006**: Structured data MUST include Offer (plans, TV packages, addons, DC services with price), HowTo (payment methods), and ItemList (news preview).
- **FR-007**: Sections MUST animate in with the `rise` animation on first viewport entry, disabled under `prefers-reduced-motion`.
- **FR-008**: Card hover effects (translateY −4px + shadow) only on pointer devices.

## Success Criteria *(mandatory)*

- **SC-001**: Visual diff vs prototype at 1280px and 390px: no section differs by more than 4px in layout.
- **SC-002**: Lighthouse mobile `/`: Performance ≥ 90, SEO 100, A11y ≥ 95; CLS < 0.05.
- **SC-003**: 100% of section text originates from the CMS or i18n JSON (grep: no Cyrillic literals in components).
- **SC-004**: Rich Results Test validates Offer/HowTo/Organization with 0 errors.

## Assumptions

- Coverage (`#coverage`) and lead form (`#lead`) are separate features (004, 005) but slot into this page.
- Prices are in UAH; currency label comes from i18n.
