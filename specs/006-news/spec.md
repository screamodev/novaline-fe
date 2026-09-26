# Feature Specification: News & Articles Pages

**Feature Branch**: `006-news`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "The landing's news cards ('Читати', 'Всі новини') lead to real pages: a news list with categories and pagination and an article page with rich text, optimised for SEO."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor reads an article (Priority: P1)

From a news card the visitor opens `/news/rozshyryuiemo-pokryttia-poltavskyi-raion`; the page (inside the site shell) shows breadcrumbs (Головна › Новини › title), category pill, date, H1, cover image, rich-text body (headings, lists, links, images, quotes), and a CTA block ("Перевірити покриття" / "Залишити заявку"), plus 3 related articles.

**Why this priority**: Articles are the main source of organic traffic.

**Independent Test**: Seeded article renders server-side with correct meta, Article + BreadcrumbList JSON-LD, and hreflang to its EN counterpart.

**Acceptance Scenarios**:

1. **Given** an unknown slug, **Then** a localised 404 with `noindex`.
2. **Given** the EN version exists, **Then** `/en/news/<en-slug>` and hreflang pair; **Given** it does not, **Then** no EN alternate is emitted and the EN switch goes to `/en/news`.
3. **Given** body images, **Then** they are lazy-loaded, responsive, with alt text from CMS.

---

### User Story 2 - Visitor browses all news (Priority: P2)

`/news` lists articles (12 per page) in the landing card style, filterable by category chips, with numbered pagination (`?page=2`) that is crawlable (real links, `rel=prev/next` not required but canonical per page).

**Acceptance Scenarios**:

1. **Given** category "Поради", **Then** URL `/news?category=porady` and only that category shows.
2. **Given** page beyond range, **Then** 404.

### Edge Cases

- Article without cover → text-only header, OG image falls back to global default.
- Very long titles → wrap; meta title truncated sensibly (≤ 60 chars target, CMS field overrides).
- Scheduled/draft articles never appear.

## Clarifications

### Session 2026-09-26

- Q: Article content for launch? → A: Six demo articles (uk/en, 300–500 words, headings/lists/quote) seeded and marked as demo for the client to replace.

## Requirements *(mandatory)*

- **FR-001**: Routes `/news`, `/news/[slug]` (+ `/en/...`) with SWR caching and inclusion in `sitemap.xml` with `lastmod` = updatedAt.
- **FR-002**: Rich text rendered from Strapi Blocks via a safe renderer (no `v-html` of untrusted HTML).
- **FR-003**: SEO: title/description/OG from article SEO component → fallback to title/excerpt/cover; `og:type=article`, `article:published_time`.
- **FR-004**: Slugs are per-locale; i18n route params map between locales for the language switch.
- **FR-005**: Related articles = same category, newest first, excluding current.

## Success Criteria *(mandatory)*

- **SC-001**: Article pages score SEO 100 and Performance ≥ 90 (mobile).
- **SC-002**: New article published in CMS is live and in the sitemap within 60 s.

## Assumptions

- Comments and author profiles are out of scope.
