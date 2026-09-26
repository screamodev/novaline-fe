const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Keeps keyboard focus inside `container` while `active` is true, locks page scroll,
 * closes on Escape and restores focus to the previously focused element afterwards.
 */
export function useFocusTrap(container: Ref<HTMLElement | null>, active: Ref<boolean>, onEscape: () => void) {
  let previous: HTMLElement | null = null

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onEscape()
      return
    }
    if (e.key !== 'Tab' || !container.value) return
    const items = [...container.value.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
    if (!items.length) return
    const first = items[0]!
    const last = items[items.length - 1]!
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const activate = async () => {
    previous = document.activeElement as HTMLElement | null
    document.documentElement.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    container.value?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
  }
  const deactivate = () => {
    document.documentElement.style.overflow = ''
    document.removeEventListener('keydown', onKeydown)
    previous?.focus()
    previous = null
  }

  if (import.meta.client) {
    watch(active, (on) => (on ? activate() : deactivate()))
    onBeforeUnmount(() => active.value && deactivate())
  }
}
