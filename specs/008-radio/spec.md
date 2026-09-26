# Feature Specification: NovaLine Radio Page

**Feature Branch**: `008-radio`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "Implement the Radio page from the prototype (Radio.dc.html): full-screen navy page with background photo, 'У ЕФІРІ' badge, 'NovaLine Radio' heading, subtitle, genre chips and a glass player card with artwork, now playing, animated equaliser, play/pause, volume slider and stream quality selection."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor listens to the stream (Priority: P1)

On `/radio` the visitor presses the large coral play button; the stream starts, the button becomes pause, and the 20-bar equaliser animates (coral every 3rd bar, violet otherwise). Pressing again pauses.

**Independent Test**: Play/pause works in Chrome, Safari (iOS), Firefox; no autoplay on load.

**Acceptance Scenarios**:

1. **Given** the stream URL fails, **Then** an inline error "Потік тимчасово недоступний" and the button returns to play.
2. **Given** playback, **Then** Media Session metadata (title "NovaLine Live Mix", artist, artwork) is set for lock-screen controls.

---

### User Story 2 - Visitor adjusts volume and quality (Priority: P2)

The volume slider (0–100, shows "%") changes volume immediately and is remembered in `localStorage`; quality buttons (HQ 320 / Standard 128 / Economy 64 kbps) switch the source, continuing playback if playing.

### Edge Cases

- Reduced motion → equaliser static.
- Mobile ≤ 600px → layout per prototype (single column, smaller art, "На сайт" text hidden).
- localStorage unavailable → default volume 70.

## Clarifications

### Session 2026-09-26

- Q: Real stream URLs? → A: Taken from the current novaline.net radio page (Icecast at stream.novaline.net.ua).
- Q: Photos? → A: Gradients; CMS images override.

## Requirements *(mandatory)*

- **FR-001**: Route `/radio` (+ `/en/radio`) inside a minimal layout (logo + "На сайт" back link) as in the prototype, not the full landing shell.
- **FR-002**: Content (title, subtitle, genres, streams with label/bitrate/url, now-playing texts, background/artwork images) from the CMS `radio` single type.
- **FR-003**: Audio via a single `<audio preload="none">`; player is client-only; page content is SSR.
- **FR-004**: Accessible controls: play button `aria-pressed` + label, slider labelled, quality as radio group.

## Success Criteria *(mandatory)*

- **SC-001**: Time from click to audio < 2 s on 4G for the Standard stream.
- **SC-002**: Page SEO 100 / A11y ≥ 95.

## Assumptions

- Streams (found on novaline.net/home/radio-2): `https://stream.novaline.net.ua/Novaline_{128,192,256,320}` (audio/mpeg, CORS `*`); the UI offers 320/192/128. Icecast `status-json.xsl` provides the live track title ("now playing").
- Background and artwork use brand gradients by default; photos uploaded to the CMS replace them. Nothing is hot-linked from Unsplash.
- The CMS `radio.indexable` flag controls noindex/sitemap.
