<script setup lang="ts">
import type { SettlementEntry } from '#shared/types/coverage'
import { searchSettlements } from '#shared/utils/coverage'

const props = defineProps<{ index: SettlementEntry[] }>()
const emit = defineEmits<{ pick: [slug: string] }>()
const { t } = useI18n()

const query = ref('')
const active = ref(-1)
const inputId = useId()
const listId = useId()

const hits = computed(() => searchSettlements(query.value, props.index))
const open = computed(() => query.value.trim().length > 0)
const nothing = computed(() => query.value.trim().length > 1 && !hits.value.length)
watch(hits, () => (active.value = hits.value.length ? 0 : -1))

const choose = (s: SettlementEntry) => {
  emit('pick', s.slug)
  query.value = ''
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' && hits.value.length) {
    e.preventDefault()
    active.value = (active.value + 1) % hits.value.length
  } else if (e.key === 'ArrowUp' && hits.value.length) {
    e.preventDefault()
    active.value = (active.value - 1 + hits.value.length) % hits.value.length
  } else if (e.key === 'Enter' && hits.value[active.value]) {
    e.preventDefault()
    choose(hits.value[active.value]!)
  } else if (e.key === 'Escape') {
    query.value = ''
  }
}
</script>

<template>
  <div>
    <label :for="inputId" class="mb-[7px] block text-[12.5px] font-semibold text-on-dark-dim">{{ t('coverage.searchLabel') }}</label>
    <div class="relative">
      <AppIcon name="search" :size="17" :stroke-width="2.2" class="pointer-events-none absolute left-[15px] top-1/2 -translate-y-1/2 text-violet" />
      <input
        :id="inputId"
        v-model="query"
        type="text"
        role="combobox"
        autocomplete="off"
        :aria-expanded="open"
        :aria-controls="listId"
        aria-autocomplete="list"
        :aria-activedescendant="active >= 0 ? `${listId}-${active}` : undefined"
        :placeholder="t('coverage.searchPlaceholder')"
        class="w-full rounded-xl border-[1.5px] border-line-dark-strong bg-white px-[42px] py-3.5 text-[15px] text-ink outline-none focus:border-violet"
        @keydown="onKey"
      >
      <button
        v-if="open"
        type="button"
        :aria-label="t('coverage.clear')"
        class="absolute right-2 top-1/2 grid h-[30px] w-[30px] -translate-y-1/2 place-items-center rounded-lg bg-bg text-[15px] text-muted"
        @click="query = ''"
      >
        ×
      </button>
    </div>
    <div v-show="open" class="mt-2 animate-rise overflow-hidden rounded-[14px] bg-white shadow-dropdown">
      <ul :id="listId" role="listbox" :aria-label="t('coverage.searchLabel')">
        <li
          v-for="(s, i) in hits"
          :id="`${listId}-${i}`"
          :key="s.slug"
          role="option"
          :aria-selected="i === active"
          class="flex min-h-11 cursor-pointer flex-col items-start gap-0.5 border-b border-line px-4 py-[13px] text-left"
          :class="i === active ? 'bg-bg' : 'hover:bg-bg'"
          @mousedown.prevent="choose(s)"
          @mouseenter="active = i"
        >
          <span class="text-[14.5px] font-bold text-navy">{{ s.name }}</span>
          <span class="text-[12.5px] text-muted">{{ s.districtName }}, {{ s.regionName }}</span>
        </li>
      </ul>
      <div v-if="nothing" class="px-4 py-[15px] text-[13.5px] leading-[1.5] text-muted" role="status">{{ t('coverage.searchNone') }}</div>
    </div>
  </div>
</template>
