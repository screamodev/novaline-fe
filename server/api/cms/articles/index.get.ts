import type { ArticleListVM } from '#shared/types/articles'
import type { StrapiListResponse } from '#shared/types/cms'
import { parsePage, toArticleCard, toCategory } from '#shared/utils/articles'

type Raw = Record<string, any>
const PAGE_SIZE = 12

const getArticles = cachedCms('articles', async (locale: string, page: number, category: string): Promise<ArticleListVM> => {
  const loc = parseLocale(locale)
  const query: Record<string, string | number> = {
    sort: 'publishedDate:desc',
    'pagination[page]': page,
    'pagination[pageSize]': PAGE_SIZE,
    'populate[category][fields][0]': 'slug',
    'populate[category][fields][1]': 'name',
  }
  if (category) query['filters[category][slug][$eq]'] = category
  const [list, cats] = await Promise.all([
    strapiLocalized<StrapiListResponse<Raw>>('/articles', query, loc),
    strapiLocalized<StrapiListResponse<Raw>>('/article-categories', { sort: 'order:asc', 'pagination[pageSize]': 100 }, loc),
  ])
  const p = list.meta?.pagination
  return {
    items: list.data.map(toArticleCard),
    categories: cats.data.map(toCategory).filter((c) => c !== null),
    page: p?.page ?? page,
    pageCount: p?.pageCount ?? 1,
    total: p?.total ?? list.data.length,
  }
})

export default defineEventHandler((event) => {
  const q = getQuery(event)
  const category = typeof q.category === 'string' ? q.category.replace(/[^a-z0-9-]/g, '').slice(0, 60) : ''
  return getArticles(parseLocale(q.locale), parsePage(q.page), category)
})
