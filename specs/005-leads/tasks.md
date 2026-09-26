# Tasks: Lead Form & Callback

- [ ] T001 [be] `privacy-page` single type + seed placeholder (uk/en) + contract R21
- [ ] T002 [be] `telegram.ts` (format + send, `TELEGRAM_API_BASE`), `afterCreate` fire-and-forget, bootstrap warning, `tsx --test`
- [ ] T003 [fe] `shared/utils/phone.ts`, `shared/schemas/lead.ts` + tests
- [ ] T004 [fe] `server/utils/rate-limit.ts` + test; `strapiPost`; `server/api/leads.post.ts`
- [ ] T005 [US1] `LeadSection.vue` (type switch, address selects, fields, topics, errors, success) + `useLeadAddress`
- [ ] T006 [US1] Lead context → topic/message prefill
- [ ] T007 [US2] `CallbackDialog.vue` phone form + success
- [ ] T008 `ui/RichText.vue`, `server/api/cms/privacy.get.ts`, `pages/privacy.vue`
- [ ] T009 Analytics events, i18n strings, remove `LeadTeaser`
- [ ] T010 Gates + e2e (Strapi record, honeypot, 429, Telegram mock)
