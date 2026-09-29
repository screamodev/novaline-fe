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
  // Inline all CSS into the SSR HTML: removes the render-blocking stylesheet request (FCP/LCP on mobile).
  features: { inlineStyles: true },

  // Components are referenced by file name (e.g. <SiteHeader>, <BaseButton>) regardless of folder.
  components: [{ path: '~/components', pathPrefix: false }],

  app: {
    head: {
      htmlAttrs: { lang: 'uk' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1F1D46' },
      ],
      link: [
        // The client's own favicon (from novaline.net).
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', href: '/favicon-32.png', sizes: '32x32' },
        { rel: 'icon', type: 'image/png', href: '/icon-192.png', sizes: '192x192' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
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
      // NUXT_PUBLIC_FEATURES_ASSISTANT=false hides the assistant widget.
      features: {
        assistant: true,
      },
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

  // Only the weights the UI uses; Cyrillic + Latin subsets (the site is uk/en).
  fonts: {
    // No font preloads: metric fallbacks (main.css) prevent reflow, and the hero image gets the bandwidth first.
    defaults: { subsets: ['cyrillic', 'latin'], preload: false },
    families: [
      { name: 'Manrope', provider: 'google', weights: [400, 500, 600, 700, 800] },
    ],
  },

  image: {
    // CMS media is fetched server-side by IPX from Strapi: `cms` inside Docker, `localhost` on the host.
    domains: ['localhost:1337', 'cms:1337'],
    format: ['avif', 'webp'],
  },

  // Indexing is allowed only when NUXT_SITE_ENV=production (nuxt-site-config), so dev/staging stay out of search.
  robots: {
    allow: '/',
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  // API responses are never cached by intermediaries.
  routeRules: {
    '/api/**': { headers: { 'cache-control': 'no-store' } },
  },

  // SWR cache for content pages (production only, so dev always renders fresh); purged by the Strapi webhook.
  $production: {
    routeRules: {
      '/': { swr: 60 },
      '/en': { swr: 60 },
      '/news/**': { swr: 60 },
      '/en/news/**': { swr: 60 },
      '/internet/**': { swr: 300 },
      '/en/internet/**': { swr: 300 },
    },
  },

  typescript: {
    strict: true,
  },

  nitro: {
    compressPublicAssets: true,
  },
})
