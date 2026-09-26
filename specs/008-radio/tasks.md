# Tasks: NovaLine Radio
- [x] T001 [be] `radio.indexable`, `radio.statusUrl`; real streams in seed (refresh); contract R20
- [x] T002 `shared/utils/icecast.ts` (pick title by listen URL/bitrate) + test; radio + now-playing BFF routes
- [x] T003 `/radio` page (header, hero, genres) with gradients / CMS images
- [x] T004 `RadioPlayer.vue` (audio, play/pause, eq, volume persisted, quality switch, Media Session, errors, now-playing polling)
- [x] T005 SEO (indexable flag, sitemap), gates, e2e (real stream request), screenshots vs prototype

## Notes (2026-09-26)
- Live stream verified: play → Novaline_320, quality switch continues on Novaline_128, volume persisted, now playing from Icecast (real track titles).
- `indexable=false` → noindex + removed from sitemap (hook), verified by toggling in the DB.
- Lighthouse: Perf 93, A11y 100, BP 100.
