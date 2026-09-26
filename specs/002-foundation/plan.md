# Implementation Plan: Frontend Foundation

**Branch**: `002-foundation` | **Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

## Summary

Build the site shell (top bar, sticky header + "Ще" menu, mobile drawer, footer, floating actions, dialog), the design-token system (already scaffolded: `app/theme/colors.ts` → `tailwind.config.ts`), i18n (uk/en), SEO base (meta, hreflang, schema.org, sitemap, robots), and the BFF layer that reads Strapi server-side with caching and webhook-driven purge.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict), Node 22

**Primary Dependencies**: Nuxt 4.5, Vue 3.5, `@nuxtjs/tailwindcss` (Tailwind 3), `@nuxtjs/i18n` 10, `@nuxtjs/sitemap` 8, `@nuxtjs/robots` 6, `nuxt-schema-org` 6, `@nuxt/image` 2, `@nuxt/fonts`, zod 4

**Storage**: Nitro storage (memory in dev, filesystem `.data/cache` in prod) for cached handlers

**Testing**: `nuxt typecheck`, `nuxt build`; Vitest + `@nuxt/test-utils` for BFF normalisers and revalidate route; manual visual diff vs prototype (Chrome at 1280/390)

**Target Platform**: Node SSR server in Docker behind Caddy

**Project Type**: Web frontend (SSR)

**Performance Goals**: cached TTFB < 200 ms; Lighthouse mobile Perf ≥ 90

**Constraints**: Strapi token never in client bundle; zero raw hex in components

**Scale/Scope**: ~15 shell components, 3 server routes

## Constitution Check

| Principle | Gate | Status |
|---|---|---|
| I | Shell copy: phones/links from `global`; labels from i18n | ✅ |
| II | Lint rule (grep in CI) for `#[0-9a-f]{3,8}` / `rgb(` in `app/components`, `app/pages` | ✅ |
| III | Header/footer/drawer values taken from prototype CSS | ✅ |
| IV | `useSeoMeta`, `useLocaleHead`, schema-org, sitemap, robots per env | ✅ |
| V | Focus trap, Escape, aria on menu/drawer/dialog; reduced motion | ✅ |
| VI | `server/api/cms/*` + `server/utils/strapi.ts` with runtime token | ✅ |
| VII | `shared/types/cms.ts` mirrors 001 contract | ✅ |
| VIII | Official modules only; no state library (composables + `useState`) | ✅ |

## Project Structure

```text
app/
├── theme/colors.ts                 # tokens (exists)
├── assets/css/main.css             # base layer (exists)
├── app.vue                         # head: locale head, schema-org org
├── error.vue                       # branded 404/500
├── layouts/default.vue             # TopBar + SiteHeader + slot + SiteFooter + FloatingActions
├── layouts/minimal.vue             # for /radio
├── components/
│   ├── layout/ TopBar.vue SiteHeader.vue MoreMenu.vue MobileDrawer.vue SiteFooter.vue FloatingActions.vue BrandLogo.vue LangSwitch.vue
│   ├── ui/ BaseButton.vue BaseDialog.vue SectionHeading.vue Pill.vue Chip.vue
│   └── icons/ Icon*.vue            # prototype SVGs
├── composables/ useGlobal.ts useSeo.ts useScrollToSection.ts useReveal.ts useFocusTrap.ts
└── pages/index.vue
shared/types/cms.ts                 # contract types (usable in app + server)
server/
├── utils/strapi.ts                 # $fetch wrapper: base URL, token, locale fallback
├── utils/cms-cache.ts              # defineCachedFunction wrappers + tag registry
├── api/cms/global.get.ts
├── api/revalidate.post.ts          # secret check → purge tags
└── routes/__sitemap__/urls.ts      # dynamic sitemap source (news, localities later)
i18n/locales/uk.json en.json
```

**Structure Decision**: Nuxt 4 `app/` + `server/` + `shared/` layout. Cross-cutting contract types live in `shared/` so both server normalisers and components import them.

## Key Design Decisions

1. **Caching**: `cachedCms(name, fn, { maxAge: 60, swr: true, getKey: locale })`; tag registry maps Strapi `model` → cache names; `/api/revalidate` removes matching keys from `useStorage('cache')` and route-rule caches (`nitro:routes`).
2. **Locale fallback**: `strapi.get(path, { locale })` retries with `uk` on empty data (contract rule).
3. **Robots**: `robots.disallowNonIndexableRoutes` + env gate `NUXT_PUBLIC_SITE_ENV`.
4. **Section scrolling**: CSS `scroll-margin-top: 80px` on sections + native smooth scroll; reduced-motion disables.
5. **Icons**: Vue SFC per icon copied from prototype paths (no icon library).

## Complexity Tracking

None.
