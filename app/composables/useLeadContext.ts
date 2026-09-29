/** What the visitor clicked before landing on the lead form (plan, TV package, shop item, …). */
export interface LeadContext {
  kind: 'plan' | 'offer' | 'addon' | 'tv' | 'promo' | 'shop' | 'datacenter' | 'consultation' | 'article' | 'assistant'
  key: string
  label: string
}

export function useLeadContext() {
  const context = useState<LeadContext | null>('lead-context', () => null)
  const set = (value: LeadContext) => (context.value = value)
  return { context, set }
}

/** Landing sections with no published content; their nav items are hidden. */
export const useHiddenSections = () => useState<SectionId[]>('hidden-sections', () => [])
