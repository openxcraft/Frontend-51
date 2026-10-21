# 10 — Performance: kyc-onboarding-flow

Spec commitments an implementation must meet; the Critic enforces them as budget rules. The performance story has two heroes and one clock. **Hero 1 — the applicant flow on a mid-range phone at 21:40 on throttled 4G** (02 Amal): the abandonment research is explicit that time is the killer — the average applicant abandons at 14 minutes 20 seconds of process (Signicat, 01 §4.3), 70% abandon KYC flows longer than three minutes (Perspective), and >5-minute processes see ~40% completion drop (ConvertCart) — so every budget below exists to keep ACTIVE WORK inside the patience band while the resumability machinery makes INTERRUPTION free. **Hero 2 — the reviewer console queue** worked keyboard-only for hours (02 Maryam): the 12-task queue clears in under 5 minutes (00 success signal 2), which is a throughput budget, not a hope. **The clock — the seeded mock's frozen instant** (07c §1): every deadline, countdown, and cadence computes against declared clock advances, never wall-clock, so performance testing is deterministic and replayable byte-identically (07c §5).

## Route budgets (JavaScript transferred, gzip)

| Route | Budget | Strategy |
|---|---|---|
| Applicant shell (entry + step flow + spine + ribbon) | ≤ 170KB | the flow is the product — entry, steps, autosave indicator, recall chips, spine eager |
| Capture step chunk | ≤ 60KB (lazy) | loaded at document-step entry; camera surface + gate checklist + upload path |
| Status page (S6) | ≤ 30KB (lazy) | post-submission applicant surface; event subscription + notices |
| Console shell (queue + drawer + composer) | ≤ 220KB | queue table + dossier layers + decision composer eager; admin surfaces lazy |
| Admin bundle (program + templates + team + jobs) | ≤ 140KB (lazy) | loaded on admin paths only (04 role routing keeps reviewer sessions lean) |
| Ledger/jobs/inbox surfaces | ≤ 70KB (lazy) | dispute path + job center + inbox |

The applicant shell never loads console code and vice versa (04 two-shell IA) — the applicant's 21:40 data plan does not pay for the reviewer's grid library.

## Applicant-flow interaction budgets (the abandonment math)

- **Step-to-step advance ≤ 250ms p95 warm** (submitStep optimistic → next step card painted; the fold choreography runs inside this window at 320ms-overlapped — the fold animates while the next question paints, never serial to it).
- **Autosave round trip ≤ 400ms p95 on throttled 4G** (saveStepDraft optimistic write; indicator saving → saved inside the window; the indicator fades at 3s per P10 — the applicant should almost never SEE "saving", only "saved"). Debounce: 800ms after last field change + immediate on blur and on step change (P10 cadence).
- **Capture evaluation loop ≤ 120ms p95 per evaluation at a 2Hz declared cadence** (500ms between evaluateCaptureFrame calls — NOT per camera frame): the advisory loop must return gate states before the next cadence tick; the loop NEVER blocks the shutter (07b rule 3 — a stalled evaluation degrades to last-known checklist state with the reason stated, CP-3 failure mode).
- **Capture submission pipeline ≤ 1.5s p95 on throttled 4G** (submitCapture including image transfer; resumable job-class write on NETWORK per CP-3 failure mode; progress honesty per async-contract §8 — "جارٍ رفع الصورة — 62%" style, determinate).
- **Submission (submitApplication) ≤ 900ms p95** — freeze + ReviewTask creation + notice emit is one idempotent round trip (07b rule 2); a retried submit never double-creates a task.
- **Cold resume (resumeApplication) → exact-step first paint ≤ 1.5s p95 on 4G**: token validation + full step-bundle hydration + recall chips render with ZERO CLS (chips have reserved inline space — Arabic strings run ~125% of English, layout budgets for it, copy-voice §5).
- **Applicant TTI ≤ 3.5s / LCP ≤ 2.5s / INP ≤ 200ms / CLS ≤ 0.02 per screen** on the reference phone; the attestation panel (the heaviest reading surface) loads ≤ 1s with the full text focusable immediately.
- **Session ribbon ticking**: countdown text updates at 1Hz coalesced per frame, tabular numerals, fixed-width ribbon — zero reflow, zero announcements (09 schedule). The 2-minute warning fires ONCE, server-side timed (07b rule 6).
- **ACTIVE-WORK time budget (the product's core promise)**: the seeded 5-step program completes in ≤ 12 minutes of active applicant work (00 success signal 1 — the CP-6.10 walkthrough logs 11m40s including two glare retakes); median step ≤ 90s active work; the document step (the category's 30–40% drop-off step — 01 §4.2) ≤ 4 minutes including retakes. These are UX budgets enforced by the flow's structure (one question per screen, P09), not by speed alone — but every interaction budget above exists so the machinery never ADDS time.
- **The resume-cascade motion cost ≤ 300ms total** (5-element unfold at ≤60ms stagger — 05): bounded by the stagger cap, runs inside the step-hydration window, never serial to the first question's paint.

