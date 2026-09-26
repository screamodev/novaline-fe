# Feature Specification: Coverage Check & Map

**Feature Branch**: `004-coverage`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "Coverage + tariff lookup from the prototype: search a locality by name, or pick region → district → settlement (→ neighbourhood when the settlement has them, which changes the price); interactive Leaflet map with all covered localities that stays in sync with the selection; result card with technology, speed, plans at the chosen address and a 'Leave a request' button that carries the address into the lead form. Data managed in Strapi."

Repos: `[fe]` UI + server route; `[be]` coverage tree endpoint (defined in 001).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor checks coverage via cascading selects (Priority: P1)

In the navy `#coverage` section the visitor picks "Харківська область" → "Харківський район" → "Харків"; because Харків has neighbourhoods, a 4th select "Мікрорайон" appears with the note "Ціна залежить від обраного мікрорайону"; after picking "Центр" the "Перевірити" button enables; on click a white result card shows ✓ "Чудові новини — ви у зоні покриття!", the locality line ("Харків · Центр, Харківський район"), technology "GPON / EPON", speed "до 1000 Мбіт/с", and two plan tiles with prices including the +30 modifier (240 / 300 грн/міс).

**Why this priority**: The single most important conversion step on an ISP landing.

**Independent Test**: With seeded data, walk the cascade for a settlement with and without neighbourhoods; verify enabling rules, prices and result text.

**Acceptance Scenarios**:

1. **Given** no region chosen, **Then** district and settlement selects are disabled (translucent style).
2. **Given** a changed region, **Then** downstream selections and the result reset.
3. **Given** a settlement without neighbourhoods, **Then** the button enables right after settlement selection.
4. **Given** a shown result, **When** the neighbourhood changes, **Then** the result locality and prices update live.
5. **Given** "Змінити адресу", **Then** the result closes and settlement/neighbourhood reset.

---

### User Story 2 - Visitor finds a village by typing (Priority: P1)

The visitor types "піс" in "Пошук за назвою"; a dropdown lists up to 7 matches ("Пісочин — Харківський район, Харківська область"); choosing one fills all selects, flies the map to it, and shows the result immediately (or waits for the neighbourhood if required). No match → "Нічого не знайдено…" hint.

**Acceptance Scenarios**:

1. **Given** input "піс", **Then** matches are case-insensitive and apostrophe-insensitive (`дубовяз` finds `Дубов’язівка`), and also match EN names on `/en`.
2. **Given** the combobox, **Then** it follows the ARIA combobox pattern (arrow keys, Enter, Escape, `aria-activedescendant`).
3. **Given** text entered, **Then** a clear (×) button resets the query.

---

### User Story 3 - Visitor explores the map (Priority: P2)

The right panel shows a dark CARTO map (initial view ~[49.85, 35.4], zoom 7, scroll-wheel zoom off) with a marker per settlement — regional centres larger coral, others smaller violet — tooltips with names, a "300+ вузлів" badge and a legend. Clicking a marker selects that settlement (same as search). Selecting via selects/search highlights the marker (white fill, coral ring, bigger), brings it to front, and flies to it (zoom 11).

**Acceptance Scenarios**:

1. **Given** the page loads, **Then** Leaflet JS/CSS and tiles load only when the map enters the viewport (no impact on LCP).
2. **Given** JS disabled, **Then** the section still shows the selects' SSR markup and a static list of covered regions (crawlable).
3. **Given** a keyboard user, **Then** the map is skippable and the selects/search give full functionality.

---

### User Story 4 - Result leads to a request with the address prefilled (Priority: P1)

On "Залишити заявку" the lead form (feature 005) receives region/district/settlement/neighbourhood and type "Нове підключення", and the page scrolls to `#lead`.

### Edge Cases

- Settlement present in CMS without coordinates → selectable but no marker.
- Neighbourhood modifier negative → price lowered, never below 0.
- Two settlements with the same name in different districts → search shows both with district meta.
- Coverage data fails to load → selects show an error hint with a phone link; lead form still works.
- Deep link `/?settlement=pisochyn#coverage` → preselects (used by locality pages, feature 007).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `[be]` Coverage tree is served in one localised request (contract in 001); `[fe]` `/api/cms/coverage` caches it and exposes a flat search index + tree.
- **FR-002**: Selection state lives in a shared composable/store (`useCoverage`) used by the section, the map and the lead form.
- **FR-003**: Prices in the result = base plan price + neighbourhood modifier; which plans are shown follows 001 FR-007 [NEEDS CLARIFICATION: same plan set everywhere or per-settlement].
- **FR-004**: Map colours and marker sizes MUST come from `colors.ts` constants; tile provider and attribution per CARTO/OSM terms.
- **FR-005**: The map component MUST be `<ClientOnly>` + lazy-hydrated on visibility; it MUST be destroyed on unmount.
- **FR-006**: The hint line MUST show the count of covered settlements from data ("Понад 300 населених пунктів…" text from CMS with count placeholder).
- **FR-007**: All labels/placeholders localised; selects are native `<select>` for mobile usability, styled per prototype.

### Key Entities

- **CoverageTree**: regions → districts → settlements (name, slug, lat, lng, isRegionalCentre) → neighbourhoods (name, priceModifier).
- **CoverageSelection**: region, district, settlement, neighbourhood, result state.

## Success Criteria *(mandatory)*

- **SC-001**: A visitor reaches a coverage result in ≤ 3 interactions via search.
- **SC-002**: Map code adds 0 KB to the initial JS bundle (loaded on demand).
- **SC-003**: Search returns results in < 50 ms for 1,000 settlements on a mid-range phone.
- **SC-004**: Coverage → lead conversion is measurable (event `coverage_check`, `coverage_lead_click`).

## Assumptions

- Technology label ("GPON / EPON") and max speed are global CMS values unless a settlement override is introduced after clarification.
- The "300+ вузлів" badge is a CMS number, not computed.
