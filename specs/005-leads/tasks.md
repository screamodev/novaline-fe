# Tasks: Lead Form & Callback

- [x] T001 [be] `privacy-page` single type + seed placeholder (uk/en) + contract R21
- [x] T002 [be] `telegram.ts` (format + send, `TELEGRAM_API_BASE`), `afterCreate` fire-and-forget, bootstrap warning, `tsx --test`
- [x] T003 [fe] `shared/utils/phone.ts`, `shared/schemas/lead.ts` + tests
- [x] T004 [fe] `server/utils/rate-limit.ts` + test; `strapiPost`; `server/api/leads.post.ts`
- [x] T005 [US1] `LeadSection.vue` (type switch, address selects, fields, topics, errors, success) + `useLeadAddress`
- [x] T006 [US1] Lead context → topic/message prefill
- [x] T007 [US2] `CallbackDialog.vue` phone form + success
- [x] T008 `ui/RichText.vue`, `server/api/cms/privacy.get.ts`, `pages/privacy.vue`
- [x] T009 Analytics events, i18n strings, remove `LeadTeaser`
- [x] T010 Gates + e2e (Strapi record, honeypot, 429, Telegram mock)

## Notes (2026-09-26)
- Rate limit keys on the right-most X-Forwarded-For entry (appended by Caddy), not the spoofable left-most.
- E2E: inline errors + focus, successful lead and callback, plan CTA → topic, Escape closes the dialog, /privacy uk/en; curl: honeypot/too-fast → silent ok, 422 with field keys, 6th request → 429; Telegram verified with a mock server.
