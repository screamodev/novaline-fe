import type { PriceVM } from '#shared/types/home'

/** Locale-aware formatting for prices and dates shown in cards. */
export function useFormat() {
  /** "31.12.2026" — the prototype uses the same numeric format in both locales. */
  const date = (iso: string | null | undefined) => {
    if (!iso) return ''
    const [y, m, d] = iso.slice(0, 10).split('-')
    return `${d}.${m}.${y}`
  }
  const amount = (n: number) => String(Math.round(n))
  /** "210", "від 450", "договірна"; `plus` renders add-on style "+60". */
  const price = (p: PriceVM, opts: { plus?: boolean } = {}) => {
    if (p.amount === null) return p.label ?? ''
    const value = `${opts.plus ? '+' : ''}${amount(p.amount)}`
    return p.prefix ? `${p.prefix} ${value}` : value
  }
  return { date, amount, price }
}
