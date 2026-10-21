# 05 — Identity: seo-brief-builder

SME-D/E/I pass · Ledger row 13 (design-language-map §4, BINDING): "Marsad Violet" oklch(0.55 0.12 285) · pairing P15 (Mada + Instrument Sans) · density B · flat-line elevation · outline-geometric iconography · crisp motion · Western numerals · bilingual-en · T3. LOOP-2 check: violet 285 has no exact-match sibling (nearest managed band is meeting-notes lilac 275 — different chroma/lightness composite, different pairing P07 vs P15, different elevation/motion; Sarraf Violet 294 sits in commerce family with different pairing P04 — composite distinct on every axis except icon style, permitted single-axis coincidence). LOOP-6: direction proposed, pending confirmation.

## Color (OKLCh intent + hex approximations, verified at definition per token-architecture §2.3)

- **Primary — "Marsad Violet"**: oklch(0.55 0.12 285) ≈ #6B66B4. An observatory violet (مرصد — the watcher): the strategist's instrument, not the marketer's confetti. Declared contracts: 5.02:1 on white / 4.61:1 on canvas (text-safe AND UI-safe); white-on-primary 5.02:1 (button text safe). Used for primary actions, active tab underline, cluster-selection marks, focus ring.
- **Violet-deep — oklch(0.42 0.12 285) ≈ #48408B**: 8.09:1 on canvas — links, intent labels when violet-coded, text-bearing accents.
- **Ink — oklch(0.25 0.02 285) ≈ #20202B**: text and table rules; 14.79:1 on canvas (AAA headroom for dense keyword tables).
- **Canvas — oklch(0.97 0.006 285) ≈ #F4F5F9**; raised surface oklch(0.99 0.004 285) ≈ #FBFBFE — flat-line separation is a border step, never a shadow.
- **Intent palette (the product's semantic core — 4 intents, always icon+text+color, never color alone):** informational teal oklch(0.50 0.09 185) ≈ #00736A (5.27:1) · navigational slate oklch(0.50 0.06 250) ≈ #496684 (5.48:1) · commercial amber oklch(0.70 0.12 80) ≈ #C5953B (2.49:1 — UI-ink duty ONLY: chip borders/markers; commercial TEXT uses commercial-deep oklch(0.55 0.11 80) ≈ #93690D, 4.52:1) · transactional green oklch(0.50 0.11 150) ≈ #2B7440 (5.25:1).
- **Parity-gap red — oklch(0.55 0.15 25) ≈ #B94642**: 4.80:1 on canvas (text-safe) — gap markers and accepted-gap strikethrough pairing; ≤5% of any screen. Success ink reuses transactional green family (oklch(0.50 0.11 150)).
- Rationale chain: buyer = analyst-strategist (02) → instrument-grade surface, cool violet over warm paper → data-forward identity that refuses both "AI purple" neon and analytics-dashboard blue. Dark theme is a Layer 2 re-bind deferred to implementation (12 Q-10); both themes must re-declare the same contracts.

## Typography (P15 — Mada + Instrument Sans)

- **Arabic: Mada** (real weights 400/500/700) — contemporary-grotesk Arabic with a low kashida temperament: reads as a data instrument, pairs with keyword tables rather than fighting them. Body ≥15px equivalent in tables; 16px+ in brief editor.
- **Latin: Instrument Sans** (400/500/600/700) — current grotesque; 500 for table headers and cluster names, 600 for the single H1 per screen. Keyword strings render at their own direction inside isolating containers (rtl-rules §2) — never force one direction on the other script.
- Line-height: Arabic 1.6 / Latin 1.5 (keyword table rows honor tashkeel headroom when seeded terms carry diacritics); tracking 0 for Arabic everywhere (token-level, rtl-rules §3). No synthetic bold on missing weights (Mada 600 → re-bind 500 or 700).
- **Numerals: Western** (ledger row; data/finance surface per design-language-map §7): volumes, counts, ratios, matrix cells all 0-9; Arabic-Indic numerals never appear in system chrome (storage canonical, display formatted — the parity matrix is a data table).
- One pairing for reading AND chrome (T3 discipline; no third family; microcopy exception not needed — Mada's small sizes are legible at table densities, unlike the flagship's serif case).

## Direction model

**bilingual-en** (proposed, LOOP-6 pending confirmation): workspace chrome defaults LTR/English (the strategist's tool language across MENA agencies is predominantly English per 02), with Arabic as full citizen — Arabic keyword data, Arabic cluster names, Arabic brief sections render RTL in bidi-isolated containers wherever they appear; the parity view's two locale columns render each at its own direction; Arabic-first buyers flip the workspace locale and every surface re-renders (verification matrix in 09, both directions full-citizen).

## Shape, elevation, iconography, motion

- **Density B (standard, 6–10px)**: cluster cards 8px, keyword table rows 6px, chips fully-rounded exception ONLY where the semantic is a removable intent chip (P08 filter chips — declared deviation, recorded here).
- **Elevation: flat-line**: hairline violet-tinted borders carry all structure; the cluster canvas separates strata by border-weight and surface step (canvas → raised 0.99), zero shadows. The parity matrix is the "deepest" surface by border weight alone.
- **Icons: outline-geometric** (constructed-grid outline set): cluster glyph = 3-dot lattice, intent glyphs = geometric markers (informational = circle-outline, navigational = arrow-in-square, commercial = tag-outline, transactional = cart-outline), parity glyph = two offset half-frames, ingest = tray-with-arrow. No sparkle glyphs anywhere — the assist affordance is a lattice icon with a "suggestion" text label (ai-native-patterns §1: no magic affordances).
- **Motion: crisp** (motion-language §1): 100–180ms, standard ease-out, zero overshoot ever. Route changes crossfade ≤180ms; cluster membership moves settle in place (no spin-in); the parity matrix cells flip state in 120ms with a text change always accompanying (motion never carries information alone — a11y-baseline §4). Success moments: state chip + polite announcement, no animation-carried meaning. Reduced-motion: hard cuts + announcements — identical perceivability by construction.

## Brand-distance check (LOOP-11)

Nearest famous neighbors: (1) "AI purple" neon-gradient chat chrome — distance: Marsad Violet is desaturated (C 0.12 vs neon ~0.2+), instrument-flat, never gradient, never glow; ui-ux-pro-max's own B2B row flags "AI purple/pink gradients" as an anti-pattern and this identity agrees by construction. (2) analytics-dashboard trust-blue — distance: violet 285 + amber/teal intent system + flat-line borders, no blue, no gradient panels. (3) keyword-tool greens — none present. Wordmark risk low (descriptive name).

## ui-ux-pro-max integration record (LOOP-9 — conflicts + resolutions)

Inputs: `search.py "seo content brief builder keyword research" --design-system -p "SeoBriefBuilder"`; variant `"serp intent analysis workspace" --design-system`; `--domain style "seo data workspace dashboard"`; `--domain typography "data table"` / `"serp keyword clustering"`; CSV scans (ux-guidelines, ui-reasoning, styles, colors, typography, icons, charts).

**Adopted (no ledger conflict):**
- ux-guidelines row 41 Keyboard Navigation (High) → 09 keyboard map; row 28 Focus States (High) → focus ring contract (Marsad Violet, ≥2px, 2.4.13 area); row 45 Skip Links → palette-first navigation; row 10 Loading States (High, skeleton screens) → P02-aligned; row 56 Inline Validation (blur/submit) → ingest paste validation; row 79 Empty States (message + action) → P01 matrix in 11; rows 44/80 Error Messages (aria-live) + Error Recovery (next steps) → 11 copy formula; row 71 Table Handling (overflow-x / card collapse) → keyword table at 360px; row 7 Excessive Motion (High, "animate 1-2 key elements max") → converges with crisp personality; row 9 Reduced Motion (High) → motion-language §5 contract; row 72 Line Height (1.5–1.75) → rtl-rules floors kept; row 29 Hover States → border-step hover (affordance discovery only).
- ui-reasoning row 45 Analytics Dashboard: "if_large_dataset: virtualize-lists" → P19 in 10; "must_have: data-export" → CP-4 (a brief builder whose deliverable IS an export). Row 19 SaaS Dashboard "if_large_dataset: prioritize-performance" → 10 budgets. Anti-patterns adopted as bans: "Ornate design + Slow rendering", "No filtering", "Excessive animation + Dark mode by default".
- styles.csv "Data-Dense Dashboard" (BI/Analytics): dense-but-readable discipline, sticky headers, compact card design → cluster canvas + keyword table structure (grid discipline adopted; the dashboard's KPI-card idiom is NOT imported — this is a workspace, not a wall of metrics). "Drill-Down Analytics": breadcrumb + context preservation → topic-workspace tab navigation keeps topic context persistent.
- charts.csv row 4 Correlation/Distribution: scatter/bubble with opacity 0.6–0.8, data-table alternative, colorblind pattern+color distinction → cluster canvas dot-field guidance (if implementation renders volume scatter); row 5 Heatmap: clear numerical legend, pattern overlay → parity matrix cell contract (numbers always present in cells — never heat-only).
- icons.csv Lucide outline set (rows 18 search, 19 filter, 50 tag, 63/64 link, 99 git-branch) → outline-geometric iconography CONVERGES with ledger; adopted as reference vocabulary for the constructed grid set.
- Pre-delivery checklist from both design-system outputs: no emoji icons (SVG outline set), visible focus, prefers-reduced-motion, 4.5:1 light-theme contrast, responsive 375/768/1024/1440, cursor-pointer affordances — all adopted into 09/10.

**Rejected (ledger row binding wins; conflicts recorded):**
1. Design-system output #1 palette "Primary #2563EB trust blue + CTA #F97316 orange on #F8FAFC" → REJECTED vs Marsad Violet ledger row; violet system + amber commercial accent retained (ledger-bound).
2. Design-system output #2 "Glassmorphism style, backdrop blur, Z-depth" → REJECTED vs flat-line elevation (glass layers are the anti-structure of a flat-line bordered instrument).
3. Typography suggestions "Crimson Pro / Atkinson Hyperlegible" (output #1) and "Inter / Inter" (output #2) → REJECTED vs binding P15 (Mada + Instrument Sans); Atkinson's legibility motive is noted and honored via size floors in 09, not via a third family.
4. typography.csv rows "Dashboard Data (Fira Code/Fira Sans)", "Science/Tech (Exo/Roboto Mono)", "Tech/HUD Mono" → REJECTED vs P15; the mono-for-data instinct is adopted as a RULE, not a font: keyword strings and normalized forms render in the pairing at tabular-figure settings where the implementation supports it (no third family at T3).
5. Output #1 style "Motion-Driven (parallax, entrance anim, page transitions)" and "hover 300-400ms" → REJECTED vs crisp personality (100–180ms, no parallax ever); adopted instead: motion restraint per motion-language §1.
6. Output #1 pattern "Newsletter/Content First (typewriter effect, single-field hero form)" → REJECTED as irrelevant surface patterning (marketing-page idiom, not a workspace); the honest transferable bit — "show what the tool produces before asking for input" — is adopted as the S1 sample-topic empty state (P22).
7. colors.csv row 19 "AI/Chatbot Platform #7C3AED neon purple + cyan" → REJECTED as the exact AI-purple cliché the brand-distance check names; row 8 "Analytics Dashboard #1E40AF" trust blue → REJECTED for the same reason; row 13 Gaming neon purple → REJECTED. Ledger violet stands.
