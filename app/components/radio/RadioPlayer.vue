<script setup lang="ts">
import type { RadioVM } from '#shared/types/radio'
import type { NowPlaying } from '#shared/utils/icecast'

const props = defineProps<{ radio: RadioVM }>()
const { t } = useI18n()
const VOLUME_KEY = 'nl_radio_vol'

const audio = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const failed = ref(false)
const volume = ref(70)
const streamIndex = ref(0)
const stream = computed(() => props.radio.streams[streamIndex.value])

// Live track title, refreshed every 20 s while the tab is visible.
const nowPlaying = ref<NowPlaying | null>(null)
async function refreshNowPlaying() {
  if (!props.radio.hasStatus || !stream.value || document.visibilityState !== 'visible') return
  const res = await $fetch<{ nowPlaying: NowPlaying | null }>('/api/radio/now-playing', { query: { stream: stream.value.url } }).catch(() => null)
  nowPlaying.value = res?.nowPlaying ?? null
}
const title = computed(() => nowPlaying.value?.title ?? props.radio.nowPlayingTitle)
const artist = computed(() => (nowPlaying.value ? nowPlaying.value.artist ?? '' : props.radio.nowPlayingArtist))

function setMediaSession() {
  if (!('mediaSession' in navigator)) return
  navigator.mediaSession.metadata = new MediaMetadata({
    title: title.value,
    artist: artist.value || props.radio.title,
    album: props.radio.title,
    artwork: [{ src: '/images/novaline-logo.png', sizes: '256x256', type: 'image/png' }],
  })
}
watch([title, artist], () => playing.value && setMediaSession())

async function play() {
  const el = audio.value
  if (!el || !stream.value) return
  failed.value = false
  if (el.src !== stream.value.url) el.src = stream.value.url
  try {
    await el.play()
    playing.value = true
    setMediaSession()
  } catch {
    failed.value = true
  }
}
function toggle() {
  if (playing.value) audio.value?.pause()
  else void play()
}
function pick(i: number) {
  streamIndex.value = i
  void refreshNowPlaying()
  if (playing.value) void play()
}
function onQualityKey(e: KeyboardEvent, i: number) {
  const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
  if (!step) return
  e.preventDefault()
  const next = (i + step + props.radio.streams.length) % props.radio.streams.length
  pick(next)
  ;(e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('[role=radio]')[next]?.focus()
}

watch(volume, (v) => {
  if (audio.value) audio.value.volume = v / 100
  try {
    localStorage.setItem(VOLUME_KEY, String(v))
  } catch {
    /* storage unavailable (private mode): volume just is not remembered */
  }
})

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  try {
    const saved = Number.parseInt(localStorage.getItem(VOLUME_KEY) ?? '', 10)
    if (saved >= 0 && saved <= 100) volume.value = saved
  } catch {
    /* default volume */
  }
  if (audio.value) audio.value.volume = volume.value / 100
  void refreshNowPlaying()
  timer = setInterval(refreshNowPlaying, 20_000)
  document.addEventListener('visibilitychange', refreshNowPlaying)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  document.removeEventListener('visibilitychange', refreshNowPlaying)
  audio.value?.pause()
})

const bars = Array.from({ length: 20 }, (_, i) => i)
const barStyle = (i: number) =>
  playing.value
    ? { animation: `eq ${(0.8 + (i % 5) * 0.12).toFixed(2)}s ease-in-out ${(i * 0.05).toFixed(2)}s infinite` }
    : { transform: `scaleY(${(0.2 + (i % 4) * 0.12).toFixed(2)})`, opacity: '.55' }
</script>

<template>
  <div class="rounded-[26px] border border-white/[.16] bg-white/[.07] p-[26px] shadow-radio-card backdrop-blur-[16px] max-sm:rounded-[20px] max-sm:p-5">
    <div class="flex items-center gap-[18px]">
      <div class="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-[18px] shadow-radio-art max-sm:h-20 max-sm:w-20">
        <NuxtImg v-if="radio.artwork" :src="radio.artwork.src" :alt="radio.artwork.alt" width="208" height="208" class="h-full w-full object-cover" />
        <div v-else class="h-full w-full bg-radio-art" />
        <div class="absolute inset-0 bg-radio-art-tint" />
        <span class="absolute bottom-2 left-2 grid h-[26px] w-[26px] place-items-center rounded-lg bg-black/50 text-white" aria-hidden="true">
          <AppIcon :name="playing ? 'pause' : 'play'" :size="13" />
        </span>
      </div>
      <div class="min-w-0 flex-1" aria-live="polite">
        <div class="text-[11.5px] font-semibold uppercase tracking-[.06em] text-on-dark-dim">{{ t('radio.nowPlaying') }}</div>
        <div class="mt-[5px] truncate font-display text-[19px] font-bold text-white">{{ title }}</div>
        <div v-if="artist" class="mt-[3px] truncate text-[13.5px] text-on-dark-dim">{{ artist }}</div>
      </div>
    </div>

    <div class="mt-[22px] flex h-[38px] items-end gap-1" aria-hidden="true">
      <span
        v-for="i in bars"
        :key="i"
        class="h-full flex-1 origin-bottom rounded-sm motion-reduce:!animate-none"
        :class="i % 3 === 0 ? 'bg-coral' : 'bg-violet-2'"
        :style="barStyle(i)"
      />
    </div>

    <div class="mt-[22px] flex items-center gap-[18px]">
      <button
        type="button"
        class="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-coral-strong text-white shadow-fab-coral"
        :aria-pressed="playing"
        :aria-label="playing ? t('radio.pause') : t('radio.play')"
        @click="toggle"
      >
        <AppIcon :name="playing ? 'pause' : 'play'" :size="26" />
      </button>
      <div class="flex min-w-0 flex-1 items-center gap-[11px]">
        <AppIcon name="volume" :size="19" class="text-on-dark-dim" />
        <input v-model.number="volume" type="range" min="0" max="100" class="nl-range min-w-0 flex-1" :aria-label="t('radio.volume')">
        <span class="w-[34px] text-right text-[12.5px] tabular-nums text-on-dark-footer">{{ volume }}%</span>
      </div>
    </div>

    <div class="mt-6 border-t border-line-dark pt-5">
      <div id="radio-quality" class="mb-[11px] text-[12px] font-semibold text-on-dark-footer">{{ t('radio.quality') }}</div>
      <div class="flex flex-wrap gap-[9px]" role="radiogroup" aria-labelledby="radio-quality">
        <button
          v-for="(s, i) in radio.streams"
          :key="s.url"
          type="button"
          role="radio"
          :aria-checked="i === streamIndex"
          :tabindex="i === streamIndex ? 0 : -1"
          class="flex flex-col items-start gap-0.5 rounded-[13px] border-[1.5px] px-4 py-[11px] text-white transition duration-200"
          :class="i === streamIndex ? 'border-violet-2 bg-violet/30' : 'border-line-dark bg-white/5 hover:border-line-dark-strong'"
          @click="pick(i)"
          @keydown="onQualityKey($event, i)"
        >
          <span class="font-display text-[14px] font-bold">{{ s.bitrate }}</span>
          <span class="text-[11px] opacity-75">{{ s.label }}</span>
        </button>
      </div>
    </div>
    <p v-if="failed" class="mt-4 text-[13px] text-on-dark-pink" role="alert">{{ t('radio.error') }}</p>

    <audio ref="audio" preload="none" @play="playing = true" @pause="playing = false" @error="(failed = playing), (playing = false)" />
  </div>
</template>
