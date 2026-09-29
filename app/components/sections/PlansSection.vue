<script setup lang="ts">
import type { HomeVM, PlanVM } from '#shared/types/home'

defineProps<{ data: HomeVM['plans']; addons: HomeVM['addons'] }>()
const { t } = useI18n()
const fmt = useFormat()
const sectionLink = useSectionLink()
const { openOrder } = useOrderDialog()
const c = useCoverage()

const place = computed(() => c.entry.value?.nameLocative ?? c.placeLabel.value)
const order = (plan: PlanVM) => openOrder({ context: { kind: 'plan', key: plan.key, label: `${plan.name} · ${plan.speedLabel}` } })

/** Scroll to the coverage check and put the cursor into its search box. */
async function chooseLocality() {
  await navigateTo(sectionLink('coverage'))
  await nextTick()
  document.querySelector<HTMLInputElement>('#coverage [data-coverage-search]')?.focus({ preventScroll: true })
}
</script>

<template>
  <section id="plans" class="section-anchor bg-plans-bg" aria-labelledby="plans-title">
    <div class="container-page reveal py-20 max-sm:py-[52px]">
      <SectionHeading v-if="data.heading" v-bind="data.heading" heading-id="plans-title" title-width="max-w-[600px]" subtitle-width="max-w-[560px]" />

      <!-- Home plans depend on the locality: shown only once it is chosen (shared state with the coverage check). -->
      <div class="mt-10">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <h3 class="text-[22px] font-bold text-navy">
            {{ c.complete.value ? t('plansHome.for', { place }) : t('plansHome.title') }}
          </h3>
          <button
            v-if="c.complete.value"
            type="button"
            class="rounded-full border border-line bg-white px-[15px] py-[9px] text-[13px] font-semibold text-muted hover:text-navy"
            @click="chooseLocality"
          >
            {{ t('plansHome.change') }}
          </button>
        </div>
        <OfferCards
          v-if="c.complete.value"
          class="mt-5"
          :offers="c.offers.value"
          :place="c.placeLabel.value"
          :settlement="c.entry.value?.slug"
          :neighbourhood="c.neighbourhood.value?.name"
          title-tag="h4"
        />
        <div v-else class="mt-5 flex flex-wrap items-center justify-between gap-5 rounded-[22px] border border-line bg-white p-7 max-sm:p-5">
          <p class="max-w-[620px] text-[15.5px] leading-[1.6] text-ink">{{ t('plansHome.lead') }}</p>
          <BaseButton class="!rounded-[14px]" @click="chooseLocality">
            {{ t('plansHome.cta') }}<AppIcon name="arrowRight" :size="17" :stroke-width="2.4" />
          </BaseButton>
        </div>
      </div>

      <!-- Business terms are uniform, so they stay static. -->
      <div v-if="data.business.length" class="mt-14">
        <h3 class="text-[22px] font-bold text-navy">{{ t('plansHome.business') }}</h3>
        <div class="mt-5 grid grid-cols-3 gap-[22px] max-tab:grid-cols-1">
          <article
            v-for="plan in data.business"
            :key="plan.key"
            class="relative flex flex-col rounded-[22px] p-8"
            :class="plan.popular ? 'bg-popular-card text-white shadow-popular' : 'border border-line bg-white'"
          >
            <span
              v-if="plan.popular"
              class="absolute right-[22px] top-[22px] rounded-full bg-coral-strong px-3 py-[5px] text-[11px] font-bold text-white"
            >
              {{ t('common.popular') }}
            </span>
            <h4 class="text-[15px] font-semibold tracking-[.02em]" :class="plan.popular ? 'text-on-dark-muted' : 'text-muted'">
              {{ plan.name }}
            </h4>
            <div class="mt-1.5 text-[30px] font-extrabold" :class="plan.popular ? 'text-white' : 'text-navy'">
              {{ plan.speedLabel }}
            </div>
            <div class="mt-[18px] flex items-baseline gap-1.5">
              <span class="text-[40px] font-extrabold leading-none" :class="plan.popular ? 'text-white' : 'text-violet'">
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
            <div class="mt-auto pt-[26px]">
              <button
                type="button"
                class="flex w-full justify-center rounded-xl py-3.5 text-[15px] font-bold"
                :class="plan.popular ? 'bg-coral-strong text-white hover:brightness-110' : 'border-[1.5px] border-line bg-bg text-navy hover:border-violet'"
                @click="order(plan)"
              >
                {{ t('common.order') }}
              </button>
            </div>
          </article>
        </div>
      </div>

      <AddonsList v-if="addons.items.length" :data="addons" />
    </div>
  </section>
</template>
