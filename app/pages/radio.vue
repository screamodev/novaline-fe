<script setup lang="ts">
import type { RadioVM } from '#shared/types/radio'

definePageMeta({ layout: 'minimal' })
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { data: radio, error } = await useFetch<RadioVM>('/api/cms/radio', { key: 'cms-radio', query: { locale } })
if (error.value || !radio.value) throw createError({ statusCode: error.value?.statusCode ?? 503, statusMessage: 'Radio unavailable', fatal: true })

const [first, ...rest] = radio.value.title.split(' ')
useSeo(() => ({ ...radio.value?.seo, title: radio.value?.seo.title || radio.value?.title, noIndex: !radio.value?.indexable }))
</script>

<template>
  <div v-if="radio" class="relative min-h-screen overflow-hidden bg-radio-base text-on-dark">
    <NuxtImg v-if="radio.background" :src="radio.background.src" alt="" sizes="100vw" format="webp" class="absolute inset-0 h-full w-full object-cover" />
    <div class="absolute inset-0 bg-radio-bg" aria-hidden="true" />

    <div class="relative z-[2]">
      <header class="mx-auto flex max-w-[1080px] items-center justify-between px-7 py-[22px] max-sm:px-[18px] max-sm:py-4">
        <NuxtLink :to="localePath('/')" class="flex items-center gap-[11px]" aria-label="NovaLine">
          <span class="grid place-items-center rounded-xl bg-white px-[11px] py-2">
            <img src="/images/novaline-logo.svg" alt="NovaLine" width="45" height="40" class="block h-10 w-auto">
          </span>
        </NuxtLink>
        <NuxtLink
          :to="localePath('/')"
          class="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[.28] bg-white/[.06] px-[18px] py-2.5 text-[14px] font-semibold text-white hover:text-white"
        >
          <AppIcon name="arrowLeft" :size="15" :stroke-width="2.2" /><span class="max-sm:sr-only">{{ t('radio.back') }}</span>
        </NuxtLink>
      </header>

      <div class="mx-auto max-w-[1080px] px-7 pb-[90px] pt-10 max-sm:px-[18px] max-sm:pb-16 max-sm:pt-6">
        <div class="grid grid-cols-[1.05fr_.95fr] items-center gap-[52px] max-tab:grid-cols-1 max-tab:gap-[34px]">
          <div>
            <span class="inline-flex items-center gap-[9px] rounded-full border border-coral/40 bg-coral/[.18] px-[15px] py-2 text-[12.5px] font-bold tracking-[.04em] text-on-dark-pink">
              <span class="h-[9px] w-[9px] rounded-full bg-coral" aria-hidden="true" />{{ radio.liveLabel }}
            </span>
            <h1 class="mt-[22px] text-[clamp(40px,5.6vw,68px)] text-white max-sm:text-[clamp(34px,11vw,46px)]">
              {{ first }}<template v-if="rest.length"><br><span class="text-violet-2">{{ rest.join(' ') }}</span></template>
            </h1>
            <p class="mt-[18px] max-w-[420px] text-[17px] leading-[1.6] text-on-dark-muted">{{ radio.subtitle }}</p>
            <ul class="mt-[26px] flex flex-wrap gap-[9px]">
              <li v-for="g in radio.genres" :key="g" class="rounded-full border border-white/[.14] bg-white/[.08] px-3.5 py-2 text-[13px] font-semibold text-on-dark-label">{{ g }}</li>
            </ul>
          </div>
          <RadioPlayer :radio="radio" />
        </div>
        <p class="mt-[46px] text-center text-[13px] leading-[1.6] text-on-dark-footer">{{ radio.hint }}</p>
      </div>
    </div>
  </div>
</template>
