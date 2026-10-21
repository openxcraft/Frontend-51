# 07c — Mock Adapter: kyc-onboarding-flow

SME-G pass · The mock is SPEC, not implementation: it defines the data and behavior a development environment must reproduce. Fully in-memory, deterministic, zero external dependencies, no network, no timers beyond declared cadences. It implements `KycOnboardingAdapterV1` exactly. A CI run twice produces identical transcripts. **Declared conditionally-AI posture honored by construction**: the mock's capture engine is the deterministic rule-gate evaluator ONLY (`engine: 'rule-gates'` on every report — the assist enrichment is an unbound abstract capability; there is no model to stub, and the provenance field is always truthful); the abstract verification assessment resolves `state: 'unavailable'` unless a configuration flag simulates a bound capability (§3) — the manual-review-on-evidence posture IS the shipped mock posture (08 N1/N2 degradation maps).

## 1. Deterministic seed dataset (fixed, named; never random)

**Workspace**: `ws-sadeem` — "محفظة سديم — الرياض" / "Sadeem Wallet — Riyadh" (bilingual-ar, Riyadh digital wallet).

**FlowProgram**: `prog-onboard` v2 (published; v1 retained as history) · programCode `sadeem-onboard`. Steps (5, ordered): `st-identity-a` (identity-fields: name group), `st-identity-b` (identity-fields: national identifier + contact), `st-doc` (document-capture: residence-permit OR national-id by applicant), `st-presence` (presence-capture, required=false, alternative path labels present), `st-submit` (review-submit). DocumentTypeCatalog: `national-id` (بطاقة الهوية الوطنية / National ID, sides [front, back], expiresCheck true), `residence-permit` (الإقامة / Residence Permit, [front, back], true), `passport` (جواز السفر / Passport, [front], true). GateThresholds v2: `framingMin 0.55 · framingMax 0.92 · glareMaxCoverage 0.04 · blurMinSharpness 0.62 · alignmentMaxDegrees 10` (SPEC-PROPOSED defaults — no retrieved source publishes threshold values, research digest §honest gaps; labeled in-program as "قيم افتراضية مقترحة" / spec-proposed defaults, 12 Q-6). SessionPolicy v2: idle 20m · absolute 60m · resumeWindow 30d · nudgeThreshold 48h · nudgeCap 3/day · maxReworkRounds 3. slaHours: `standard 24 · priority 8 · urgent 2`. ReasonCodeCatalog v2 (bilingual; scoped): approve: `complete-clear` (اكتمال واضح / clearly complete) · reject: `document-invalid` (مستند غير صالح / invalid document), `identity-mismatch` (تعارض الهوية / identity mismatch), `suspected-fraud` (اشتباه تزوير / suspected fraud) · request-rework: `capture-quality` (جودة الالتقاط / capture quality), `field-mismatch` (تعارض في الحقول / field mismatch), `missing-side` (وجه مفقود / missing side) · escalate: `senior-judgment` (حكم أعلى / senior judgment) · reverse: `decision-reversed-on-review` (قرار معاد النظر فيه / decision reversed on review). retentionDays 90. AttestationText (bilingual, verbatim in 11 §D5).

**Users (4, named)**:

| id | name | role | locale | purpose in fixtures |
|---|---|---|---|---|
| `u-maryam` | مريم الدوسري / Maryam D. | reviewer | ar | CP-5 queue persona; decision fixtures |
| `u-khalid` | خالد الشمري / Khalid A. | admin | en | CP-6 persona; program publishes; nudges |
| `u-salem` | سالم عتيبي / Salem O. | reviewer | ar | evening-shift escalation fixture |
| `u-nouf` | نوف الرشيدي / Nouf R. | reviewer | en | pool-vs-owned fixture |

**Applicants + Applications (12, fixed; the state spread the spec needs)**:

