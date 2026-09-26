<script setup lang="ts">
import type { SocialNetwork } from '#shared/types/cms'

const { t } = useI18n()
const localePath = useLocalePath()
const sectionLink = useSectionLink()
const hidden = useHiddenSections()
const visible = <T extends SectionId>(ids: readonly T[]) => ids.filter((id) => !hidden.value.includes(id))
const { data: global } = useGlobal()

const FOOTER_SECTIONS = ['coverage', 'plans', 'tv', 'promos', 'news', 'datacenter', 'shop', 'payment'] as const
const SOCIAL_ICON: Record<SocialNetwork, IconName> = {
  instagram: 'instagram',
  telegram: 'telegram',
  facebook: 'facebook',
  youtube: 'youtube',
  viber: 'viber',
}
</script>

<template>
  <footer id="contact" class="section-anchor bg-navy text-on-dark">
    <div
      class="container-page grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-9 pb-10 pt-16 max-tab:grid-cols-2 max-sm:grid-cols-1"
    >
      <div>
        <BrandLogo variant="footer" :tagline="global?.taglineLines" />
        <p class="mt-[18px] max-w-[280px] text-[14px] leading-[1.6] text-on-dark-dim">{{ global?.footerTagline }}</p>
        <div class="mt-5 flex gap-2.5">
          <a
            v-for="s in global?.socials"
            :key="s.network"
            :href="s.url"
            target="_blank"
            rel="noopener"
            :aria-label="s.network"
            class="grid h-[42px] w-[42px] place-items-center rounded-xl bg-glass-strong text-white hover:text-white hover:bg-glass-line"
          >
            <AppIcon :name="SOCIAL_ICON[s.network]" :size="20" :stroke-width="1.8" />
          </a>
          <NuxtLink
            :to="localePath('/radio')"
            :aria-label="t('nav.radio')"
            class="grid h-[42px] w-[42px] place-items-center rounded-xl bg-glass-strong text-white hover:text-white hover:bg-glass-line"
          >
            <AppIcon name="play" :size="18" />
          </NuxtLink>
        </div>
      </div>

      <div>
        <h2 class="mb-4 font-display text-[14px] font-semibold text-white">{{ t('footer.phones') }}</h2>
        <div class="flex flex-col gap-2.5 text-[14.5px] max-sm:gap-0">
          <a v-for="phone in global?.phones" :key="phone.tel" :href="`tel:${phone.tel}`" class="text-on-dark hover:text-white max-sm:py-[11px]">
            {{ phone.display }}
          </a>
        </div>
      </div>

      <div>
        <h2 class="mb-4 font-display text-[14px] font-semibold text-white">{{ t('footer.email') }}</h2>
        <a v-if="global?.email" :href="`mailto:${global.email}`" class="text-[14.5px] text-on-dark hover:text-white max-sm:inline-block max-sm:py-[11px]">{{ global.email }}</a>
      </div>

      <div>
        <h2 class="mb-4 font-display text-[14px] font-semibold text-white">{{ t('nav.services') }}</h2>
        <nav :aria-label="t('a11y.footerNav')" class="flex flex-col gap-2.5 text-[14.5px] max-sm:gap-0">
          <NuxtLink v-for="id in visible(FOOTER_SECTIONS)" :key="id" :to="sectionLink(id)" class="text-on-dark hover:text-white max-sm:py-[11px]">
            {{ t(`nav.${id}`) }}
          </NuxtLink>
          <NuxtLink :to="localePath('/internet')" class="text-on-dark hover:text-white max-sm:py-[11px]">{{ t('footer.coverage') }}</NuxtLink>
          <NuxtLink :to="localePath('/radio')" class="text-on-dark hover:text-white max-sm:py-[11px]">{{ t('nav.radio') }}</NuxtLink>
          <a v-if="global?.cabinetUrl" :href="global.cabinetUrl" target="_blank" rel="noopener" class="text-on-dark hover:text-white max-sm:py-[11px]">
            {{ t('topbar.cabinet') }}
          </a>
          <a v-if="global?.offerUrl" :href="global.offerUrl" target="_blank" rel="noopener" class="text-on-dark hover:text-white max-sm:py-[11px]">
            {{ t('footer.offer') }}
          </a>
        </nav>
      </div>
    </div>
    <div class="border-t border-glass-strong">
      <!-- Extra bottom space on phones so the floating callback button never covers the copyright. -->
      <div class="container-page py-5 text-[13px] text-on-dark-footer max-sm:pb-24">{{ global?.copyright }}</div>
    </div>
  </footer>
</template>
