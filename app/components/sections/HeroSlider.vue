<script setup lang="ts">
import emblaCarouselVue from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'
import type { HeroSlideVM } from '#shared/types/home'

/**
 * Homepage hero: active CMS offers as an autoplaying carousel (embla).
 * Server render shows the first slide in place, so there is no layout shift before hydration.
 */
const props = defineProps<{ slides: HeroSlideVM[] }>()
const { t } = useI18n()

const DELAY = 6000
const multiple = computed(() => props.slides.length > 1)
const autoplay = Autoplay({ delay: DELAY, playOnInit: false, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true })
const [viewport, embla] = emblaCarouselVue({ loop: true, duration: 32, active: multiple.value }, [autoplay])

const selected = ref(0)
/** Content fade-up only after the first user/auto change: the initial paint stays static for LCP. */
const changed = ref(false)
/** Autoplay runs unless the visitor prefers reduced motion; it pauses on hover/focus (embla option). */
const autoplaying = ref(false)
/** The current timer is running (it stops while hovered/focused); drives the progress bar. */
const ticking = ref(false)
const tick = ref(0)

onMounted(() => {
  const api = embla.value
  if (!api || !multiple.value) return
  api.on('select', () => {
    selected.value = api.selectedScrollSnap()
    changed.value = true
  })
  api.on('autoplay:timerset', () => {
    tick.value++
    ticking.value = true
  })
  api.on('autoplay:timerstopped', () => (ticking.value = false))
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  autoplaying.value = true
  autoplay.play()
})

const go = (i: number) => embla.value?.scrollTo(i)
const prev = () => embla.value?.scrollPrev()
const next = () => embla.value?.scrollNext()

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}
</script>

<template>
  <section
    v-if="slides.length"
    class="bg-white pb-8 pt-6 max-sm:pb-5 max-sm:pt-3"
    :aria-roledescription="multiple ? 'carousel' : undefined"
    :aria-label="t('hero.slider.label')"
    @keydown="onKey"
  >
    <div class="container-page max-sm:px-3">
      <div class="relative">
        <div ref="viewport" class="overflow-hidden rounded-[28px] shadow-card">
          <div class="flex touch-pan-y" :aria-live="autoplaying ? 'off' : 'polite'">
            <div
              v-for="(slide, i) in slides"
              :key="slide.key"
              class="min-h-[600px] min-w-0 flex-[0_0_100%] max-tab:min-h-[560px]"
              role="group"
              :aria-roledescription="multiple ? 'slide' : undefined"
              :aria-label="multiple ? t('hero.slider.slideOf', { n: i + 1, total: slides.length }) : undefined"
              :aria-hidden="i !== selected || undefined"
              :inert="i !== selected || undefined"
            >
              <HeroSlide :slide="slide" :first="i === 0" :animate="changed && i === selected" />
            </div>
          </div>
        </div>

        <!-- Arrows on the slider edges (desktop/tablet; phones swipe). -->
        <template v-if="multiple">
          <button
            type="button"
            class="hero-arrow left-0 -translate-x-1/2 max-tab:left-4 max-tab:translate-x-0"
            :aria-label="t('hero.slider.prev')"
            @click="prev"
          >
            <AppIcon name="arrowLeft" :size="20" :stroke-width="2.4" />
          </button>
          <button
            type="button"
            class="hero-arrow right-0 translate-x-1/2 max-tab:right-4 max-tab:translate-x-0"
            :aria-label="t('hero.slider.next')"
            @click="next"
          >
            <AppIcon name="arrowRight" :size="20" :stroke-width="2.4" />
          </button>

          <!-- Progress pills: the active one fills while its autoplay timer runs. -->
          <div
            class="absolute bottom-8 left-14 flex items-center gap-2 max-lg:left-10 max-sm:bottom-6 max-sm:left-5"
            role="tablist"
            :aria-label="t('hero.slider.label')"
          >
            <button
              v-for="(slide, i) in slides"
              :key="slide.key"
              type="button"
              role="tab"
              :aria-selected="i === selected"
              :aria-label="t('hero.slider.goTo', { n: i + 1 })"
              class="relative h-2.5 overflow-hidden rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
              :class="[
                i === selected ? 'w-14' : 'w-2.5 hover:w-5',
                slides[selected]?.theme === 'light' ? 'bg-navy/15' : 'bg-white/30',
              ]"
              @click="go(i)"
            >
              <span
                v-if="i === selected"
                :key="tick"
                class="absolute inset-y-0 left-0 rounded-full"
                :class="[slides[selected]?.theme === 'light' ? 'bg-slide-progress' : 'bg-white', ticking && autoplaying ? 'hero-progress' : 'w-full']"
                :style="{ animationDuration: `${DELAY}ms` }"
              />
            </button>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-arrow {
  @apply absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border-[1.5px] border-line bg-white text-navy shadow-float transition duration-200 hover:border-violet hover:text-violet focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet max-sm:hidden;
}
.hero-progress {
  animation: hero-progress linear forwards;
}
@keyframes hero-progress {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero-progress {
    animation: none;
    width: 100%;
  }
}
</style>
