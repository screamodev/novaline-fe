<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type Variant = 'violet' | 'coral' | 'white' | 'soft'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    pill?: boolean
    block?: boolean
    href?: string
    to?: RouteLocationRaw
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'violet', size: 'md', pill: false, block: false, type: 'button' },
)

const VARIANTS: Record<Variant, string> = {
  violet: 'bg-violet text-white shadow-btn-violet hover:text-white hover:brightness-110',
  coral: 'bg-coral-strong text-white shadow-btn-coral hover:text-white hover:brightness-110',
  white: 'bg-white text-navy border-[1.5px] border-line hover:text-navy hover:border-violet',
  soft: 'bg-bg text-navy border-[1.5px] border-line hover:text-navy hover:border-violet',
}
const SIZES: Record<Size, string> = {
  sm: 'text-[14px] px-[18px] py-[11px]',
  md: 'text-[15px] px-[22px] py-[13px]',
  lg: 'text-[16px] px-7 py-4',
}

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : props.href ? 'a' : 'button'))
const classes = computed(() => [
  'inline-flex items-center justify-center gap-[9px] font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet',
  VARIANTS[props.variant],
  SIZES[props.size],
  props.pill ? 'rounded-full' : 'rounded-xl',
  props.block && 'w-full',
])
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :href="to ? undefined : href"
    :type="to || href ? undefined : type"
    :disabled="to || href ? undefined : disabled"
    :class="classes"
  >
    <slot />
  </component>
</template>
