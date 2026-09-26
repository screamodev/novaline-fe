/**
 * URLs of the previous WordPress site (novaline.net) mapped to their new homes, so bookmarks,
 * printed links and search results keep working after the switch. Keys are decoded, lower-case,
 * without trailing slash.
 */
const LEGACY: Record<string, string> = {
  '/home': '/',
  '/home/tv': '/#tv',
  '/tv-2': '/#tv',
  '/home/radio-2': '/radio',
  '/private-cabinet': 'https://stat.novaline.net/',
  '/contract-offer': '/dogovir.pdf',
  '/privacy-policy': '/privacy',
  '/инструкции-пополнения-счета': '/#payment',
  '/другие-инструкции': '/#payment',
  '/hello-world': '/news',
  '/ru': '/',
  '/ru/contract-offer': '/dogovir.pdf',
  '/ru/privacy-policy': '/privacy',
}

const normalize = (path: string) => {
  let p = path
  try {
    p = decodeURIComponent(path)
  } catch {
    /* malformed escape: match the raw path */
  }
  p = p.toLowerCase().replace(/\/+$/, '')
  return p || '/'
}

/** Target for a legacy path, or null. Unknown `/ru/...` pages go to the home page. */
export function legacyRedirect(path: string): string | null {
  const p = normalize(path)
  if (p === '/') return null
  return LEGACY[p] ?? (p.startsWith('/ru/') ? '/' : null)
}
