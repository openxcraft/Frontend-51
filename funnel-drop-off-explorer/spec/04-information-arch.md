# 04 — Information Architecture: funnel-drop-off-explorer

SME-C pass · One product, one shell, two viewports. The desktop-first exploration canvas (≥1280px) and the tablet review view (≥820px) are projections of the same entity graph (07a) and the same adapter (07b) — no separate information model exists. Every screen's data needs map to adapter operations; no screen renders data the contract cannot supply. The word "dashboard" does not appear anywhere in this IA: the canvas is a workspace you interrogate, and that posture is the product's structural differentiator against the incumbent widget-wall (01 §6.3).

## Entity overview (navigation-relevant; full contract in 07a)

User · TaxonomyEvent (+ properties, status lifecycle) · EventSource · Funnel (+ steps, ordering mode, conversion window, filters) · FunnelMetrics (immutable computation rows with basis) · TransitionDetail (time distribution + displaced paths) · SegmentDefinition (predicates + origin) · AnnealRun (policy + full iteration trace) · Cohort (materialized pseudonymous keys) · Analysis (the evidence pack: funnel + parameters + run + narrative + segments + annotations) · Narrative (provenance-tagged) · Job · ActivityEntry · NotificationEvent. Movement spine: **TaxonomyEvent → Funnel(steps) → compute → FunnelMetrics → seam selection → (breakdown | displaced paths | time) → AnnealRun → SegmentDefinition → Cohort(user drill) → Analysis → exported artifact**, with the taxonomy governance loop (lint → fix → version) feeding every stage and the analyses feed as the collaboration destination.

## Navigation model

### Desktop exploration canvas (≥1280px, keyboard-first)

