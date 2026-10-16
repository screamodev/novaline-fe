<script setup lang="ts">
import type { HeroSlideVM } from '#shared/types/home'

/** One hero banner. The first slide renders the page `<h1>` and owns the LCP image. */
const props = defineProps<{ slide: HeroSlideVM; first: boolean; animate: boolean }>()
const { t } = useI18n()

const dark = computed(() => props.slide.theme !== 'light')
/** Order requests name the offer itself; the legacy hero keeps the button label ("Отримати консультацію"). */
const context = computed(() => {
  const legacy = props.slide.key === 'hero'
  const label = legacy ? '' : [props.slide.title, props.slide.titleAccent].filter(Boolean).join(' ')
  return { kind: legacy ? 'consultation' : 'promo', key: props.slide.key, label } as const
})
const THEMES = {
  light: 'bg-bg-hero text-navy',
  violet: 'bg-slide-violet text-white',
  navy: 'bg-slide-navy text-white',
} as const
</script>

<template>
  <div class="relative h-full overflow-hidden rounded-[28px]" :class="THEMES[slide.theme]">
    <!-- Background: photo with a readable scrim, or decorative glow + rings for photo-less slides. -->
    <template v-if="slide.image">
      <NuxtImg
        :src="slide.image.src"
        :alt="slide.image.alt"
        :width="slide.image.width ?? 1400"
        sizes="xs:100vw sm:100vw md:70vw lg:70vw xl:860px"
        format="webp"
        :loading="first ? 'eager' : 'lazy'"
        :preload="first ? { fetchPriority: 'high' } : false"
        :fetchpriority="first ? 'high' : 'auto'"
        class="absolute inset-y-0 right-0 h-full w-auto max-w-[70%] object-cover object-center max-tab:max-w-full"
      />
      <div v-if="!dark" class="absolute inset-0 bg-hero-scrim max-tab:bg-hero-scrim-mobile" aria-hidden="true" />
      <div v-else class="absolute inset-0 bg-overlay max-tab:bg-overlay" aria-hidden="true" />
    </template>
    <div class="absolute inset-0" :class="dark ? 'bg-slide-glow' : 'bg-hero-glow'" aria-hidden="true" />

    <div
      v-if="!slide.image && slide.highlight"
      class="pointer-events-none absolute right-[6%] top-1/2 grid h-[400px] w-[400px] -translate-y-1/2 place-items-center rounded-full border max-lg:h-[320px] max-lg:w-[320px] max-tab:hidden"
      :class="dark ? 'border-line-dark' : 'border-line'"
      aria-hidden="true"
    >
      <div class="grid h-[74%] w-[74%] place-items-center rounded-full border" :class="dark ? 'border-line-dark bg-glass' : 'border-line bg-white'">
        <div class="text-center">
          <div class="font-display text-[clamp(64px,8vw,112px)] font-extrabold leading-none tracking-[-0.04em]">
            {{ slide.highlight.value }}<span v-if="slide.highlight.unit" class="ml-1 text-[0.32em] font-bold tracking-normal">{{ slide.highlight.unit }}</span>
          </div>
          <div v-if="slide.highlight.caption" class="mt-2 text-[15px] font-semibold" :class="dark ? 'text-on-dark-soft' : 'text-muted'">
            {{ slide.highlight.caption }}
          </div>
        </div>
      </div>
    </div>

    <div class="relative flex h-full items-center px-14 pb-[120px] pt-16 max-lg:px-10 max-tab:pb-[112px] max-tab:pt-12 max-sm:px-5 max-sm:pt-9">
      <div class="max-w-[560px]" :class="animate && 'animate-rise'">
        <span
          v-if="slide.kicker"
          class="inline-flex items-center gap-[9px] rounded-full px-[15px] py-2 text-[13px] font-bold tracking-[.02em] shadow-chip"
          :class="dark ? 'bg-glass-strong text-white' : 'bg-white text-violet'"
        >
          <span class="h-2 w-2 rounded-full" :class="dark ? 'bg-coral' : 'bg-violet'" aria-hidden="true" />{{ slide.kicker }}
        </span>
        <component :is="first ? 'h1' : 'h2'" class="mt-[22px] text-h1">
          {{ slide.title }}<template v-if="slide.titleAccent"><br><span :class="dark ? 'text-on-dark-pink' : 'text-violet'">{{ slide.titleAccent }}</span></template>
        </component>
        <p v-if="slide.subtitle" class="mt-5 max-w-[470px] text-[18px] leading-[1.6] max-sm:text-[16px]" :class="dark ? 'text-on-dark' : 'text-muted'">
          {{ slide.subtitle }}
        </p>
        <div v-if="slide.primaryCta || slide.secondaryCta" class="mt-[26px] flex flex-wrap gap-3.5">
          <CtaButton v-if="slide.primaryCta" :cta="slide.primaryCta" :context="context" />
          <CtaButton v-if="slide.secondaryCta" :cta="slide.secondaryCta" :context="context" />
        </div>
      </div>
    </div>

    <!-- Photo slides: the highlight is a floating chip (the old speed badge). -->
    <div
      v-if="slide.image && slide.highlight"
      class="absolute right-8 top-8 flex items-center gap-3 rounded-2xl bg-white px-[18px] py-3.5 shadow-float max-sm:hidden"
      :aria-label="t('hero.speedAlt')"
    >
      <span class="grid h-11 w-11 place-items-center rounded-xl bg-grad-violet text-white">
        <AppIcon name="bolt" :size="22" :stroke-width="2.2" />
      </span>
      <div>
        <div class="font-display text-[19px] font-bold leading-none text-navy">
          {{ slide.highlight.value }} <span class="text-[13px] text-muted">{{ slide.highlight.unit }}</span>
        </div>
        <div v-if="slide.highlight.caption" class="mt-0.5 text-[12px] text-muted">{{ slide.highlight.caption }}</div>
      </div>
    </div>
  </div>
</template>
