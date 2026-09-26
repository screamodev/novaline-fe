<script setup lang="ts">
// Placeholder for #coverage until feature 004 (search, cascading selects, map) lands.
import type { HeadingVM } from '#shared/types/home'

defineProps<{ heading: HeadingVM | null }>()
const { t } = useI18n()
const sectionLink = useSectionLink()
const { data: global } = useGlobal()
</script>

<template>
  <section id="coverage" class="section-anchor relative overflow-hidden bg-navy text-white" aria-labelledby="coverage-title">
    <div class="absolute inset-0 bg-glow-coverage" aria-hidden="true" />
    <div class="container-page reveal relative py-[76px] max-sm:py-[52px]">
      <SectionHeading v-if="heading" v-bind="heading" dark heading-id="coverage-title" />
      <p class="mt-4 max-w-[600px] text-[15px] leading-[1.6] text-on-dark-dim">{{ t('coverage.teaserText') }}</p>
      <div class="mt-7 flex flex-wrap gap-3.5">
        <BaseButton :to="sectionLink('lead')" size="lg" class="!rounded-[14px]">
          {{ t('coverage.cta') }}<AppIcon name="arrowRight" :size="18" :stroke-width="2.4" />
        </BaseButton>
        <BaseButton v-if="global?.phones[0]" :href="`tel:${global.phones[0].tel}`" variant="white" size="lg" class="!rounded-[14px]">
          <AppIcon name="phone" :size="18" />{{ global.phones[0].display }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>
