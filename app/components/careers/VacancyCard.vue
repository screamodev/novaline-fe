<script setup lang="ts">
import type { VacancyVM } from '#shared/types/careers'
import type { Locale } from '#shared/types/cms'
import { formatSalary } from '#shared/utils/careers'

/** Accordion card: summary row always visible, details + HR contacts expand in place (deep-linkable by `#key`). */
const props = defineProps<{ vacancy: VacancyVM; open: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const bodyId = computed(() => `vacancy-${props.vacancy.key}-body`)
/** Numbers big, the free-text label («+ премії») small underneath; label alone when there are no numbers. */
const amount = computed(() => formatSalary({ ...props.vacancy.salary, label: null }, locale.value as Locale))
const salaryNote = computed(() => (amount.value ? props.vacancy.salary.label : null))
const salaryMain = computed(() => amount.value ?? props.vacancy.salary.label ?? t('careers.salaryNone'))
const mailto = computed(() => {
  const email = props.vacancy.contacts.email
  return email ? `mailto:${email}?subject=${encodeURIComponent(t('careers.mailSubject', { title: props.vacancy.title }))}` : null
})
const sections = computed(() =>
  (['responsibilities', 'requirements', 'offer'] as const)
    .map((key) => ({ key, items: props.vacancy[key] }))
    .filter((s) => s.items.length),
)

const copied = ref(false)
async function copyLink() {
  const url = `${window.location.origin}${localePath('/vacancies')}#${props.vacancy.key}`
  try {
    await navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    window.location.hash = props.vacancy.key
  }
}
</script>

<template>
  <article
    :id="vacancy.key"
    class="scroll-mt-28 rounded-[22px] border bg-white transition duration-300"
    :class="open ? 'border-violet shadow-card' : 'border-line hover:border-violet-2 hover:shadow-chip'"
  >
    <button
      type="button"
      class="flex w-full items-start gap-6 rounded-[22px] p-7 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet max-md:flex-col max-md:gap-4 max-sm:p-5"
      :aria-expanded="open"
      :aria-controls="bodyId"
      @click="emit('toggle')"
    >
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <span v-if="vacancy.isHot" class="inline-flex items-center gap-1.5 rounded-full bg-coral-soft px-3 py-1 text-[11.5px] font-bold uppercase tracking-[.04em] text-coral-strong">
            <AppIcon name="bolt" :size="13" :stroke-width="2.6" />{{ t('careers.hot') }}
          </span>
          <span v-if="vacancy.department" class="rounded-full bg-violet-soft px-3 py-1 text-[11.5px] font-bold uppercase tracking-[.04em] text-violet">
            {{ vacancy.department }}
          </span>
        </div>
        <h3 class="mt-3 font-display text-[22px] font-bold leading-tight text-navy max-sm:text-[19px]">{{ vacancy.title }}</h3>
        <ul class="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold text-muted">
          <li class="flex items-center gap-1.5"><AppIcon name="pin" :size="16" class="text-violet" />{{ vacancy.city }}</li>
          <li class="flex items-center gap-1.5"><AppIcon name="clock" :size="16" class="text-violet" />{{ t(`careers.employment.${vacancy.employmentType}`) }}</li>
          <li class="flex items-center gap-1.5"><AppIcon name="briefcase" :size="16" class="text-violet" />{{ t(`careers.format.${vacancy.workFormat}`) }}</li>
        </ul>
        <p v-if="vacancy.summary" class="mt-3.5 max-w-[640px] text-[15px] leading-[1.6] text-muted">{{ vacancy.summary }}</p>
      </div>

      <div class="flex shrink-0 flex-col items-end gap-4 max-md:w-full max-md:flex-row max-md:items-center max-md:justify-between">
        <div class="max-w-[260px] text-right max-md:text-left">
          <div class="whitespace-nowrap font-display text-[21px] font-extrabold leading-tight text-navy max-sm:text-[18px]">{{ salaryMain }}</div>
          <div v-if="salaryNote" class="mt-1 text-[13px] font-semibold text-success-ink">{{ salaryNote }}</div>
        </div>
        <span
          class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-bold transition"
          :class="open ? 'bg-violet text-white' : 'bg-bg text-navy'"
        >
          {{ open ? t('careers.collapse') : t('careers.details') }}
          <AppIcon name="chevronDown" :size="16" :stroke-width="2.6" class="transition-transform duration-300" :class="open && 'rotate-180'" />
        </span>
      </div>
    </button>

    <!-- grid-rows 0fr→1fr animates to the content's natural height; closed content stays in the HTML for SEO but is inert. -->
    <div
      :id="bodyId"
      class="grid transition-[grid-template-rows] duration-300 ease-out"
      :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      :inert="!open || undefined"
    >
      <div class="overflow-hidden">
        <div class="border-t border-line px-7 pb-7 pt-6 max-sm:px-5 max-sm:pb-5">
          <RichText v-if="vacancy.description.length" :blocks="vacancy.description" class="max-w-[760px] text-[15.5px] leading-[1.7] text-ink" />

          <div v-if="sections.length" class="mt-6 grid gap-4" :class="sections.length === 3 ? 'grid-cols-3 max-lg:grid-cols-1' : 'grid-cols-2 max-md:grid-cols-1'">
            <section v-for="s in sections" :key="s.key" class="rounded-2xl bg-bg p-5">
              <h4 class="font-display text-[15px] font-bold text-navy">{{ t(`careers.${s.key}`) }}</h4>
              <ul class="mt-3 flex flex-col gap-2.5">
                <li v-for="item in s.items" :key="item" class="flex gap-2.5 text-[14.5px] leading-[1.5] text-ink">
                  <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full" :class="s.key === 'offer' ? 'bg-success-soft text-success-ink' : 'bg-violet-soft text-violet'">
                    <AppIcon name="check" :size="12" :stroke-width="3" />
                  </span>
                  {{ item }}
                </li>
              </ul>
            </section>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-line p-4 max-sm:p-3">
            <div class="mr-auto min-w-[180px]">
              <div class="text-[12px] font-bold uppercase tracking-[.06em] text-muted">{{ t('careers.apply') }}</div>
              <div v-if="vacancy.contacts.name" class="mt-0.5 font-semibold text-navy">{{ vacancy.contacts.name }}</div>
            </div>
            <BaseButton v-if="vacancy.contacts.phone" :href="`tel:${vacancy.contacts.phone.tel}`" size="sm" class="!rounded-xl">
              <AppIcon name="phone" :size="16" />{{ vacancy.contacts.phone.display }}
            </BaseButton>
            <BaseButton v-if="vacancy.contacts.telegram" :href="vacancy.contacts.telegram" target="_blank" rel="noopener" variant="white" size="sm" class="!rounded-xl">
              <AppIcon name="telegram" :size="16" />{{ t('careers.telegram') }}
            </BaseButton>
            <BaseButton v-if="mailto" :href="mailto" variant="white" size="sm" class="!rounded-xl">
              <AppIcon name="mail" :size="16" />{{ t('careers.email') }}
            </BaseButton>
            <button
              type="button"
              class="grid h-[42px] w-[42px] place-items-center rounded-xl border-[1.5px] border-line text-navy transition hover:border-violet hover:text-violet focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet"
              :aria-label="copied ? t('careers.copied') : t('careers.copyLink')"
              :title="copied ? t('careers.copied') : t('careers.copyLink')"
              @click="copyLink"
            >
              <AppIcon :name="copied ? 'check' : 'link'" :size="17" :stroke-width="2.3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
