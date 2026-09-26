<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { data: tree, index } = await useCoverageData()
if (!tree.value) throw createError({ statusCode: 503, statusMessage: 'CMS unavailable', fatal: true })

const goTo = (slug: string) => navigateTo(localePath(`/internet/${slug}`))
useSeo(() => ({
  title: `${t('locality.directoryTitle')} | NovaLine`,
  description: t('locality.directoryLead', { count: index.value.length }),
}))
</script>

<template>
  <section class="container-page py-[60px] max-sm:py-10">
    <Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: localePath('/') }, { label: t('breadcrumbs.coverage') }]" />
    <h1 class="mt-6 text-h2 text-navy">{{ t('locality.directoryTitle') }}</h1>
    <p class="mt-3.5 max-w-[640px] text-[16.5px] leading-[1.6] text-muted">{{ t('locality.directoryLead', { count: index.length }) }}</p>

    <div class="mt-8 max-w-[560px] rounded-3xl bg-navy p-6">
      <CoverageSearch :index="index" @pick="goTo" />
    </div>

    <div class="mt-12 grid gap-10">
      <section v-for="region in tree?.regions" :id="region.slug" :key="region.slug" class="section-anchor" :aria-labelledby="`region-${region.slug}`">
        <h2 :id="`region-${region.slug}`" class="font-display text-[24px] font-bold text-navy">{{ region.name }}</h2>
        <div class="mt-5 grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
          <div v-for="district in region.districts" :key="district.slug" class="rounded-[20px] border border-line bg-white p-6">
            <h3 class="font-display text-[16px] font-semibold text-navy">{{ district.name }}</h3>
            <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              <li v-for="s in district.settlements" :key="s.slug">
                <NuxtLink :to="localePath(`/internet/${s.slug}`)" class="text-[14.5px] font-semibold text-violet hover:text-coral-strong">{{ s.name }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
