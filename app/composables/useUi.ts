import type { LeadContext } from './useLeadContext'

/** Shared open/closed state for overlays triggered from anywhere (header, FABs, sections). */
export const useMobileMenu = () => useState('ui-mobile-menu', () => false)
export const useCallbackDialog = () => useState('ui-callback-dialog', () => false)
export const useAssistantPanel = () => useState('ui-assistant-panel', () => false)

/** What an "Замовити" button passes to the order dialog: what was clicked and, if known, where. */
export interface OrderRequest {
  context?: LeadContext | null
  /** Settlement slug + neighbourhood name to prefill the address. */
  settlement?: string
  neighbourhood?: string
}

/** The compact order popup opened by every "Замовити" button (no scrolling to the lead form). */
export function useOrderDialog() {
  const open = useState('ui-order-dialog', () => false)
  const request = useState<OrderRequest>('ui-order-request', () => ({}))
  const { track } = useAnalytics()
  const openOrder = (req: OrderRequest = {}) => {
    request.value = req
    open.value = true
    track('order_open', { kind: req.context?.kind ?? 'header' })
  }
  return { open, request, openOrder }
}

/** Link to a landing section that works from any page and locale. */
export function useSectionLink() {
  const localePath = useLocalePath()
  return (id: SectionId) => ({ path: localePath('/'), hash: `#${id}` })
}
