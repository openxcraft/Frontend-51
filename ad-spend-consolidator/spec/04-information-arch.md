# 04 — Information Architecture: ad-spend-consolidator

## Navigation model

Left rail (mirrors in RTL per rtl-rules §2): **Dashboard** (spend dashboard home) · **Ledger** (reconciliation console, snapshots & revisions, raw line items) · **Overlays** (overlay library + comparison) · **Budgets** (budget lines + pacing) · **Channels** (channel connections) · **Policy** (normalization & FX) · **Exports** (report packs + artifacts) · **Queue** (jobs center) · **Settings.** Two-level IA: section → item; the dashboard is a snapshot-scoped view, not a container — every ledger read names its snapshot version on screen (the version is part of the number). ⌘K command palette (P05, T2 mandate) reaches snapshots, channels, line-item keys, moments, budget lines, and actions with bilingual normalized search (rtl-rules §4 — Arabic moment names are searchable with alef/taa-marbouta/yaa normalization).

## Entity overview (07a for full shapes)

**Workspace** (one declared reporting currency; normalization policy; FX rate table) → owns **ChannelConnections** (kind, native currency, cadence, metric shape, dedupe priority, status/credential state) and **SpendLineItems** (raw, channel-native, revision-chained, grouped into **ImportBatches**) → a **ConsolidationRun** (Job) produces a **ConsolidationSnapshot** (immutable, versioned; health flags; totals as derived reads) composed of **NormalizedSpendRecords** (converted amount + **ConversionReceipt**: native amount, rate, basis, policy version) and **OverlapFindings** (candidate pairs + human **Resolutions** with reasons). **HolidayMoments** (bilingual names, anchor rules, market scope, versioned) → **OverlayWindows** (computed occurrences + control windows) → **OverlayComparisons** (derived: lift ratio, like-for-like delta). **BudgetLines** (versioned; period + amount in reporting currency) → **PacingStatus** (derived). **ReportPack**/**ExportArtifact**, **Job**, **ActivityEntry** (P17), **Session** (auth-agnostic).

## Screen inventory (11)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Spend dashboard (home) | period total, daily timeline with overlay bands, channel breakdown, snapshot version chip + health | getSnapshot, getSpendTimeline, getSpendBreakdown, getSession |
| S2 | Reconciliation console | overlap findings beside their raw line-item pairs; resolution actions; cluster grouping | listOverlapFindings, resolveOverlap, listSpendLines |
| S3 | Raw line items | full ledger browser: import batches, revisions, dedupe state, bidi-safe campaign names | listSpendLines |
| S4 | Snapshots & revisions | version history, health flags, revision deltas, superseded markers, re-derive action | listSnapshots, getRevisionDelta, runConsolidation |
| S5 | Overlay library | moment authoring: bilingual names, anchor rules, market scope, status | listHolidayMoments, saveHolidayMoment |
| S6 | Overlay comparison | occurrence windows, control windows, lift ratio, like-for-like delta, channel split | getOverlayComparison, getSpendTimeline |
| S7 | Budgets & pacing | budget lines, pace meters, variance states, amendment history | listBudgetLines, saveBudgetLine, getPacing |
| S8 | Channel connections | connection list, create/edit, verify, cadence + metric-shape + priority policy, health | listChannelKinds, listChannelConnections, createChannelConnection, updateChannelConnection, verifyChannelConnection |
| S9 | Normalization & FX | reporting currency, FX basis, epsilon, pacing threshold; declared rate table with receipts | updateNormalizationPolicy, getFxRateTable |
| S10 | Exports & jobs | report-pack composer, artifacts with expiry, all async jobs (imports, consolidations, exports) | exportReportPack, getArtifact, getUsage, listJobs |
| S11 | Settings | locale/direction default, capability consents (kind-not-vendor), usage window | getSession, getUsage |

Mobile (≤767px): S1 totals + pacing chips, S4 version list, S7 pacing read, S10 job progress — the check-in view; reconciliation editing (S2/S3), overlay authoring (S5), and policy edits (S9) are desktop/tablet (00 surface). Every screen states its filters (P08) and its four empties per P01 (11 matrix).

## Per-screen state obligations

First-run (S1 offers the sample workspace — the planted overlap and the Ramadan double-occurrence are the value proof); skeletons mirror final geometry per direction (P02, RTL skeletons flip; the timeline reserves band-width so overlays arriving cause no reflow); errors per 03 mapping; copy matrix in 11. The dashboard is snapshot-scoped: switching snapshot versions is an explicit, named action — ambient "live" totals do not exist in this product (the number is always a version, 00).

## IA decisions and rationale

- **The dashboard binds timeline + breakdown + version chip permanently**: the consolidated total, its shape over time, and *which version produced it* are one read — detaching version state from totals is exactly the silent-mutation posture the snapshot design refuses (07a).
- **Reconciliation is its own console (S2), not a tab on the dashboard**: the overlap decision needs both line items, both policies, and room for a reason — a modal would shrink the evidence the decision depends on (02 Adel's audit posture).
- **Raw line items get a full browser (S3)**: the drill from aggregate → row is the product's evidence spine (03 CP-2.5); burying rows behind expanders-only would hide the ledger's grain.
- **Overlay library and comparison are separate (S5/S6)**: authoring policy data (moments) and reading derived arithmetic (comparisons) are different jobs for different personas (Nouf authors; everyone reads) — same entity family, two postures.
- **Channels (S8) and Policy (S9) are separate**: connection health is Lina's daily surface; currency/epsilon policy is Huda's declared-once governance — conflating them buries the one-time decision under the operational one.
- **Exports shares the jobs surface (S10)**: report packs are the only artifact-producing surface; the jobs console is async-contract §7's dedicated IA for T1/2 — imports, consolidations, and exports in one filterable queue.
- **Queue is small but first-class**: three job classes exist from day one (import, consolidation, export); the jobs console is their single home (async-contract §7).
