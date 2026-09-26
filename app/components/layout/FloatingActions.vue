<script setup lang="ts">
const { t } = useI18n()
const callbackOpen = useCallbackDialog()
const assistantOpen = useAssistantPanel()
// The assistant widget ships with feature 009; until then its button stays hidden.
const assistantEnabled = useRuntimeConfig().public.features.assistant
</script>

<template>
  <div>
    <button
      v-if="assistantEnabled && !assistantOpen"
      type="button"
      class="fixed bottom-[86px] right-6 z-[60] max-xs:bottom-[84px] max-xs:right-4 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-white px-5 py-[13px] text-[14.5px] font-bold text-navy shadow-fab max-xs:px-3.5 max-xs:py-3 max-xs:text-[13.5px]"
      :aria-label="t('fab.assistant')"
      @click="assistantOpen = true"
    >
      <span class="grid h-[26px] w-[26px] place-items-center rounded-[9px] bg-grad-violet-coral text-white">
        <AppIcon name="bot" :size="15" :stroke-width="2.1" />
      </span>
      <span class="max-xs:hidden">{{ t('fab.assistant') }}</span>
    </button>

    <button
      type="button"
      class="fixed bottom-6 right-6 z-[60] inline-flex items-center gap-2.5 rounded-full bg-coral-strong px-5 py-[15px] text-[14.5px] font-bold text-white shadow-fab-coral max-xs:bottom-4 max-xs:right-4 max-xs:p-4"
      :aria-label="t('fab.callback')"
      @click="callbackOpen = true"
    >
      <AppIcon name="phone" :size="18" :stroke-width="2.2" />
      <!-- Icon-only on small phones so the button does not cover the hero CTAs. -->
      <span class="max-xs:sr-only">{{ t('fab.callback') }}</span>
    </button>
  </div>
</template>
