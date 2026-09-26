# Implementation Plan: AI Assistant Chat

**Spec**: [spec.md](./spec.md) · **Status**: Implemented 2026-09-27

## Architecture

```
Widget (AssistantPanel, lazy)  ──POST /api/assistant──▶  Nitro route
   │  sessionStorage history                              │ zod → rate limit (20/10 min/IP)
   │  parseActions → buttons                              │ key empty / sk-placeholder → fallback JSON
   ◀── text/plain stream  or  {mode:'fallback', text} ────┤ getAssistantPrompt(locale)  (cachedCms, webhook-purged)
                                                          │   ← /api/cms/home + global + coverage + assistant-settings
                                                          └ streamOpenAi(): first token ≤ 15 s else fallback
```

## Key decisions

- **Grounding**: the system prompt is rebuilt from the same cached BFF reads the pages use (`shared/utils/assistant-prompt.ts`), so a price change in Strapi reaches the assistant with the webhook purge. Neighbourhood prices are precomputed (the model mis-applied surcharges when given modifiers only).
- **Streaming**: plain text chunks, not SSE, to keep the client a simple `ReadableStream` reader. The server waits for the first token before committing to a stream, so early OpenAI failures still degrade to the CMS fallback.
- **Actions**: the model appends `[[lead]]`, `[[callback]]`, `[[coverage]]`; `parseActions` strips them (including half-streamed tokens) and renders buttons.
- **Privacy**: settings `promptAddendum` / `fallbackReplies` never leave the server; message texts are not logged; history lives only in the visitor's sessionStorage.
- **Feature flag**: `NUXT_PUBLIC_FEATURES_ASSISTANT=false` hides the widget.

## Files

- `server/api/assistant.post.ts`, `server/api/cms/assistant.get.ts`, `server/utils/assistant.ts`
- `shared/schemas/assistant.ts`, `shared/types/assistant.ts`, `shared/utils/assistant.ts`, `shared/utils/assistant-prompt.ts`
- `app/components/assistant/AssistantPanel.vue`, `app/composables/useAssistantChat.ts`, `app/components/layout/FloatingActions.vue`
- Tests: `tests/assistant.test.ts`; e2e scenario in the QA report.
