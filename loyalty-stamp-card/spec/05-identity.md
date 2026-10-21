# 05 — Identity: loyalty-stamp-card

SME-D/E/I pass · Ledger row 33 (design-language-map §4, BINDING): "Wafa Rose" oklch(0.64 0.13 335) · pairing P13 (Baloo Bhaijaan 2 + Plus Jakarta Sans) · radius D (pill, 20px+) · soft-lift elevation · filled-rounded icons · calm motion · Western numerals · bilingual-ar · T3. LOOP-6: direction proposed, pending owner confirmation.

## Color (OKLCh intent + hex approximations + COMPUTED contrast contracts, verified at definition per token-architecture §2.3)

All ratios below were computed (sRGB math on the hex approximations) — they are contract numbers, not aspirations.

- **Primary — "Wafa Rose"**: oklch(0.64 0.13 335) ≈ **#BC6CAB**. A rosewater rose (وفاء — loyalty/faithfulness): the ink of the stamp, not the neon of the loyalty app. Declared contracts: **3.58:1 on white / 3.27:1 on canvas / 3.08:1 on the rose tint** — UI-component and large-text duty ONLY (WCAG 2.2 §1.4.11 non-text ≥3:1; large text ≥3:1): stamp-dot fills, tier-band fills, active rail marks, the pass card face, selected-chip borders. **Wafa Rose never bears body text and never appears as a small-text background** — body-bearing rose duty belongs to rose-deep (below). Small-display exception: primary may render display numerals ≥24px/700 on canvas at 3.27:1 (large-text AA).
- **Rose-deep — oklch(0.44 0.13 335) ≈ #7C316E**: **8.33:1 on white / 7.61:1 on canvas / 7.17:1 on the rose tint** (text-safe everywhere). Carries all text-bearing rose: primary buttons (white text on rose-deep at 8.33:1), links, redeemable emphasis when rose-coded, the focus ring (declared at rose-deep for a ≥7:1 change-contrast — focus never rides the 3.27:1 edge), tier names on the studio rows.
- **Ink — oklch(0.26 0.02 335) ≈ #2A2028**: **14.37:1 on canvas / 13.53:1 on the tint** — body text, table rules, stamp counts ("6 من 8"), audit ledger rows (AAA headroom for the dense timeline).
- **Canvas — oklch(0.97 0.008 335) ≈ #F9F3F7**; **raised — oklch(0.99 0.005 335) ≈ #FEFAFD** (card sheets, studio preview stage); **rose tint — oklch(0.95 0.02 335) ≈ #F8EAF4** (pending-stamp slot fill, tier-row hover). A second, deeper wash oklch(0.93 0.03 335) ≈ #F5E1F0 is decorative-only (empty-state illustration washes): ink text on it holds 12.66:1, but **stamp fills must never sit on it (2.88:1 — fails §1.4.11)** — the rule is declared so the tint family cannot drift darker at implementation.
- **Redeemable green — oklch(0.45 0.10 150) ≈ #236436**: **7.12:1 on white / 6.51:1 on canvas** — redeemable-tier text and its chip border; never a background behind body text except green-tint chips carrying green-deep text (6.13:1 on the rose tint also holds).
- **Expiring amber — oklch(0.50 0.11 80) ≈ #845B00**: **5.52:1 on canvas / 6.04:1 on white** (text-safe) — expiring-soon state only. A lighter amber variant (oklch 0.55) computed at 4.50:1 on canvas was rejected as riding the AA floor — recorded here so implementation cannot "brighten for warmth".
- **Blocked red — oklch(0.50 0.12 25) ≈ #A34242-class** (computed with the portfolio's warm-red convention): ≥4.5:1 on canvas for blocked-state text; icon+text, never color alone.
- **Rose-soft — oklch(0.80 0.09 335) ≈ #E3A8D5**: decorative card-face pattern accents only (1.94:1 on white — never text, never interactive states).
- Rationale chain: buyer = neighborhood retailer + counter staff (02) → warm, low-arousal, friendly-but-honest surface; the rose is the store's hospitality and the stamp is its ink. Dark theme is a Layer 2 re-bind deferred past v1 (12 Q-12); any re-bind must re-declare every contract above.

## Typography (P13 — Baloo Bhaijaan 2 + Plus Jakarta Sans)

