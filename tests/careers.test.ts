import { describe, expect, it } from 'vitest'
import { displayPhone, facet, filterVacancies, formatSalary, normalizeCareers, telegramUrl } from '../shared/utils/careers'

const page = {
  hero: { kicker: 'Кар’єра', title: 'Будуємо разом' },
  hrName: 'HR',
  hrPhone: { display: '+38 (098) 506 06 09', tel: '+380985060609' },
  hrEmail: 'hr@example.com',
  hrTelegram: '@novaline_hr',
  benefits: [{ icon: 'award', title: 'Офіційно' }, { icon: 'unknown', title: 'Інше', text: 'x' }, { icon: 'bolt', title: '' }],
}
const vacancy = (key: string, extra: Record<string, unknown> = {}) => ({ key, title: `Title ${key}`, city: 'Харків', ...extra })

describe('telegramUrl', () => {
  it.each([
    ['@novaline_hr', 'https://t.me/novaline_hr'],
    ['novaline_hr', 'https://t.me/novaline_hr'],
    ['t.me/novaline_hr', 'https://t.me/novaline_hr'],
    ['https://t.me/novaline_hr/', 'https://t.me/novaline_hr'],
    ['https://evil.com/x', null],
    ['ab', null],
    [null, null],
  ])('%s → %s', (raw, url) => expect(telegramUrl(raw)).toBe(url))
})

describe('formatSalary', () => {
  it.each([
    [{ from: 28000, to: 40000, label: null }, 'uk', '28 000 – 40 000 грн'],
    [{ from: 28000, to: 40000, label: '+ премії' }, 'uk', '28 000 – 40 000 грн + премії'],
    [{ from: 20000, to: null, label: null }, 'uk', 'від 20 000 грн'],
    [{ from: null, to: 15000, label: null }, 'en', 'up to 15 000 UAH'],
    [{ from: 30000, to: 30000, label: null }, 'en', '30 000 UAH'],
    [{ from: null, to: null, label: 'за домовленістю' }, 'uk', 'за домовленістю'],
    [{ from: null, to: null, label: null }, 'uk', null],
  ] as const)('%o (%s) → %s', (salary, locale, out) => expect(formatSalary(salary, locale)).toBe(out))
})

describe('normalizeCareers', () => {
  it('maps page contacts and drops untitled benefits', () => {
    const vm = normalizeCareers(page, [], '')
    expect(vm.hero?.title).toBe('Будуємо разом')
    expect(vm.contacts).toEqual({
      name: 'HR',
      phone: { tel: '+380985060609', display: '+38 (098) 506 06 09' },
      email: 'hr@example.com',
      telegram: 'https://t.me/novaline_hr',
    })
    expect(vm.benefits).toEqual([
      { icon: 'award', title: 'Офіційно', text: null },
      { icon: 'check', title: 'Інше', text: 'x' },
    ])
  })

  it('merges vacancy contacts over the HR ones, field by field', () => {
    const [own, inherited] = normalizeCareers(
      page,
      [vacancy('a', { contactName: 'Олена', contactPhone: '+380501112233', contactTelegram: 'bad url!' }), vacancy('b')],
      '',
    ).vacancies
    expect(own!.contacts).toEqual({
      name: 'Олена',
      phone: { tel: '+380501112233', display: '+38 (050) 111 22 33' },
      email: 'hr@example.com',
      telegram: 'https://t.me/novaline_hr',
    })
    expect(inherited!.contacts.name).toBe('HR')
  })

  it('normalises enums, salary numbers and lists; skips entries without key or title', () => {
    const list = normalizeCareers(null, [
      vacancy('a', { employmentType: 'weird', workFormat: 'field', salaryFrom: '25000', responsibilities: [{ text: 'A' }, { text: '' }] }),
      { key: 'no-title', title: '' },
    ], '').vacancies
    expect(list).toHaveLength(1)
    expect(list[0]).toMatchObject({ employmentType: 'full-time', workFormat: 'field', salary: { from: 25000, to: null }, responsibilities: ['A'] })
  })

  it('survives an empty CMS', () => {
    const vm = normalizeCareers(null, [], '')
    expect(vm.hero).toBeNull()
    expect(vm.contacts).toEqual({ name: null, phone: null, email: null, telegram: null })
  })
})

describe('filters', () => {
  const list = normalizeCareers(null, [
    vacancy('a', { department: 'Tech' }),
    vacancy('b', { city: 'Полтава', department: 'Sales' }),
    vacancy('c', { department: 'Tech' }),
  ], '').vacancies

  it('filters by city and department', () => {
    expect(filterVacancies(list, { city: 'Харків', department: '' }).map((v) => v.key)).toEqual(['a', 'c'])
    expect(filterVacancies(list, { city: 'Харків', department: 'Sales' })).toEqual([])
    expect(filterVacancies(list, { city: '', department: '' })).toHaveLength(3)
  })

  it('builds facets with counts in CMS order', () => {
    expect(facet(list, (v) => v.city)).toEqual([{ value: 'Харків', count: 2 }, { value: 'Полтава', count: 1 }])
    expect(facet(list, (v) => v.department)).toEqual([{ value: 'Tech', count: 2 }, { value: 'Sales', count: 1 }])
  })
})

describe('displayPhone', () => {
  it('formats UA numbers and leaves others', () => {
    expect(displayPhone('+380985060609')).toBe('+38 (098) 506 06 09')
    expect(displayPhone('+48123456789')).toBe('+48123456789')
  })
})
