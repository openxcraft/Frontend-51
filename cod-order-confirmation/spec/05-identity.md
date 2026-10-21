# 05 — Identity: cod-order-confirmation

SME-D + SME-E + SME-I pass · Slot source: design-language-map.md ledger row 31 (BINDING): "Task Courier Carbon" — chrome oklch(0.24 0.015 260)n + signal-orange accent oklch(0.75 0.15 38) | pairing P04 | radius A (cut) | ink-press elevation | outline-geometric iconography | crisp motion | Western numerals | bilingual-ar | T1. This is a dual-token identity (carbon chrome as the surface system + signal-orange as the intent accent) in the same family as the ledger's other ink-press composites.

## LOOP-2 hue analysis (collision check against named neighbors)

The chrome token is a **neutral slot** (C 0.015 ≤ 0.03 — exempt from hue uniqueness by ledger §6, but obliged to differ in temperature and accent strategy). Nearest composite neighbors, all held distinct:

- **funnel-drop-off-explorer** (T1, ink-press): canvas oklch(0.22 0.05 212) + chartreuse accent oklch(0.82 0.16 105), P14, A, line-2, crisp — same elevation family and tier; distinguished by canvas chroma (0.05 blue-tinged vs our 0.015 near-neutral graphite), accent hue (105 chartreuse vs 38 signal-orange — 67° apart, different temperature strategy), pairing (P14 Rubik/Space Mono vs P04 Cairo/Sora), icon style (line-2 vs outline-geometric).
- **caption-lab** (T2, ink-press): Sinema Cyan oklch(0.72 0.11 210) on chrome oklch(0.19 0.02 240), P02, A, crisp — darker and bluer chrome, cyan accent 172° from our orange; pairing and icon style differ.
- **shift-swap-marketplace** (T1): accent-side proximity — Nahas Copper oklch(0.58 0.13 45) is 7° in hue from our signal-orange 38, and the ssm 05 already records this pair as a managed proximity: copper is a LIGHT-THEME primary on warm paper at L 0.58; our orange is a dark-theme ACCENT at L 0.75 C 0.15 on carbon. Composite distance holds across theme polarity, lightness strategy, radius (C vs A), elevation (soft-lift vs ink-press), icon style (duotone vs outline-geometric), and motion (energetic vs crisp).
- **expense-claim-flow** (vermilion 20, light soft-lift, P06, T2) and **content-remix-studio** (coral 30, light soft-lift, P11, T3) share the warm band at 18°/8° — both light-theme primaries with different pairings, radii, and motion; composite distinct.

P04 pairing co-users (this is the 4th and final P04 seat under the ≤4 cap): shift-swap-marketplace (C, soft-lift, duotone, energetic, light), ad-spend-consolidator (B, soft-lift, duotone, crisp, light), marketplace-listing-sync (B, flat-line, outline-geometric, crisp, light). Ours differs from every co-user in weight strategy (see typography), radius (A cut), elevation (ink-press), theme polarity (dark), and icon construction — the composite tuple is unique in the ledger.

## Color (OKLCh intent + computed hex + contrast ladder)

Hexes computed by the standard OKLab→sRGB transform at spec time (deterministic; recorded so implementations verify) and are reference approximations — Layer 1 primitives bind them, Layer 2 owns meaning (token-architecture §1). Contrast ratios computed by the standard WCAG relative-luminance formula against each paired background's stated hex, then re-verified at the completion pass (every ratio below reproduces from the stated hexes); every declared pair meets its contract at definition time (token-architecture §2.3). **The product ships a single theme: the carbon ink-press dark system** (an ops-room console under mixed lighting — chrome-dark by design, like the dispatch desks it replaces; a light re-bind would be a v2 decision carrying its own full contrast declaration per token-architecture §2.10 — not assumed here).

