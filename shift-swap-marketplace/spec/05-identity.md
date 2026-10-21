# 05 — Identity: shift-swap-marketplace

SME-D + SME-E + SME-I pass · Slot source: design-language-map.md ledger row 28 (BINDING): "Nahas Copper" oklch(0.58 0.13 45) | pairing P04 | density C | soft-lift elevation | duotone iconography | energetic motion | Western numerals | bilingual-ar | T1. LOOP-2 check: no collision — hue 45 (copper band) is unique in the ledger; nearest warm neighbors are expense-claim-flow (20, vermilion, P06, T2) and content-remix-studio (30, coral, P11, T3) — both differ in hue, chroma strategy, pairing, and tier; cod-order-confirmation's signal-orange accent (38, on carbon ink-press) shares the warm band but sits on a dark carbon chrome with A-radius ink-press vs our light soft-lift C-radius — composite distance holds (design-language-map §5 discipline). LOOP-6: direction proposed (bilingual-ar), pending owner confirmation.

## Color (OKLCh intent + computed hex + contrast ladder)

Hexes below are computed by the standard OKLab→sRGB transform at spec time (deterministic; recorded so implementations can verify) and are reference approximations — Layer 1 primitives bind them, Layer 2 owns meaning (token-architecture §1). Contrast ratios computed WCAG-2.x-style against the paired background; every declared pair meets its contract at definition time (token-architecture §2.3).

| Token (Layer 2 intent) | OKLCh primitive | Computed hex | Declared pair & measured contrast |
|---|---|---|---|
| accent.primary — "Nahas Copper" | oklch(0.58 0.13 45) | #B85E31 | on paper 4.16:1 → **UI components & large text only (≥3:1)**; never body text |
| accent.deep — copper ink for text | oklch(0.44 0.11 45) | #823B15 | on paper **7.54:1** (AAA body); paper on copper.deep **7.54:1** (primary button labels) |
| text.primary — warm graphite | oklch(0.30 0.05 50) | #422616 | on paper **12.82:1**; on copper.tint **11.20:1** |
| surface.default — "paper" | oklch(0.975 0.006 85) | #F9F6F2 | light-theme canvas |
| surface.tint — copper wash (cards, rails) | oklch(0.93 0.035 65) | #F9E4D0 | text.primary on tint **11.20:1** |
| surface.wash — lighter band | oklch(0.88 0.05 60) | #F1D0B7 | text.primary on wash **9.50:1** |
| canvas.dark — dark-theme chrome | oklch(0.24 0.015 55) | #251D19 | paper text on dark **15.37:1**; accent.bright on dark **6.90:1** |
| accent.bright — dark-theme accent | oklch(0.74 0.12 50) | #E79363 | dark-theme interactive/links (AAA text where used) |
| feedback.success | oklch(0.62 0.12 150) | #4A9A5E | on paper 3.21:1 → **UI/icons only**; success TEXT uses success.deep |
| feedback.success.deep | oklch(0.42 0.10 150) | #195C2E | on paper **7.46:1** (success body text) |
| feedback.critical | oklch(0.55 0.18 25) | #C53637 | on paper **4.93:1** (AA text) |
| feedback.notice | oklch(0.72 0.13 85) | #CA9D33 | on copper.ink **5.51:1** (aging badges, amber panels) |
| focus.ring | oklch(0.50 0.13 50) | #9B4805 | on paper **5.87:1**; dark theme binds ring → accent.bright (6.90:1 on dark — light theme's 2.62:1 on dark is rejected, re-bind documented per token-architecture §2.10) |

Rationale chain: buyer = frontline workers + their supervisors, in rooms with fluorescent light and gloves-off phones → a warm, metallic, high-visibility identity that reads as **tools, not admin** — copper is the trades-metal (pipes, wiring, hands), and a swap board is honest labor logistics. Copper carries the "energetic" motion personality (below) without the candy-neon of consumer marketplaces — trust with pulse (01 §6 attack map: no incumbent occupies warm-metal). Accent discipline: copper.primary ≤5% of any screen (chips, active states, the weld line); copper.tint/wash carry the warm surfaces; text stays graphite/copper-deep. Dark theme is a Layer 2 re-bind (token-architecture §2.10): elevation by surface-lightness steps (copper-tinged graphites), never an inversion filter.

## Typography (P04 — Cairo + Sora)

