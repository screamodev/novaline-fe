# Feature Specification: Client Revisions (ТЗ «доопрацювання та редизайн»)

**Feature Branch**: `011-client-revisions`

**Created**: 2026-09-29

**Status**: Implemented

**Input**: Client brief `new.novaline.net.txt` (seen only the prototype) — seven changes to navigation, typography, the USP block, the coverage check, home-page plans, promotions and the "Замовити" behaviour.

## Brief → change

| # | Brief | Change |
|---|---|---|
| 1 | "Покриття і тарифи" and "Тарифи" duplicate each other; "Радіо" appears twice | Menu items "Покриття" and "Тарифи" point to different sections; the radio link stays only in the main navigation |
| 2 | Font too wide; no dash before section badges | Manrope for headings and body (Unbounded removed); kickers without the leading coral bar |
| 3 | Remove every "Підтримка 24/7" | Removed from the trust strip, plan features, hero, meta descriptions, about stats and locality templates; data-centre physical access and the 24/7 radio stream are not support and stay |
| 4 | Remove the abstract map; keep the address check; show technology and plans for the point | Map and Leaflet removed; search or Область → Район → Населений пункт (→ Мікрорайон in Kharkiv); the result shows that point's technology, tariffs and connection price |
| 5 | No static home plans; plans only after choosing a locality; business may stay static | Home offers come from the chosen locality (shared state between "Покриття" and "Тарифи"); business plans remain static |
| 6 | Keep one promotion: "Приведи друга" | Only that promotion is published; hero promo pill removed |
| 7 | Every "Замовити" opens a compact popup with Name, Phone, Address | `OrderDialog` opened from the header, drawer, offer and business cards, TV, shop, data centre, promotion, hero consultation, article CTA and the assistant |

## Clarifications

### Session 2026-09-29

- Q: Data for per-locality plans? → A: Import the real coverage from the old novaline.net ("Умови підключення": 254 options in 19 groups, 275 offer cards). Kharkiv's options become neighbourhoods. No coordinates exist, so maps are removed everywhere.
- Q: Heading font? → A: Manrope everywhere.
- Q: Promotions? → A: Keep the prototype text of "Приведи друга" for the client to adjust in the CMS.
- Q: What does "Тарифи" show? → A: Business plans statically plus "plans for home": the chosen locality's offers, or a prompt to choose one.

## Requirements

- **FR-001** `[be]` Component `coverage.offer` (technology, audience, tariffs `{speed, price, extra}`, connection price / old price, promo flag, note uk/en), not localised; on settlements and neighbourhoods.
- **FR-002** `[be]` Coverage tree API returns offers; neighbourhood price modifiers and map copy removed; lead gains `street`.
- **FR-003** Coverage result appears automatically once the choice is complete; the same selection drives the "Тарифи" section and prefills the order dialog.
- **FR-004** Locality pages list offers (per neighbourhood in Kharkiv), link other localities of the same district, and derive SEO texts from the offers.
- **FR-005** The assistant prompt carries offers grouped by identical terms.

## Success Criteria

- **SC-001** No "24/7 support" text on the home page (uk/en).
- **SC-002** Every "Замовити" opens the dialog without scrolling; the lead reaches Strapi with the address.
- **SC-003** Prices shown for a locality match the old site's card for it.
