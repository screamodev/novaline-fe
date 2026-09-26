// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  ssr: true,

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org',
    '@nuxt/image',
    '@nuxt/fonts',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'uk' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1F1D46' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/images/novaline-logo.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/images/novaline-logo.png' },
      ],
    },
  },

  runtimeConfig: {
    // Server-only — never exposed to the browser (BFF pattern).
    strapiUrl: 'http://localhost:1337',
    strapiToken: '',
    revalidateSecret: '',
    openaiApiKey: '',
    openaiModel: 'gpt-4o-mini',
    public: {
      siteUrl,
      strapiMediaUrl: 'http://localhost:1337',
    },
  },

  site: {
    url: siteUrl,
    name: 'NovaLine',
    defaultLocale: 'uk',
  },

  i18n: {
    baseUrl: siteUrl,
    strategy: 'prefix_except_default',
    defaultLocale: 'uk',
    locales: [
      { code: 'uk', language: 'uk-UA', file: 'uk.json', name: 'UA' },
      { code: 'en', language: 'en-US', file: 'en.json', name: 'EN' },
    ],
    detectBrowserLanguage: false,
  },

  fonts: {
    families: [
      { name: 'Manrope', provider: 'google', weights: [400, 500, 600, 700, 800] },
      { name: 'Unbounded', provider: 'google', weights: [500, 600, 700, 800] },
    ],
  },

  image: {
    domains: [new URL(process.env.NUXT_PUBLIC_STRAPI_MEDIA_URL || 'http://localhost:1337').host],
    format: ['avif', 'webp'],
  },

  robots: {
    allow: '/',
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  // SWR cache for content pages; purged by the Strapi publish webhook (/api/revalidate).
  routeRules: {
    '/': { swr: 60 },
    '/en': { swr: 60 },
    '/news/**': { swr: 60 },
    '/en/news/**': { swr: 60 },
    '/internet/**': { swr: 300 },
    '/en/internet/**': { swr: 300 },
  },

  typescript: {
    strict: true,
  },

  nitro: {
    compressPublicAssets: true,
  },
})
