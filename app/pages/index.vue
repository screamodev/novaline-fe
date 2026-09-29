<script setup lang="ts">
import type { HomeVM } from '#shared/types/home'

const [{ data: home, error }] = await Promise.all([useHome(), useCoverageData()])
if (error.value && !home.value) throw createError({ statusCode: 503, statusMessage: 'CMS unavailable', fatal: true })

const localePath = useLocalePath()
const siteUrl = useRuntimeConfig().public.siteUrl

/** Sections without published content are not rendered and drop out of the navigation. */
const hidden = useHiddenSections()
function emptySections(h: HomeVM): SectionId[] {
  const out: SectionId[] = []
  if (!h.services.items.length) out.push('services')
  if (!h.tv.packages.length && !h.tv.channels.length) out.push('tv')
  if (!h.promos.items.length) out.push('promos')
  if (!h.dataCentre.services.length) out.push('datacenter')
  if (!h.shop.items.length) out.push('shop')
  if (!h.payment.methods.length) out.push('payment')
  if (!h.news.items.length) out.push('news')
  if (!h.about.heading) out.push('about')
  return out
}
watchEffect(() => (hidden.value = home.value ? emptySections(home.value) : []))
const show = (id: SectionId) => !hidden.value.includes(id)

useSeo(() => home.value?.seo)
useReveal()

// Structured data: offered services with prices, payment how-tos and the latest articles.
const h = home.value
if (h) {
  const offer = (price: number | null, name: string) =>
    price === null ? undefined : { price, priceCurrency: 'UAH', name }
  useSchemaOrg([
    ...h.plans.business.map((p) =>
      defineService({ '@id': `#service-plan-${p.key}`, name: `${p.name} — ${p.speedLabel}`, serviceType: 'Internet access', offers: offer(p.price.amount, p.name) }),
    ),
    ...h.tv.packages.map((p) =>
      defineService({ '@id': `#service-tv-${p.key}`, name: p.name, serviceType: 'OTT television', offers: offer(p.price, p.name) }),
    ),
    ...h.dataCentre.services.map((s) =>
      defineService({ '@id': `#service-dc-${s.key}`, name: s.title, description: s.description, offers: offer(s.price, s.title) }),
    ),
    ...h.payment.methods.map((m) => defineHowTo({ '@id': `#howto-${m.key}`, name: m.name, step: m.steps.map((text) => ({ text })) })),
    defineItemList({
      itemListElement: h.news.items.map((a) => ({ name: a.title, url: `${siteUrl}${localePath(`/news/${a.slug}`)}` })),
    }),
  ])
}
</script>

<template>
  <div v-if="home">
    <HeroSection :hero="home.hero" />
    <TrustStrip :items="home.trust" />
    <CoverageSection :copy="home.coverage" />
    <ServicesSection v-if="show('services')" :data="home.services" />
    <PlansSection v-if="show('plans')" :data="home.plans" :addons="home.addons" />
    <TvSection v-if="show('tv')" :data="home.tv" />
    <PromosSection v-if="show('promos')" :data="home.promos" />
    <DataCentreSection v-if="show('datacenter')" :data="home.dataCentre" />
    <ShopSection v-if="show('shop')" :data="home.shop" />
    <PaymentSection v-if="show('payment')" :data="home.payment" />
    <NewsPreviewSection v-if="show('news')" :data="home.news" />
    <AboutSection v-if="show('about')" :data="home.about" />
    <LeadSection :heading="home.lead.heading" />
  </div>
</template>
