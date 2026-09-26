<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import type { CircleMarker, Map as LeafletMap } from 'leaflet'
import type { SettlementEntry } from '#shared/types/coverage'
import { palette } from '~/theme/colors'

const props = defineProps<{ index: SettlementEntry[]; selected: string; initialCenter?: [number, number] }>()
const emit = defineEmits<{ pick: [slug: string] }>()
const { tileUrl, attribution } = useRuntimeConfig().public.map

const el = ref<HTMLElement | null>(null)
let map: LeafletMap | null = null
const markers = new Map<string, CircleMarker>()
let flownTo = ''

const style = (s: SettlementEntry, on: boolean) => ({
  radius: on ? 11 : s.isRegionalCentre ? 8 : 5.5,
  weight: on ? 3 : s.isRegionalCentre ? 2 : 1.2,
  color: on ? palette.coral : palette.white,
  fillColor: on ? palette.white : s.isRegionalCentre ? palette.coral : palette.violet2,
  fillOpacity: 0.95,
  opacity: 0.9,
})

function sync() {
  if (!map) return
  for (const s of props.index) {
    const m = markers.get(s.slug)
    if (!m) continue
    const on = s.slug === props.selected
    m.setStyle(style(s, on))
    if (on) m.bringToFront()
  }
  const target = props.index.find((s) => s.slug === props.selected)
  if (target?.lat != null && target.lng != null && flownTo !== target.slug) {
    flownTo = target.slug
    map.flyTo([target.lat, target.lng], 11, { duration: 0.9 })
    markers.get(target.slug)?.openTooltip()
  }
  if (!props.selected) flownTo = ''
}

onMounted(async () => {
  const L = await import('leaflet')
  if (!el.value) return
  map = L.map(el.value, { zoomControl: true, scrollWheelZoom: false })
  if (props.initialCenter) {
    // Single-settlement mode: start focused, no fly-in animation.
    map.setView(props.initialCenter, 11)
    flownTo = props.selected
  } else {
    map.setView([49.85, 35.4], 7)
  }
  L.tileLayer(tileUrl, { maxZoom: 18, attribution }).addTo(map)
  for (const s of props.index) {
    if (s.lat == null || s.lng == null) continue
    const m = L.circleMarker([s.lat, s.lng], style(s, false)).addTo(map)
    m.bindTooltip(s.name, { direction: 'top', offset: [0, -6] })
    m.on('click', () => emit('pick', s.slug))
    markers.set(s.slug, m)
  }
  sync()
  if (props.initialCenter) markers.get(props.selected)?.openTooltip()
})
watch(() => [props.selected, props.index], sync)
onBeforeUnmount(() => {
  map?.remove()
  map = null
  markers.clear()
})
</script>

<template>
  <div ref="el" class="nl-map h-full w-full" />
</template>
