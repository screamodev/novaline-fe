<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()
const notFound = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: () => (notFound.value ? t('error.notFoundTitle') : t('error.serverTitle')),
  robots: 'noindex, nofollow',
})
</script>

<template>
  <NuxtLayout>
    <section class="container-page flex min-h-[60vh] flex-col items-start justify-center py-[96px]">
      <span class="font-display text-[64px] font-extrabold leading-none text-violet">{{ error.statusCode }}</span>
      <h1 class="mt-5 text-h2 text-navy">{{ notFound ? t('error.notFoundTitle') : t('error.serverTitle') }}</h1>
      <p class="mt-4 max-w-[520px] text-[17px] leading-[1.6] text-muted">
        {{ notFound ? t('error.notFoundText') : t('error.serverText') }}
      </p>
      <BaseButton :to="localePath('/')" size="lg" class="mt-8" @click="clearError()">{{ t('error.home') }}</BaseButton>
    </section>
  </NuxtLayout>
</template>
