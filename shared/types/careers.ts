import type { BlockNode } from './blocks'
import type { MediaVM, SeoVM } from './cms'
import type { HeadingVM } from './home'

export type EmploymentType = 'full-time' | 'part-time' | 'shift' | 'contract' | 'internship'
export type WorkFormat = 'office' | 'field' | 'remote' | 'hybrid'
export type BenefitIcon = 'award' | 'bolt' | 'calendar' | 'headset' | 'wrench' | 'net' | 'consult' | 'check'

/** How a candidate reaches HR: every channel is optional, the page shows what is filled in. */
export interface ContactsVM {
  name: string | null
  phone: { display: string; tel: string } | null
  email: string | null
  /** Absolute https://t.me/… link. */
  telegram: string | null
}

export interface SalaryVM {
  from: number | null
  to: number | null
  /** Free text: replaces the numbers when they are empty, otherwise follows them («+ премії»). */
  label: string | null
}

export interface VacancyVM {
  key: string
  title: string
  city: string
  department: string | null
  employmentType: EmploymentType
  workFormat: WorkFormat
  salary: SalaryVM
  isHot: boolean
  summary: string | null
  description: BlockNode[]
  responsibilities: string[]
  requirements: string[]
  offer: string[]
  /** Vacancy-specific contacts merged over the page HR contacts. */
  contacts: ContactsVM
}

export interface CareersVM {
  hero: HeadingVM | null
  heroImage: MediaVM | null
  benefitsTitle: string | null
  benefits: { icon: BenefitIcon; title: string; text: string | null }[]
  listTitle: string | null
  contactsTitle: string | null
  contactsText: string | null
  contacts: ContactsVM
  emptyTitle: string | null
  emptyText: string | null
  seo: SeoVM
  vacancies: VacancyVM[]
}
