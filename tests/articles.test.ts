import { describe, expect, it } from 'vitest'
import { parsePage, toArticle } from '../shared/utils/articles'

describe('toArticle', () => {
  const raw = {
    slug: 'yak-obraty-router', locale: 'uk', title: 'Як обрати роутер', excerpt: 'Коротко', publishedDate: '2026-08-14',
    updatedAt: '2026-09-26T10:00:00Z', category: { slug: 'advice', name: 'Поради' }, cover: null,
    body: [{ type: 'paragraph', children: [{ type: 'text', text: 'x' }] }],
    localizations: [{ locale: 'en', slug: 'how-to-choose-a-router' }],
  }
  it('maps the other-locale slug and category', () => {
    const a = toArticle(raw, 'http://cms:1337')
    expect(a.alternate).toEqual({ locale: 'en', slug: 'how-to-choose-a-router' })
    expect(a.category).toEqual({ slug: 'advice', name: 'Поради' })
    expect(a.body).toHaveLength(1)
  })
  it('excludes the article itself from related and caps at 3', () => {
    const rel = [raw, ...[1, 2, 3, 4].map((i) => ({ ...raw, slug: `s${i}` }))]
    expect(toArticle(raw, '', rel).related.map((r) => r.slug)).toEqual(['s1', 's2', 's3'])
  })
  it('has no alternate when untranslated', () => {
    expect(toArticle({ ...raw, localizations: [] }, '').alternate).toBeNull()
  })
})

describe('parsePage', () => {
  it.each([['2', 2], [undefined, 1], ['0', 1], ['abc', 1], ['-3', 1]])('%s → %s', (v, out) => expect(parsePage(v)).toBe(out))
})
