import { defineComponent, h, type PropType, type VNode } from 'vue'

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

function renderText(n: BlockNode): VNode | string {
  let node: VNode | string = n.text ?? ''
  if (n.code) node = h('code', node)
  if (n.bold) node = h('strong', node)
  if (n.italic) node = h('em', node)
  if (n.underline) node = h('u', node)
  if (n.strikethrough) node = h('s', node)
  return node
}

function renderNode(n: BlockNode, key: number): VNode | string {
  const kids = () => (n.children ?? []).map(renderNode)
  switch (n.type) {
    case 'text':
      return renderText(n)
    case 'paragraph':
      return h('p', { key }, kids())
    case 'heading':
      return h(`h${Math.min(Math.max(n.level ?? 2, 2), 6)}`, { key }, kids())
    case 'list':
      return h(n.format === 'ordered' ? 'ol' : 'ul', { key }, kids())
    case 'list-item':
      return h('li', { key }, kids())
    case 'quote':
      return h('blockquote', { key }, kids())
    case 'code':
      return h('pre', { key }, h('code', kids()))
    case 'link': {
      const external = /^https?:\/\//.test(n.url ?? '')
      return h('a', { key, href: n.url, ...(external ? { target: '_blank', rel: 'noopener' } : {}) }, kids())
    }
    default:
      return h('span', { key }, kids())
  }
}

/** Renders Strapi Blocks as Vue vnodes — no v-html, so CMS content cannot inject markup. */
export default defineComponent({
  name: 'RichText',
  props: { blocks: { type: Array as PropType<BlockNode[]>, default: () => [] } },
  setup(props) {
    return () => h('div', { class: 'rich-text' }, props.blocks.map(renderNode))
  },
})