- **Arabic: Cairo** (geo-modern Kufi-descended sans; weights 400/600/700/800 real — rtl-rules §3 weight reality respected; no synthetic bold). Headings 700; body 400 at ≥16px equivalent on the worker surface (mobile floor higher than desktop: 16px minimum body, 02 personas read mid-shift); rationale chips 600 at ≥13px (contrast ladder carries them).
- **Latin: Sora**. Same roles mirrored; console density uses Sora's narrower cuts for table numerics.
- Line-height: Arabic body 1.65 (≥1.6 baseline, rtl-rules §3); Latin 1.5. Tracking: **0 for Arabic everywhere** (token-level: `type.tracking.arabic = 0` — build rejection if violated). Numerals: **Western** per ledger (data/ops surface — design-language-map §7); Arabic-Indic never injected in ar UI chrome (numeral policy is a single system, no mid-sentence mixing — copy-voice §1.7).
- Fallback stack: Cairo → Noto Kufi Arabic → system Arabic; Sora → Noto Sans → system. `font-display: swap` with metric-compatible fallbacks (10 asset strategy).

## Direction model

**bilingual-ar** (proposed, LOOP-6 pending confirmation): default workspace locale Arabic; full LTR rendering as first-class citizen (Noora's console-in-English case, 02). Justification: buyer geography (01 §5); worker surface is Arabic-dominant by persona; supervisor/ops surfaces are bilingual-by-role. Both directions pass the full verification matrix (09); mixed strings (worker names in Latin inside Arabic sentences) get bidi isolation (rtl-rules §2).

## Shape, elevation, iconography

- **Radius family C (soft, 12–16px)**: cards 16, controls 12, sheets 16 top-radius. Worker-surface controls trend to the upper bound (touch ergonomics); console tables use 12 for density. Pills only for status chips (D-family shapes are reserved for other products; hiring-pipeline/calendar own pill-density).
- **Elevation: soft-lift** — diffuse ambient shadows, one step per z-level (card → sheet → drawer). Dark theme re-binds elevation to surface-lightness steps (above). No glow, no neon edge (distance from consumer-marketplace candy).
- **Iconography: duotone** — two-tone constructed icons (copper primary + graphite secondary tone); 24px grid, 44px touch targets on the worker surface (a11y floor × 1.8); icon metaphor decisions recorded per rtl-rules §2: swap-arrows and send glyphs flip in RTL; clock, magnifier, shield (blackout), and the weld-mark are symmetric — never flipped. The **weld-mark** (a short double line ⊨) is the product's match/confirm glyph, reserved for confirmed swaps only (semantic reservation: it means "this is now real coverage").

## Motion personality: energetic (motion-language §1)

Durations 150–250ms; standard easing; **one controlled overshoot ≤8% reserved for success moments only** (the Swap Handshake weld — never for errors, never for hover). Micro-interaction mapping (motion-language §2): hover = affordance discovery (copper border emphasis, no scale); press = ≤80ms tactile confirm; focus = visible ring (motion never replaces focus, a11y-baseline §2); success = the Handshake (below); error = arrive-don't-bounce (panel slides in, settles, no shake); empty→filled = content settles in place (board cards fade-and-settle, never spin-in).

### Signature moment — the Swap Handshake (SME-K original; full choreography in 13 §B2)

When a match is confirmed (accept→supervisor-approved→confirmed), the two shift cards converge along the reading axis and a single copper line "welds" them (200ms converge + 120ms weld flash with the ≤8% overshoot), then the welded pair collapses into the confirmed-coverage card. The choreography expresses the product's whole thesis in one gesture: **two separate obligations becoming one covered reality, permanently recorded.** Reduced-motion: no movement — the pair crossfades to a state chip carrying the weld-mark + announcement ("تم تأكيد التبديل — التغطية مؤكدة" / "Swap confirmed — coverage is locked"). The overshoot collapses to the state chip per motion-language §5.

### Tier-1 motion obligations (motion-language §4)

Original proposals are mandatory and delivered: Fairness Ladder reveal cascade (13 §B1), Swap Handshake weld (13 §B2), Rest Ribbon draw (13 §B3) — each states the work its motion does; none is ornamental. Route transitions: crossfade ≤180ms; list→detail shared-element intent for board cards (offer card → detail sheet); modals 0.96→1.0 scale+fade 140ms with focus trap and return (a11y-baseline §3). Stagger ≤60ms, capped at 5 elements (ladder rationale rows obey the cap — the cascade is 5 rows max then simultaneous).

## Brand-distance check (LOOP-11)

Nearest famous neighbors: ride-hailing/delivery driver apps (orange-and-black gig marketplaces) and shift-scheduling suites (blue/grey admin chrome). Distance strategy: copper's hue sits between safety-orange and terracotta with 0.13 chroma restraint (not hi-vis orange, not lifestyle terracotta); pairing P04 (Cairo/Sora) is absent from both neighbor sets; soft-lift warm-paper surfaces (not dark-with-orange driver chrome — that position belongs to cod-order-confirmation's carbon family); duotone trades-iconography (not line-2 admin icons); the weld-mark semantic reservation has no famous equivalent. Wordmark is descriptive ("سوق التبديل" / shift-swap-marketplace) — no logo-similarity risk flagged.

