import type { BenefitIcon, CareersVM, ContactsVM, EmploymentType, SalaryVM, VacancyVM, WorkFormat } from '../types/careers'
import type { Locale } from '../types/cms'
import { toHeading } from './home-normalize'
import { toMedia, toSeo } from './cms-normalize'

type Raw = Record<string, any>

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')
const opt = (v: unknown): string | null => str(v) || null
const int = (v: unknown): number | null => (v === null || v === undefined || v === '' || Number.isNaN(Number(v)) ? null : Math.round(Number(v)))
const texts = (list: unknown): string[] => (Array.isArray(list) ? list.map((f) => str(f?.text)).filter(Boolean) : [])
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T => (allowed.includes(v as T) ? (v as T) : fallback)

const EMPLOYMENT: readonly EmploymentType[] = ['full-time', 'part-time', 'shift', 'contract', 'internship']
const FORMATS: readonly WorkFormat[] = ['office', 'field', 'remote', 'hybrid']
const ICONS: readonly BenefitIcon[] = ['award', 'bolt', 'calendar', 'headset', 'wrench', 'net', 'consult', 'check']

/** `@user`, `user`, `t.me/user` or `https://t.me/user` → `https://t.me/user`; anything else → null. */
export function telegramUrl(raw: unknown): string | null {
  const m = str(raw).match(/^(?:https?:\/\/)?(?:t\.me\/|telegram\.me\/)?@?([A-Za-z0-9_]{4,32})\/?$/)
  return m ? `https://t.me/${m[1]}` : null
}

/** +380XXXXXXXXX → «+38 (0XX) XXX XX XX» (the format used across the site); other numbers stay as they are. */
export function displayPhone(tel: string): string {
  const m = tel.match(/^\+38(0\d{2})(\d{3})(\d{2})(\d{2})$/)
  return m ? `+38 (${m[1]}) ${m[2]} ${m[3]} ${m[4]}` : tel
}

const phoneOf = (tel: unknown, display?: unknown) => {
  const t = str(tel)
  return /^\+\d{10,15}$/.test(t) ? { tel: t, display: opt(display) ?? displayPhone(t) } : null
}

/** Vacancy contacts win field by field; the e-mail is always the HR one. */
export function mergeContacts(page: ContactsVM, v: Raw): ContactsVM {
  return {
    name: opt(v.contactName) ?? page.name,
    phone: phoneOf(v.contactPhone) ?? page.phone,
    email: page.email,
    telegram: telegramUrl(v.contactTelegram) ?? page.telegram,
  }
}

export function toVacancy(v: Raw, contacts: ContactsVM): VacancyVM {
  return {
    key: str(v.key),
    title: str(v.title),
    city: str(v.city),
    department: opt(v.department),
    employmentType: oneOf(v.employmentType, EMPLOYMENT, 'full-time'),
    workFormat: oneOf(v.workFormat, FORMATS, 'office'),
    salary: { from: int(v.salaryFrom), to: int(v.salaryTo), label: opt(v.salaryLabel) },
    isHot: !!v.isHot,
    summary: opt(v.summary),
    description: Array.isArray(v.description) ? v.description : [],
    responsibilities: texts(v.responsibilities),
    requirements: texts(v.requirements),
    offer: texts(v.offer),
    contacts: mergeContacts(contacts, v),
  }
}

export function normalizeCareers(page: Raw | null, vacancies: Raw[], mediaBase: string): CareersVM {
  const p = page ?? {}
  const contacts: ContactsVM = {
    name: opt(p.hrName),
    phone: phoneOf(p.hrPhone?.tel, p.hrPhone?.display),
    email: opt(p.hrEmail),
    telegram: telegramUrl(p.hrTelegram),
  }
  return {
    hero: toHeading(p.hero),
    heroImage: toMedia(p.heroImage, mediaBase),
    benefitsTitle: opt(p.benefitsTitle),
    benefits: (p.benefits ?? [])
      .filter((b: Raw) => str(b?.title))
      .map((b: Raw) => ({ icon: oneOf(b.icon, ICONS, 'check'), title: str(b.title), text: opt(b.text) })),
    listTitle: opt(p.listTitle),
    contactsTitle: opt(p.contactsTitle),
    contactsText: opt(p.contactsText),
    contacts,
    emptyTitle: opt(p.emptyTitle),
    emptyText: opt(p.emptyText),
    seo: toSeo(p.seo, mediaBase),
    vacancies: vacancies.filter((v) => str(v.title) && str(v.key)).map((v) => toVacancy(v, contacts)),
  }
}

const SALARY_WORDS: Record<Locale, { from: string; upTo: string; currency: string }> = {
  uk: { from: 'від', upTo: 'до', currency: 'грн' },
  en: { from: 'from', upTo: 'up to', currency: 'UAH' },
}

/** «28 000 – 40 000 грн + премії», «від 20 000 грн», «за домовленістю»; null when nothing is set. */
export function formatSalary(s: SalaryVM, locale: Locale): string | null {
  const w = SALARY_WORDS[locale]
  const n = (v: number) => new Intl.NumberFormat(locale === 'uk' ? 'uk-UA' : 'en-US').format(v).replace(/ | |,/g, ' ')
  let amount: string | null = null
  if (s.from !== null && s.to !== null) amount = s.from === s.to ? `${n(s.from)} ${w.currency}` : `${n(s.from)} – ${n(s.to)} ${w.currency}`
  else if (s.from !== null) amount = `${w.from} ${n(s.from)} ${w.currency}`
  else if (s.to !== null) amount = `${w.upTo} ${n(s.to)} ${w.currency}`
  if (amount && s.label) return `${amount} ${s.label}`
  return amount ?? s.label
}

export interface VacancyFilter {
  city: string
  department: string
}

export const filterVacancies = (list: VacancyVM[], f: VacancyFilter): VacancyVM[] =>
  list.filter((v) => (!f.city || v.city === f.city) && (!f.department || v.department === f.department))

/** Distinct values with counts, in first-seen (CMS) order. */
export function facet(list: VacancyVM[], pick: (v: VacancyVM) => string | null): { value: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const v of list) {
    const value = pick(v)
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts].map(([value, count]) => ({ value, count }))
}