| id | name | locale | application | status | fixtures of note |
|---|---|---|---|---|---|
| `ap-amal` | أمل حسن / Amal H. | ar | `APP-1042` | in-progress (doc step) | THE canonical resume journey: started 2026-10-20T21:40, session ended idle 22:03, resumed 2026-10-21T09:10 (cross-device event recorded); front retake chain: attempt 1 glare-fail, attempt 2 PASS (submittedAsEvidence); back + presence pending |
| `ap-yousef` | يوسف عبد الله / Yousef A. | en | `APP-1039` | in-progress (identity step) | nudge-eligible idler: lastActivityAt = mock-now − 51h; nudgeCountToday 1 of cap 3; manual-copy link fixture |
| `ap-tariq` | طارق زهران / Tarif Z. | ar | `APP-1041` | in-progress (doc step) | glare retake loop: 3 failed attempts (glare 0.09 / 0.07 / 0.06 — environment-hint threshold fixture: after 3 fails the coach suggests the day-part hint, CP-3 edge) |
| `ap-sara` | سارة مبارك / Sara M. | ar | `APP-1036` | needs-attention (round 1) | name-mismatch rework: decision request-rework, reasonCodes [field-mismatch], reworkStepIds [st-identity-a]; parked task awaiting re-submission |
| `ap-hind` | هند مرعي / Hind M. | ar | `APP-1033` | needs-attention (round 2) | priority-SLA fixture (reworkRounds 2); ownership retained by u-maryam through round 2 |
| `ap-faisal` | فيصل العمري / Faisal A. | ar | `APP-1030` | approved | full clean chain: attestation with focusTraversalCompleted true, approve decision reasonCode [complete-clear] |
| `ap-maha` | مها فؤاد / Maha F. | ar | `APP-1028` | approved | reversal chain: reject [document-invalid] → reverse [decision-reversed-on-review] → approve — both decision rows intact with supersededByDecisionId (immutability chain fixture) |
| `ap-rakan` | راكان العمر / Rakan A. | ar | `APP-1027` | rejected | reject reasonCodes [suspected-fraud, identity-mismatch], note fixture "صورة الهوية تحمل علامات تعديل" (bidi-isolated, ≤280) |
| `ap-omar` | عمر بسام / Omar B. | en | `APP-1040` | submitted | queued task, standard SLA: submittedAt = mock-now − 3h → deadline = +21h remaining; captureWarningCount 1 (back-side blur 0.58 at submit re-evaluation) |
| `ap-joud` | جود خالد / Joud K. | ar | `APP-1043` | submitted | fresh submission: submittedAt = mock-now − 12m; deadline arithmetic fixture (24h − 12m) |
| `ap-bader` | بدر السالم / Bader S. | en | `APP-1031` | in-review | escalated task (urgent SLA: escalated by u-salem, deadline = mock-now + 41m); document-expiry mismatch flag fixture (residence-permit expiry = mock-now + 20d < 30d rule → advisory flag) |
| `ap-dana` | دانة الفهد / Dana F. | en | `APP-1019` | expired | resume window elapsed (lastActivityAt = mock-now − 34d > 30d); expired-notice sent; evidence retained per retentionDays 90 |

**Captures (exact metrics — the gate arithmetic fixtures)**:

| capture | application | side | metrics (coverage / glare / sharpness / rotation / edges) | verdict |
|---|---|---|---|---|
| `cap-amal-f1` (attempt 1) | APP-1042 | front | 0.71 / **0.12** / 0.78 / 3° / true | FAIL — glare 0.12 > 0.04 (the named-gate error fixture) |
| `cap-amal-f2` (attempt 2) | APP-1042 | front | 0.74 / 0.02 / 0.81 / 2° / true | PASS — submittedAsEvidence |
| `cap-tariq-f1..f3` | APP-1041 | front | 0.68/**0.09**/0.75/4°/true · 0.70/**0.07**/0.77/3°/true · 0.72/**0.06**/0.79/2°/true | FAIL ×3 — glare (loop fixture) |
| `cap-omar-f1` | APP-1040 | front | 0.76 / 0.03 / 0.83 / 2° / true | PASS |
| `cap-omar-b1` | APP-1040 | back | 0.69 / 0.02 / **0.58** / 5° / true | PASS-at-capture, FAIL-at-submit-re-evaluation — sharpness 0.58 < 0.62 (the captureWarningCount fixture: submitted evidence carries a re-evaluated failing gate, CP-5.1 row warning) |
| `cap-bader-f1/b1` | APP-1031 | front/back | 0.78 / 0.01 / 0.85 / 1° / true · 0.73 / 0.02 / 0.80 / 4° / true | PASS both |
| `cap-faisal-f1/b1` | APP-1030 | front/back | 0.80 / 0.01 / 0.86 / 1° / true · 0.75 / 0.02 / 0.82 / 3° / true | PASS (clean chain) |

Every seeded capture's `quality.gates` array carries exactly five GateResult rows composed from the versioned bilingual labels (11 §D2), thresholds from FlowProgram v2, and `engine: 'rule-gates'` (the mock never fabricates an assist-enriched row — §5).

