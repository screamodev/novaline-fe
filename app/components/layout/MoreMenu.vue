<script setup lang="ts">
const { t } = useI18n()
const sectionLink = useSectionLink()
const hidden = useHiddenSections()
const visible = <T extends SectionId>(ids: readonly T[]) => ids.filter((id) => !hidden.value.includes(id))
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const menuId = useId()

const close = () => (open.value = false)
const onDocClick = (e: MouseEvent) => {
  if (root.value && !root.value.contains(e.target as Node)) close()
}
const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()

watch(open, (on) => {
  if (!import.meta.client) return
  if (on) {
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
  } else {
    document.removeEventListener('click', onDocClick)
    document.removeEventListener('keydown', onKey)
  }
})
onBeforeUnmount(close)
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="inline-flex items-center gap-1.5 p-0 text-[14px] font-semibold text-ink hover:text-coral"
      :aria-expanded="open"
      :aria-controls="menuId"
      @click="open = !open"
    >
      {{ t('nav.more') }}
      <span class="text-[10px] text-violet transition-transform" :class="open && 'rotate-180'" aria-hidden="true">▾</span>
    </button>
    <div
      v-show="open"
      :id="menuId"
      class="absolute right-0 top-[calc(100%+10px)] z-[70] min-w-[210px] rounded-2xl border border-line bg-white p-2 shadow-menu"
    >
      <NuxtLink
        v-for="id in visible(NAV_MORE)"
        :key="id"
        :to="sectionLink(id)"
        class="block rounded-[10px] px-3.5 py-[11px] text-[14px] font-semibold text-ink hover:bg-bg hover:text-violet"
        @click="close"
      >
        {{ t(`nav.${id}`) }}
      </NuxtLink>
    </div>
  </div>
</template>
