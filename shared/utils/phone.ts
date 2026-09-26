/** Normalises Ukrainian phone numbers to +380XXXXXXXXX; null when it is not a UA number. (Same rule as novaline-be.) */
export function normalizeUaPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (/^380\d{9}$/.test(digits)) return `+${digits}`
  if (/^0\d{9}$/.test(digits)) return `+38${digits}`
  return null
}
