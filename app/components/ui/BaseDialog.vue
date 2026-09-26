<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })
defineProps<{ labelledby?: string; closeLabel: string }>()

const panel = ref<HTMLElement | null>(null)
useFocusTrap(panel, open, () => (open.value = false))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[70] grid place-items-center bg-overlay p-5 backdrop-blur-[4px]"
      @click.self="open = false"
    >
      <div
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="labelledby"
        class="relative w-full max-w-[400px] animate-rise rounded-[22px] bg-white p-[34px] shadow-dialog"
      >
        <button
          type="button"
          :aria-label="closeLabel"
          class="absolute right-4 top-4 grid h-[34px] w-[34px] place-items-center rounded-full bg-bg text-muted hover:text-navy"
          @click="open = false"
        >
          <AppIcon name="close" :size="16" :stroke-width="2.4" />
        </button>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