## ui-ux-pro-max integration record (LOOP-9 — advisory adopted/rejected against the binding ledger)

**Adopted (UX guidelines, ux-guidelines.csv):**
- Touch targets ≥44×44px minimum on worker surface with ≥8px spacing between adjacent targets (rows 22/23/66) — exceeds the 24px WCAG floor; adopted as the worker-surface target rule (00, 09).
- Skeleton loading mirrors final geometry incl. RTL flip; no blank-frozen UI for >300ms operations (rows 10/78; P02 alignment) — board skeletons specified in 11.
- Errors announced via live regions / role=alert, never color-only (row 44) — announcement schedule in 09.
- Mobile-first design → enhance upward (row 1) — the console is an enhancement layer over the worker layout (04 responsive behavior).
- inputmode on numeric inputs (row 63) — post-a-swap time fields and rule-hour fields declare inputmode (06, 09).
- Deep-linkable state: filters and queue views update the URL for shareability (row 5) — saved views (P08) serialize to URL.
- Toasts auto-dismiss 3–5s (row 82); success feedback visible, not silent (row 34) — P21 ladder governs classes.
- Skip-to-main link on console surfaces (row 45); user freedom: no locked tours (row 88) — P22 checklist onboarding already forbids tours.

**Adopted (reasoning heuristics, ui-reasoning.csv):** P2P-marketplace trust guidance (row 24: must-have trust signals, avoid low-trust/confusing layouts) → the fairness ledger + rationale chips ARE the trust-signal layer; real-time-updates must-have with large-dataset performance priority (row 19, SaaS dashboard) → subscribeSwapEvents + board virtualization budgets (10); advanced search/filter musts (row 23, job board) → console ⌘K + board filter chips, filters never hidden (04).

**Adopted (style evidence, styles.csv):** the "Vibrant & Block-based" style's energetic/duotone keywords and 200–300ms range corroborate the ledger's energetic personality + duotone iconography — adopted as confirmation, not as a color/style source.

**Rejected (conflicts with the BINDING ledger row — LOOP-9 records each):**
1. Recommended palette (#7C3AED purple primary / #22C55E CTA / #FAF5FF background) — REJECTED: ledger binds Nahas Copper oklch(0.58 0.13 45) as primary; purple/transaction-green contradicts the identity tuple. (Ledger wins per integration rule.)
2. Recommended typography Inter/Inter — REJECTED: pairing P04 (Cairo + Sora) is binding; also rejected the CSV's Outfit/Work-Sans and Space Grotesk/DM Sans pairs for the same reason.
3. "Search bar is the CTA" hero-search marketplace pattern — REJECTED for this product: the board is a bounded ops market (04 IA decision), not an open consumer marketplace; search is console navigation only.
4. 48px+ section gaps / 32px+ display type / scroll-snap sections / animated background patterns / continuous pattern animation — REJECTED: density C (12–16px radius, compact ops surfaces) and motion-language §6 anti-patterns (no ambient looping decoration) both bind against it.
5. Glassmorphism / aurora-gradient style families — REJECTED: soft-lift elevation on warm paper is the ledger style; frosted-glass blur contradicts mid-range-device performance budgets (10) and the trades-material identity.
6. "High contrast 7:1+ everywhere" checklist item — PARTIALLY adopted (body text exceeds AAA where the ladder shows) but rejected as a blanket rule: AAA on every pair would force chroma below the copper identity; the contrast ladder (above) declares per-pair contracts instead, exceeding AA everywhere and AAA on the reading pairs.

Conflict resolution rule (teachable): ledger tuple axes (hue, pairing, radius, elevation, icon, motion, numerals, direction) always win over skill output; skill output is adopted where it improves ergonomics, trust surfacing, and state communication without touching the tuple.
