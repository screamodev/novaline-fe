<script setup lang="ts">
import type { SettlementExtraVM } from '#shared/types/coverage'
import { allOffers, districtNeighbours, maxSpeed, minPrice, technologies } from '#shared/utils/coverage'

const { t, locale } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const siteUrl = useRuntimeConfig().public.siteUrl
const { openOrder } = useOrderDialog()
const slug = computed(() => String(route.params.slug))

const [{ data: home }, { index }, { data: extra }] = await Promise.all([
  useHome(),
  useCoverageData(),
  useFetch<SettlementExtraVM>(() => `/api/cms/settlements/${slug.value}`, { key: `cms-settlement-${slug.value}`, query: { locale } }),
])
const entry = computed(() => index.value.find((s) => s.slug === slug.value))
if (!home.value || !entry.value) throw createError({ statusCode: 404, statusMessage: 'Locality not found', fatal: true })

const s = entry.value
const place = computed(() => entry.value?.nameLocative || t('locality.placeFallback', { name: entry.value?.name }))
const offers = computed(() => allOffers(entry.value!))
const nearby = computed(() => districtNeighbours(entry.value!, index.value, 12))

// The lead form below is prefilled with this locality.
const leadAddress = useLeadAddress()
leadAddress.value = { region: s.regionSlug, district: s.districtSlug, settlement: s.slug, neighbourhood: '' }
useLeadType().value = 'connect'

const vars = computed(() => ({
  place: place.value,
  district: entry.value!.districtName,
  region: entry.value!.regionName,
  technology: technologies(offers.value).join(' / ') || 'GPON',
  speed: maxSpeed(offers.value) ?? '',
  min: minPrice(offers.value) ?? '',
}))

const orderHere = () =>
  openOrder({ context: { kind: 'offer', key: s.slug, label: t('locality.serviceName', vars.value) }, settlement: s.slug })

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
    offers: offers.value.flatMap((o) =>
      o.tariffs.map((tariff) => ({
        name: `${o.technology} ${tariff.speed} Mbps`,
        price: tariff.price,
        priceCurrency: 'UAH',
        url: `${siteUrl}${route.path}`,
      })),
    ),
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
      <div class="mt-6 max-w-[820px]">
        <h1 class="text-h2 text-navy">{{ t('locality.h1', vars) }}</h1>
        <RichText v-if="extra?.intro.length" :blocks="extra.intro" class="mt-5" />
        <div v-else class="rich-text mt-5">
          <p>{{ t('locality.intro', vars) }}</p>
          <p v-if="entry.neighbourhoods.length">{{ t('locality.introNeigh') }}</p>
          <p v-if="vars.min !== ''">{{ t('locality.introPlans', vars) }}</p>
        </div>
      </div>
      <dl class="mt-7 grid grid-cols-4 gap-3 max-tab:grid-cols-2 max-sm:grid-cols-1">
        <div
          v-for="(value, key) in { technology: vars.technology, speed: vars.speed ? t('offer.speed', { speed: vars.speed }) : '', district: vars.district, region: vars.region }"
          :key="key"
          class="rounded-[14px] border border-line bg-white px-[18px] py-3.5"
        >
          <dt class="text-[12px] font-semibold text-muted">{{ t(`locality.facts.${key}`) }}</dt>
          <dd class="text-[16px] font-bold text-navy">{{ value }}</dd>
        </div>
      </dl>
      <div class="mt-7">
        <BaseButton variant="coral" size="lg" class="!rounded-[14px] !shadow-none" @click="orderHere">
          {{ t('offer.order') }}<AppIcon name="arrowRight" :size="17" :stroke-width="2.4" />
        </BaseButton>
      </div>
    </section>

    <section class="container-page pb-14" aria-labelledby="terms-title">
      <h2 id="terms-title" class="text-[26px] font-extrabold text-navy">{{ t('locality.pricesTitle', { place }) }}</h2>
      <div v-if="entry.neighbourhoods.length" class="grid items-start gap-x-6 lg:grid-cols-2">
        <div v-for="n in entry.neighbourhoods" :key="n.name" class="mt-8">
          <h3 class="text-[19px] font-bold text-navy">{{ n.name }}</h3>
          <OfferCards class="mt-4" :offers="n.offers" :place="`${entry.name} · ${n.name}`" :settlement="entry.slug" :neighbourhood="n.name" title-tag="h4" stack />
        </div>
      </div>
      <OfferCards v-else class="mt-6" :offers="entry.offers" :place="entry.name" :settlement="entry.slug" />
      <p class="mt-4 text-[13px] text-muted">{{ t('locality.pricesNote') }}</p>
    </section>

    <section v-if="nearby.length" class="container-page pb-14" aria-labelledby="nearby-title">
      <h2 id="nearby-title" class="text-[22px] font-bold text-navy">{{ t('locality.nearbyTitle') }}</h2>
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