| Token (Layer 2 intent) | OKLCh primitive | Computed hex | Declared pair & measured contrast |
|---|---|---|---|
| surface.canvas — "carbon chrome" | oklch(0.24 0.015 260) | #1B1F27 | the base; cool near-neutral graphite |
| surface.raised — one elevation step | oklch(0.29 0.018 260) | #262C34 | ink-press elevation by lightness step (no shadows) |
| surface.wash — two steps | oklch(0.345 0.022 260) | #333A45 | drawer/sheet headers, table header rows |
| surface.sunken — recessed inputs | oklch(0.195 0.012 260) | #12151A | text.primary on sunken **14.89:1** (AAA) |
| surface.selected — orange-tinted selection | oklch(0.33 0.05 38) | #4B2C22 | text.primary on selected **10.16:1** (AAA); accent.primary on selected 5.31:1 (AA) |
| accent.primary — "signal-orange" | oklch(0.75 0.15 38) | #FD8965 | on canvas **7.03:1**, on raised 5.99:1, on wash 4.88:1 — AA body text where used; UI components everywhere |
| accent.deep | oklch(0.68 0.135 38) | #DE7858 | on canvas 5.45:1 — clears AA body numerically; role remains UI components & large text (deep is the pressed/hover member of the orange ramp, not a text token — accent discipline, not contrast necessity) |
| accent.bright — focus ring + dark-bg emphasis | oklch(0.82 0.135 42) | #FFA57D | on canvas **8.59:1**, on raised 7.32:1, on wash 5.97:1, on selected 6.50:1 |
| text.primary | oklch(0.93 0.008 260) | #E5E8ED | on canvas **13.44:1** / raised **11.46:1** / wash **9.33:1** / sunken 14.89:1 / selected 10.16:1 — **AAA on every surface** (deliberately not #FFFFFF: near-white avoids halation on carbon) |
| text.secondary | oklch(0.78 0.012 260) | #B3B8BF | on canvas **8.28:1**, raised 7.05:1, wash 5.75:1 — AA body everywhere, AAA on canvas/raised (timestamps, secondary labels) |
| text.muted | oklch(0.74 0.012 260) | #A6ABB3 | on canvas 7.15:1 — clears AAA numerically; reserved for de-emphasized content (tertiary labels, inactive chrome) by ROLE, not by contrast necessity |
| border.interactive | oklch(0.74 0.012 260) | #A6ABB3 | **7.15:1** vs canvas — non-text contrast ≥3:1 for interactive component boundaries (WCAG 1.4.11) with wide margin |
| border.subtle — ink-press edge highlight | oklch(0.44 0.025 260) | #4B5361 | 2.13:1 vs canvas — decorative separators/edges only (exempt decoration — NEVER the sole affordance marker; interactive bounds use border.interactive or the focus ring) |
| feedback.success | oklch(0.80 0.125 148) | #83D48F | on canvas **9.26:1**, raised 7.89:1, wash 6.43:1 — AA+ text-grade (confirmed/stamped states) |
| feedback.critical | oklch(0.70 0.18 25) | #FA6863 | on canvas **5.68:1**, raised 4.84:1 — AA text; on wash 3.94:1 — large text & UI components only on wash surfaces (critical copy lives on canvas/raised row and trail surfaces, never body-size on wash headers — a usage contract, enforced by component tokens) |
| feedback.notice | oklch(0.82 0.13 85) | #EBBD57 | on canvas **9.39:1**, raised 8.01:1, wash 6.52:1 — AA+ text (aging badges, capacity warnings, holds) |
| focus.ring | oklch(0.82 0.135 42) | #FFA57D | ≥3:1 change-contrast on every surface (2.4.13) — 8.59:1 on canvas; binds accent.bright |
| text.on-accent (button labels on orange fills) | carbon oklch(0.24 0.015 260) on accent.primary | #1B1F27 on #FD8965 | **7.03:1** — AA; primary buttons carry CARBON text on orange, never white (2.35:1 rejected) |

Rationale chain: the buyer works a **dispatch room** — screens read at arm's length between phone calls, under mixed office light, with lives governed by cutoffs. A carbon chrome with signal-orange intent reads as **railway-dispatch signage, not consumer marketplace**: highest-contrast text (AAA everywhere on the reading pairs), one accent hue reserved for intent (confirm, send, focus, the stamp), and structure carried by lightness steps + cut edges rather than shadows or glow. Orange discipline: accent.primary ≤5% of any screen (active states, the stamp, focus, primary buttons); success/critical/notice carry their own text-grade tokens; red exists ONLY as feedback.critical — never as a brand or decorative hue (LOOP-11 distance, below). Risk bands are NOT hue-coded alone: low/medium/high render as text+icon+band-position (06 RiskRail; a11y-baseline §4 — color never the sole carrier).

