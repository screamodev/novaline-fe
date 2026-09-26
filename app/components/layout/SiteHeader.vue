<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const sectionLink = useSectionLink()
const hidden = useHiddenSections()
const visible = <T extends SectionId>(ids: readonly T[]) => ids.filter((id) => !hidden.value.includes(id))
const { data: global } = useGlobal()
const menuOpen = useMobileMenu()
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line bg-header backdrop-blur-[14px]">
    <div class="container-page flex items-center gap-7 py-3">
      <BrandLogo :tagline="global?.taglineLines" />

      <nav :aria-label="t('a11y.mainNav')" class="ml-auto hidden items-center gap-[19px] text-[14px] font-semibold xl:flex">
        <NuxtLink v-for="id in visible(NAV_PRIMARY)" :key="id" :to="sectionLink(id)" class="whitespace-nowrap text-ink hover:text-coral">
          {{ t(`nav.${id}`) }}
        </NuxtLink>
        <MoreMenu />
        <NuxtLink :to="localePath('/radio')" class="inline-flex items-center gap-[7px] font-bold text-coral-strong hover:text-coral-strong">
          <span class="grid h-[22px] w-[22px] place-items-center rounded-full bg-coral-strong text-white">
            <AppIcon name="play" :size="10" />
          </span>
          {{ t('nav.radio') }}
        </NuxtLink>
      </nav>

      <BaseButton :to="sectionLink('lead')" variant="coral" pill class="hidden shrink-0 !text-[14.5px] xl:inline-flex">
        {{ t('cta.order') }}
      </BaseButton>

      <button
        type="button"
        class="ml-auto inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px] border border-line bg-white text-navy xl:hidden"
        :aria-label="t('menu.open')"
        :aria-expanded="menuOpen"
        aria-controls="mobile-drawer"
        @click="menuOpen = true"
      >
        <AppIcon name="burger" :size="22" :stroke-width="2.2" />
      </button>
    </div>
  </header>
</template>
