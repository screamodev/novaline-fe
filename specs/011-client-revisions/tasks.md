# Tasks: Client Revisions

## Block 1 — quick UI
- [x] T001 Menu "Покриття" / "Тарифи"; radio link removed from the top bar
- [x] T002 Manrope for headings, Unbounded removed (fonts config, fallback face, icons)
- [x] T003 Kicker without the coral dash (SectionHeading, news index)
- [x] T004 Remove "24/7 support" (seed: trust, plans, hero, meta, about; i18n meta/locality)
- [x] T005 One promotion ("Приведи друга"), hero promo pill cleared, single-card layout

## Block 2 — real coverage and per-locality offers
- [x] T006 [be] `coverage.offer` / `coverage.tariff`, offers on settlement + neighbourhood, clean-up of replaced fields, `lead.street`
- [x] T007 [be] Snapshot `legacy-rates.json` + generator `build-coverage.mjs`; seed 239 settlements, 15 neighbourhoods, 275 offers
- [x] T008 [be] Coverage tree returns offers; contract checks updated
- [x] T009 Coverage section without map; auto result with `OfferCards`
- [x] T010 "Тарифи": business static + home offers of the chosen locality / CTA to choose
- [x] T011 Locality pages from offers; same-district links; SEO templates
- [x] T012 Assistant prompt: offers grouped by identical terms; fallback replies without fixed prices
- [x] T013 Unit tests for coverage helpers, business plans and the prompt

## Block 3 — order popup
- [x] T014 `useOrderDialog` + `OrderDialog` (name, phone, locality datalist, street)
- [x] T015 All order CTAs open the dialog (header, drawer, offers, business, TV, shop, DC, promo, hero, article, assistant)

## Block 4 — verification
- [x] T016 Gates (typecheck, unit, colour lint, contract) + browser pass at 1440 / 390 + e2e + crawler