Top rail (inline-start vertical rail): **CANVAS HOME** (funnels list — analyst default) · **SEGMENT WORKSHOP** · **COHORTS & USERS** · **TAXONOMY** · **SOURCES & SAMPLES** · **ANALYSES** · **ACTIVITY & JOBS** · **INBOX**. The exploration canvas itself (S3) opens from any funnel row and is a full-viewport workspace: the Step Composer collapses into a header strip after composition; the Cascade occupies the main column; the seam dossier docks inline-end as a stack-pushed panel (two levels max: rail surface → canvas → dossier panel); sheets (anneal launcher, compare, narration, export) dock above the dossier. ⌘K palette (P05) reaches funnels, events, segments, cohorts, analyses, and actions ("run anneal on selected seam", "break down by platform") with bilingual normalized search (rtl-rules §4 — the taxonomy's Arabic labels are first-class search terms).

### Tablet review view (≥820px, touch)

Tabs (4): **ANALYSES** (the feed — default for viewer role) · **FUNNELS** (read-only cascade with seam dossiers, no composer) · **COHORTS** (read-only drill) · **INBOX**. No taxonomy mutation, no funnel authoring, no policy publish below desktop — the review posture is read-and-annotate (analysis notes, shares, exports). Below 820px the product states the honest boundary (a phone is not an exploration surface — 11 §G degradation row) and offers the digest only.

## Screen inventory (11 screens; viewport per screen)

| # | Screen | Shell / viewport | Purpose | Key data needs (→ 07b) |
|---|---|---|---|---|
| S1 | SIGN-IN | Both / all | session entry, locale pick, role routing | getSession |
| S2 | CANVAS HOME | Desktop ≥1280 | funnel list with latest headlines (conversion, trend arrow, freshness), new-funnel entry, first-run data posture | listFunnels, importEventSample, listEventSources, computeFunnelMetrics (headline basis), getSession |
| S3 | EXPLORATION CANVAS | Desktop ≥1280 (tablet: read-only cascade) | the flagship surface: composer strip, the Cascade, seam navigation, dossier stack | computeFunnelMetrics, getFunnel, saveFunnel, breakdownFunnelStep, getStepTransitionDetail, getFunnelTrend, annealSegment, compareSegments, listTaxonomyEvents, narrateDropOff, saveAnalysis, subscribeWorkspaceEvents |
| S4 | SEGMENT WORKSHOP | Desktop ≥1280 | segment library (provenance cards), anneal history (runs with traces), compare board | listAnalyses, getAnalysis, compareSegments, annealSegment (policy default publish — admin), saveCohort, listCohorts |
| S5 | COHORTS & USERS | Desktop ≥1280 (tablet read-only) | cohort library, pseudonymous user drill | listCohorts, listCohortUsers, saveCohort |
| S6 | TAXONOMY MANAGER | Desktop ≥1280 | bilingual event dictionary, lint report, event cards, deprecation gates, proposed events | listTaxonomyEvents, getTaxonomyEvent, upsertTaxonomyEvent, setTaxonomyEventStatus, getTaxonomyLintReport |
| S7 | SOURCES & SAMPLES | Desktop ≥1280 | bound source health (credential lifecycle), paste-sample import | listEventSources, importEventSample, getJob |
| S8 | ANALYSES FEED | Both (tablet default) | saved evidence packs: headline, narration, Spine preview, share state, export path | listAnalyses, getAnalysis, exportAnalysis, narrateDropOff (regenerate), markNotificationsSeen (context) |
| S9 | ACTIVITY & JOBS | Desktop ≥1280 | activity trail (P17), job center | listActivity, getJob, retryJob, cancelJob |
| S10 | INBOX | Both | notification digest ladder (P21) | listNotifications, markNotificationsSeen |
| S11 | ONBOARDING CHECKLIST | Both / first-run overlay | P22 value milestones, four persona entry paths | (links into S2/S3/S6/S8; no own data) |

Responsive behavior: the desktop canvas is the base layout; ≥820–1279px renders the review view (analyses/funnels-read-only/cohorts/inbox tabs); below 820px the digest-only boundary states itself honestly (04 decision recorded, 12 Q-14 — a phone-sized funnel explorer is a degraded toy, and this product refuses the toy).

## Per-screen state obligations

Each screen declares its four empties (P01), loading shape (P02 skeletons mirroring final geometry, RTL-flipped), and error classes (03 mapping) in the 11 matrix. Canvas-critical empties: first-run (no data — teach the paste-sample loop, CP-1.2), no-data-after-activity (source unbound/sample expired — the data-posture chip), no-access (viewer role on authoring surfaces — never called "empty"), filtered-empty (segments/cohorts outside the filter — reset + name what exists). The taxonomy manager distinguishes "dictionary empty" (first governance pass) from "lint clean" (a GOOD state with its own copy — 11 §A).

## IA decisions and rationale

- **The seam is the unit of work, and the dossier is a docked panel, not a route**: the cascade is decision context — seam-to-seam movement (j/k) must never navigate away from the render; the dossier stacks inline-end so both stay visible (CP-2; rejects the incumbent chart-switching posture, 01 §5.3).
- **The canvas is a query surface with local last-good retention**: reads never blank the canvas on failure (03 CP-2 recovery) — an analyst mid-exploration keeps her render with a staleness chip; this is the query-first degradation posture.
- **The workshop lists segments through analyses, not beside them**: a segment without provenance (which funnel, which seam, which run) is exactly the floating cohort-chip the incumbents produce; provenance is structural by making the analysis the parent entity (03 design note (a)).
- **The taxonomy manager is top-level, not a settings tab**: taxonomy is half the product's namesake feature; governance is a daily surface for the data engineer persona (02 Reem), not an admin afterthought.
- **The analyses feed is the tablet default**: Sara and Layla live here (02); the review posture (narration + Spine + export) is what makes evidence self-serve for non-analysts — the adoption story for the economic buyer.
- **Cohorts are materializations, not filters**: a cohort is a snapshot of a segment's user set at a moment (with a basis timestamp); conflating it with a live filter would silently drift the evidence — 07a lifecycle.
- **Inbox has zero instant-tier classes at v1**: an exploration tool has no page-worthy emergencies; the deliberate absence is recorded (12 Q-13) rather than filled with notification theater.
- **Below 820px is a stated boundary, not a broken layout**: the product's value is a large-canvas interrogation posture; the honest phone answer is the digest, and pretending otherwise would ship a toy that damages the flagship surface's credibility.
