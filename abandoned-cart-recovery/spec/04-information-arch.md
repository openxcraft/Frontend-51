# 04 — Information Architecture: abandoned-cart-recovery

## Navigation model

Left rail (mirrors in RTL per rtl-rules §2): **Queue** (recovery queue — home) · **Sequences** (studio) · **Templates** (library + generation dock) · **Policy** (routing & incentives · quiet-hours center) · **Ledger** (send ledger · suppression ledger) · **Report** · **Jobs** · **Settings.** Two-level IA: section → item; the sequence studio and template library are the two authoring surfaces; the queue and send ledger are the two operating surfaces. ⌘K command palette (P05, T2 mandate) reaches carts (by shopper handle or cart id), sequences, templates (normalized bilingual search incl. Arabic normalization per rtl-rules §4), jurisdiction rows, and jump-to-state filters.

## Entity overview (07a for full shapes)

**Workspace** → owns **AbandonedCarts**, **RecoverySequences**, **MessageTemplates**, **RoutingPolicy**, **QuietHourPolicies**, **Suppressions**, **Jobs**, **Artifacts**. An **AbandonedCart** (shopper ref, line items with bilingual names, total, currency, locale, jurisdiction+timezone, consent basis, provenance) passes deterministic intake → band + priority + routing → a **SequenceAssignment** (sequence + version, optional manual override with reason). A **RecoverySequence** (versioned: draft/active/paused/retired; consent basis; expiry) contains ordered **SequenceSteps** (delay, channel kind, template ref + version, quiet-hours policy ref, incentive ref). The scheduler produces **SendRecords** (scheduled/deferred/dispatched/delivered/clicked/failed/cancelled/skipped-suppressed — deferrals carry reason + rescheduled time + policy-row version). **ShopperEvents** (delivered/clicked/checkout-completed/opt-out; provenance manual|channel) drive state transitions and the **SuppressionLedger**. **DraftVariantSets** (provenance `generated`) feed template promotion. **RecoveryReport** (derived), **Job**, **ExportArtifact**, **ActivityEntry** (P17), **Session** (auth-agnostic).

## Screen inventory (11)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Recovery queue | carts list, priority/band/locale/state, filters + saved views (P08), onboarding checklist (P22) | listCarts, getSession |
| S2 | Cart detail | items, shopper, consent basis, send timeline + events, sequence state, operator actions (override / cancel / event / suppress) | getCart, assignSequence, cancelCartRecovery, recordShopperEvent, addSuppression |
| S3 | Sequence studio | sequence list + step editor (delay, channel kind, template binding, policy refs), versioning, activation gate, schedule preview | listSequences, getSequence, createSequence, updateSequence, setSequenceStatus, previewSchedule |
| S4 | Template library + generation dock | bilingual two-column authoring (P23), variable chips, length budgets, approve/retire lifecycle; dock: generated drafts with diff + promote gate | listTemplates, saveTemplate, approveTemplate, retireTemplate, generateMessageVariants, getDraftVariantSet, promoteDraftVariant, getUsage |
| S5 | Routing & incentives | value-band thresholds, band → sequence mapping, per-band incentive policy, version diffs | getRoutingPolicy, updateRoutingPolicy |
| S6 | Quiet-hours policy center | jurisdiction window rows with source labels, workspace default row, versioning, preview link | listQuietHourPolicies, saveQuietHourPolicy |
| S7 | Send ledger | the outbox: every send with state incl. deferred (reason + rescheduled time + policy version), channel kind, filters | listSends |
| S8 | Suppression ledger | opt-out and manual entries, restore with reason | listSuppressions, removeSuppression |
| S9 | Recovery report | recovered revenue, per-step funnel, deferral statistics, per-sequence comparison, export launch | getRecoveryReport, exportRecoveryPackage, getArtifact |
| S10 | Jobs center | imports/generations/exports, cancel/retry, link-to-context (async-contract §7) | listJobs |
| S11 | Settings | workspace locale + currency set, capability consent state (kind-not-vendor), usage window, defaults (abandonment threshold) | getSession, getUsage |

Mobile (≤767px): S1, S7, S9 read modes; S2 timeline read + event entry (the on-call path: record what happened while away); S3–S6, S8, S10, S11 read-only or deferred to desktop. Every screen states its filters (P08) and its four empties per P01 (11 matrix).

## Per-screen state obligations

First-run (S1 offers the sample set — a deferred send, a recovered cart, a suppressed shopper are the planted value moments); skeletons mirror final geometry per direction (P02, RTL skeletons flip); errors per 03 mapping; copy matrix in 11.

## IA decisions and rationale

- **The queue is home, not a dashboard**: recovery is a queue of work objects with clocks attached (02 Faisal's daily loop) — the operator's first question is "what needs a human today", answered by priority-sorted rows with deferral and failure marks, not by a chart.
- **Send ledger is separate from cart detail, not instead of it**: the ledger answers "what did we send and when did the clock move it" across carts (the compliance surface); cart detail answers "what happened to this cart" (the work surface) — same SendRecord data, two scopes, one operation (listSends + getCart's embedded timeline).
- **Sequences and templates are separate authoring surfaces**: templates are bilingual copy assets reused across sequences and bands (Karim's cross-brand archive); steps are policy (timing, channel, incentive). Splitting them keeps both reusable and both versioned independently.
- **Policy is one section with two screens (S5/S6)**: Dana's two artifacts — money discipline (routing/incentives) and clock discipline (quiet hours) — are distinct surfaces sharing the versioned-policy grammar (diffs, preview gate, pinned history).
- **The generation dock lives inside the template library, not in sequences**: generation produces *draft copy assets* (provenance-gated, promotion-gated) — placement in the library keeps the two human gates (review-diff promote → template approve) physically adjacent and keeps sequences AI-free by construction (00 stance).
- **Report is a derived read with its own screen (S9)**: the buyer's monthly artifact (02 Nayla/Karim) and the export launch point — burying it in settings would hide the product's answer; making it editable would violate its derived nature.
