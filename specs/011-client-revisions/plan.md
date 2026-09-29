# Implementation Plan: Client Revisions

**Spec**: [spec.md](./spec.md) · **Status**: Implemented 2026-09-29

## Data

`novaline-be/scripts/seed-data/legacy-rates.json` is a snapshot of the old site's "Умови підключення" block: optgroups, options and `.rate-item` cards. `build-coverage.mjs` turns it into seed entries:

| Legacy | New model |
|---|---|
| optgroup "Харків" | district "м. Харків" → settlement "Харків" with 15 neighbourhoods |
| other optgroups (pre-2020 districts) | districts, mapped to 5 regions (Kharkiv, Poltava, Sumy, Kirovohrad, Zakarpattia) |
| option | settlement: KMU-2010 slug, suffixed with the district when the name repeats; generated uk locative + manual overrides |
| `.rate-item` | `coverage.offer` on the settlement or neighbourhood (22 places have two: houses + apartments) |

Notes are cleaned up (shouting caps, typos) and translated. Speeds with "+ IPTV" become `tariff.extra`. "Акційна ціна!" becomes `connectionPromo`. A crossed-out old price becomes `connectionPriceOld`.

## Frontend

- `shared/utils/coverage.ts`: `offersFor`, `allOffers`, `minPrice`, `maxSpeed`, `technologies`, `districtNeighbours`. These replace `planPrice` and the coordinate-based `nearestSettlements`.
- `useCoverage()` (global state):
  - `complete` → `offers`; no "Перевірити" button, the result appears once the choice is complete;
  - `placeLabel` for order contexts.
- `OfferCards.vue` is shared by the coverage result, the "Тарифи" section and locality pages.
- `useOrderDialog()` + `OrderDialog.vue`:
  - every order CTA passes a `LeadContext` plus an optional settlement/neighbourhood;
  - the address prefill comes from the card or the coverage selection;
  - "Населений пункт" is a datalist over covered places; "Вулиця, будинок" goes to `lead.street`.
- Removed: `CoverageMapPanel`, `CoverageMapCanvas`, `NeighbourhoodPrices`, Leaflet (dependency, CSS, runtime config), plan segment tabs, `plansConnectionNote`.
- Typography: Manrope is used for `font-display` too. Headings are 800 weight with tighter tracking. The Arial-based metric fallback stays for Manrope only.

## Backend

Schema changes:
- `coverage.offer` / `coverage.tariff`;
- `settlement.offers`, `neighbourhood.offers` (non-localised);
- removed `neighbourhood.priceModifier`, `plan.availableForCoverage` / `coverageCaption`, the coverage-copy map fields and `home-page.plansConnectionNote`;
- `lead.street`, which also goes into the Telegram message.

The coverage service populates offers.

Repo fix: `.gitignore` had a bare `coverage` rule (for test reports) that silently excluded `src/api/coverage` and `src/components/coverage`. It is now anchored as `/coverage`.
