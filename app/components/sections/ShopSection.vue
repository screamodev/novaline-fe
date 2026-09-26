<script setup lang="ts">
import type { HomeVM, ShopItemVM } from '#shared/types/home'

defineProps<{ data: HomeVM['shop'] }>()
const { t } = useI18n()
const fmt = useFormat()
const sectionLink = useSectionLink()
const { data: global } = useGlobal()
const { set: setLeadContext } = useLeadContext()
const buy = (item: ShopItemVM) => setLeadContext({ kind: 'shop', key: item.key, label: item.name })
</script>

<template>
  <section id="shop" class="section-anchor container-page reveal py-[84px] max-sm:py-[52px]" aria-labelledby="shop-title">
    <SectionHeading v-if="data.heading" v-bind="data.heading" heading-id="shop-title" />

    <div v-if="data.routerNote" class="mt-6 flex items-start gap-4 rounded-[18px] border border-violet/[.22] bg-violet/[.06] px-6 py-[22px]">
      <AppIcon name="info" :size="22" class="mt-px text-violet" />
      <p class="text-[14.5px] leading-[1.65] text-ink">{{ data.routerNote }}</p>
    </div>

    <ul class="mt-[30px] grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
      <li v-for="item in data.items" :key="item.key" class="flex flex-col rounded-[20px] border border-line bg-white p-[26px]">
        <NuxtImg
          v-if="item.image"
          :src="item.image.src"
          :alt="item.image.alt"
          width="320"
          height="200"
          loading="lazy"
          format="webp"
          class="mb-4 aspect-[8/5] w-full rounded-xl object-contain"
        />
        <span class="text-[11.5px] font-bold uppercase tracking-[.05em] text-violet">{{ item.categoryLabel }}</span>
        <h3 class="mt-3 font-display text-[18px] font-semibold leading-[1.25] text-navy">{{ item.name }}</h3>
        <p class="mt-2.5 text-[14px] leading-[1.6] text-muted">{{ item.description }}</p>
        <div class="mt-auto flex items-center justify-between gap-3.5 pt-[22px]">
          <div>
            <span class="font-display text-[26px] font-extrabold text-navy">{{ fmt.amount(item.price) }}</span>
            <span class="text-[13px] text-muted"> {{ global?.currencyLabel }}</span>
          </div>
          <BaseButton :to="sectionLink('lead')" variant="soft" pill size="sm" @click="buy(item)">{{ t('shop.buy') }}</BaseButton>
        </div>
      </li>
    </ul>
    <p v-if="data.orderNote" class="mt-[22px] text-[13px] text-muted">{{ data.orderNote }}</p>
  </section>
</template>
