<script setup lang="ts">
import type { CareersVM } from '#shared/types/careers'
import type { Locale } from '#shared/types/cms'
import { facet, filterVacancies, formatSalary } from '#shared/utils/careers'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const siteUrl = useRuntimeConfig().public.siteUrl

const { data: page, error } = await useFetch<CareersVM>('/api/cms/careers', { key: 'cms-careers', query: { locale } })
if (error.value && !page.value) throw createError({ statusCode: 503, statusMessage: 'CMS unavailable', fatal: true })

const vacancies = computed(() => page.value?.vacancies ?? [])
const contacts = computed(() => page.value?.contacts)

// ---- filters (kept in the URL: ?city=&dept=) ----
const q = (v: unknown) => (typeof v === 'string' ? v : '')
const filter = computed(() => ({ city: q(route.query.city), department: q(route.query.dept) }))
const cities = computed(() => facet(vacancies.value, (v) => v.city))
const departments = computed(() => facet(vacancies.value, (v) => v.department))
const shown = computed(() => filterVacancies(vacancies.value, filter.value))
const filtered = computed(() => !!(filter.value.city || filter.value.department))
function setFilter(key: 'city' | 'dept', value: string) {
  const query = { ...route.query, [key]: value || undefined }
  router.replace({ query, hash: route.hash })
}
const resetFilters = () => router.replace({ query: {}, hash: route.hash })

