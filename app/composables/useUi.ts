/** Shared open/closed state for overlays triggered from anywhere (header, FABs, sections). */
export const useMobileMenu = () => useState('ui-mobile-menu', () => false)
export const useCallbackDialog = () => useState('ui-callback-dialog', () => false)
export const useAssistantPanel = () => useState('ui-assistant-panel', () => false)

/** Link to a landing section that works from any page and locale. */
export function useSectionLink() {
  const localePath = useLocalePath()
  return (id: SectionId) => ({ path: localePath('/'), hash: `#${id}` })
}
