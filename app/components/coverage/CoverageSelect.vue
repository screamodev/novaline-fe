<script setup lang="ts">
const model = defineModel<string>({ required: true })
withDefaults(
  defineProps<{
    label: string
    placeholder: string
    options: { value: string; label: string }[]
    disabled?: boolean
    /** `dark`: coverage panel on navy; `light`: lead form on white. */
    variant?: 'dark' | 'light'
    name?: string
  }>(),
  { disabled: false, variant: 'dark' },
)
const id = useId()
</script>

<template>
  <div>
    <label
      :for="id"
      class="mb-[7px] flex items-center gap-2 text-[12.5px] font-semibold"
      :class="variant === 'dark' ? 'text-on-dark-dim' : 'text-navy'"
    >
      {{ label }}<slot name="note" />
    </label>
    <div class="relative">
      <select
        :id="id"
        v-model="model"
        :name="name"
        :disabled="disabled"
        class="w-full cursor-pointer appearance-none rounded-xl border-[1.5px] font-body text-ink outline-none transition-colors focus-visible:border-violet disabled:cursor-not-allowed"
        :class="[
          variant === 'dark'
            ? 'py-3.5 pl-4 pr-10 text-[15px] border-line-dark-strong bg-white disabled:border-line-dark disabled:bg-white/35 disabled:text-on-dark-faint'
            : 'py-[13px] pl-3.5 pr-[38px] text-[14.5px] border-line bg-white disabled:bg-bg disabled:text-muted',
        ]"
      >
        <option value="">{{ placeholder }}</option>
        <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
      <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-violet" aria-hidden="true">▾</span>
    </div>
  </div>
</template>
