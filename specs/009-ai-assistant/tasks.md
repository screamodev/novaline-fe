# Tasks: AI Assistant Chat

- [x] T001 Types, zod request schema, settings normaliser (`shared/`)
- [x] T002 Keyword fallback matcher + action token parser, unit tests
- [x] T003 System prompt builder from CMS data (plans, add-ons, TV, promos, payment, DC, shop, coverage + neighbourhood prices, contacts), unit test
- [x] T004 `/api/cms/assistant` (public widget texts only)
- [x] T005 `/api/assistant`: validation, rate limit, fallback mode, OpenAI streaming with first-token timeout
- [x] T006 `AssistantPanel` per prototype (lazy, aria-live/aria-busy, Esc, focus return, sessionStorage history, quick chips, demo label)
- [x] T007 Action buttons → lead form / callback dialog / coverage
- [x] T008 i18n uk/en, analytics events without message text, feature flag on by default
- [x] T009 Manual audit with a real key: prices match CMS, off-topic refusal, prompt-injection refusal, EN replies
- [x] T010 e2e 1440/390: chip answer, typed question, action navigation, history across pages, Esc + focus, clean console
