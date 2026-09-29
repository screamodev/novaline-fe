<script setup lang="ts">
import type { HomeVM } from '#shared/types/home'

const props = defineProps<{ copy: HomeVM['coverage'] }>()
const { t } = useI18n()
const route = useRoute()
const c = useCoverage()

const hint = computed(() => props.copy.hint?.replace('{count}', String(c.index.value.length)) ?? '')

// Deep link from locality pages: /?settlement=<slug>#coverage
const deepLink = typeof route.query.settlement === 'string' ? route.query.settlement : ''
if (deepLink) watch(c.index, (idx) => idx.length && !c.address.value.settlement && c.pickSettlement(deepLink), { immediate: true })
</script>

<template>
  <section id="coverage" class="section-anchor relative overflow-hidden bg-navy text-white" aria-labelledby="coverage-title">
    <div class="absolute inset-0 bg-glow-coverage" aria-hidden="true" />
    <div class="container-page relative py-[76px] max-sm:py-[52px]">
      <SectionHeading v-if="copy.heading" v-bind="copy.heading" dark heading-id="coverage-title" />

      <div class="mt-[34px] grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start gap-5 max-tab:grid-cols-1">
        <!-- Left: search + region → district → settlement (→ neighbourhood) -->
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
            />
          </div>
          <p v-if="hint" class="mt-4 flex items-center gap-2 text-[13px] text-on-dark-dim">
            <AppIcon name="info" :size="15" class="text-violet-2" />{{ hint }}
          </p>
        </div>

        <!-- Right: technology and plans for the chosen point -->
        <CoverageResult
          v-if="c.complete.value"
          :copy="copy"
          :offers="c.offers.value"
          :locality="c.resultLabel.value"
          :place="c.placeLabel.value"
          :settlement="c.entry.value"
          :neighbourhood="c.neighbourhood.value?.name"
          @change="c.reset"
        />
        <div
          v-else
          class="flex min-h-[220px] items-center gap-4 rounded-3xl border border-dashed border-white/[.22] p-[26px] text-[15px] leading-[1.6] text-on-dark-dim max-sm:p-5"
          role="status"
        >
          <AppIcon name="search" :size="26" class="shrink-0 text-violet-2" />
          <span>{{ c.needsNeighbourhood.value ? t('coverage.pickNeighbourhood') : t('coverage.placeholder') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