## Typography (P04 — Cairo + Sora; real weights only, rtl-rules §3)

- **Arabic: Cairo** (geo-modern Kufi-descended sans). Real weights used: 400 (body), 600 (chips, labels, call-script emphasis), 700 (headings, the stamp chip), 800 (queue orderRef token, reserved for data-identities — the ONE display-weight use). No synthetic bold; no ninth weight assumed.
- **Latin: Sora**. 400/600/700 mirrored roles; Sora's narrower cuts carry console table numerics and the manifest rollup figures.
- Line-height: Arabic body 1.65 (≥1.6 floor); Latin 1.5. Call-script sheets use 1.75 Arabic (read-aloud surfaces need air — Hessa glances mid-call). Tracking: **0 for Arabic everywhere** (`type.tracking.arabic = 0` — build rejection if violated; token-architecture §2.5); Latin display tracking allowed up to -0.01em on orderRef tokens only.
- **Numerals: Western (0–9) in BOTH locales** per ledger row 31 — data/ops surface (design-language-map §7); Arabic-Indic never injected into ar UI chrome; no mid-sentence mixing (copy-voice §1.7). Amounts, countdowns, window ranges (16–20), and attempt counts render Western inside Arabic prose by contract.
- Fallback stack: Cairo → Noto Kufi Arabic → system Arabic; Sora → Noto Sans → system. `font-display: swap` with metric-compatible fallbacks bounding CLS (10).

## Direction model

