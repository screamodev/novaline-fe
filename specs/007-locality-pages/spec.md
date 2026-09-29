# Feature Specification: Locality Landing Pages (local SEO)

**Feature Branch**: `007-locality-pages`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "SEO pages per covered settlement (e.g. 'Інтернет у Пісочині') generated from the coverage data, with plans, map and a request form, to rank for 'internet + locality' queries."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Searcher lands on their village's page (Priority: P1)

Someone googles "інтернет Пісочин" and lands on `/internet/pisochyn`: H1 "Інтернет у Пісочині — оптика GPON від NovaLine", breadcrumb (Головна › Покриття › Харківська обл. › Пісочин), a short intro (CMS text or a templated default), technology & max speed, plan cards for this location (with neighbourhood price notes if any), a small map centred on the settlement with nearby covered localities, the lead form prefilled with this address, and links to neighbouring settlements.

**Why this priority**: Local intent queries are the highest-converting organic traffic for an ISP.

**Independent Test**: Every published settlement has a page returning 200 with unique title/description, listed in the sitemap.

**Acceptance Scenarios**:

1. **Given** a settlement with custom CMS intro/SEO, **Then** it is used; otherwise the templated text (with correct Ukrainian locative case from a CMS field) is used.
2. **Given** an unpublished/unknown slug, **Then** 404.
3. **Given** the page, **Then** JSON-LD includes BreadcrumbList and a Service with `areaServed` = the settlement (Place with geo coordinates) and Offers.
4. **Given** `/en/internet/pisochyn`, **Then** EN version with hreflang pair.

---

### User Story 2 - Visitor navigates the coverage directory (Priority: P2)

`/internet` lists all regions → districts → settlements as links (a crawlable directory), with the search box from feature 004.

### Edge Cases

- Ukrainian grammatical cases: the locative form ("у Пісочині", "в Харкові") cannot be generated reliably → CMS field `nameLocative` with fallback "у н.п. <name>".
- Duplicate names → slugs disambiguated per 001.
- Thin-content risk → minimum unique content: intro text, neighbourhood list, nearby localities, plans; pages without coordinates still valid.

## Clarifications

### Session 2026-09-26

- Q: Source of page text? → A: Template built from real data (district, neighbourhood prices, nearest localities, plans, map); `nameLocative` seeded for all settlements; CMS `intro`/`seo` override the template.

## Requirements *(mandatory)*

- **FR-001**: Routes `/internet`, `/internet/[slug]` (+ `/en`), SWR cache 5 min, included in sitemap.
- **FR-002**: `[be]` settlement gains `nameLocative` (localised) and optional `intro` rich text and SEO component (extends 001).
- **FR-003**: Page reuses PlansSection, coverage map (single-settlement mode) and LeadForm components.
- **FR-004**: Internal linking: landing coverage result links to the locality page; locality page links to 6 nearest settlements (by distance).

## Success Criteria *(mandatory)*

- **SC-001**: 100% of published settlements have indexable pages with unique title + description.
- **SC-002**: Indexed within 4 weeks of launch for ≥ 80% of pages (Search Console).

## Assumptions

- Page count ≈ number of covered settlements (hundreds), acceptable for SWR rendering.

## Revision 2026-09-29 (feature 011)

- Prices come from per-locality **connection offers** (`settlement.offers`; Kharkiv per neighbourhood) imported from the old site. They replace the base plans + neighbourhood modifiers table.
- No coordinates in the real data: the map is removed, and "nearby" links are other settlements of the same district (FR-004 "6 nearest by distance" is superseded).
- H1, intro and SEO templates use the offers' technology, top speed and cheapest tariff. No "24/7 support".
