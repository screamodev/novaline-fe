<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const open = useCallbackDialog()
const phone = ref('')
const website = ref('')
const { state, errors, formError, submit, reset } = useLeadSubmit()

watch(open, (on) => on && reset())
const onSubmit = () => submit({ type: 'callback', phone: phone.value, website: website.value })
</script>

<template>
  <BaseDialog v-model:open="open" labelledby="callback-title" :close-label="t('menu.close')">
    <div v-if="state === 'sent'" class="py-4 text-center" role="status">
      <span class="inline-grid h-[58px] w-[58px] place-items-center rounded-full bg-success-soft text-success">
        <AppIcon name="check" :size="30" :stroke-width="2.6" />
      </span>
      <div class="mt-3.5 font-display text-[19px] font-bold text-navy">{{ t('callback.success') }}</div>
    </div>
    <template v-else>
      <div class="flex items-center gap-3">
        <span class="grid h-[46px] w-[46px] place-items-center rounded-[14px] bg-coral/[.12] text-coral">
          <AppIcon name="phone" :size="22" :stroke-width="2.2" />
        </span>
        <h2 id="callback-title" class="font-display text-[20px] font-bold text-navy">{{ t('fab.callback') }}</h2>
      </div>
      <p class="mb-[18px] mt-3.5 text-[14px] leading-[1.5] text-muted">{{ t('callback.sub') }}</p>
      <form novalidate @submit.prevent="onSubmit">
        <label for="callback-phone" class="sr-only">{{ t('lead.phone') }}</label>
        <input
          id="callback-phone"
          v-model="phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          :placeholder="t('lead.phonePh')"
          :aria-invalid="!!errors.phone"
          :aria-describedby="errors.phone ? 'callback-phone-error' : undefined"
          class="w-full rounded-xl border-[1.5px] px-4 py-[15px] text-[15.5px] outline-none focus:border-coral"
          :class="errors.phone ? 'border-coral-strong' : 'border-line'"
        >
        <p v-if="errors.phone" id="callback-phone-error" class="mt-1 text-[12.5px] text-coral-strong">{{ t('lead.errors.phone') }}</p>
        <input v-model="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 opacity-0">
        <p v-if="formError" class="mt-3 text-[13px] text-ink" role="alert">{{ t(`lead.errors.${formError}`) }}</p>
        <BaseButton type="submit" variant="coral" block class="mt-3.5 !py-[15px] !text-[15.5px] !shadow-none" :disabled="state === 'sending'">
          {{ state === 'sending' ? t('lead.sending') : t('callback.submit') }}
        </BaseButton>
        <p class="mt-3 text-center text-[12px] text-muted">
          {{ t('lead.privacyBefore') }}<NuxtLink :to="localePath('/privacy')" class="text-muted underline hover:text-violet" @click="open = false">{{ t('lead.privacyLink') }}</NuxtLink>{{ t('lead.privacyAfter') }}
        </p>
      </form>
    </template>
  </BaseDialog>
</template>
