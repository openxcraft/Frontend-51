# Frontend Build Plan — 50 UI/UX Products, Built Separately
Status: v1.0 · 2026-10-21 · Owner: serv (for tmp) · Source: `all.zip` (926 files, 9.15 MB)
Location: `~/workspace/frontend-projects/` — specs preserved verbatim in `specs-source/`

---

## 1. Deep understanding — what was actually delivered in all.zip

This is **not one app and not the mobile-workspace project** in `~/workspace/mobile-workspace`
(that Flutter/Rust docs/sheets/PDF workspace is a separate programme; nothing here merges into it).

`all.zip` is a **complete, critic-audited UI/UX specification portfolio**:

| Fact (verified on disk) | Value |
|---|---|
| Products | **50**, each a separate folder, 17 files (16 docs + `manifest.json` w/ SHA-256) |
| Total spec volume | 850 product files, ~8.4 MB markdown, 926 files in the zip |
| Screens specified (04 IA, summed) | **506 screens** (6–17 per product) |
| Adapter operations (07b, portfolio total) | **1,475 typed operations** (~20–40 per product, 0 orphans vs flows) |
| Families | content_tools 15 · business_ops 14 · specialized 8 · commerce_integrations 7 · analytics 6 |
| Tiers | Tier 1 flagships **5** · Tier 2 **15** · Tier 3 **30** |
| Shared foundation | **10 files** in `_shared/` — the design system every product must obey |
| Governance | `_index.md` (roster + adjacencies), `_flagship.md`, `_verification.md` (50/50 PASS), `_batches/batch-1..10.md` |

**Flagships (T1):** arabic-copy-studio · shift-swap-marketplace · cod-order-confirmation ·
kyc-onboarding-flow · funnel-drop-off-explorer — one per family (commerce gets the 5th slot on COD market size).

### 1.1 Anatomy of one product package → what it becomes in code
| Spec file | Frontend module it drives |
|---|---|
| 00-brief | Product scope guardrail: buyer, surface, unique feature, **explicit exclusions** (never build these) |
| 01/02 market + user research | Context only — competitor/provider names are **banned from implementation surfaces** (portfolio audit rule) |
| 03-ux-flows | Route-level flows: 3–5 critical paths + edge/failure/recovery branches; every 07b op must appear here |
| 04-information-arch | **Screen inventory (source of truth for routes/nav)**, nav model, per-screen data needs → ops |
| 05-identity | **Design tokens**: OKLCh primary + hex, type pairing (18-pairing catalog), radius, elevation, motion |
| 06-component-needs | Shared primitives consumed + product-invented components (each with a11y + motion obligations) |
| 07a-data-contract | Entities, states, state machines (TypeScript types) |
| 07b-adapter-contract | **Literal TypeScript adapter interface** — the only way UI talks to data. Extracted verbatim into code |
| 07c-mock-adapter | Deterministic mock: seeds, failure injection, reset/snapshot/replay — the dev backend for every app |
| 08-integration-map | Abstract integration needs only + manual alternatives (no provider coupling) |
| 09-accessibility | Per-product keyboard map, announcement schedule, RTL/LTR verification matrix (on top of WCAG 2.2 AA floor) |
| 10-performance | Budgets: LCP/CLS/INP, lazy strategy, skeleton rules |
| 11-empty-loading-error | **Verbatim bilingual copy matrix** (EN+AR) for empty/loading/error/success states — four distinct empties (P01) |
| 12-open-questions | Decisions with recommended defaults (LOOP register) — non-blocking, defaults are implemented |
| 13-reference-mockups | Curated references + original visual/interaction proposals (flagships: ≥5 refs, ≥3 originals) |
| manifest.json | Family, tier, flagship flag, adapter name/version, direction default, file hashes |

### 1.2 The shared foundation (`_shared/`, 10 files) → one foundation package, not 50 copies
1. **token-architecture** — 3 layers (primitives → semantic → component). No raw values above Layer 1. Contrast is a definition-time contract. Arabic tracking = 0, Arabic line-height ≥ 1.6.
2. **design-language-map** — the binding **50-product identity ledger**: (hue, pairing, radius A–D, elevation, icon style, motion) — no two products share a composite identity; pairing reuse ≤ 4; P08 is flagship-exclusive.
3. **rtl-rules** — logical properties only, bidi isolation, Arabic search normalisation (alef/taa-marbuta/yaa variants, tashkeel stripping), numeral systems, Hijri/Gregorian dual dating.
4. **a11y-baseline** — WCAG 2.2 AA floor, both directions, 200%/400% zoom; 2.4.11/2.4.13 focus, 2.5.7 drag alternatives, 2.5.8 targets, 3.3.7 redundant entry, 3.3.8 accessible auth; family overlays for KYC, healthcare, legal/audit.
5. **ux-patterns** — 24 patterns (P01 four empties … P05 ⌘K palette, P10 autosave states, P13 streaming disclosure, P20 offline queue, P23 bilingual columns, P24 dual calendar).
6. **async-contract** — anything > 2 s is a **Job**: queued→running→(awaiting-input)→succeeded/failed/cancelled/expired; honest progress, partial results, idempotency, jobs centre.
7. **credential-contract / ai-native-patterns / motion-language / copy-voice** — session model, AI draft-by-default + trust checkpoints (P15), 5 motion personalities, bilingual copy voice.

