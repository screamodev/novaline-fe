declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/** Provider-agnostic analytics: pushes events to `window.dataLayer` when a tag manager is installed. */
export function useAnalytics() {
  const track = (event: string, props: Record<string, unknown> = {}) => {
    if (import.meta.client) window.dataLayer?.push({ event, ...props })
  }
  return { track }
}
