<script setup lang="ts">
/** Visible breadcrumb trail + BreadcrumbList JSON-LD. The last item is the current page. */
const props = defineProps<{ items: { label: string; to?: string }[] }>()
const { t } = useI18n()
const siteUrl = useRuntimeConfig().public.siteUrl

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: props.items.map((i) => ({ name: i.label, item: i.to ? `${siteUrl}${i.to}` : undefined })),
  }),
])
</script>

<template>
  <nav :aria-label="t('a11y.breadcrumbs')" class="text-[13px] text-muted">
    <ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
      <li v-for="(item, i) in items" :key="i" class="flex items-center gap-2">
        <NuxtLink v-if="item.to && i < items.length - 1" :to="item.to" class="text-muted hover:text-violet">{{ item.label }}</NuxtLink>
        <span v-else aria-current="page" class="font-semibold text-navy">{{ item.label }}</span>
        <span v-if="i < items.length - 1" aria-hidden="true">›</span>
      </li>
    </ol>
  </nav>
</template>
