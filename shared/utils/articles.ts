import type { ArticleCategoryVM, ArticleVM } from '../types/articles'
import type { ArticleCardVM } from '../types/home'
import { toMedia, toSeo } from './cms-normalize'

type Raw = Record<string, any>
const str = (v: unknown) => (typeof v === 'string' ? v : '')

export const toCategory = (c: Raw | null | undefined): ArticleCategoryVM | null =>
  c?.slug ? { slug: str(c.slug), name: str(c.name) } : null

export function toArticleCard(a: Raw): ArticleCardVM {
  return {
    slug: str(a.slug),
    title: str(a.title),
    excerpt: str(a.excerpt),
    categoryName: a.category?.name ? str(a.category.name) : null,
    publishedDate: str(a.publishedDate),
  }
}

export function toArticle(a: Raw, mediaBase: string, related: Raw[] = []): ArticleVM {
  const other = (a.localizations as Raw[] | undefined)?.find((l) => l.locale !== a.locale && l.slug)
  return {
    slug: str(a.slug),
    locale: str(a.locale),
    title: str(a.title),
    excerpt: str(a.excerpt),
    category: toCategory(a.category),
    publishedDate: str(a.publishedDate),
    updatedAt: a.updatedAt ? str(a.updatedAt) : null,
    cover: toMedia(a.cover, mediaBase, str(a.title)),
    body: Array.isArray(a.body) ? a.body : [],
    seo: toSeo(a.seo, mediaBase),
    alternate: other ? { locale: str(other.locale), slug: str(other.slug) } : null,
    related: related.filter((r) => r.slug !== a.slug).slice(0, 3).map(toArticleCard),
  }
}

/** Page number from a query value; invalid input becomes page 1. */
export function parsePage(v: unknown): number {
  const n = Number.parseInt(String(v ?? ''), 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}
