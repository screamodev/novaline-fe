<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { data: global } = useGlobal()
</script>

<template>
  <div class="bg-navy text-on-dark">
    <div
      class="container-page flex h-11 items-center justify-between gap-5 text-[13px] font-medium max-sm:h-auto max-sm:flex-wrap max-sm:gap-y-1.5 max-sm:py-2"
    >
      <div class="flex flex-wrap items-center gap-x-[18px] gap-y-2 text-on-dark-soft max-sm:gap-x-2.5 max-sm:text-[12px]">
        <span
          v-if="global?.phones.some((p) => p.viber)"
          class="grid h-5 w-5 place-items-center rounded-md bg-viber text-white"
          :title="t('topbar.viber')"
        >
          <AppIcon name="viber" :size="12" />
        </span>
        <a
          v-for="phone in global?.phones"
          :key="phone.tel"
          :href="`tel:${phone.tel}`"
          :class="['tap-target', phone.primary ? 'font-semibold text-on-dark hover:text-white' : 'text-on-dark-soft hover:text-white']"
        >
          {{ phone.display }}
        </a>
      </div>
      <div class="flex items-center gap-2 max-sm:gap-1.5">
        <NuxtLink
          :to="localePath('/radio')"
          class="tap-target inline-flex items-center gap-[7px] rounded-full border border-glass-line px-3 py-[5px] font-semibold text-on-dark hover:text-white max-[400px]:hidden"
        >
          <AppIcon name="play" :size="13" />{{ t('nav.radio') }}
        </NuxtLink>
        <a
          v-if="global?.cabinetUrl"
          :href="global.cabinetUrl"
          target="_blank"
          rel="noopener"
          class="tap-target inline-flex items-center gap-[7px] whitespace-nowrap rounded-full bg-white px-[15px] py-[7px] font-bold text-navy shadow-pill hover:text-navy"
        >
          <AppIcon name="key" :size="14" :stroke-width="2.2" class="text-violet" />{{ t('topbar.cabinet') }}
        </a>
        <LangSwitch />
      </div>
    </div>
  </div>
</template>
