<script setup lang="ts">
// Placeholder for #lead until feature 005 (lead form, callback dialog, Telegram) lands.
import type { HeadingVM } from '#shared/types/home'

defineProps<{ heading: HeadingVM | null }>()
const { t } = useI18n()
const { data: global } = useGlobal()
const callbackOpen = useCallbackDialog()
</script>

<template>
  <section id="lead" class="section-anchor container-page py-20 max-sm:py-[52px]" aria-labelledby="lead-title">
    <div class="relative overflow-hidden rounded-[28px] bg-lead-card p-[52px] shadow-lead max-sm:p-7">
      <div class="absolute -right-10 -top-10 h-[280px] w-[280px] rounded-full bg-white/[.08]" aria-hidden="true" />
      <div class="relative grid grid-cols-2 items-center gap-11 max-tab:grid-cols-1">
        <div v-if="heading" class="text-white">
          <div class="text-kicker font-bold uppercase text-white/85">{{ heading.kicker }}</div>
          <h2 id="lead-title" class="mt-3 text-h2-sm">{{ heading.title }}</h2>
          <p v-if="heading.subtitle" class="mt-4 text-[16px] leading-[1.6] text-white/90">{{ heading.subtitle }}</p>
        </div>
        <div class="rounded-[20px] bg-white p-[30px] max-sm:p-6">
          <div class="font-display text-[19px] font-bold text-navy">{{ t('lead.teaserTitle') }}</div>
          <ul class="mt-4 flex flex-col gap-1">
            <li v-for="phone in global?.phones" :key="phone.tel">
              <a :href="`tel:${phone.tel}`" class="flex min-h-11 items-center text-[17px] font-bold text-navy hover:text-violet">{{ phone.display }}</a>
            </li>
          </ul>
          <BaseButton variant="coral" size="lg" block class="mt-5 !shadow-none" @click="callbackOpen = true">
            <AppIcon name="phone" :size="18" />{{ t('lead.callback') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