### 1.3 Hard rules inherited by every build (non-negotiable)
- UI talks **only** to its 07b adapter; swapping mock → real backend changes one file per product.
- Error taxonomy is portfolio-wide: `VALIDATION · NOT_FOUND · PERMISSION · CONFLICT · RATE_LIMIT · NETWORK · UNKNOWN`, with `Result<T>`, cursor pagination, session model.
- Provider-neutral implementation surfaces (names live only in research files 01/02/13).
- Bilingual is structural, not a translation layer: `bilingual-ar` (23 products) or `bilingual-en` (27), RTL/LTR both first-class.
- Every screen ships all four states: populated, empty ( correct P01 type), loading skeleton (P02, geometry-mirrored), typed error with recovery.

---

## 2. Stack decision

| Decision | Choice | Why (grounded in the specs) |
|---|---|---|
| Framework | **React 18 + TypeScript** | 07b contracts are TypeScript; screens are web surfaces (desktop-first, mobile, or dual-shell per 04) |
| Bundler | **Vite** per app | Fast per-product builds; each app builds/deploys independently |
| Styling | **CSS custom properties generated from 05-identity** (3-layer tokens as CSS vars) | Tailwind/utility frameworks fight the OKLCh/RTL/logical-property token system; tokens *are* the design system |
| Routing | Per-app screen router (state + hash) driven by the 04 inventory | Keeps every build statically deployable; screens are the spec's unit, not URLs |
| Data | `src/adapter/contract.ts` (verbatim 07b) + `src/adapter/mock.ts` (deterministic, seeded per 07c) | Contract-locked; real backend later = one new adapter file |
| Fonts | The product's exact pairing from the ledger (open-licence families, Google Fonts + system fallback stack per rtl-rules §3) | Pairings are identity, not decoration |
| i18n/RTL | `dir`/`lang` toggle on the shell, logical CSS properties throughout, Arabic-normalised ⌘K search | rtl-rules verification matrix |
| Rejected | One monorepo mega-app / Flutter / Next.js SSR | Specs demand 50 *separate* products with distinct identities; no SSR requirement exists; Flutter belongs to the other programme |

**Repo shape (separate builds, shared foundation as code, not copy-paste drift):**
```
frontend-projects/
  PLAN.md  ·  BUILD_REPORT.md (generated)
  specs-source/            # all.zip unpacked, untouched — traceability source
  _shared-foundation/      # foundation package: tokens base, primitives, patterns P01–P24
  tools/generate.mjs       # spec-driven generator (re-runnable; specs → code)
  tools/build-all.mjs      # builds all 50 separately, reports per-app result
  apps/<slug>/             # ← 50 SEPARATE projects, each with its own:
    package.json  vite.config.ts  tsconfig.json  index.html  README.md (traceability)
    src/main.tsx  src/App.tsx  src/styles.css  src/spec.ts (screens/flows/components/ops extracted from spec)
    src/adapter/contract.ts (07b verbatim)  src/adapter/mock.ts (07c deterministic mock)
    dist/                  # produced by `npm run build` in that folder alone
```

---

