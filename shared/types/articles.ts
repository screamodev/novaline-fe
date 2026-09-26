import type { BlockNode } from './blocks'
import type { MediaVM, SeoVM } from './cms'
import type { ArticleCardVM } from './home'

export interface ArticleCategoryVM {
  slug: string
  name: string
}

export interface ArticleListVM {
  items: ArticleCardVM[]
  categories: ArticleCategoryVM[]
  page: number
  pageCount: number
  total: number
}

export interface ArticleVM {
  slug: string
  /** Locale the content is actually in (may differ from the request when falling back). */
  locale: string
  title: string
  excerpt: string
  category: ArticleCategoryVM | null
  publishedDate: string
  updatedAt: string | null
  cover: MediaVM | null
  body: BlockNode[]
  seo: SeoVM
  /** Slug of the same article in the other locale, when translated. */
  alternate: { locale: string; slug: string } | null
  related: ArticleCardVM[]
}
