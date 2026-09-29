import type { CoverageTreeVM, SettlementEntry } from '#shared/types/coverage'
import { buildIndex, offersFor } from '#shared/utils/coverage'

export interface AddressSelection {
  region: string
  district: string
  settlement: string
  neighbourhood: string
}
export const emptyAddress = (): AddressSelection => ({ region: '', district: '', settlement: '', neighbourhood: '' })

/** Coverage tree for the current locale (cached BFF call, shared by every consumer). */
export function useCoverageData() {
  const { locale } = useI18n()
  const res = useFetch<CoverageTreeVM>('/api/cms/coverage', { key: 'cms-coverage', query: { locale }, dedupe: 'defer' })
  const ctx = { data: res.data, error: res.error, status: res.status, index: computed(() => buildIndex(res.data.value)) }
  // Awaitable (like useFetch itself) so pages can block SSR on the tree.
  return Object.assign(res.then(() => ctx), ctx)
}

/**
 * Region → district → settlement → neighbourhood cascade over any address state.
 * Used by the coverage check and by the address block of the lead form.
 */
export function useAddressCascade(address: Ref<AddressSelection>) {
  const { data: tree, index } = useCoverageData()

  const region = computed(() => tree.value?.regions.find((r) => r.slug === address.value.region))
  const district = computed(() => region.value?.districts.find((d) => d.slug === address.value.district))
  const entry = computed<SettlementEntry | undefined>(() => index.value.find((s) => s.slug === address.value.settlement))
  const neighbourhood = computed(() => entry.value?.neighbourhoods.find((n) => n.name === address.value.neighbourhood))

  const options = computed(() => ({
    regions: (tree.value?.regions ?? []).map((r) => ({ value: r.slug, label: r.name })),
    districts: (region.value?.districts ?? []).map((d) => ({ value: d.slug, label: d.name })),
    settlements: (district.value?.settlements ?? []).map((s) => ({ value: s.slug, label: s.name })),
    neighbourhoods: (entry.value?.neighbourhoods ?? []).map((n) => ({ value: n.name, label: n.name })),
  }))

  const setRegion = (v: string) => (address.value = { ...emptyAddress(), region: v })
  const setDistrict = (v: string) => (address.value = { ...address.value, district: v, settlement: '', neighbourhood: '' })
  const setSettlement = (v: string) => (address.value = { ...address.value, settlement: v, neighbourhood: '' })
  const setNeighbourhood = (v: string) => (address.value = { ...address.value, neighbourhood: v })
  /** Fill every level from a settlement slug (search hit, map marker, deep link). */
  const setBySettlement = (slug: string) => {
    const s = index.value.find((x) => x.slug === slug)
    if (s) address.value = { region: s.regionSlug, district: s.districtSlug, settlement: s.slug, neighbourhood: '' }
    return s
  }

  /** Human-readable labels, e.g. for the lead record and Telegram message. */
  const labels = computed(() => ({
    region: region.value?.name ?? '',
    district: district.value?.name ?? '',
    settlement: entry.value?.name ?? '',
    neighbourhood: neighbourhood.value?.name ?? '',
  }))

  return { tree, index, entry, neighbourhood, options, labels, setRegion, setDistrict, setSettlement, setNeighbourhood, setBySettlement }
}

/**
 * State of the coverage check, shared by the coverage section, the "Тарифи" section and the order dialog.
 * The result appears as soon as the choice is complete (a settlement, plus a neighbourhood in Kharkiv).
 */
export function useCoverage() {
  const address = useState<AddressSelection>('coverage-address', emptyAddress)
  const cascade = useAddressCascade(address)
  const { track } = useAnalytics()

  const needsNeighbourhood = computed(() => !!cascade.entry.value?.neighbourhoods.length)
  const complete = computed(() => !!cascade.entry.value && (!needsNeighbourhood.value || !!cascade.neighbourhood.value))
  const offers = computed(() => (complete.value ? offersFor(cascade.entry.value, cascade.neighbourhood.value) : []))
  const resultLabel = computed(() => {
    const e = cascade.entry.value
    if (!e) return ''
    return `${e.name}${cascade.neighbourhood.value ? ` · ${cascade.neighbourhood.value.name}` : ''}, ${e.districtName}`
  })
  /** Short place name for order contexts, e.g. "Харків · Салтівка". */
  const placeLabel = computed(() => {
    const e = cascade.entry.value
    return e ? `${e.name}${cascade.neighbourhood.value ? ` · ${cascade.neighbourhood.value.name}` : ''}` : ''
  })

  if (import.meta.client) {
    watch(complete, (done) => done && track('coverage_check', { settlement: address.value.settlement, neighbourhood: address.value.neighbourhood }))
  }

  const reset = () => (address.value = { ...address.value, settlement: '', neighbourhood: '' })

  return {
    address,
    ...cascade,
    needsNeighbourhood,
    complete,
    offers,
    resultLabel,
    placeLabel,
    pickSettlement: cascade.setBySettlement,
    reset,
  }
}

/** Address block of the lead form; prefilled from the coverage check. */
export const useLeadAddress = () => useState<AddressSelection>('lead-address', emptyAddress)
/** Lead form type (connection vs. question/issue); set to "connect" by coverage CTAs. */
export const useLeadType = () => useState<'connect' | 'issue'>('lead-type', () => 'connect')
