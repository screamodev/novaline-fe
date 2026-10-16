# Feature Specification: Vacancies

**Feature Branch**: `013-vacancies`

**Created**: 2026-10-16

**Status**: Implemented

**Input**: A careers page with a menu item; vacancies (city, description, conditions, …) managed in Strapi; attractive UI.

## Clarifications

### Session 2026-10-16

- Q: How does a candidate apply? → A: Contacts only (phone, Telegram, e-mail with a prefilled subject) — no form, no leads.
- Q: Page structure? → A: One page `/vacancies` with expandable cards; no detail pages.

## Requirements

- **FR-001** `[be]` Single type `careers-page` (i18n, D&P): hero (`sections.heading`), heroImage, benefitsTitle, benefits (`careers.benefit` {icon, title, text}), listTitle, contactsTitle/Text, HR name/phone/email/telegram, empty-state copy, seo.
- **FR-002** `[be]` Collection `vacancy` (i18n, D&P): key, order, title, city, department, employmentType, workFormat, salaryFrom/To, salaryLabel, isHot, summary, description (blocks), responsibilities / requirements / offer (`shared.feature`[]), optional contactName/Phone/Telegram overriding the HR contacts. Lifecycle: from ≤ to; no salary → label required.
- **FR-003** `[be]` Contract R23 (careers-page) and R24 (vacancies).
- **FR-004** BFF `/api/cms/careers` → `CareersVM`; Telegram handles normalised to `https://t.me/…`, vacancy contacts merged over HR ones field by field.
- **FR-005** `/vacancies` (+ `/en/vacancies`): hero with live stats and a "now hiring" board, benefits grid, city/department chip filters (URL `?city=&dept=`), accordion cards (deep link `#key`, copy-link button), HR contacts block, empty and no-match states.
- **FR-006** Navigation: "Ще" dropdown (with a "Наймаємо" badge), mobile drawer, footer. Sitemap picks up the page automatically; production SWR 300 s.
- **FR-007** SEO: CMS `seo` with i18n fallback, `ItemList` JSON-LD of vacancies, breadcrumbs.

## Tasks

- [x] T001 `[be]` `careers.benefit`, `careers-page`, `vacancy` + lifecycle
- [x] T002 `[be]` Seed: careers page + 4 vacancies uk/en; R23/R24; types
- [x] T003 Types/normaliser `shared/{types,utils}/careers.ts`, BFF route, tests `tests/careers.test.ts`
- [x] T004 `VacancyCard`, `pages/vacancies.vue`, new icons, i18n `careers.*`, `nav.vacancies`
- [x] T005 Menu, drawer, footer links; route rules; browser check (desktop/mobile, uk/en)

## Follow-ups

- Real HR e-mail / Telegram: the seed uses the public support e-mail and the main phone; set the HR contacts in the CMS.