- **Arabic: Baloo Bhaijaan 2** (real weights 400/500/600/700/800) — rounded-terminal Naskh-influenced display-face family: reads as the friendly neighborhood signboard (02's retail-register evidence, research sources 24/26), pairs with the pill radius and the filled-rounded icons as one temperament. Body at 400/500; card-face display (program names, tier names on the pass) at 700; the stamp count at 700/800.
- **Latin: Plus Jakarta Sans** (400–800) — rounded-grotesk twin; 600 for section headers, 500 for labels/chips, 400 body.
- **Weight strategy (the P13 co-user differentiator, LOOP-2)**: display-heavy 700/800 on card faces with 400/500 working text — the card is the poster, the console is the counter. Distinct from bilingual-content-calendar's 500/700 tabular discipline and hiring-pipeline-desk's 600/800 board headers.
- Line-height: Arabic 1.6 body / 1.4 display; Latin 1.5 / 1.2; tracking 0 for Arabic everywhere (token rule, rtl-rules §3 — violating it is a build rejection); no synthetic bold on missing weights (both families ship the full 400–800 set, so re-binding is never needed).
- **Numerals: Western** (ledger row; stamps, counts, times, phone hints are data — 0-9 everywhere, never mixed systems mid-sentence; storage canonical, display formatted per rtl-rules §3).

## Direction model

**bilingual-ar** (proposed, LOOP-6 pending confirmation): the console defaults to RTL/Arabic chrome (the counter speaks Arabic first — 02 personas; the region's retail surfaces are Arabic-first, research sources 24/25/28) with English as a full citizen: every staff surface flips via workspace/member locale; member-entered names render at their own direction in bidi-isolated containers (rtl-rules §2); the customer pass follows the member's locale. Both directions pass the full 09 verification matrix; the card face itself is authored bilingual by construction (tier rows carry both scripts — P23 columns).

## Shape, elevation, iconography

- **Radius D (pill, 20px+)**: fully-round buttons, pill chips, and — the family's signature case — **stamp dots are circles**, the card face and its tier rows are 20–24px, the pass card 24px; the counter sheet 28px. The radius IS the metaphor: a stamped dot is round, the card in the wallet is soft-cornered; sharp corners would read as a queue-management tool, not a loyalty card.
- **Elevation: soft-lift** — diffuse ambient shadows only. The tier the member is closest to lifts one soft step; the card sheet lifts above canvas; the pass card carries the deepest soft-lift (the product's one object-quality surface). No hard drop shadows, no borders-as-structure (that is the flat-line family's grammar).
- **Icons: filled-rounded** (friendly solid set): stamp glyph (filled seal with a soft star), coffee cup, cookie, gift box for tier rows, QR glyph, magnifier, undo arrow. Directional glyphs (undo arrow, next-tier chevron) flip in RTL; semantically anchored glyphs (stamp seal, QR, cup) never flip (rtl-rules §2 — decisions recorded per component in 06).

## Motion (calm — motion-language §1)

200–320ms, symmetric ease-in-out, no scale change on hover (opacity/border only), zero overshoot ever. Route changes crossfade ≤180ms; the card sheet settles in place; nothing bounces — the counter is a queue surface, and queues punish theatrics.

**The ONE signature micro-interaction (T3 discipline: exactly one)** — **the Stamp Landing**: on `issueStamp` commit, the next pending dot fills with Wafa Rose in 240ms ease-in-out while the count text updates in the same frame and a polite announcement fires ("ختم 4 من 8"). A 1px press settle on the dot accompanies the fill (press ≤80ms, tactile confirm); the dot never overshoots (calm forbids it). Reduced-motion: the fill renders in a single ≤2-step opacity change + the announcement — identical perceivability by construction (a11y-baseline §4). Everything else in the product is standard-set: redemption is a state chip + receipt line; undo is a quiet rollback; flags arrive, they never bounce.

## LOOP-2 hue analysis (named neighbors, composite differentiation)

- **kpi-alert-watch (analytics, T3) — oklch(0.60 0.15 331)**: 4° apart, the nearest hue neighbor in the ledger (inside the 10° managed band). Composite separation: lightness 0.64 vs 0.60, chroma 0.13 vs 0.15 (Wafa Rose is the calmer rose), pairing P13 vs P12, radius D vs B, icons filled-rounded vs duotone, motion calm vs energetic, direction bilingual-ar vs bilingual-en, family commerce vs analytics. Distinct on every axis except tier; flagged here for the ledger's §5 review pass as a proposed managed pair — no reassignment filed (the ledger row is binding; owner retains override).
- **interactive-story-builder — oklch(0.58 0.15 348)**: 13° (outside the band), same motion 'calm' — different pairing (P03 vs P13), radius (B vs D), elevation (layered-depth vs soft-lift), icons (line-1.5 vs filled-rounded), hue distance carries it.
- **abandoned-cart-recovery — oklch(0.52 0.12 312)**: 23° — far; different temperament (energetic duotone P05).
- **P13 co-users**: bilingual-content-calendar (hue 148 green — 187° away; crisp; bilingual-ar; planning-grid surface) and hiring-pipeline-desk (hue 8 coral — 327° away; energetic; bilingual-en; pipeline board). The pairing is shared but hue is never shared and motion/weight-strategy/direction differentiate; per the ledger's amended co-user rule (max 4 per pairing, distinct composites), this file records the composite argument honestly: radius D and soft-lift/filled-rounded coincide with both siblings — separation rides hue + motion + weight strategy + surface grammar. Watch note filed in 12 (Q-6) for the batch-10 ledger review.

## Brand-distance check (LOOP-11)

Nearest famous neighbors: (1) **dating-app rose** (#E11D48-class saturated rose on blush backgrounds — ui-ux-pro-max's own colors.csv "Dating App" row): distance — Wafa Rose is half the chroma (0.13 vs ~0.22+), mid-lightness, never used as a romantic gradient or blush wash; the rose here is rosewater and stamp ink, paired with ink text and ledger discipline. (2) **loyalty/punch-app hot pink marketing pages** (app-store stamp-card category pages): distance — desaturated, calm-motion, soft-lift console surface, no neon, no confetti-on-reward. (3) **pink-and-orange donut/coffee retail combos**: no orange anywhere in the system (the only warm accent is the expiring amber, a semantic state, never a brand voice). (4) **loyalty gold/amber cliché**: amber exists solely as the expiring-soon deep ink. Wordmark risk low (descriptive slug).

## ui-ux-pro-max integration record (LOOP-9 — conflicts + resolutions)

Inputs: `search.py "loyalty stamp card retail counter staff verification bilingual" --design-system -p "LoyaltyStampCard"`; `--domain ux "loyalty card stamp reward counter tablet bilingual RTL"`; `--domain ux "QR code scan customer identification"`; `--domain style "friendly rounded retail app design warm rose"`; `--domain typography "retail POS counter app typography rounded friendly"`; `--domain typography "loyalty reward progress"` (empty); `--domain color "loyalty reward warm rose pink palette"`; `--domain product "ecommerce dashboard loyalty members list table"`; `--domain icons "icon set filled rounded retail food drink"` (empty); `--domain ux "keyboard navigation focus states empty states loading skeleton error messages"`; CSV scans of ux-guidelines, styles, typography, colors, products.

**Adopted (no ledger conflict):**
- ux-guidelines row Focus States (High) → rose-deep focus ring ≥2px at 7.61:1 change-contrast, 2.4.11 scroll-margin on the stamper's sticky search; row Empty States (Medium, message + action) → P01 matrix in 11; row Error Messages (High, aria-live/role=alert) → 09 announcement schedule; row Loading States (skeletons) → P02 geometry-mirroring skeletons (stamp dots reserve geometry, 10 CLS budget).
- Pre-delivery checklist from the design-system output: SVG icons (no emoji), cursor-pointer affordances, hover transitions 150–300ms (the band overlaps calm's 200–320 — the overlap adopted at 200–300ms), light-theme 4.5:1 text pairs (all declared contracts above), prefers-reduced-motion, responsive 375/768/1024/1440 — all bound into 09/10.
- products.csv Analytics Dashboard "drill-down with context preservation" instinct → member-detail timeline keeps the members-list context (S5→S6 breadcrumb); explicitly NOT importing the KPI-wall idiom (this is a counter console, not a metrics wall).
- styles.csv Bento Grids row: the modular rounded-card discipline (grid gap rhythm, 20–24px radii, content-first cards) converges with radius D + soft-lift → adopted as the S1 today-board and S8 insights-tile structure guidance; the Apple-marketing bento aesthetic is not imported (see rejection 6).
- typography.csv rows were rejected as pairings but their instinct — "soft rounded friendly" temperament — converges with P13 by the ledger's own choice; noted, not adopted as substitution.

**Rejected (ledger row binding wins; 7 conflicts recorded):**
1. Design-system palette "Primary #2563EB trust blue + CTA #F97316 orange on #F8FAFC" → REJECTED vs binding Wafa Rose oklch(0.64 0.13 335); no blue, no orange anywhere (the blue+orange combo is also the courier-brand blocklist's nearest cousin — LOOP-11 distance).
2. Design-system pattern "Marketplace / Directory — hero search bar as CTA, card carousel, become-a-host sections" → REJECTED as marketing-page idiom; the transferable kernel (search-first interaction) is already the stamper's grammar — a speed surface, not a landing page.
3. Design-system style "Exaggerated Minimalism — oversized typography, high contrast statement design, clamp() hero type" → REJECTED vs calm + counter-density; the counter must show identity, card, and action in one screen without poster typography.
4. Design-system typography "Rubik / Nunito Sans" → REJECTED vs binding P13 (Baloo Bhaijaan 2 + Plus Jakarta Sans).
5. typography.csv "Soft Rounded — Varela Round / Nunito Sans" and "Kids/Education — Baloo 2 / Comic Neue" → REJECTED vs P13; the kids-row's Baloo is the Latin cousin of our Arabic family — temperament noted, pairing not substituted; Comic Neue is banned outright for a ledger surface.
6. styles.csv "Bento Grids" as a wholesale aesthetic (Apple-style product-marketing bento) → REJECTED as brand direction (adopted only as card-grid structure guidance, per the adopted note above — the split is recorded, not silent).
7. colors.csv "Dating App #E11D48 romantic rose + warm orange", "Gaming #7C3AED neon purple + rose action", "Social Media #E11D48 + engagement blue" → all REJECTED vs Wafa Rose: double the chroma, wrong connotations, gradient-native; the ledger rose stands (the brand-distance check names this exact cliché).
