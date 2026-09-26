# Implementation Plan: Lead Form & Callback

**Branch**: main | **Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

## Summary
A shared zod schema validates leads on both client and server. `POST /api/leads` (Nuxt) applies honeypot, minimum fill time and a per-IP rate limit, then creates the lead in Strapi with the server token. Strapi's `lead.afterCreate` sends a Telegram message (skipped until a token exists). The `#lead` placeholder becomes the prototype form, the callback dialog gets its phone form, and `/privacy` renders a CMS page.

## Technical Context
**Stack**: Nuxt 4, zod 4, Strapi 5 lifecycles · **Testing**: Vitest (schema, phone, rate limit), `tsx --test` in be (Telegram message format), mock Telegram server for e2e

## Constitution Check
I ✅ privacy text in CMS, topics in i18n · II ✅ tokens only · V ✅ labelled inputs, `aria-describedby`, focus management, dialog trap · VI ✅ server-only token, zod, honeypot, rate limit, secrets in env · VIII ✅ no new deps

## Structure
```text
[fe] shared/utils/phone.ts, shared/schemas/lead.ts, server/utils/rate-limit.ts, server/api/leads.post.ts,
     server/api/cms/privacy.get.ts, app/components/lead/LeadSection.vue, layout/CallbackDialog.vue,
     ui/RichText.vue, app/pages/privacy.vue, app/composables/useLeadAddress.ts
[be] src/api/privacy-page/*, src/api/lead/services/telegram.ts, lifecycles afterCreate, seed + contract R21
```
