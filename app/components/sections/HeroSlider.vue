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
/** Autoplay is on unless the visitor paused it or prefers reduced motion (assumed on during SSR, so the icon does not flip). */
const playing = ref(multiple.value)
/** The current timer is running (it stops while hovered/focused); drives the progress bar. */
const ticking = ref(false)
const tick = ref(0)

const pad = (n: number) => String(n).padStart(2, '0')

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
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) playing.value = false
  else play()
})

function play() {
  playing.value = true
  autoplay.play()
}
function pause() {
  playing.value = false
  ticking.value = false
  autoplay.stop()
}
const toggle = () => (playing.value ? pause() : play())
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
          <div class="flex touch-pan-y" :aria-live="playing ? 'off' : 'polite'">
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

        <!-- Controls: progress pills (left), counter + pause + arrows (right). -->
        <div
          v-if="multiple"
          class="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 px-14 pb-8 max-lg:px-10 max-sm:justify-start max-sm:px-5 max-sm:pb-6"
        >
          <div class="pointer-events-auto flex items-center gap-2" role="tablist" :aria-label="t('hero.slider.label')">
            <button
              v-for="(slide, i) in slides"
              :key="slide.key"
              type="button"
              role="tab"
              :aria-selected="i === selected"
              :aria-label="t('hero.slider.goTo', { n: i + 1 })"
              class="group relative h-2.5 overflow-hidden rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
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
                :class="[slides[selected]?.theme === 'light' ? 'bg-slide-progress' : 'bg-white', ticking && playing ? 'hero-progress' : 'w-full']"
                :style="{ animationDuration: `${DELAY}ms` }"
              />
            </button>
          </div>

          <div class="pointer-events-auto flex items-center gap-2.5">
            <span
              class="mr-0.5 grid h-11 place-items-center rounded-full bg-white px-4 font-display text-[14px] font-bold tabular-nums text-navy shadow-chip max-sm:hidden"
              aria-hidden="true"
            >
              <span>{{ pad(selected + 1) }} <span class="text-muted">/ {{ pad(slides.length) }}</span></span>
            </span>
            <button
              type="button"
              class="hero-ctrl grid"
              :aria-label="playing ? t('hero.slider.pause') : t('hero.slider.play')"
              @click="toggle"
            >
              <AppIcon :name="playing ? 'pause' : 'play'" :size="16" :stroke-width="2.4" />
            </button>
            <button type="button" class="hero-ctrl grid max-sm:hidden" :aria-label="t('hero.slider.prev')" @click="prev">
              <AppIcon name="arrowLeft" :size="18" :stroke-width="2.4" />
            </button>
            <button type="button" class="hero-ctrl grid max-sm:hidden" :aria-label="t('hero.slider.next')" @click="next">
              <AppIcon name="arrowRight" :size="18" :stroke-width="2.4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-ctrl {
  @apply h-11 w-11 place-items-center rounded-full border-[1.5px] border-line bg-white text-navy shadow-chip transition duration-200 hover:border-violet hover:text-violet focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet;
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
