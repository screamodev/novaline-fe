<script setup lang="ts">
import type { CtaVM } from '#shared/types/home'
import type { LeadContext } from '~/composables/useLeadContext'

/** A CMS button (`context.label` empty → the button label is sent with the order): renders the right element for its action (order/callback dialog, coverage anchor, link). */
const props = withDefaults(defineProps<{ cta: CtaVM; context: LeadContext; size?: 'sm' | 'md' | 'lg' }>(), { size: 'lg' })

const localePath = useLocalePath()
const sectionLink = useSectionLink()
const { openOrder } = useOrderDialog()
const callbackOpen = useCallbackDialog()

const external = computed(() => props.cta.action === 'link' && /^https?:\/\//i.test(props.cta.url ?? ''))
const to = computed(() => {
  if (props.cta.action === 'coverage') return sectionLink('coverage')
  if (props.cta.action !== 'link' || external.value || !props.cta.url?.startsWith('/')) return undefined
  const url = new URL(props.cta.url, 'http://site.local')
  return { path: localePath(url.pathname), hash: url.hash || undefined, query: Object.fromEntries(url.searchParams) }
})
const href = computed(() => (props.cta.action === 'link' && !to.value ? (props.cta.url ?? undefined) : undefined))

function onClick() {
  if (props.cta.action === 'order') openOrder({ context: { ...props.context, label: props.context.label || props.cta.label } })
  else if (props.cta.action === 'callback') callbackOpen.value = true
}
</script>

<template>
  <BaseButton
    :variant="cta.variant"
    :size="size"
    :to="to"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener' : undefined"
    class="!rounded-[14px]"
    @click="onClick"
  >
    {{ cta.label }}<AppIcon v-if="cta.variant !== 'white'" name="arrowRight" :size="18" :stroke-width="2.4" />
  </BaseButton>
</template>
