<script setup lang="ts">
const head = useLocaleHead({ seo: { canonicalQueries: ['page', 'category'] } })
const { data: global, error: globalError } = await useGlobal()
// Without CMS data the page would be incomplete; a 503 is never stored by the SWR route cache,
// so a previously cached good page keeps being served while Strapi is down.
if (globalError.value && !global.value) {
  throw createError({ statusCode: 503, statusMessage: 'CMS unavailable', fatal: true })
}
const org = global.value?.organization

useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs?.lang },
  link: head.value.link,
  meta: head.value.meta,
  // Marks JS availability so reveal animations never hide content for no-JS clients and crawlers.
  script: [{ key: 'js-flag', innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' }],
}))

useSchemaOrg([
  defineOrganization({
    name: 'NovaLine',
    legalName: org?.legalName ?? undefined,
    logo: '/images/novaline-logo.png',
    foundingDate: org?.foundingYear?.toString(),
    email: global.value?.email ?? undefined,
    telephone: global.value?.phones[0]?.tel,
    areaServed: org?.areaServed ?? undefined,
    sameAs: global.value?.socials.map((s) => s.url),
  }),
  defineWebSite({ name: 'NovaLine' }),
  defineWebPage(),
])
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
