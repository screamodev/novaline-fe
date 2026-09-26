<script setup lang="ts">
import type { HomeVM, PlanVM } from '#shared/types/home'

const props = defineProps<{ copy: HomeVM['coverage']; plans: PlanVM[] }>()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()
const { track } = useAnalytics()
const c = useCoverage()
const leadAddress = useLeadAddress()
const leadType = useLeadType()

const coveragePlans = computed(() => props.plans.filter((p) => p.availableForCoverage))
const hint = computed(() => props.copy.hint?.replace('{count}', String(c.index.value.length)) ?? '')

// Deep link from locality pages: /?settlement=<slug>#coverage
const deepLink = typeof route.query.settlement === 'string' ? route.query.settlement : ''
if (deepLink) watch(c.index, (idx) => idx.length && !c.address.value.settlement && c.pickSettlement(deepLink), { immediate: true })

function goLead() {
  leadAddress.value = { ...c.address.value }
  leadType.value = 'connect'
  track('coverage_lead_click', { settlement: c.address.value.settlement })
  router.push({ path: localePath('/'), hash: '#lead' })
}

// The map (Leaflet + tiles) loads only when the panel scrolls into view.
const mapShell = ref<HTMLElement | null>(null)
const mapVisible = ref(false)
onMounted(() => {
  if (!mapShell.value) return
  const io = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting) {
      mapVisible.value = true
      io.disconnect()
    }
  }, { rootMargin: '200px' })
  io.observe(mapShell.value)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <section id="coverage" class="section-anchor relative overflow-hidden bg-navy text-white" aria-labelledby="coverage-title">
    <div class="absolute inset-0 bg-glow-coverage" aria-hidden="true" />
    <div class="container-page relative py-[76px] max-sm:py-[52px]">
      <SectionHeading v-if="copy.heading" v-bind="copy.heading" dark heading-id="coverage-title" />

      <div class="mt-[34px] grid grid-cols-2 items-start gap-5 max-tab:grid-cols-1">
        <!-- Left: search + cascading selects + result -->
        <div class="rounded-3xl border border-line-dark bg-glass p-[26px] backdrop-blur-[8px] max-sm:p-5">
          <div class="flex flex-col gap-3.5">
            <CoverageSearch :index="c.index.value" @pick="c.pickSettlement" />
            <div class="my-0.5 flex items-center gap-3" aria-hidden="true">
              <span class="h-px flex-1 bg-white/[.16]" />
              <span class="text-[11.5px] font-semibold uppercase tracking-[.04em] text-on-dark-faint">{{ t('coverage.searchOr') }}</span>
              <span class="h-px flex-1 bg-white/[.16]" />
            </div>
            <CoverageSelect
              :model-value="c.address.value.region"
              :label="t('coverage.region')"
              :placeholder="t('coverage.selectRegion')"
              :options="c.options.value.regions"
              @update:model-value="c.setRegion"
            />
            <CoverageSelect
              :model-value="c.address.value.district"
              :label="t('coverage.district')"
              :placeholder="t('coverage.selectDistrict')"
              :options="c.options.value.districts"
              :disabled="!c.address.value.region"
              @update:model-value="c.setDistrict"
            />
            <CoverageSelect
              :model-value="c.address.value.settlement"
              :label="t('coverage.settlement')"
              :placeholder="t('coverage.selectSettlement')"
              :options="c.options.value.settlements"
              :disabled="!c.address.value.district"
              @update:model-value="c.setSettlement"
            />
            <CoverageSelect
              v-if="c.needsNeighbourhood.value"
              class="animate-rise"
              :model-value="c.address.value.neighbourhood"
              :label="t('coverage.neighbourhood')"
              :placeholder="t('coverage.selectNeighbourhood')"
              :options="c.options.value.neighbourhoods"
              @update:model-value="c.setNeighbourhood"
            >
              <template #note>
                <span class="rounded-full bg-violet-2/[.16] px-2 py-0.5 text-[10.5px] font-semibold text-violet-2">{{ t('coverage.neighbourhoodNote') }}</span>
              </template>
            </CoverageSelect>
            <button
              type="button"
              class="mt-1 rounded-xl py-[15px] text-[15.5px] font-bold text-white transition-colors"
              :class="c.canCheck.value ? 'bg-violet hover:brightness-110' : 'cursor-not-allowed bg-white/[.16]'"
              :disabled="!c.canCheck.value"
              @click="c.check"
            >
              {{ t('coverage.check') }}
            </button>
          </div>

          <CoverageResult
            v-if="c.resultShown.value"
            :copy="copy"
            :plans="coveragePlans"
            :locality="c.resultLabel.value"
            :modifier="c.modifier.value"
            @change="c.reset"
            @lead="goLead"
          />

          <p v-if="hint" class="mt-4 flex items-center gap-2 text-[13px] text-on-dark-dim">
            <AppIcon name="info" :size="15" class="text-violet-2" />{{ hint }}
          </p>
        </div>

        <!-- Right: coverage map -->
        <div class="relative overflow-hidden rounded-3xl border border-line-dark bg-map-panel p-[22px] max-sm:p-4">
          <div class="flex items-center justify-between gap-3">
            <h3 class="font-display text-[14px] font-semibold text-white">{{ copy.mapTitle }}</h3>
            <span
              v-if="copy.nodesCount"
              class="rounded-full border border-coral/40 bg-coral/20 px-[11px] py-[5px] text-[11.5px] font-bold text-white"
            >
              {{ copy.nodesCount }}+ {{ copy.nodesLabel }}
            </span>
          </div>
          <div ref="mapShell" class="relative z-[1] mt-4 h-[380px] overflow-hidden rounded-2xl border border-line-dark bg-navy-deep max-sm:h-[300px]">
            <a href="#coverage-map-end" class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[500] focus:rounded-lg focus:bg-white focus:px-3 focus:py-1.5 focus:text-navy">
              {{ t('coverage.mapSkip') }}
            </a>
            <LazyCoverageMapCanvas
              v-if="mapVisible"
              :index="c.index.value"
              :selected="c.address.value.settlement"
              @pick="c.pickSettlement"
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
      </div>
    </div>
  </section>
</template>
