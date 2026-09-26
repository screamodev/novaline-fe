<script setup lang="ts">
import type { SettlementExtraVM } from '#shared/types/coverage'
import { nearestSettlements, planPrice } from '#shared/utils/coverage'

const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const siteUrl = useRuntimeConfig().public.siteUrl
const slug = computed(() => String(route.params.slug))

const [{ data: home }, { index }, { data: extra }] = await Promise.all([
  useHome(),
  useCoverageData(),
  useFetch<SettlementExtraVM>(() => `/api/cms/settlements/${slug.value}`, { key: `cms-settlement-${slug.value}`, query: { locale } }),
])
const entry = computed(() => index.value.find((s) => s.slug === slug.value))
if (!home.value || !entry.value) throw createError({ statusCode: 404, statusMessage: 'Locality not found', fatal: true })

const s = entry.value
const copy = home.value.coverage
const place = computed(() => entry.value?.nameLocative || t('locality.placeFallback', { name: entry.value?.name }))
const coveragePlans = computed(() => Object.values(home.value!.plans.bySegment).flat().filter((p) => p.availableForCoverage))
const minPrice = computed(() => {
  const mods = entry.value!.neighbourhoods.length ? entry.value!.neighbourhoods.map((n) => n.priceModifier) : [0]
  const prices = coveragePlans.value.flatMap((p) => mods.map((m) => planPrice(p.price.amount, m) ?? Infinity))
  return prices.length ? Math.min(...prices) : null
})
const nearby = computed(() => nearestSettlements(entry.value!, index.value, 6))

// The lead form below is prefilled with this locality.
const leadAddress = useLeadAddress()
leadAddress.value = { region: s.regionSlug, district: s.districtSlug, settlement: s.slug, neighbourhood: '' }
useLeadType().value = 'connect'

const vars = computed(() => ({
  place: place.value,
  district: entry.value!.districtName,
  region: entry.value!.regionName,
  technology: copy.technology ?? 'GPON',
  speed: copy.speedValue ?? '',
  min: minPrice.value ?? '',
}))

useSeo(() => ({
  title: extra.value?.seo.title || t('locality.seoTitle', vars.value),
  description: extra.value?.seo.description || t('locality.seoDescription', vars.value),
  image: extra.value?.seo.image,
  noIndex: extra.value?.seo.noIndex,
}))
useSchemaOrg([
  defineService({
    '@id': `#service-locality-${s.slug}`,
    name: t('locality.serviceName', vars.value),
    serviceType: 'Internet access',
    areaServed: definePlace({
      name: s.name,
      address: { addressLocality: s.name, addressRegion: s.regionName, addressCountry: 'UA' },
      ...(s.lat != null && s.lng != null ? { geo: { latitude: s.lat, longitude: s.lng } } : {}),
    }),
    offers: coveragePlans.value
      .filter((p) => p.price.amount !== null)
      .map((p) => ({ name: `${p.name} ${p.speedLabel}`, price: planPrice(p.price.amount, 0) ?? 0, priceCurrency: 'UAH', url: `${siteUrl}${route.path}` })),
  }),
])
</script>

<template>
  <div v-if="entry && home">
    <section class="container-page py-[60px] max-sm:py-10">
      <Breadcrumbs
        :items="[
          { label: t('breadcrumbs.home'), to: localePath('/') },
          { label: t('breadcrumbs.coverage'), to: localePath('/internet') },
          { label: entry.regionName, to: `${localePath('/internet')}#${entry.regionSlug}` },
          { label: entry.name },
        ]"
      />
      <div class="mt-6 grid grid-cols-[1.1fr_.9fr] items-start gap-10 max-tab:grid-cols-1">
        <div>
          <h1 class="text-h2 text-navy">{{ t('locality.h1', vars) }}</h1>
          <RichText v-if="extra?.intro.length" :blocks="extra.intro" class="mt-5" />
          <div v-else class="rich-text mt-5">
            <p>{{ t('locality.intro', vars) }}</p>
            <p v-if="entry.neighbourhoods.length">{{ t('locality.introNeigh') }}</p>
            <p v-if="minPrice !== null">{{ t('locality.introPlans', vars) }}</p>
          </div>
          <dl class="mt-7 grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <div v-for="(value, key) in { technology: vars.technology, speed: vars.speed, district: vars.district, region: vars.region }" :key="key" class="rounded-[14px] border border-line bg-white px-[18px] py-3.5">
              <dt class="text-[12px] font-semibold text-muted">{{ t(`locality.facts.${key}`) }}</dt>
              <dd class="font-display text-[16px] font-bold text-navy">{{ value }}</dd>
            </div>
          </dl>
          <div class="mt-7 flex flex-wrap gap-3">
            <BaseButton href="#lead" variant="coral" size="lg" class="!rounded-[14px] !shadow-none">
              {{ t('coverage.leave') }}<AppIcon name="arrowRight" :size="17" :stroke-width="2.4" />
            </BaseButton>
          </div>
        </div>
        <CoverageMapPanel :copy="home.coverage" :index="index" :selected="entry.slug" :focus="entry" title-tag="h2" @pick="(s: string) => navigateTo(localePath(`/internet/${s}`))" />
      </div>

      <NeighbourhoodPrices class="mt-14" :settlement="entry" :plans="coveragePlans" :place="place" />
    </section>

    <PlansSection :data="home.plans" :addons="home.addons" />

    <section class="container-page py-14" aria-labelledby="nearby-title">
      <h2 id="nearby-title" class="font-display text-[22px] font-bold text-navy">{{ t('locality.nearbyTitle') }}</h2>
      <ul class="mt-5 flex flex-wrap gap-3">
        <li v-for="n in nearby" :key="n.slug">
          <NuxtLink :to="localePath(`/internet/${n.slug}`)" class="inline-flex rounded-full border border-line bg-white px-4 py-2.5 text-[14px] font-semibold text-navy hover:border-violet hover:text-violet">
            {{ t('locality.nearbyLink', { place: n.nameLocative || t('locality.placeFallback', { name: n.name }) }) }}
          </NuxtLink>
        </li>
      </ul>
      <NuxtLink :to="localePath('/internet')" class="mt-5 inline-block text-[14px] font-bold text-violet">{{ t('locality.directoryLink') }} →</NuxtLink>
    </section>

    <LeadSection :heading="home.lead.heading" />
  </div>
</template>