**ReviewTasks (5 live + 3 decided-history)**: `task-omar` (queued, standard, deadline mock-now+21h, captureWarningCount 1, assessmentAvailable false — unbound capability posture), `task-joud` (queued, standard, +23h48m), `task-bader` (in-review, urgent, +41m, escalated, assignee null — senior pool), `task-sara` (parked rework round 1, assignee u-maryam), `task-hind` (parked rework round 2, priority, assignee u-maryam), decided: `task-faisal` / `task-maha` / `task-rakan` (status decided, full decision chains).

**Decisions (7 rows)**: as per the applications table (faisal approve; maha reject → reverse → approve with superseded chain; rakan reject 2 reason codes + note; sara rework round 1 targeting st-identity-a; hind rework round 2 targeting st-doc + st-presence).

**MessageTemplates (6, versioned, bilingual, verbatim bodies in 11 §D6)**: `tpl-submitted`, `tpl-rework`, `tpl-approved`, `tpl-rejected`, `tpl-nudge`, `tpl-expired`.

**NotificationEvents (10)**: one per class across the three P21 tiers, mixed seen/unseen — `sla-breach-warning` on task-bader (urgent, 41m), `rework-returned` instant for u-maryam, `submissions-digest`, `nudge-delivered` (ap-yousef), `program-published` (v2), `artifact-expiring` (a ledger export), etc.

**ActivityEntries (47)**: the full chain for every seeded mutation (started → session.ended → resumed → step.submitted ×2 → capture.submitted ×2 → rework decisions → escalations → submissions → decisions → reversals → nudge → program publish), actor ids or null (engine) with program versions in detail, monotonically increasing fixed timestamps.

**Jobs (3)**: `job-led-1` succeeded ledger-export (artifact `art-led-1`, 47 entries, expiry 7 days from mock-now); `job-assess-1` assessment-run resolved `failed` (capability-unbound simulation → honest `unavailable` posture recorded); `job-led-2` queued (cancel fixture).

**Mock clock (fixed, seeded)**: the mock's "now" is frozen at `2026-10-21T09:00:00+03:00` — every countdown (idle timeout, SLA deadline, resume window, nudge eligibility, artifact expiry) computes against this instant, never wall-clock. The clock advances ONLY through the declared cadences in §3 (`clockAdvanceMinutes` config; event replay 40ms cadence) and `reset()` restores it. Two runs at any real-world time produce identical state, gates, deadlines, and copy.

## 2. Behavior specification

### 2.1 The capture-quality engine (EXACT deterministic rules — the core heuristic)

`evaluateCaptureFrame` and `submitCapture` (and the seed-build pre-pass) evaluate, with `T = FlowProgram v2 gateThresholds`:

1. **framing**: `x = metrics.documentCoverage`. PASS iff `0.55 ≤ x ≤ 0.92`. `x < 0.55` → fail label "الإطار — المستند صغير جداً في الإطار" / "framing — document too small in frame"; `x > 0.92` → fail label "الإطار — المستند قريب جداً" / "framing — document too close".
2. **glare**: `g = metrics.glareCoverage`. PASS iff `g ≤ 0.04`. Fail label composes the measured percentage: "وهج يغطي {pct}% من المستند (الحد 4%)" / "glare covers {pct}% of the document (limit 4%)" — percentages render Western, rounded to integer for display only (computation uses full precision).
3. **blur**: `s = metrics.sharpness`. PASS iff `s ≥ 0.62`. Fail: "ضبابية — الحدة {s} أقل من الحد 0.62" / "blur — sharpness {s} below the 0.62 floor" (sharpness rendered at 2 decimals).
4. **alignment**: `θ = |metrics.rotationDegrees|`. PASS iff `θ ≤ 10`. Fail: "ميل — المستند مائل {θ}° (الحد 10°)" / "tilt — document rotated {θ}° (limit 10°)".
5. **edges**: `e = metrics.edgesComplete`. PASS iff true. Fail: "أركان ناقصة — الأركان الأربعة يجب أن تكون داخل الإطار" / "incomplete edges — all four corners must be inside the frame".

