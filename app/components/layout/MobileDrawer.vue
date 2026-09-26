<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const sectionLink = useSectionLink()
const hidden = useHiddenSections()
const visible = <T extends SectionId>(ids: readonly T[]) => ids.filter((id) => !hidden.value.includes(id))
const { data: global } = useGlobal()
const open = useMobileMenu()
const panel = ref<HTMLElement | null>(null)
const close = () => (open.value = false)

useFocusTrap(panel, open, close)
// Close when navigating (e.g. choosing a section link).
const route = useRoute()
watch(() => route.fullPath, close)
</script>

<template>
  <Teleport to="body">
    <template v-if="open">
      <div class="fixed inset-0 z-[90] bg-overlay backdrop-blur-[3px]" aria-hidden="true" @click="close" />
      <div
        id="mobile-drawer"
        ref="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-drawer-title"
        class="fixed bottom-0 right-0 top-0 z-[91] w-[min(390px,92vw)] animate-rise overflow-y-auto bg-white px-6 pb-[30px] pt-[22px] shadow-drawer"
      >
        <div class="flex items-center justify-between gap-4">
          <span id="mobile-drawer-title" class="font-display text-[16px] font-bold text-navy">{{ t('menu.title') }}</span>
          <button
            type="button"
            :aria-label="t('menu.close')"
            class="grid h-11 w-11 place-items-center rounded-xl border border-line bg-white text-navy"
            @click="close"
          >
            <AppIcon name="close" :size="20" :stroke-width="2.3" />
          </button>
        </div>

        <nav :aria-label="t('a11y.mainNav')" class="mt-3.5 flex flex-col">
          <NuxtLink
            v-for="id in visible([...NAV_PRIMARY, ...NAV_MORE])"
            :key="id"
            :to="sectionLink(id)"
            class="flex min-h-11 items-center justify-between border-b border-line px-1 py-4 text-[16.5px] font-bold text-navy hover:text-violet"
            @click="close"
          >
            {{ t(`nav.${id}`) }}<span class="text-violet" aria-hidden="true">→</span>
          </NuxtLink>
          <NuxtLink
            :to="localePath('/radio')"
            class="flex min-h-11 items-center justify-between border-b border-line px-1 py-4 text-[16.5px] font-bold text-coral-strong hover:text-coral-strong"
          >
            {{ t('nav.radio') }}<span aria-hidden="true">→</span>
          </NuxtLink>
        </nav>

        <div class="mt-[22px]">
          <div class="text-[12px] font-bold uppercase tracking-[.06em] text-muted">{{ t('menu.phones') }}</div>
          <div class="mt-2.5 flex flex-col gap-0.5">
            <a
              v-for="phone in global?.phones"
              :key="phone.tel"
              :href="`tel:${phone.tel}`"
              class="flex min-h-11 items-center text-[16px] font-bold text-navy"
            >
              {{ phone.display }}
            </a>
          </div>
        </div>

        <BaseButton :to="sectionLink('lead')" variant="coral" size="lg" block class="mt-[18px] !rounded-[14px] !shadow-none" @click="close">
          {{ t('cta.order') }}
        </BaseButton>
      </div>
    </template>
  </Teleport>
</template>
