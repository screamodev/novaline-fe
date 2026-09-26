<script setup lang="ts">
import type { SettlementEntry } from '#shared/types/coverage'
import type { HomeVM } from '#shared/types/home'

/** Map card: header, lazily loaded Leaflet canvas (on scroll into view), hint and legend. */
const props = defineProps<{
  copy: HomeVM['coverage']
  index: SettlementEntry[]
  selected: string
  /** Start centred on this settlement instead of the regional overview. */
  focus?: SettlementEntry | null
  /** Heading level of the map title, to keep the document outline valid where it is used. */
  titleTag?: 'h2' | 'h3'
}>()
const emit = defineEmits<{ pick: [slug: string] }>()
const { t } = useI18n()

const shell = ref<HTMLElement | null>(null)
const visible = ref(false)
onMounted(() => {
  if (!shell.value) return
  const io = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting) {
      visible.value = true
      io.disconnect()
    }
  }, { rootMargin: '200px' })
  io.observe(shell.value)
  onBeforeUnmount(() => io.disconnect())
})
const center = computed(() => (props.focus?.lat != null && props.focus.lng != null ? ([props.focus.lat, props.focus.lng] as [number, number]) : undefined))
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl border border-line-dark bg-map-panel p-[22px] max-sm:p-4">
    <div class="flex items-center justify-between gap-3">
      <component :is="titleTag ?? 'h3'" class="font-display text-[14px] font-semibold text-white">{{ copy.mapTitle }}</component>
      <span v-if="copy.nodesCount" class="rounded-full border border-coral/40 bg-coral/20 px-[11px] py-[5px] text-[11.5px] font-bold text-white">
        {{ copy.nodesCount }}+ {{ copy.nodesLabel }}
      </span>
    </div>
    <div ref="shell" class="relative z-[1] mt-4 h-[380px] overflow-hidden rounded-2xl border border-line-dark bg-navy-deep max-sm:h-[300px]">
      <a href="#coverage-map-end" class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[500] focus:rounded-lg focus:bg-white focus:px-3 focus:py-1.5 focus:text-navy">
        {{ t('coverage.mapSkip') }}
      </a>
      <LazyCoverageMapCanvas
        v-if="visible"
        :index="index"
        :selected="selected"
        :initial-center="center"
        @pick="(slug: string) => emit('pick', slug)"
      />
    </div>
    <span id="coverage-map-end" />
    <p v-if="copy.mapHint" class="mt-3 flex items-start gap-2 text-[12.5px] leading-[1.5] text-on-dark-dim">
      <AppIcon name="info" :size="15" class="mt-0.5 text-violet-2" />{{ copy.mapHint }}
    </p>
    <div class="mt-3.5 flex gap-[18px] text-[12px] text-on-dark-dim">
      <span v-if="copy.legendCity" class="inline-flex items-center gap-1.5"><span class="h-[9px] w-[9px] rounded-full bg-coral" />{{ copy.legendCity }}</span>
      <span v-if="copy.legendVillage" class="inline-flex items-center gap-1.5"><span class="h-[9px] w-[9px] rounded-full bg-violet-2" />{{ copy.legendVillage }}</span>
    </div>
  </div>
</template>