// ---- accordion (one open card, mirrored in the URL hash for sharing) ----
const openKey = ref('')
function toggle(key: string) {
  openKey.value = openKey.value === key ? '' : key
  history.replaceState(history.state, '', openKey.value ? `#${openKey.value}` : `${location.pathname}${location.search}`)
}
onMounted(() => {
  const key = decodeURIComponent(location.hash.slice(1))
  if (!vacancies.value.some((v) => v.key === key)) return
  // A deep link must not be hidden by an active filter.
  if (!shown.value.some((v) => v.key === key)) resetFilters()
  openKey.value = key
  nextTick(() => document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
})

// ---- copy helpers ----
const plural = (n: number, word: 'vacanciesWord' | 'citiesWord') =>
  t(`careers.${word}.${new Intl.PluralRules(locale.value).select(n)}`, t(`careers.${word}.other`))
const salaryOf = (v: CareersVM['vacancies'][number]) => formatSalary(v.salary, locale.value as Locale)
const mailto = computed(() =>
  contacts.value?.email ? `mailto:${contacts.value.email}?subject=${encodeURIComponent(t('careers.mailSubject', { title: t('careers.title') }))}` : null,
)
const heroTitle = computed(() => page.value?.hero?.title ?? t('careers.title'))
const preview = computed(() => [...vacancies.value].sort((a, b) => Number(b.isHot) - Number(a.isHot)).slice(0, 3))

useSeo(() => ({
  ...page.value?.seo,
  title: page.value?.seo.title || `${heroTitle.value} | NovaLine`,
  description: page.value?.seo.description || page.value?.hero?.subtitle || undefined,
}))
useReveal()
useSchemaOrg([
  defineItemList({
    itemListElement: vacancies.value.map((v) => ({ name: `${v.title} — ${v.city}`, url: `${siteUrl}${localePath('/vacancies')}#${v.key}` })),
  }),
])
</script>

<template>
  <div v-if="page">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-bg-hero">
      <div class="absolute inset-0 bg-hero-glow" aria-hidden="true" />
      <div class="container-page relative grid grid-cols-[1.1fr_.9fr] items-center gap-12 py-16 max-lg:grid-cols-1 max-lg:gap-10 max-sm:py-10">
        <div>
          <Breadcrumbs :items="[{ label: t('breadcrumbs.home'), to: localePath('/') }, { label: t('breadcrumbs.vacancies') }]" />
          <span class="mt-7 inline-flex items-center gap-[9px] rounded-full bg-white px-[15px] py-2 text-[13px] font-bold tracking-[.02em] text-violet shadow-chip">
            <span class="h-2 w-2 animate-pulse rounded-full bg-coral" aria-hidden="true" />{{ page.hero?.kicker ?? t('careers.kicker') }}
          </span>
          <h1 class="mt-5 text-h1 text-navy">{{ heroTitle }}</h1>
          <p v-if="page.hero?.subtitle" class="mt-5 max-w-[540px] text-[18px] leading-[1.6] text-muted max-sm:text-[16px]">{{ page.hero.subtitle }}</p>

          <dl v-if="vacancies.length" class="mt-8 flex flex-wrap gap-3">
            <div class="rounded-2xl bg-white px-5 py-3.5 shadow-chip">
              <dt class="sr-only">{{ t('careers.listTitle') }}</dt>
              <dd class="flex items-baseline gap-2"><span class="font-display text-[30px] font-extrabold text-violet">{{ vacancies.length }}</span><span class="text-[14px] font-semibold text-muted">{{ plural(vacancies.length, 'vacanciesWord') }}</span></dd>
            </div>
            <div class="rounded-2xl bg-white px-5 py-3.5 shadow-chip">
              <dt class="sr-only">{{ t('careers.filterCity') }}</dt>
              <dd class="flex items-baseline gap-2"><span class="font-display text-[30px] font-extrabold text-coral-strong">{{ cities.length }}</span><span class="text-[14px] font-semibold text-muted">{{ plural(cities.length, 'citiesWord') }}</span></dd>
            </div>
          </dl>

          <div class="mt-8 flex flex-wrap gap-3.5">
            <BaseButton v-if="vacancies.length" :to="{ hash: '#list', query: route.query }" size="lg" class="!rounded-[14px]">
              {{ page.listTitle ?? t('careers.listTitle') }}<AppIcon name="arrowRight" :size="18" :stroke-width="2.4" class="rotate-90" />
            </BaseButton>
            <BaseButton v-if="mailto" :href="mailto" variant="white" size="lg" class="!rounded-[14px]">
              <AppIcon name="mail" :size="18" />{{ t('careers.email') }}
            </BaseButton>
          </div>
        </div>

        <!-- Visual: CMS photo, or a "now hiring" board with the hottest positions. -->
        <div class="relative">
          <NuxtImg
            v-if="page.heroImage"
            :src="page.heroImage.src"
            :alt="page.heroImage.alt"
            :width="page.heroImage.width ?? 900"
            sizes="xs:100vw lg:45vw xl:560px"
            format="webp"
            :preload="{ fetchPriority: 'high' }"
            class="aspect-[4/3.4] w-full rounded-[28px] object-cover shadow-card"
          />
          <div v-else class="relative overflow-hidden rounded-[28px] bg-slide-navy p-8 text-white shadow-card max-sm:p-6" aria-hidden="true">
            <div class="absolute inset-0 bg-slide-glow" />
            <div class="relative">
              <div class="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[.08em] text-on-dark-soft">
                <span class="h-2 w-2 animate-pulse rounded-full bg-coral" />{{ t('nav.hiring') }}
              </div>
              <ul class="mt-5 flex flex-col gap-3">
                <li v-for="(v, i) in preview" :key="v.key" class="animate-rise rounded-2xl border border-line-dark bg-glass p-4" :style="{ animationDelay: `${i * 120}ms` }">
                  <div class="flex items-start justify-between gap-3">
                    <div class="font-display text-[17px] font-bold leading-snug">{{ v.title }}</div>
                    <span v-if="v.isHot" class="shrink-0 rounded-full bg-coral px-2.5 py-0.5 text-[11px] font-bold uppercase">{{ t('careers.hot') }}</span>
                  </div>
                  <div class="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] text-on-dark-soft">
                    <span class="flex items-center gap-1.5"><AppIcon name="pin" :size="14" />{{ v.city }}</span>
                    <span v-if="salaryOf(v)" class="font-semibold text-white">{{ salaryOf(v) }}</span>
                  </div>
                </li>
                <li v-if="!preview.length" class="rounded-2xl border border-line-dark bg-glass p-5 text-[15px] text-on-dark-soft">
                  {{ page.emptyText ?? '' }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section v-if="page.benefits.length" class="container-page py-[72px] max-sm:py-12">
      <h2 class="max-w-[640px] text-h2 text-navy">{{ page.benefitsTitle }}</h2>
      <ul class="mt-9 grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <li v-for="b in page.benefits" :key="b.title" class="reveal rounded-[22px] border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-card">
          <span class="grid h-12 w-12 place-items-center rounded-2xl bg-icon-tile text-violet"><AppIcon :name="b.icon" :size="24" :stroke-width="2" /></span>
          <h3 class="mt-4 font-display text-[18px] font-bold text-navy">{{ b.title }}</h3>
          <p v-if="b.text" class="mt-2 text-[14.5px] leading-[1.6] text-muted">{{ b.text }}</p>
        </li>
      </ul>
    </section>

    <!-- Vacancies -->
    <section id="list" class="section-anchor bg-bg py-[72px] max-sm:py-12">
      <div class="container-page">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <h2 class="text-h2 text-navy">{{ page.listTitle ?? t('careers.listTitle') }}</h2>
          <p v-if="vacancies.length" class="text-[14px] font-semibold text-muted" aria-live="polite">{{ t('careers.found', { n: shown.length }) }}</p>
        </div>

        <div v-if="vacancies.length && (cities.length > 1 || departments.length > 1)" class="mt-7 flex flex-col gap-3">
          <div v-for="group in [
            { key: 'city' as const, label: t('careers.filterCity'), all: t('careers.allCities'), items: cities, value: filter.city },
            { key: 'dept' as const, label: t('careers.filterDepartment'), all: t('careers.allDepartments'), items: departments, value: filter.department },
          ].filter((g) => g.items.length > 1)" :key="group.key" class="flex flex-wrap items-center gap-2" role="group" :aria-label="group.label">
            <span class="mr-1 w-[72px] text-[12px] font-bold uppercase tracking-[.06em] text-muted max-sm:w-full">{{ group.label }}</span>
            <div class="flex flex-wrap gap-2 max-sm:-mx-[18px] max-sm:w-[calc(100%+36px)] max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-[18px] max-sm:pb-1">
            <button
              v-for="opt in [{ value: '', count: vacancies.length, label: group.all }, ...group.items.map((i) => ({ ...i, label: i.value }))]"
              :key="opt.value"
              type="button"
              :aria-pressed="group.value === opt.value"
              class="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-[9px] text-[13.5px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
              :class="group.value === opt.value ? 'bg-violet text-white shadow-btn-violet' : 'border border-line bg-white text-muted hover:border-violet hover:text-navy'"
              @click="setFilter(group.key, opt.value)"
            >
              {{ opt.label }}<span class="rounded-full px-1.5 text-[11.5px] font-bold" :class="group.value === opt.value ? 'bg-glass-strong' : 'bg-bg'">{{ opt.count }}</span>
            </button>
            </div>
          </div>
        </div>

        <TransitionGroup v-if="shown.length" tag="div" name="vacancy" class="relative mt-8 flex flex-col gap-4">
          <VacancyCard v-for="v in shown" :key="v.key" :vacancy="v" :open="openKey === v.key" @toggle="toggle(v.key)" />
        </TransitionGroup>

        <div v-else-if="filtered" class="mt-8 rounded-[22px] border border-dashed border-line bg-white p-10 text-center">
          <p class="text-[16px] text-muted">{{ t('careers.noMatch') }}</p>
          <BaseButton variant="soft" size="sm" class="mt-4" @click="resetFilters">{{ t('careers.reset') }}</BaseButton>
        </div>

        <div v-else class="mt-8 flex items-center gap-6 rounded-[22px] border border-line bg-white p-10 max-sm:flex-col max-sm:p-7 max-sm:text-center">
          <span class="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-icon-tile text-violet"><AppIcon name="search" :size="30" /></span>
          <div>
            <h3 class="font-display text-[20px] font-bold text-navy">{{ page.emptyTitle }}</h3>
            <p v-if="page.emptyText" class="mt-2 max-w-[560px] text-[15px] leading-[1.6] text-muted">{{ page.emptyText }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- HR contacts -->
    <section v-if="contacts && (contacts.phone || contacts.email || contacts.telegram)" class="container-page py-[72px] max-sm:py-12">
      <div class="relative overflow-hidden rounded-[28px] bg-lead-card p-12 text-white shadow-lead max-sm:p-7">
        <div class="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-line-dark-strong" aria-hidden="true" />
        <div class="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-line-dark-strong" aria-hidden="true" />
        <div class="relative grid grid-cols-[1.2fr_1fr] items-center gap-10 max-lg:grid-cols-1">
          <div>
            <h2 class="text-h2-sm">{{ page.contactsTitle ?? t('careers.contactsTitle') }}</h2>
            <p v-if="page.contactsText" class="mt-4 max-w-[520px] text-[17px] leading-[1.6] text-on-dark">{{ page.contactsText }}</p>
            <p class="mt-4 flex items-center gap-2 text-[14px] text-on-dark-soft"><AppIcon name="clock" :size="16" />{{ t('careers.contactsHint') }}</p>
          </div>
          <div class="flex flex-col gap-3">
            <a v-if="contacts.phone" :href="`tel:${contacts.phone.tel}`" class="hr-link">
              <span class="hr-icon"><AppIcon name="phone" :size="20" /></span>
              <span><span class="block text-[12px] font-bold uppercase tracking-[.06em] text-on-dark-soft">{{ contacts.name ?? t('careers.call') }}</span>{{ contacts.phone.display }}</span>
            </a>
            <a v-if="contacts.telegram" :href="contacts.telegram" target="_blank" rel="noopener" class="hr-link">
              <span class="hr-icon"><AppIcon name="telegram" :size="20" /></span>{{ t('careers.telegram') }}
            </a>
            <a v-if="mailto" :href="mailto" class="hr-link">
              <span class="hr-icon"><AppIcon name="mail" :size="20" /></span>
              <span><span class="block text-[12px] font-bold uppercase tracking-[.06em] text-on-dark-soft">{{ t('careers.email') }}</span>{{ contacts.email }}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hr-link {
  @apply flex items-center gap-4 rounded-2xl border border-line-dark bg-glass px-5 py-4 font-display text-[17px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-glass-strong hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white;
}
.hr-icon {
  @apply grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-violet;
}
.vacancy-move,
.vacancy-enter-active,
.vacancy-leave-active {
  transition: all 0.3s ease;
}
.vacancy-enter-from,
.vacancy-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
.vacancy-leave-active {
  position: absolute;
  width: 100%;
}
</style>
