<script setup lang="ts">
import type { HomeVM } from '#shared/types/home'

defineProps<{ hero: HomeVM['hero'] }>()
const { t } = useI18n()
const sectionLink = useSectionLink()
const { set: setLeadContext } = useLeadContext()
</script>

<template>
  <section class="relative overflow-hidden bg-bg-hero" aria-labelledby="hero-title">
    <NuxtImg
      v-if="hero.image"
      :src="hero.image.src"
      :alt="hero.image.alt"
      :width="hero.image.width ?? 1400"
      sizes="xs:100vw sm:100vw md:66vw lg:66vw xl:66vw"
      format="webp"
      :preload="{ fetchPriority: 'high' }"
      fetchpriority="high"
      class="absolute inset-y-0 right-0 h-full w-auto max-w-[66%] object-cover object-center max-tab:max-w-full"
    />
    <div class="absolute inset-0 bg-hero-scrim max-tab:bg-hero-scrim-mobile" aria-hidden="true" />
    <div class="absolute inset-0 bg-hero-glow" aria-hidden="true" />

    <div
      class="container-page relative flex min-h-[600px] items-center pb-[104px] pt-24 max-tab:min-h-[540px] max-tab:pb-20 max-tab:pt-[70px] max-sm:pt-11"
    >
      <div class="max-w-[560px]">
        <span
          v-if="hero.kicker"
          class="inline-flex items-center gap-[9px] rounded-full bg-white px-[15px] py-2 text-[13px] font-bold tracking-[.02em] text-violet shadow-chip"
        >
          <span class="h-2 w-2 rounded-full bg-violet" aria-hidden="true" />{{ hero.kicker }}
        </span>
        <h1 id="hero-title" class="mt-[22px] text-h1 text-navy">
          {{ hero.titleLine1 }}<template v-if="hero.titleLine2"><br><span class="text-violet">{{ hero.titleLine2 }}</span></template>
        </h1>
        <p v-if="hero.subtitle" class="mt-5 max-w-[460px] text-[18px] leading-[1.6] text-muted">{{ hero.subtitle }}</p>
        <div
          v-if="hero.promoText"
          class="mt-[22px] inline-flex items-center gap-2.5 rounded-[14px] border border-line bg-white px-4 py-3 shadow-card"
        >
          <span class="text-[22px]" aria-hidden="true">🎁</span>
          <span class="text-[14.5px] font-bold text-navy">{{ hero.promoText }}</span>
        </div>
        <div class="mt-[26px] flex flex-wrap gap-3.5">
          <BaseButton v-if="hero.primaryCta" :to="sectionLink('coverage')" size="lg" class="!rounded-[14px]">
            {{ hero.primaryCta }}<AppIcon name="arrowRight" :size="18" :stroke-width="2.4" />
          </BaseButton>
          <BaseButton
            v-if="hero.secondaryCta"
            :to="sectionLink('lead')"
            variant="white"
            size="lg"
            class="!rounded-[14px]"
            @click="setLeadContext({ kind: 'consultation', key: 'hero', label: hero.secondaryCta })"
          >
            {{ hero.secondaryCta }}
          </BaseButton>
        </div>
      </div>

      <div
        v-if="hero.speedValue"
        class="absolute bottom-9 right-7 flex items-center gap-3 rounded-2xl bg-white px-[18px] py-3.5 shadow-float max-sm:hidden"
        :aria-label="t('hero.speedAlt')"
      >
        <span class="grid h-11 w-11 place-items-center rounded-xl bg-grad-violet text-white">
          <AppIcon name="bolt" :size="22" :stroke-width="2.2" />
        </span>
        <div>
          <div class="font-display text-[19px] font-bold leading-none text-navy">
            {{ hero.speedValue }} <span class="text-[13px] text-muted">{{ hero.speedUnit }}</span>
          </div>
          <div class="mt-0.5 text-[12px] text-muted">{{ hero.speedCaption }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
