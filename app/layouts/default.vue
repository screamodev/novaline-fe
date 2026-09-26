<template>
  <div class="min-h-screen">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2">
      {{ $t('a11y.skip') }}
    </a>
    <TopBar />
    <SiteHeader />
    <MobileDrawer />
    <main id="main">
      <slot />
    </main>
    <SiteFooter />
    <FloatingActions />
    <CallbackDialog />
  </div>
</template>
