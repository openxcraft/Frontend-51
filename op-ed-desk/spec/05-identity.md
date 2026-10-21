# 05 — Identity: op-ed-desk

SME-D/E/I pass · Ledger row 10 (design-language-map §4, BINDING): "Sahafa Newsprint" — paper oklch(0.94 0.01 250)n / ink oklch(0.25 0.02 250)n + editorial red oklch(0.55 0.18 25) · P03 · density A · flat-line · line-1.5 · minimal motion · AR-indic optional · bilingual-ar · T3. Neutral-slot primary: hue-exempt, distinct by temperature (cool 250) + red accent strategy.

## Color (OKLCh intent + hex approximations)

- **Paper — oklch(0.94 0.01 250) ≈ #EDEEF2**: queue canvas; cool newsprint, deliberately not cream — a utilitarian desk tool, not a reading product.
- **Ink — oklch(0.25 0.02 250) ≈ #2B2D36**: text, chrome, table rules. Ink-on-paper ≈ 12.5:1 (AAA) — headroom for dense queue metadata.
- **Editorial red — oklch(0.55 0.18 25) ≈ #C33D23**: the proofreader's pen — ONLY annotation/accent ink: finding anchors, integrity severity, override moments, destructive confirms. Declared contract: 4.5:1 on paper for text-bearing accents (verified at definition), 3:1 as UI ink; pressed variant oklch(0.45 0.16 25) for small-text red below contract. Red ≤5% of any screen.
- **Findings severity**: policy = red, style = muted ink oklch(0.45 0.03 250), integrity = red + underline pattern (never color alone). Success ink oklch(0.55 0.09 150); status-info oklch(0.50 0.08 250).
- Single paper theme at v1 (newsprint is inherently light); night-desk dark re-bind deferred (12 Q-9).

## Typography (P03 — Noto Naskh Arabic + Newsreader)

- **Arabic: Noto Naskh Arabic** (400/700) — the newspaper body hand; submission text and letters ≥17px equivalent; queue metadata ≥13px; real weight set only, no synthetic bold (rtl-rules §3).
- **Latin: Newsreader** (400/500/600/700) — editorial serif partner; the queue reads as a paper, not a dashboard. One pairing for reading surfaces AND chrome.
- Line-height: Arabic body 1.7 (1.9 with tashkeel — reading views reserve room); Latin 1.55. Tracking 0 for Arabic (token-level).
- **Numerals: AR-indic optional** (ledger): Western in queue/table metadata and canonical storage; ٠-٩ offered in Arabic prose contexts (submission display, AR letters) as a declared toggle — display formatting only.

## Direction model

**bilingual-ar** (proposed, LOOP-6 pending confirmation): desk geography Arabic-first, English full citizen; submission text renders at its own direction in an isolating container; blind workspace and composer work both directions on every screen. Matrix in 09.

## Shape, elevation, iconography, motion

- **Density A (cut, 0–4px)**: queue rows, finding chips, letter paper — print furniture; pills forbidden.
- **Elevation: flat-line**: hairline rules carry all structure, zero shadows — a ruled ledger page; the decision letter sheet is "raised" by a border-weight step only.
- **Icons: line-1.5 editorial**: thin queue actions (advance/decline/hold), marginalia ticks for findings, a stamp-like anonymization mark. No sparkle glyphs — lint affordances are proofreader ticks, not magic.
- **Motion: minimal**: opacity-only ≤120ms; position changes instant with crossfade; list→detail hard-cut crossfade; decision-sent confirmation is a state chip, never animation-carried information. Reduced-motion = hard cuts + polite announcements — identical to default by construction.

## Brand-distance check (LOOP-11)

Nearest neighbors: newspaper masthead chrome (cream+black+serif) and submission-portal blue dashboards. Distance: cool-tinted paper (250, not cream); red as annotation ink, not brand flood; cut radius + ruled-table flatness reading as production-desk tool; Naskh/Newsreader where mastheads use display serifs. Clear on both.

## ui-ux-pro-max integration record (LOOP-9 — conflicts + resolutions)

Inputs: `search.py "editorial submission review workflow newsroom" --design-system -p "OpEdDesk"`; variant `"manuscript slush pipeline publishing review"`; `--domain style "editorial submission desk"`; `--domain typography "editorial serif newspaper typography"`; CSV scans (ux-guidelines, ux-reasoning, styles, colors, typography, icons).

**Adopted (no ledger conflict):** Flat Design guidance ("no shadows, clean lines, typography-focused") — converges with flat-line elevation. Newsreader as Latin serif — CONVERGES with ledger P03. Swiss-grid discipline (strict grid, single accent) — queue-grid discipline; reinforces red's ≤5% restraint. Editorial Grid/Magazine conventions — ADVISORY for the blind-workspace reading view (print-like column rhythm; page-flip/parallax REJECTED per motion anti-patterns). ux-guidelines: double-submit prevention on composer/review submit (High — adopted, busy-state buttons); submit feedback; table overflow handling; loaders only >300ms (P02-aligned); empty-state guidance (P01); no forced tours (P22); realistic sample data (→ 07c seeds). Checklist: no emoji icons (line-1.5 SVG); visible focus; prefers-reduced-motion; 4.5:1 light-theme contrast; breakpoints 375/768/1024/1440.

**Rejected (ledger row binding wins; six conflicts recorded):**
1. Skill palette "editorial black + accent pink #EC4899" → pink REJECTED vs ledger editorial red; paper/ink kept (ledger-bound).
2. colors.csv News/Media "breaking red + link blue #1E40AF" → red CONVERGES (kept); link blue REJECTED — ink is the link color; single-accent system holds.
3. Typography suggestions Libre Bodoni/Public Sans and Cormorant/Libre Baskerville → REJECTED vs binding P03.
4. "Roboto as UI sans" → REJECTED — no third family; UI text stays in-pairing.
5. Hover "150–300ms smooth transitions" → ADJUSTED to minimal personality: opacity-only ≤120ms.
6. ux-reasoning "Product Review/Ratings" pattern (aggregate rating + buy CTA) → REJECTED as literal; its transferable principle (aggregate + individual reviews shown together) adopted as the S5 round-summary layout.
