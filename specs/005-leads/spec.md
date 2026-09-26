# Feature Specification: Lead Form & Callback

**Feature Branch**: `005-leads`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "Connection request form (new connection / question-issue with topic list, address block prefilled from the coverage check, name, phone, optional message) and the 'Зворотній дзвінок' callback dialog. Submissions are stored in Strapi and managers get a Telegram notification."

Repos: `[fe]` form UI + `/api/leads` server route; `[be]` `lead` collection (001) + lifecycle hook → Telegram.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor requests a connection (Priority: P1)

In `#lead` (violet→coral gradient card) the visitor sees the type switch ("Нове підключення" / "Питання / проблема"), an address block (region, district, settlement, neighbourhood if applicable), name, phone, topic select, optional message, the coral "Відправити заявку" button and the privacy note. On success the form is replaced by a ✓ "Дякуємо!…" message.

**Why this priority**: The primary business outcome of the site.

**Independent Test**: Submit a valid form → lead exists in Strapi with all fields and status `new`; Telegram test chat receives a formatted message.

**Acceptance Scenarios**:

1. **Given** type "Питання / проблема", **Then** the topic list switches to issue topics and the selected topic resets.
2. **Given** a coverage result, **When** "Залишити заявку" was clicked, **Then** the address block is prefilled and editable.
3. **Given** a CTA from a plan/TV/shop/DC/promo card, **Then** the matching topic is preselected (or appended to the message when no topic matches).
4. **Given** invalid phone (not a UA number), **Then** inline error in the current locale, focus moves to the field, nothing is sent.
5. **Given** a network/server error, **Then** an error message with the phone number is shown and input is preserved.

---

### User Story 2 - Visitor asks for a callback (Priority: P1)

The floating "Зворотній дзвінок" button opens a dialog with a phone field and "Передзвоніть мені"; success shows ✓ "Готово!…".

**Acceptance Scenarios**:

1. **Given** the dialog, **Then** it traps focus, closes by ×, Escape and overlay click, and restores focus to the trigger.
2. **Given** a valid phone, **Then** a lead with type `callback` is created.

---

### User Story 3 - Managers are notified instantly (Priority: P1)

When a lead is created, the configured Telegram chat receives: type, name, phone (tap-to-call), topic, address, message, locale, page, admin link.

**Acceptance Scenarios**:

1. **Given** Telegram is unreachable, **Then** the lead is still saved and the error is logged (no user-facing failure).
2. **Given** no bot token configured, **Then** notifications are skipped silently with a startup warning.

---

### User Story 4 - Spam is filtered (Priority: P2)

Bots filling the hidden honeypot field, or submitting faster than 2 s after render, or exceeding 5 submissions / 10 min per IP are rejected (honeypot/time → fake success; rate limit → 429 message).

### Edge Cases

- Phone formats: `+380985060609`, `098 506 06 09`, `(098) 506-06-09` → normalised to `+380985060609`.
- Double-click submit → one lead (button disabled while pending, idempotency key).
- Message > 1,000 chars → rejected with a hint.

## Clarifications

### Session 2026-09-26

- Q: Privacy policy? → A: CMS single type `privacy-page`, page `/privacy`, placeholder text in seed.
- Q: Telegram bot available? → A: Later. Notification code ships now; without token/chat id it is skipped with a startup warning.
- Q: No-JS form fallback? → A: Not required; the form submits via fetch.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `[fe]` `POST /api/leads` validates with a shared zod schema (type, name 2–60, phone UA, reason from allowed list, message ≤ 1000, location fields, honeypot, renderedAt, locale, sourcePath), normalises phone, and creates the lead in Strapi with the server-only create token.
- **FR-002**: `[fe]` Rate limiting per IP (5 / 10 min) in Nitro storage; responses never echo internal errors.
- **FR-003**: `[be]` `lead.afterCreate` lifecycle sends a Telegram `sendMessage` (HTML parse mode, escaped) to `TELEGRAM_CHAT_ID`; failures are logged, not thrown.
- **FR-004**: Topic lists (connect/issue) are UI micro-copy in i18n JSON; the stored value is a stable key plus the localised label.
- **FR-005**: The form uses native inputs with labels, `autocomplete` (`name`, `tel`), `inputmode="tel"`, and error messages linked via `aria-describedby`.
- **FR-006**: Analytics events `lead_submit_success` / `callback_submit_success` are emitted (provider-agnostic hook).
- **FR-007**: The privacy note links to `/privacy` (and `/en/privacy`), a CMS-managed page (`privacy-page` single type) seeded with placeholder text for the client to replace.

## Success Criteria *(mandatory)*

- **SC-001**: 100% of valid submissions are persisted; notification delivered in < 5 s for ≥ 99%.
- **SC-002**: Form completion (connect) takes < 60 s for a first-time visitor.
- **SC-003**: < 1% of stored leads are spam after one month.

## Assumptions

- A Telegram bot and group chat will be created by the client; until then, the token is empty and notifications are skipped.
- Leads are handled manually by managers in the Strapi admin (status field).