## Console interaction budgets (the throughput instrument)

- **Console TTI ≤ 2.5s / LCP ≤ 2.0s / INP ≤ 200ms / CLS ≤ 0.02 per route** on the reference laptop.
- **Queue throughput**: row focus→paint ≤ 16ms (60fps floor under j/k hold — P18); deadline ticks at 1Hz with zero layout shift (tabular numerals, fixed columns).
- **Dossier open ≤ 200ms first paint** from the row's embedded data (listReviewTasks embeds deadline, aging, rework, warning count, assessment presence — one fetch for N rows, 07b denormalization), then getReviewTask reconciles the four layers (captures + quality reports + assessment + mismatch flags) without blocking the first paint — corrections only ADD (a missing finding can appear; a shown one never silently vanishes).
- **Mismatch-flag assembly ≤ 50ms p95** at dossier render (pure functions over declared inputs — 07c §2.4); SLA class computation is arithmetic on the task row (07c §2.2), zero extra round trips.
- **Decision commit**: optimistic render ≤ 100ms with adapter confirmation reconciling idempotently (07b rules 1–2); the seal settle (360ms) runs overlapped with the queue row's state patch, never blocking the next j/k.
- **Assessment request**: requestVerificationAssessment resolves a Job-shaped return immediately (async-contract §1); the dossier's assessment layer renders the pending state inline ("التقييم الآلي قيد الجريان — يمكنك البت الآن على الأدلة" — CP-5 edge) — the machine is never a blocker, so its latency is never the reviewer's latency.
- **Queue virtualization (P19)**: above 200 rows the queue virtualizes (a month-end backlog of 2,000+ tasks is the planned pathological case); scrolling never moves focus; row-count context on region entry; live patches (subscribeApplicationEvents) re-render only the affected row, coalesced to ≤ 1 batch per frame; re-sorts happen off-viewport or on scroll-idle only (CP-5.8).
- **12-task queue clear ≤ 5 min** end-to-end including 9 approves, 1 reject with reason codes, 2 rework decisions with step targeting (00 success signal 2 — the scripted benchmark).

## Resumability budgets (the flagship mechanic's cost profile)

- **Application state payload ≤ 90KB gzip** for a full 5-step program with capture metadata (thumbnails excluded — the step bundle carries answers, validation state, recall keys, and capture QUALITY REPORTS as data, not images).
- **Capture thumbnails ≤ 40KB** progressive, rendered in summary/dossier lists; full images lazy-load on dossier zoom (≤ 900KB per image typical, streamed).
- **Resume token validation + step hydration = ONE round trip** (resumeApplication returns the ApplicantContext compound — 07b: application + currentStep + session + programVersion + tokenExpiry — no waterfall).
- **Cross-device continuation is stateless for the client**: no local cache is trusted on resume; the token is the state (07a) — a fresh device pays exactly the cold-resume budget, nothing more.
- **Idle-timeout end state persists instantly** (≤ 100ms local write of the already-autosaved draft acknowledgement): timeout never destroys data (CP-1.4) — the durability is architectural (07a lifecycle), the budget is for the honest ended-state render.

## Offline capture queue (P20 — the applicant's evening reality)

- **Draft writes queue locally with per-field state** (answers, not images); queue is reviewable and per-item cancellable before reconnection flushes (P20); text payloads are tiny (≤ 2KB per write) — the queue is effectively unbounded for drafts within device storage.
- **Capture uploads are resumable job-class writes**: on NETWORK mid-upload, the image transfer resumes (chunked, declared-progress); at most 3 pending captures per document side queue locally (bounded image storage — 07c MockConfig.offlineQueueBehavior exercises both 'flush-all' and 'discard-resolved').
- **Reviewer decisions queue offline with per-task state** (CP-6.11): reconciliation discards only legally-superseded writes with notices — a queued decision that reaches a resolved task resolves to a discard notice, never a phantom write (07b rule 1).
- **Reconnect flush**: queued writes post in order with their original timestamps; conflicts surface as CONFLICT with both-states compare (P10 discipline) — never silent overwrite.

## Perceived performance (honesty rules)

