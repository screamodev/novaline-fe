<script setup lang="ts">
withDefaults(
  defineProps<{
    kicker?: string | null
    title: string
    subtitle?: string | null
    dark?: boolean
    /** Tailwind max-width class for the title. */
    titleWidth?: string
    headingId?: string
    size?: 'md' | 'sm'
    subtitleWidth?: string
  }>(),
  { dark: false, titleWidth: 'max-w-[640px]', size: 'md', subtitleWidth: 'max-w-[600px]' },
)
</script>

<template>
  <div>
    <div v-if="kicker" class="mb-3.5 flex items-center gap-3">
      <span class="h-1 w-[26px] rounded-sm bg-coral" aria-hidden="true" />
      <span class="text-kicker font-bold uppercase" :class="dark ? 'text-violet-2' : 'text-violet'">{{ kicker }}</span>
    </div>
    <h2 :id="headingId" :class="[titleWidth, size === 'sm' ? 'text-h2-sm' : 'text-h2', dark ? 'text-white' : 'text-navy']">{{ title }}</h2>
    <p
      v-if="subtitle"
      class="mt-3.5 text-[16.5px] leading-[1.6]"
      :class="[subtitleWidth, dark ? 'text-on-dark-muted' : 'text-muted']"
    >
      {{ subtitle }}
    </p>
  </div>
</template>
