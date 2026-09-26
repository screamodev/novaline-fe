# Implementation Plan: NovaLine Radio

**Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

## Summary
`/radio` in the minimal layout per `Radio.dc.html`: gradient hero, player card with live "now playing" (Icecast status JSON via a cached BFF route), equaliser, play/pause, persisted volume, quality radiogroup, Media Session metadata. Streams and texts come from the CMS `radio` single type (new fields `indexable`, `statusUrl`).

## Constitution Check
I ✅ streams/texts in CMS · II ✅ gradients/eq colours from tokens · IV ✅ SSR content, indexable flag · V ✅ labelled controls, radiogroup, aria-pressed, reduced motion · VI ✅ now-playing proxied server-side

## Structure
```text
server/api/cms/radio.get.ts · server/api/radio/now-playing.get.ts · shared/utils/icecast.ts (+test)
app/pages/radio.vue · app/components/radio/RadioPlayer.vue · [be] radio schema + seed refresh
```
