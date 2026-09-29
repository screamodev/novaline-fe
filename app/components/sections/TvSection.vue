<script setup lang="ts">
import type { HomeVM, TvPackageVM, TvTier } from '#shared/types/home'

const props = defineProps<{ data: HomeVM['tv'] }>()
const { t } = useI18n()
const fmt = useFormat()
const sectionLink = useSectionLink()
const { data: global } = useGlobal()
const { openOrder } = useOrderDialog()

const category = ref('')
/** On phones the full list is long; show the first MOBILE_LIMIT channels until expanded (all stay in the HTML). */
const MOBILE_LIMIT = 12
const expanded = ref(false)
const visibleChannels = computed(() => props.data.channels.filter((c) => isVisible(c.categoryKey)))
const isVisible = (categoryKey: string) => !category.value || category.value === categoryKey
const chipDots = ['bg-violet', 'bg-coral', 'bg-violet-2']
const TIER_CLASS: Record<TvTier, string> = {
  min: 'bg-success-soft text-success-ink',
  mid: 'bg-violet-soft text-violet',
  max: 'bg-coral-soft text-coral-strong',
}
const categories = computed(() => [{ key: '', name: t('tv.all') }, ...props.data.categories])
const order = (p: TvPackageVM) => openOrder({ context: { kind: 'tv', key: p.key, label: p.name } })
</script>

<template>
  <section id="tv" class="section-anchor bg-bg" aria-labelledby="tv-title">
    <div class="container-page reveal py-[84px] max-sm:py-[52px]">
      <SectionHeading v-if="data.heading" v-bind="data.heading" heading-id="tv-title" title-width="max-w-[680px]" />

      <ul v-if="data.chips.length" class="mt-[22px] flex flex-wrap gap-3">
        <li
          v-for="(chip, i) in data.chips"
          :key="chip"
          class="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-[9px] text-[13.5px] font-semibold text-navy"
        >
          <span class="h-[7px] w-[7px] rounded-full" :class="chipDots[i % chipDots.length]" aria-hidden="true" />{{ chip }}
        </li>
      </ul>

      <div class="mt-9 grid grid-cols-3 gap-[22px] max-lg:grid-cols-2 max-md:grid-cols-1">
        <article
          v-for="pkg in data.packages"
          :key="pkg.key"
          class="relative flex flex-col rounded-[22px] p-8"
          :class="pkg.popular ? 'bg-popular-card text-white shadow-popular' : 'border border-line bg-white'"
        >
          <span v-if="pkg.popular" class="absolute right-[22px] top-[22px] rounded-full bg-coral-strong px-3 py-[5px] text-[11px] font-bold text-white">
            {{ t('common.popular') }}
          </span>
          <h3 class="font-display text-[20px] font-semibold" :class="pkg.popular ? 'text-white' : 'text-navy'">{{ pkg.name }}</h3>
          <div class="mt-[18px] font-display text-[40px] font-extrabold leading-none" :class="pkg.popular ? 'text-white' : 'text-violet'">
            {{ pkg.channelsLabel }}
          </div>
          <div class="text-[13px]" :class="pkg.popular ? 'text-on-dark-dim' : 'text-muted'">{{ t('tv.channelsIn') }}</div>
          <div class="mt-4 flex items-baseline gap-1.5">
            <span class="font-display text-[34px] font-extrabold" :class="pkg.popular ? 'text-white' : 'text-navy'">{{ fmt.amount(pkg.price) }}</span>
            <span class="text-[13px]" :class="pkg.popular ? 'text-on-dark-dim' : 'text-muted'">{{ global?.perMonthLabel }}</span>
          </div>
          <div class="my-5 h-px" :class="pkg.popular ? 'bg-line-dark' : 'bg-line'" />
          <ul class="flex flex-col gap-[11px]">
            <li
              v-for="feature in pkg.features"
              :key="feature"
              class="flex items-start gap-2.5 text-[14px]"
              :class="pkg.popular ? 'text-on-dark-feature' : 'text-ink'"
            >
              <AppIcon name="check" :size="17" :stroke-width="2.6" class="mt-px" :class="pkg.popular ? 'text-violet-2' : 'text-coral'" />
              {{ feature }}
            </li>
          </ul>
          <div class="mt-auto pt-6">
            <button
              type="button"
              class="flex w-full justify-center rounded-xl py-3.5 text-[15px] font-bold"
              :class="pkg.popular ? 'bg-coral-strong text-white hover:brightness-110' : 'border-[1.5px] border-line bg-bg text-navy hover:border-violet'"
              @click="order(pkg)"
            >
              {{ t('tv.order') }}
            </button>
          </div>
        </article>
      </div>

      <div v-if="data.channels.length" class="mt-10 rounded-[22px] border border-line bg-white p-[30px] max-sm:p-5">
        <h3 class="font-display text-[21px] font-bold text-navy">{{ data.channelsTitle }}</h3>
        <p v-if="data.channelsSubtitle" class="mt-2 text-[14.5px] text-muted">{{ data.channelsSubtitle }}</p>
        <div class="mt-5 flex flex-wrap gap-[9px]" role="group" :aria-label="t('tv.filter')">
          <button
            v-for="c in categories"
            :key="c.key"
            type="button"
            :aria-pressed="category === c.key"
            class="whitespace-nowrap rounded-full px-4 py-[9px] text-[13.5px] font-semibold max-sm:min-h-11"
            :class="category === c.key ? 'bg-violet text-white' : 'border border-line bg-white text-muted hover:text-navy'"
            @click="category = c.key"
          >
            {{ c.name }}
          </button>
        </div>
        <!-- All channels are server-rendered; the filter only hides them. -->
        <ul class="mt-[22px] grid grid-cols-4 gap-2.5 max-lg:grid-cols-2 max-md:grid-cols-1">
          <li
            v-for="ch in data.channels"
            v-show="isVisible(ch.categoryKey)"
            :key="ch.key"
            class="flex items-center justify-between gap-2.5 rounded-xl bg-bg px-3.5 py-3"
            :class="!expanded && visibleChannels.indexOf(ch) >= MOBILE_LIMIT && 'max-md:hidden'"
          >
            <span class="truncate text-[14px] font-bold text-navy">{{ ch.name }}</span>
            <span class="whitespace-nowrap rounded-full px-2 py-[3px] text-[10.5px] font-bold" :class="TIER_CLASS[ch.tier]">
              {{ t(`tv.tiers.${ch.tier}`) }}
            </span>
          </li>
        </ul>
        <button
          v-if="!expanded && visibleChannels.length > MOBILE_LIMIT"
          type="button"
          class="mt-3 hidden min-h-11 w-full rounded-xl border-[1.5px] border-line text-[14px] font-bold text-navy max-md:block"
          @click="expanded = true"
        >
          {{ t('tv.showAll', { count: visibleChannels.length }) }}
        </button>
        <p v-if="data.channelsNote" class="mt-[18px] text-[12.5px] text-muted">{{ data.channelsNote }}</p>
      </div>
    </div>
  </section>
</template>
