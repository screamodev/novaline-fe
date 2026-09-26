<script setup lang="ts">
const props = withDefaults(defineProps<{ name: IconName; size?: number; strokeWidth?: number }>(), {
  size: 20,
  strokeWidth: 2,
})
const icon = computed(() => ICONS[props.name])
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- static SVG paths from app/utils/icons.ts -->
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    :fill="icon.mode === 'fill' ? 'currentColor' : 'none'"
    :stroke="icon.mode === 'stroke' ? 'currentColor' : 'none'"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="shrink-0"
    v-html="icon.body"
  />
</template>
