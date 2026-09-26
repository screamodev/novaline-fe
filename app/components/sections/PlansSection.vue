<script setup lang="ts">
import type { HomeVM, PlanSegment, PlanVM } from '#shared/types/home'
import { PLAN_SEGMENTS } from '#shared/types/home'

const props = defineProps<{ data: HomeVM['plans']; addons: HomeVM['addons'] }>()
const { t } = useI18n()
const fmt = useFormat()
const sectionLink = useSectionLink()
const { set: setLeadContext } = useLeadContext()

const segments = computed(() => PLAN_SEGMENTS.filter((s) => props.data.bySegment[s].length))
const active = ref<PlanSegment>(segments.value[0] ?? 'private')
const tabRefs = ref<HTMLButtonElement[]>([])

/** Arrow-key navigation per the WAI-ARIA tabs pattern. */
function onTabKey(e: KeyboardEvent, index: number) {
  const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (!step) return
  e.preventDefault()
  const next = (index + step + segments.value.length) % segments.value.length
  active.value = segments.value[next]!
  tabRefs.value[next]?.focus()
}

const order = (plan: PlanVM) => setLeadContext({ kind: 'plan', key: plan.key, label: `${plan.name} · ${plan.speedLabel}` })
</script>

<template>
  <section id="plans" class="section-anchor bg-plans-bg" aria-labelledby="plans-title">
    <div class="container-page reveal py-20 max-sm:py-[52px]">
      <div class="flex flex-wrap items-end justify-between gap-5">
        <SectionHeading v-if="data.heading" v-bind="data.heading" heading-id="plans-title" title-width="max-w-[600px]" subtitle-width="max-w-[480px]" />
        <div
          v-if="segments.length > 1"
          role="tablist"
          :aria-label="t('plans.tablist')"
          class="inline-flex flex-wrap rounded-full border border-line bg-white p-[5px]"
        >
          <button
            v-for="(segment, i) in segments"
            :id="`plans-tab-${segment}`"
            :key="segment"
            ref="tabRefs"
            type="button"
            role="tab"
            :aria-selected="active === segment"
            :aria-controls="`plans-panel-${segment}`"
            :tabindex="active === segment ? 0 : -1"
            class="whitespace-nowrap rounded-full px-4 py-[9px] text-[13.5px] font-bold transition duration-200"
            :class="active === segment ? 'bg-violet text-white' : 'text-muted hover:text-navy'"
            @click="active = segment"
            @keydown="onTabKey($event, i)"
          >
            {{ t(`plans.segments.${segment}`) }}
          </button>
        </div>
      </div>

      <!-- Every segment is server-rendered; inactive panels are only hidden. -->
      <div
        v-for="segment in segments"
        :id="`plans-panel-${segment}`"
        :key="segment"
        role="tabpanel"
        :aria-labelledby="`plans-tab-${segment}`"
        :hidden="active !== segment"
        class="mt-10 grid grid-cols-3 gap-[22px] max-tab:grid-cols-1"
        :class="active !== segment && '!hidden'"
      >
        <article
          v-for="plan in data.bySegment[segment]"
          :key="plan.key"
          class="relative rounded-[22px] p-8"
          :class="plan.popular ? 'bg-popular-card text-white shadow-popular' : 'border border-line bg-white'"
        >
          <span
            v-if="plan.popular"
            class="absolute right-[22px] top-[22px] rounded-full bg-coral px-3 py-[5px] text-[11px] font-bold text-white"
          >
            {{ t('common.popular') }}
          </span>
          <h3 class="font-display text-[15px] font-semibold tracking-[.02em]" :class="plan.popular ? 'text-on-dark-muted' : 'text-muted'">
            {{ plan.name }}
          </h3>
          <div class="mt-1.5 font-display text-[32px] font-bold" :class="plan.popular ? 'text-white' : 'text-navy'">
            {{ plan.speedLabel }}
          </div>
          <div class="mt-[18px] flex items-baseline gap-1.5">
            <span class="font-display text-[44px] font-extrabold leading-none" :class="plan.popular ? 'text-white' : 'text-violet'">
              {{ fmt.price(plan.price) }}
            </span>
            <span v-if="plan.price.amount !== null" class="text-[14px]" :class="plan.popular ? 'text-on-dark-dim' : 'text-muted'">
              {{ plan.periodLabel }}
            </span>
          </div>
          <div class="my-[22px] h-px" :class="plan.popular ? 'bg-line-dark' : 'bg-line'" />
          <ul class="flex flex-col gap-3">
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-start gap-2.5 text-[14px]"
              :class="plan.popular ? 'text-on-dark-feature' : 'text-ink'"
            >
              <AppIcon name="check" :size="18" :stroke-width="2.6" class="mt-px" :class="plan.popular ? 'text-violet-2' : 'text-coral'" />
              {{ feature }}
            </li>
          </ul>
          <NuxtLink
            :to="sectionLink('lead')"
            class="mt-[26px] flex justify-center rounded-xl py-3.5 text-[15px] font-bold"
            :class="plan.popular ? 'bg-coral text-white hover:text-white hover:brightness-110' : 'border-[1.5px] border-line bg-bg text-navy hover:border-violet hover:text-navy'"
            @click="order(plan)"
          >
            {{ t('common.order') }}
          </NuxtLink>
        </article>
      </div>

      <div
        v-if="data.connectionNote"
        class="mt-[22px] flex items-center gap-3 rounded-2xl border border-dashed border-violet bg-white px-6 py-[18px]"
      >
        <span class="text-[22px]" aria-hidden="true">🎁</span>
        <span class="text-[14.5px] font-semibold text-navy">{{ data.connectionNote }}</span>
      </div>

      <AddonsList v-if="addons.items.length" :data="addons" />
    </div>
  </section>
</template>