`overallPassed = framing ∧ glare ∧ blur ∧ alignment ∧ edges`. Gate order is fixed [framing, glare, blur, alignment, edges] in every report. `submitCapture` with overallPassed false stores the record in the retake chain (attempt n+1 available) and returns the failing gates' values+thresholds — the named-gate error IS the report (CP-3.5). Camera-source and upload-source captures run the IDENTICAL evaluation (`source` is metadata, never a different gate path — CP-3.5's first-class alternative). `evaluateCaptureFrame` returns the same gate states as advisory `CaptureGuidance` plus the static bilingual checklist (one guidance string per gate from the versioned template table, 11 §D2) — `engine: 'rule-gates'` always in the default mock; `readyToCapture = overallPassed`. The evaluation loop NEVER blocks: `submitCapture` is callable with any metrics at any time.

### 2.2 The SLA engine (EXACT rules)

`slaClass(task)`: if the task was escalated → `urgent`. Else if `application.reworkRounds ≥ 2` OR `task.captureWarningCount ≥ 3` → `priority`. Else `standard`. `deadlineAt = lastSubmittedAt + slaHours[slaClass]` where lastSubmittedAt is the ORIGINAL submission for round 0 and the RE-submission timestamp for every rework round (deadline recomputes on re-submission, CP-5.5). Queue default sort: `deadlineAt asc, submittedAt asc`. Verification with seeds: task-omar standard → 09:00−3h submitted → deadline +21h ✓; task-bader escalated urgent → +2h from escalation at 08:19 → 09:00+41m remaining ✓; task-hind priority (round 2) → 8h window on re-submission ✓.

### 2.3 The session & resume engine (EXACT rules)

- **Idle timeout**: session expires at `lastActivityAt + 20m`; `session.warning` fires at `expiresAt − 2m` (engine event, always). `extendSession` sets idle baseline to now, bounded by the absolute cap: `absoluteCapAt = sessionStart + 60m`; extension requests past the cap return VALIDATION naming the absolute cap with the save-and-exit guidance in details (data never lost — the application is durable, 07a).
- **Resume window**: `resumeTokenExpiresAt = lastActivityAt + 30d`. `resumeApplication` with an elapsed window returns NOT_FOUND with `resumeWindowDays` and `retentionDays` in details (the expired-door state, CP-1 edge). A token used from a second device while a session is live returns CONFLICT with both session facts (choose-continue, never silent takeover).
- **Nudges**: eligible iff status ∈ {in-progress, needs-attention} AND `now − lastActivityAt ≥ 48h` AND `nudgeCountToday < 3`. `sendResumeLink` increments the count, regenerates the resume token, records the ActivityEntry, and (channel-abstract) returns `deliveredVia: 'channel'` when the abstract channel is configured 'bound' in MockConfig, else `'manual-copy'` with the link + QR payload for the console (LOOP-5 first-class).
- **Expiry sweep**: applications in-progress/needs-attention with `lastActivityAt + 30d < now` resolve `expired` (only via declared clock advance — never wall-clock), emit the expired-notice template, retain captured evidence until retentionDays (07a).

### 2.4 The mismatch-flag rules (EXACT deterministic cross-checks — dossier layer four)

`mismatchFlags(application)`, computed at dossier assembly and at submit:

- **MR-EXP** (expiry): for each submitted capture whose DocumentTypeSpec.expiresCheck is true and whose document expiry date (declared field on the document step) is within 30 days of now → advisory flag "تاريخ انتهاء المستند قارب على الاستحقاق ({date})" / "document expiry date is near ({date})". Seed: ap-bader +20d → flag present.
- **MR-NAME**: normalized `identity.nameFamily + identity.nameGiven` ≠ normalized document-name field → advisory. Normalization = the rtl-rules §4 Arabic variant fold + Latin case/space fold (deterministic; disclosed in the flag detail as the normalization applied — ai-native-patterns §7.4 transparency instinct). Seed: ap-sara's rework origin.
- **MR-DOB**: identity date-of-birth vs document date-of-birth divergence → advisory.
- **MR-QUAL**: `captureWarningCount ≥ 1` → blocking-class flag listing the failing gates ("تحذير جودة الالتقاط — بوابة الضبابية عند التقديم" / "capture quality warning — blur gate at submission"). Seed: ap-omar.

Flags are computed by pure functions over declared inputs; two assemblies over identical state produce identical flags (§5).

### 2.5 Submission, rework, decisions

