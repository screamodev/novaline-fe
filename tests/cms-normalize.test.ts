import { describe, expect, it } from 'vitest'
import { normalizeGlobal, toMedia } from '../shared/utils/cms-normalize'

describe('toMedia', () => {
  it('prefixes relative upload URLs with the media base', () => {
    expect(toMedia({ url: '/uploads/a.png', alternativeText: 'A' }, 'http://cms:1337/')?.src).toBe('http://cms:1337/uploads/a.png')
  })
  it('keeps absolute URLs and handles missing media', () => {
    expect(toMedia({ url: 'https://cdn.x/a.png' }, 'http://cms:1337')?.src).toBe('https://cdn.x/a.png')
    expect(toMedia(null, 'http://cms:1337')).toBeNull()
  })
})

describe('normalizeGlobal', () => {
  it('splits the tagline, puts the primary phone first and survives empty input', () => {
    const vm = normalizeGlobal(
      {
        brandTagline: 'НАДІЙНЕ\nПІДКЛЮЧЕННЯ\nДО INTERNET',
        phones: [
          { display: '099', tel: '+38099', primary: false },
          { display: '098', tel: '+38098', primary: true, viber: true },
        ],
      },
      'http://cms:1337',
    )
    expect(vm.taglineLines).toEqual(['НАДІЙНЕ', 'ПІДКЛЮЧЕННЯ', 'ДО INTERNET'])
    expect(vm.phones[0]).toMatchObject({ tel: '+38098', primary: true, viber: true })
    expect(normalizeGlobal(null, '').phones).toEqual([])
  })
})