**bilingual-ar** (proposed, LOOP-6 pending confirmation): default workspace locale Arabic; English is a full citizen (console locale flips per user — Fahad reads English dashboards, Hessa works Arabic; buyer-facing templates are authored per the BUYER's locale independently of the console locale, 07a). Justification: buyer geography and persona split (02 — agents Arabic-first, founders bilingual, buyers per-order locale); the trail, ribbons, and sheets pass the full verification matrix in both directions (09); mixed strings (Latin orderRef, Latin buyer names inside Arabic rows) get bidi isolation (rtl-rules §2).

## Shape, elevation, iconography

- **Radius family A (cut, 0–4px)**: cards and queue rows 2px; controls 4px; chips/stamps 2px; sheets 4px top edges. No pills anywhere (D-family reserved for other products). The cut is the identity: stamped-paper meets machine-plate — corners look cut, not rounded.
- **Elevation: ink-press** — no shadows at all. Depth = surface lightness steps (canvas → raised → wash) + a 1px top edge highlight at border.subtle on raised surfaces + hairline separators. Sunken inputs invert the step (darker than canvas). Selection is the orange-tinted surface.selected, not a glow.
- **Iconography: outline-geometric** — constructed on a 24px grid with 1.75px strokes, currentColor, single duotone-free tone; metaphors are drawn from dispatch language: rung/stamp/kebab-dial/window-grid/courier-box. Icon-flip ledger (rtl-rules §2, recorded per 06): send/next/previous/external-link arrows FLIP in RTL; clock, phone, stamp, window-grid, magnifier, scale NEVER flip. The **stamp glyph** (a square seal with a check notch) is semantically reserved for confirmed-with-agreement orders only (06 StampBadge) — reservation enforced, never decorative reuse.

## Motion personality: crisp (motion-language §1)

Durations 100–180ms; standard ease-out; **no overshoot, ever** (crisp is the no-droop personality — the one place shape-change expresses is the Agreement Stamp's press, which UNDER-shoots: it compresses, never bounces). Micro-interaction mapping (motion-language §2): hover = affordance discovery (border.interactive emphasis + orange edge bar, no scale); press = ≤80ms tactile confirm (scale 0.97→1.0 on rungs and buttons); focus = visible ring (accent.bright; motion never replaces focus); success = the Agreement Stamp (the one ceremony); error = arrive-don't-bounce (panels slide 140ms and settle; no shake); streaming = not applicable (no AI text surfaces); empty→filled = queue cards fade-and-settle in place (never spin-in).

### The motion signature — the dispatch-stamp cadence (SME-I original)

Every consequential state change in this product lands as a **stamp**: an attempt fires → a rung stamps; a buyer confirms a window → the agreement stamps; a manifest seals → the batch row stamps its count. The cadence is always the same three phases: **press (≤80ms scale-down 1.0→0.97) → land (60ms scale-back with a 1px border.interactive flash) → settle (state chip remains, nothing loops)**. 140ms total, ease-out, zero overshoot — the rhythm of a dispatcher's date-stamp on a waybill, which is the emotional register of the buyer's work (02). The cadence is the product's recognizability: an operator who sees one stamp knows every other state change will feel identical (motion-language §2 taxonomy honored — one grammar, zero surprises).

### Tier-1 motion obligations (motion-language §4) — original proposals delivered

1. **The Ladder Trail** (13 §B1): rungs stamp in chronological order with cooldown arcs on the active rung; the trail teaches the state machine by reading order.
2. **The Agreement Stamp** (13 §B2): the signature moment — the selected window chip presses into the order's agreement slot and remains as evidence; assertive-once announcement + permanent state chip (a11y below).
3. **The Risk Rail** (13 §B3): the three-band meter wipes to its band in 120ms with the delta named; the drill decomposes the score into components as a disclosure cascade.

Each proposal states the work its motion does; none is ornamental. Route transitions: crossfade ≤180ms; queue row → drawer is an in-place expansion (shared-element intent on the row); sheets scale 0.96→1.0 + fade 140ms with focus trap and return (a11y-baseline §3). Stagger ≤60ms capped at 5 elements (trail rungs obey the cap — 4 rungs + response tag, then simultaneous).

## Brand-distance check (LOOP-11 — mandatory for this product)

**Blocklist trigger**: ledger §6 names "yellow+red courier combos" as BLOCKLISTED for cod-order-confirmation — the express-courier livery family (DHL-class yellow+red, and the red-dominant regional courier brands — Aramex/SMSA-class red marques) cannot be approached. **Nearest famous neighbors**: (a) global express brands — yellow-and-red or purple-and-orange liveries with rounded friendly app chrome; (b) regional courier portals — red/white and blue/white tracking UIs; (c) rideshare driver consoles — dark chrome with hi-vis orange and earnings-green. **Distance strategy, axis by axis**: (1) **hue system** — carbon near-neutral chrome (C 0.015) with ONE signal-orange accent at restrained chroma 0.15: neither yellow+red (no yellow token exists; red exists only as feedback.critical, never brand) nor hi-vis (hi-vis orange runs far higher chroma and yellow-leaning hue; ours sits at hue 38 with 0.15 chroma and is paired with cool graphite, not white or yellow); (2) **shape** — A-radius cut everywhere vs the rounded/pill courier-app vocabulary; (3) **elevation** — ink-press lightness steps and edge highlights vs livery flat-bright or glowing cards; (4) **iconography** — outline-geometric constructed glyphs vs pictorial courier marks (winged parcels, swooshes); (5) **typography** — P04 Cairo/Sora is absent from the neighbor set; the wordmark is descriptive (تأكيد طلبات الدفع عند الاستلام / cod-order-confirmation), no logo-similarity claim; (6) **motion** — crisp stamp cadence vs energetic consumer-courier confetti-adjacent motion. Verified against the ssm 05's own cession ("dark chrome + hi-vis orange — that visual position belongs to cod-order-confirmation's carbon family"): our chroma restraint, cut radius, edge-highlight elevation, and outline-geometric icons keep the rideshare-driver distance even inside the dark+orange position. No flagged similarity risk remains.

## ui-ux-pro-max integration record (LOOP-9 — advisory adopted/rejected against the binding ledger)

**Adopted (UX guidelines, ux-guidelines.csv):**
- Skeleton loading with no frozen UI past ~300ms; skeletons mirror final geometry incl. RTL flip (rows 10/78; P02 alignment) — queue/drawer skeletons specified in 11.
- Success feedback is never silent (row 34) — within the P21 ladder: stamps + inbox, not toast multiplication.
- Z-index scale system (10/20/30/50 tiers; no arbitrary 9999) — adopted as the console stacking contract (drawer 30, sheets 40, toasts 50).
- Confirmation before destructive/irreversible actions (row: "Are you sure modal") — adopted IN PRINCIPLE, replaced by the P04 destructive ladder: consequence-naming copy ("ختم 41 طلباً — 5 نوافذ…" / "Sealing 41 orders — 5 windows…"), never a generic "Are you sure?" (copy-voice §2 ban).
- No emojis as icons — SVG icon set on a constructed grid (adopted as outline-geometric 24px set, 06).

**Adopted (web-interface / styles evidence):**
- Keyboard handlers alongside every click affordance (web row: onKeyDown+onClick; tabIndex) — the queue is keyboard-first by contract (09).
- Data-Dense Dashboard style row (12-col grid, minimal padding, sticky headers, ~36px rows, sortable tables, loading states, exports) — adopted for the console grid density, re-skinned to A-radius + ink-press surfaces (not its light-grey palette).
- Dark Mode (OLED) row's contrast discipline ("text contrast 7:1+", "no white #FFFFFF background", "visible focus") — adopted in outcome: text.primary exceeds 9:1 on every reading surface (AAA), pure white is banned (halation), focus ring 8.59:1; its "minimal glow" is REJECTED (below).
- cursor-pointer on clickables + hover transitions in the 150–300ms guidance — adopted at the crisp band (100–180ms) where they overlap; the ledger's band wins at the edges.

**Rejected (conflicts with the BINDING ledger row — LOOP-9 records each):**
1. **Recommended palette: Primary #2563EB "tracking blue" + CTA #F97316 orange on #EFF6FF ("Tracking blue + delivery orange" per the design-system pass)** — REJECTED: the ledger binds Task Courier Carbon chrome oklch(0.24 0.015 260) + signal-orange oklch(0.75 0.15 38); a light blue-tracking chrome is also precisely the express-courier neighbor the LOOP-11 check distances us from. (Ledger wins per integration rule.)
2. **Recommended typography Fira Code + Fira Sans ("dashboard, data, analytics, code, technical")** — REJECTED: pairing P04 (Cairo + Sora) is binding; also rejected the same pass's Outfit/Work-Sans ("Geometric Modern") and Lexend Mega/Public Sans ("Neubrutalist Bold") pairs.
3. **"Arabic Elegant" pairing (Noto Naskh Arabic + Noto Sans Arabic, typography.csv)** — REJECTED: P04 is binding; naskh's manuscript register contradicts the dispatch-console temperament (Cairo's Kufi-descended geometry IS the temperament).
4. **Exaggerated Minimalism (clamp 3rem–12rem display type, letter-spacing -0.05em, 8rem+ whitespace)** — REJECTED: A-radius cut density is the ledger's shape; and letter-spacing is FORBIDDEN for Arabic (rtl-rules §3 — breaks joined letterforms; a build rejection, not a style preference).
5. **OLED neon glow (text-shadow glow, "vibrant neon accents", dark-to-light transitions)** — REJECTED: ink-press elevation is lightness steps + edge highlights with NO glow (token-architecture §2.10's dark-elevation rule); neon contradicts the signal-orange single-accent discipline and motion-language §6's anti-pattern list.
6. **Feature-Rich Showcase + Real-Time landing pattern ("Hero > Features > CTA", above-fold CTA)** — REJECTED: this is an ops console, not a landing page; no marketing hero exists anywhere in the IA (04).
7. **Data colors "blue/green/red" trio from the Data-Dense Dashboard row** — PARTIALLY REJECTED: green/red survive ONLY as the feedback.success / feedback.critical tokens on carbon (their light-theme blue is out; the risk bands are not hue-coded blue/green/red — they are text+icon+position, 06).

Conflict-resolution rule (teachable): the ledger tuple axes (chrome+accent, pairing, radius, elevation, icon, motion, numerals, direction) always win over skill output; skill output is adopted where it improves ergonomics, density discipline, and state communication without touching the tuple.