- **submitApplication**: validates every required step's StepState is `submitted`, attestationConfirmed true (else VALIDATION naming the field), re-evaluates submitted captures' gates (§2.1 over stored metrics — the cap-omar-b1 sharpness flip), computes captureWarningCount, creates the ReviewTask (slaClass §2.2, deadline arithmetic), freezes the draft (status submitted), emits `application.submitted`, sends tpl-submitted, appends ActivityEntry. Duplicate idempotency keys return the ORIGINAL result — never a second task.
- **decideReviewTask**: approve/reject close the task + application (terminal), emit the decision notice (tpl-approved/tpl-rejected), append the decision chain; request-rework validates reworkStepIds ⊆ application steps, reworkRounds < maxReworkRounds (else VALIDATION with the policy value — rule 7 demo), sets application needs-attention, parks the task (status queued awaiting re-submission, deadline recomputes on re-submission per §2.2), sends tpl-rework naming the steps; escalate sets slaClass urgent and routes to the senior pool with the stated reason; reverse supersedes forward (new row, supersededByDecisionId set, task re-opens queued) — both rows persist forever (maha fixture).
- **requestVerificationAssessment**: default posture `unavailable` (capability unbound — resolves the job succeeded with `state: 'unavailable'` and the honest manual-review provenance line); with MockConfig.simulateBoundAssessment the mock returns a FIXED typed field-result set per seeded application (deterministic — the same application always yields the same assessment), including one divergent field on ap-sara (the disagree-with-the-machine fixture, CP-5.6) and document findings mirroring §2.4 flags with severity advisory. The assessment NEVER auto-resolves a task (contract rule 4).

### 2.6 Permissions, errors, idempotency

Role gates: reviewer — queue/dossier/decisions/assignment/applicants-read/ledger-read/inbox; admin — everything (program, templates, team, capability posture, retention, exports, nudges). Violations → PERMISSION with the named capability. Applicant-surface operations (`startApplication`, `resumeApplication`, `extendSession`, `saveStepDraft`, `submitStep`, `evaluateCaptureFrame`, `submitCapture`, `submitApplication`, `cancelApplication` by applicant) are token-scoped, never session-scoped — a console session cannot invoke them and vice versa. Every method can return each applicable error class via failure injection; correlationIds fixed (`corr-0001`…). Idempotency: duplicate keys on the 14 keyed operations return the original result — never a second mutation.

## 3. Failure injection (per method, configurable)

`MockConfig = { latencyMs?: number; errorRate?: number; errorCode?: ErrorCode; simulateBoundAssessment?: boolean; simulateAssistEnrichment?: boolean; clockAdvanceMinutes?: number; offlineQueueBehavior?: 'discard-resolved' | 'flush-all' }` — applied per method name via a config map. `simulateBoundAssessment` toggles the N1 posture (§2.5); `simulateAssistEnrichment` flips capture reports to `engine: 'assist-enriched'` with FIXED hint strings per gate state (deterministic — proving the provenance field's truthfulness both ways, contract rule 3); `clockAdvanceMinutes` advances the seeded clock deterministically to exercise idle timeout, resume expiry, and SLA breach without wall-clock dependence. Defaults: zero latency, zero errors, both capabilities unbound, no clock advance. One config object at construction (no environment variables, no network).

## 4. Test-support operations (mock-only, outside v1 contract)

`reset()` — restores seeds and clock · `snapshot()` — deep clone for assertion · `replay(events)` — applies a recorded event list to reach a state deterministically · `seedSummary()` — emits the fixture tables above as data (tests assert against the same named world the spec documents). The live subscription replays a fixed 7-event script at 40ms cadence on subscribe (application.started → step.submitted → capture.submitted → application.submitted → session.warning → session.extended → rework.requested), then emits on real mutations; unsubscribe is exact (no leaks). Never called by product UI.

## 5. No-go guarantees

No timers beyond declared cadences; no randomness anywhere (variation = seeded fixture selection by input hash); no network; no provider imports; no persistence across resets; the capture engine, SLA engine, mismatch rules, and session engine are pure and shared between seed-build and runtime — the mock cannot ship a gate verdict, deadline, or flag its own engines cannot reproduce. Two identical runs produce identical transcripts, including gate labels, deadline arithmetic, event order, and artifact descriptors. **No AI anywhere in the default mock**: the declared conditionally-AI posture (00, 07a determinism statement) is honored by construction — every capture report reads `engine: 'rule-gates'`, there is no model call to stub, and both enrichment capabilities are simply unbound (the degraded posture IS the shipped mock posture, 08 degradation maps). The 00 §success-signal 5 degradation test runs with both simulate flags false — and the full walkthrough (CP-6.10) completes identically.
