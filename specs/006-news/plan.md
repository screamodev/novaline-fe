# Implementation Plan: News & Articles

**Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

## Summary
Cached BFF routes for article lists (page, category) and single articles (with the other-locale slug and related items); `/news` and `/news/[slug]` pages reuse the landing card and `RichText`; Article + BreadcrumbList JSON-LD; sitemap entries with hreflang alternatives. Seed gains full demo articles and a `--refresh` mode.

## Constitution Check
I ✅ all article content in CMS · IV ✅ SSR, one H1, canonical per page, hreflang via `useSetI18nParams`, JSON-LD, sitemap lastmod · V ✅ breadcrumbs nav, real pagination links · VI ✅ BFF · VIII ✅ no new deps

## Structure
```text
shared/utils/articles.ts (+tests) · server/api/cms/articles/index.get.ts · server/api/cms/articles/[slug].get.ts
app/components/news/ArticleCard.vue, Breadcrumbs.vue · app/pages/news/index.vue, [slug].vue
server/api/__sitemap__/urls.ts · [be] seed articles + --refresh
```
