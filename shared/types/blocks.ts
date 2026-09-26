/** Minimal Strapi Blocks node shape (paragraph, heading, list, quote, code, link, text). */
export interface BlockNode {
  type: string
  level?: number
  format?: 'ordered' | 'unordered'
  url?: string
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  children?: BlockNode[]
}