- **Skeletons (P02) mirror final geometry RTL-flipped** — the spine renders its step-count structure immediately (the applicant sees HOW MANY steps remain before the first question paints — the resumability promise is visible from the first frame, CP-1.2); skeleton duration honest: first page ≤ 50 items (07b limit), one round trip.
- **The fold fires on step completion events, never on re-renders** (10 contract for 05's signature): a resumed application does not re-fold its history; the cascade runs ONCE per resume (the unfold direction), and subsequent visits render at final state.
- **Queue landings patch rows in place**; arrivals announce politely on the focused row only (09 schedule); reshuffles never occur under the cursor (CP-5.8) — the reviewer's j/k muscle memory is a performance surface.
- **Job progress is visible where the job lives** (ledger exports in the jobs center + inline job rows; assessment runs in the dossier layer) — no background polling on queue surfaces; return-state surfaces unfinished business on re-entry (async-contract §6.3).

## Asset strategy

- **Fonts**: Arabic-first subsetting — Readex Pro (400/500/700 — the P07 real weights, 05) + DM Sans (400/500/700) ≈ ≤ 160KB per direction with `font-display: swap` and metric-compatible fallbacks (Noto Sans Arabic / Noto Sans) bounding CLS ≤ 0.02; zero synthetic weights (rtl-rules §3); Arabic tracking stays 0 (token obligation — no optical tricks buy density).
- **Icons**: single line-2 constructed outline sprite (24px grid, 2px stroke, currentColor — 05/06); no per-icon requests; RTL flips are transform-level, not duplicate assets.
- **Gate labels, checklist guidance, reason codes, mismatch-flag labels, provenance sentences, template bodies are DATA** (bilingual versioned rows — 07a/07c), not rendered artifacts: no per-locale image variants, no layout cost per language; Arabic-length inflation (~125%) is budgeted in every fixed-width surface (ribbons, chips, queue columns — 09 worst-case strings).
- **The capture viewport's frame guide is SVG** overlay geometry sized to the document-type spec (one vector per orientation), never a raster per type.
- **Countdown/tick paths contain zero width/layout animation** (text nodes swap at fixed widths).

## Data-path rules

- Cursor pages ≤ 50 items (07b limit); the queue fetch embeds deadline basis, aging, rework rounds, warning count, and assessment presence per row (denormalized ReviewTask — one round trip, not N); the dossier detail fetch carries captures + quality + assessment + flags in ONE payload (getReviewTask's compound EvidenceDossierDTO — no waterfall).
- subscribeApplicationEvents coalesces to ≤ 1 batch per frame; a 60-application submission storm renders as one queue patch; SLA breach warnings are single-row patches + instant-tier notifications.
- Assessment jobs poll only while the dossier is open (async-contract visibility rule); exports poll in the jobs center only.
- The capture engine, SLA engine, session engine, and mismatch rules are pure shared functions between seed-build and runtime (07c §5) — no recompute drift, no double-derivation cost.
- Offline queue stores action payloads (bounded per §Offline), never queue snapshots; the applicant draft store is keyed by application id + step id (per-field granularity for conflict surfacing).

## Measurement protocol (spec-level acceptance)

1. **Cold loads** on reference devices (mid-range phone throttled 4G; business laptop): TTI/LCP/INP/CLS for applicant shell, capture chunk, status page, console shell, admin bundle — both directions (ar/en) and both motion modes.
2. **The full-day walkthrough scripted end-to-end** (CP-6.10, 00 success signal 1): Amal's journey from 21:40 start through cross-device resume to 09:19 submission — wall-clock ACTIVE-WORK ≤ 12 min (idle/timeout time excluded by ledger timestamps), zero CLS events across the 6 applicant screens, resume p95 ≤ 1.5s on the second device; replayed twice byte-identical (07c §5).
3. **Reviewer throughput benchmark**: the 12-task queue cleared keyboard-only ≤ 5 min with decision round-trips logged; j/k hold at 60fps; dossier open ≤ 200ms first paint; virtualized 2,000-row scroll at 60fps with focus preservation; event-storm patch (60 events in 1s) = one batched render.
4. **Capture benchmark**: evaluation loop cadence adherence (2Hz, ≤120ms p95 return) across the glare-loop fixture (ap-tariq's 3-fail chain — 07c §1); submission ≤ 1.5s p95 on throttled 4G; offline-resume upload completes from a 50% interruption.
5. **Session engine benchmark**: warning fires exactly at expiresAt − 2m under clockAdvanceMinutes; extend round trip ≤ 400ms p95; absolute-cap VALIDATION returns with the save-and-exit guidance.
6. **Reduced-motion + RTL variants of every benchmark** (same budgets — motion and direction never buy or cost performance; 09 §8).
7. **Determinism audit**: two consecutive 07c replays produce byte-identical state, gate labels, deadline arithmetic, event order, and artifact descriptors — the trust contract is also a performance guarantee (no recompute drift, no clock-dependent flakiness).
