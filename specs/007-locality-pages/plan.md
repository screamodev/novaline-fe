# Implementation Plan: Locality Landing Pages

**Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

## Summary
`/internet` (crawlable coverage directory with search) and `/internet/[slug]` built from the cached coverage tree plus optional CMS intro/SEO per settlement. Pages combine a data-driven template (locative name, district, neighbourhood price table, nearest settlements), plans, a single-settlement map and the lead form prefilled with the address.

## Constitution Check
I ✅ data + CMS overrides, template strings in i18n · IV ✅ unique title/description, Breadcrumb + Service/Place JSON-LD, sitemap · V ✅ tables with headers, links · VIII ✅ reuse PlansSection, LeadSection, map canvas

## Structure
```text
shared/utils/coverage.ts (nearestSettlements) · server/api/cms/settlements/[slug].get.ts
app/pages/internet/index.vue, [slug].vue · app/components/locality/NeighbourhoodPrices.vue
[be] scripts/seed-data/locatives.ts, contract R18
```