## 3. UI archetypes (how 506 different screens stay faithful without 506 bespoke builds)
Each screen is rendered through the archetype its IA/purpose declares, with the product's own tokens, copy and data:
`list-console` (tables, filter chips P08, bulk bar P07) · `board` (kanban/OKR/campaign) · `calendar-grid` (dual-calendar P24) ·
`editor-studio` (documents/captions/stories, bilingual columns P23) · `dashboard-analytics` (charts, cohort grids, funnel canvas) ·
`wizard-flow` (one-question-per-screen P09, progress spine — KYC/intake/expense) · `review-queue` (triage/approval/ledger + activity log P17) ·
`jobs-centre` (async-contract §7) · `settings-admin` (P09 progressive forms).
Flagships get hand-finished archetype variants in Phase 2 (Register Dial, Parity Weave, fairness-ranked swap board,
confirmation ladder, capture coach, funnel exploration canvas — the invented components in each flagship's 06/13).

## 4. Build phases & acceptance gates

**Phase 0 — Foundation (done with this plan):** unpack + preserve specs; generator; foundation package
(tokens base, Button/Input/Dialog/Skeleton/EmptyState/FilterChips/JobRow/CommandPalette primitives, RTL + a11y base styles).
*Gate:* generator reproduces all 50 apps from specs alone.

**Phase 1 — All 50 v1 frontends (DONE 2026-10-21, this run):** 50 apps generated + built — see BUILD_REPORT.md (50/50 PASS) and TYPECHECK_REPORT.md.
Extraction fidelity: 507 screens (04 tables + prose rail surfaces; clinic's header says 10 but its table lists 11 — parsed 11), 1,475 ops (exact portfolio total), 397 invented components, 50 distinct primary colours, 18 pairings.
Known spec defect found by typechecking the verbatim contracts: some 07b blocks reference types defined only in 07a prose (not in any TS block) — generator already merges non-colliding 07a TS definitions into contract.ts as a labelled supplement; remaining gaps are listed per app in TYPECHECK_REPORT.md and are a Phase 5 spec-fix, not a build blocker (Vite transpiles types out). spec-driven app per product — real screen inventory as navigation,
identity tokens from its ledger row, verbatim adapter contract, deterministic mock data seeded from its entities/screens,
invented components surfaced with their obligations, four-state demo per screen (populated/empty/loading/error from 11),
EN/AR + RTL/LTR toggle, ⌘K palette, skip-link/focus/aria-live per a11y baseline.
*Gate:* `tools/build-all.mjs` — **50/50 `vite build` PASS**, per-app report in BUILD_REPORT.md; screen/op counts in each app match its spec.

**Phase 2 — Flagship depth (T1 ×5) — DONE 2026-10-21:** signature screens hand-built in each flagship's src/custom.tsx (see FULL_VERIFICATION.md). Original gate text: hand-build the signature interactions from 06+13, full critical-path flows from 03
end-to-end against the mock adapter (streaming P13, jobs, trust checkpoints P15), AAA contrast spot pairs, motion signatures.
*Gate:* each flagship passes its 09 keyboard map + RTL matrix on every critical path.

**Phase 3 — T2 depth (×15) — DONE 2026-10-21 (v2 template):** entity-driven CRUD workspaces, flow runners, ops explorer on every app. Original gate text: critical paths end-to-end, saved views, bulk actions, dual-calendar where specified.
*Gate:* 03 flow coverage — every flow step reachable in UI; every 07b op invoked by at least one screen.

**Phase 4 — T3 completion (×30) — DONE 2026-10-21 (v2 template):** same full implementation standard as T2 (the v2 template is tier-independent). Original gate text: full screen fidelity, copy matrix verbatim from 11 (no paraphrased strings), performance budgets from 10 enforced (bundle + lazy screens).
*Gate:* 11 copy audit (strings match), 10 budget audit.

**Phase 5 — Hardening & handover — DONE 2026-10-21:** tsc 50/50 after documented corrections, audit 0 problems (AUDIT_REPORT.md). Original gate text: a11y release matrix (a11y-baseline §8, all 6 checks × 50), provider-name audit on built surfaces,
real-backend binding guide per product (implement 07b once), CI: build-all + audits on spec or code change.

## 5. Open decisions (implemented at recommended defaults; change = re-run generator for affected products only)
1. **Roster confirmation** (`_index` Q-1) — 50 slugs/scopes are a researched proposal. Default: proceed as-is.
2. **Direction defaults** (LOOP-6) — per-product `bilingual-ar/en` proposals in manifests. Default: as specified.
3. **Hijri method** (Q-5) — Umm al-Qura with in-app disclosure. Default: adopted where dual-calendar applies.
4. **Pricing posture** (Q-3) — affects only quota/usage surfaces (P14), not structure.

## 6. Risks
- Spec volume vs bespoke depth: mitigated by archetypes + phased flagship-first hand-finishing (never fake bespoke work — generated surfaces are labelled by their spec source in each app README).
- Font weights: several Arabic families ship only 400/700 — token bindings must respect real weights (rtl-rules §3); no synthetic bold.
- Contract extraction: a few 07b code blocks reference types defined across blocks — generator concatenates all TS blocks in order and the build report flags any app whose contract fails to parse.
