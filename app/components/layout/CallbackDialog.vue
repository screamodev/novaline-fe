<script setup lang="ts">
// Interim callback dialog: lists phone numbers. The callback form (feature 005) replaces the body.
const { t } = useI18n()
const { data: global } = useGlobal()
const open = useCallbackDialog()
</script>

<template>
  <BaseDialog v-model:open="open" labelledby="callback-title" :close-label="t('menu.close')">
    <div class="flex items-center gap-3">
      <span class="grid h-[46px] w-[46px] place-items-center rounded-[14px] bg-coral/[.12] text-coral">
        <AppIcon name="phone" :size="22" :stroke-width="2.2" />
      </span>
      <h2 id="callback-title" class="font-display text-[20px] font-bold text-navy">{{ t('fab.callback') }}</h2>
    </div>
    <ul class="mt-5 flex flex-col gap-1">
      <li v-for="phone in global?.phones" :key="phone.tel">
        <a :href="`tel:${phone.tel}`" class="flex min-h-11 items-center text-[17px] font-bold text-navy hover:text-violet">{{ phone.display }}</a>
      </li>
    </ul>
  </BaseDialog>
</template>
