# 07c — Mock Adapter: policy-acknowledgment-portal

In-memory, deterministic, zero external dependencies, implements `PolicyAcknowledgmentAdapterV1` (07b). Dispatch and export are **simulated async stages** per async-contract.md: Jobs walking queued → running (determinate unit progress) → succeeded against fixed tables — no network, no timers beyond the declared cadences. The AI declaration is **non-AI**: no assist mode exists to toggle; the only configuration axis is channel/credential state (per 08's degradation map).

## Seeded world (fixed, named)

### Workspace — "Bareeq Trading Group" / "مجموعة بريق للتجارة"
Multi-site Gulf trading group: Riyadh HQ (8), Dubai (9), Doha (11). `defaultLocale: 'en'` (LOOP-6 proposed); `governingLocaleHint: 'ar'` (KSA posture — 01 evidence [33]). Fixed seeded clock: **frozen at 2026-10-21T09:00:00+03:00**; advances only via declared cadences (job pacing, reminder ticks in replay); `reset()` restores the frozen instant.

### People (28, bilingual, realistic)
EMP-1001…EMP-1028 across three sites. Representative fixtures: **EMP-1004 Tariq Al-Fahim / طارق الفهيم** (Dubai, HR lead, readingLocale en, Head Office + a Retail overlap membership — the dedup fixture) · **EMP-1016 Mariam Al-Marri / مريم المري** (Doha retail supervisor, readingLocale ar, Retail Operations — 02's Mariam) · **EMP-1021 Khaled Mansour / خالد منصور** (Doha warehouse, readingLocale ar, Warehouse) · **EMP-1001 Layla Haddad / ليلى حداد** (Riyadh, compliance admin — the owner persona as seeded member) · **EMP-1013 Saad Al-Otaibi / سعد العتيبي** (Riyadh, **inactive** since 2026-08-30, with a live historical acknowledgment — the never-delete audit fixture) · **EMP-1027 / EMP-1028** contractors (kind `contractor`, Warehouse + Retail). Arabic names render bidi-isolated in EN chrome and vice versa; four people carry AR-only names (nameEn transliteration absent — honest unpaired-name rendering fixture).

### Segments (4)
**Head Office** / المكتب الرئيسي (8) · **Retail Operations** / عمليات التجزئة (12) · **Warehouse & Logistics** / المستودعات والخدمات اللوجستية (7) · **Contractors** / المتعاقدون (2). EMP-1004 belongs to Head Office AND Retail Operations (the launch-dedup fixture).

### Policies (6) and versions

| Policy | Governing | Versions (chain) | Fixture purpose |
|---|---|---|---|
| P-001 Code of Conduct / مدونة السلوك | en | v2.1 (superseded) → **v3.0 (published, both locales)** | the worked supersedes chain + mixed-coverage campaign |
| P-002 Information Security Policy / سياسة أمن المعلومات | **ar** | v2.2 (superseded, 22 lifetime acks) → **v2.3 (published, both locales)** | KSA governing-locale posture + running campaign + historical period evidence |
| P-003 Acceptable Use Policy / سياسة الاستخدام المقبول | ar | **v1.1 (published, AR body ONLY — unpaired EN warning)** | honest unpaired-version fixture (warns at publish, at campaign, in register) |
| P-004 Health & Safety / الصحة والسلامة المهنية | ar | **v2.0 (published, both locales)** | the completed-coverage campaign (C-003, 100%) |
| P-005 Anti-Bribery & Corruption / مكافحة الرشوة والفساد | en | v0.2 (draft, EN body) + **v1.0 (published, EN body ONLY — unpaired AR warning)** | draft fixture + unpaired-publish fixture (governing en, so publish succeeds with warning) |
| P-006 Data Privacy Notice / إشعار خصوصية البيانات | en | **v1.0 (published, both locales)** | historical/inactive-person evidence (EMP-1013's acknowledgment) |

Bodies are realistic policy text fragments (a few paragraphs per locale, seeded verbatim in the fixture tables) with embedded Latin runs inside the AR body of P-002 (mixed-script isolation fixture) and tashkeel on one P-004 heading (line-height fixture). Version labels follow the document-control grammar; v3.0's change summaries are authored bilingual pairs ("Added remote-work section" / "أُضيف قسم العمل عن بُعد").

### Campaigns (4)

- **C-001** — P-001 v3.0 → all four segments (28 assignments at launch, including the now-inactive EMP-1013 — snapshot proof: membership drift never rewrites scope). Launched T-45d, dueWindow 30d → **due T-15d**. Coverage at the frozen clock: **19 acknowledged · 1 declined · 8 overdue** (all non-terminal past due; includes EMP-1013's inactive-marked overdue row). requireLocale `governing` (en). Attestation text AT-001.
- **C-002** — P-002 v2.3 → Retail + Warehouse (19). Launched T-6d, dueWindow 14d → due T+8d. Coverage: **7 acknowledged · 12 pending · 0 overdue** (the pre-due-window state — proves overdue is derived, not stored). requireLocale `governing` (ar). Attestation text AT-002 (AR-authored pair).
- **C-003** — P-004 v2.0 → Head Office (8). Launched T-90d, dueWindow 21d, **completed: 8 acknowledged · 0 anything else** (the full-coverage fixture for export).
- **C-004** — P-003 v1.1 → Retail (12). Launched T-10d, **CANCELLED at T-3d** with reason "أُلغيت لإعادة الإصدار بعد تصحيح النسخة" — 5 acknowledged before cancellation are preserved (the cancel-keeps-attestations fixture).

### Acknowledgment / decline fixtures (representative, all pinned)
- **Mariam EMP-1016 on C-001**: read evidence AR opened T-45d+2h, EN opened +4min; `localesAttested: ['ar','en']`; typed name matched مريم المري; digest per rule D3 below.
- **Tariq EMP-1004 on C-002**: AR opened (governing, required) + EN opened; attested `['ar','en']` — the English-first reader satisfying an AR-governing gate.
- **Khaled EMP-1021 decline on C-001**: reason "أحتاج نسخة أوضح بالعربية" — the surfaced decline fact (plum rendering, 11 copy).
- **EMP-1013 (inactive) acknowledgment of P-006 v1.0** (C-000, historical campaign predating the seed window) — person-history export shows the inactive member's evidence intact.
- **22 warehouse/retail acknowledgments of P-002 v2.2** (C-000, historical) — superseded-period evidence: `getPolicyVersion(v2.2)` reports `acknowledgmentCount: 22` and the evidence pack for v2.2 labels it period evidence.

### Ledger (seeded)
Entries matching every fixture event: 6 policy-created + 8 version-published (one per published version — the P-005 v0.2 draft records nothing until publish: no draft kind exists in 07a's LedgerActionKind) + 4 campaign-launched + 1 campaign-cancelled + 28 person-created + 4 segment-created + 1 person-updated (EMP-1013's deactivation), dispatch entries with per-recipient accounting, view events for every seeded read (per-locale, per G7 — Mariam and Tariq carry two each), 62 acknowledgment-recorded (19 C-001 + 7 C-002 + 8 C-003 + 5 C-004 + 23 historical C-000: EMP-1013's P-006 v1.0 record + the 22 P-002 v2.2 period acknowledgments) + 1 decline-recorded (Khaled), reminder events per G10, 2 export-runs (one artifact EXPIRED — the NOT_FOUND + regenerate fixture). No withdrawal, extension, or consent events exist in the seed (each is exercised only through declared actions in replay). Representative rows verbatim in the fixture table; counts declared (ledger rows ≈ 190).

### Attestation texts
**AT-001** EN: "I acknowledge that I have received, read, and understood this policy and agree to comply with it." AR: "أُقرّ بأنني استلمت هذه السياسة وقرأتها وفهمتها وأوافق على الالتزام بها." · **AT-002** (AR-governing variant) AR: "أُقرّ بأنني اطلعت على سياسة أمن المعلومات في إصدارها المحدد أدناه وفهمتها، وألتزم بما ورد فيها." EN mirror authored. Unpaired-text attempts at launch on an AR-governing campaign → VALIDATION gate fixture (rule G2).

## Deterministic computation rules (EXACT — the product's heuristics)

- **G1 — Version-label grammar**: valid label matches `v(\d+).(\d+)`; `status:'draft'` iff major = 0; publishing requires major ≥ 1, the governing locale's body present, `effectiveDate` ≥ publish day, and `supersedesVersionId` = the current published version at publish time (auto-proposed by the UI; the adapter validates, never guesses). Superseding flips the prior version to `superseded` atomically with the publish.
- **G2 — Campaign gates**: launch requires AR-or-EN governing-locale attestation text matching the policy's `governingLocale` (VALIDATION naming the gate otherwise), `dueWindowDays ≥ 1`, non-empty segments, and no active campaign with overlapping person scope on the same version (VALIDATION naming both campaigns). `dueDate = launchedAt + dueWindowDays` calendar days.
- **G3 — Digests (declared function, no crypto claim)**: `digest(s)` = the 32-bit FNV-1a of the UTF-8 bytes of `s`, rendered as 16 lowercase hex chars. `contentDigest = digest(locale + ':' + bodyText)`; `attestationDigest = digest(personId + ':' + policyVersionId + ':' + attestationTextId + ':' + submittedAtIso8601)`. Same inputs → same digest on every run; digests are never re-computed after recording.
- **G4 — Derived zones**: `coverageState = 'overdue'` iff campaign running AND now > dueDate AND assignment state = 'assigned'. Computed at read; nothing stores overdue; no escalation ever fires (LOOP-10).
- **G5 — Coverage arithmetic**: counts per campaign = terminal-state tallies; coverage percent = floor(acknowledged / assigned × 100) — floor, never round-up (19/28 → 67%, honest). Zone rosters order by (overdue-first, then nameEn) — deterministic ordering.
- **G6 — Typed-name match**: `typedName` matches the person's `nameEn` (case-insensitive, trimmed, inner whitespace collapsed) or `nameAr` (exact, trimmed) — either accepted; mismatch → VALIDATION with the honest copy (11 C), the typed text is retained for retry (P11 — never retype).
- **G7 — Locale gates on submit**: `localesAttested ⊆ localesOpened`; if `requireLocale = 'governing'`, the governing locale ∈ `localesOpened`; if `'both'`, both locales ∈ `localesOpened`. `recordView` appends per-locale opened events (deduplicated per locale per assignment; re-opens refresh nothing — first-open timestamps persist).
- **G8 — Launch dedup**: a person in N overlapping segments gets exactly one assignment; the launch result names the deduplicated count.
- **G9 — Extension arithmetic**: `updateCampaign(dueWindowDays)` computes newDue = extension-moment + newWindowDays, appends `campaign-extended` with detail `"dueDate: {old} → {new}"` (bilingual arrow rendering at display; stored canonical), never mutates prior ledger entries.
- **G10 — Reminder cadence**: scheduled reminders fire on `reminderCadenceDays` (measured from launch) for non-terminal assignments at declared clock ticks during replay; each batch appends one `reminder-sent` ledger entry with recipient count; manual sends append per batch. No reminder ever fires for terminal assignments.

## Behavior (per operation class)

- `publishPolicyVersion`: paced 60ms/body; atomic (a failed publish leaves the prior published version untouched — regression assertion); idempotent replay returns the original version; label collision on the same policy → VALIDATION naming both labels.
- `importPeople`: paced 60ms/row-chunk; bad row (missing employeeNumber or nameEn) → VALIDATION naming the first bad row + prior-good rows kept; duplicate employeeNumber → counted in `duplicates` with both rows named for human dedup (never silently merged); existing employeeNumber with changed fields → counted in `updated` (the joiner/leaver reality).
- `createCampaign`: snapshot + dedup per G8; dispatch Job created per G2 pass; `chaseListAvailable: true` always (the LOOP-5 floor); channel unconsented → campaign still launches, dispatch job records `dispatch-failed` with per-recipient accounting, and the result carries the chase-list alternative (credential-contract §3/§6 posture).
- `recordView`: appends locale-open events per G7; assignment not in `assigned` state → VALIDATION (terminal assignments cannot accumulate views).
- `submitAcknowledgment`: atomic per 07b rule 1; gates G6 + G7; success returns digest + ledger entry id; double-submit with a new idempotency key after success → CONFLICT with the existing acknowledgment payload (the honest re-ask); same key replay → the original result, nothing appended.
- `submitDecline`: atomic; reason optional; decline never notifies managers (G4's LOOP-10 posture; regression assertion: zero escalation ledger kinds exist).
- `listAcknowledgments`: cursor-paginated; `coverageState` derived per G4 at read; person drill returns the full history incl. superseded versions and the inactive-person marker.
- `listLedger`: filterable per 07b; append-only — no update/delete methods exist on the mock (regression assertion).
- `exportEvidencePack`: per-section partial (sections: version-record, coverage-census, per-person-attestations, attestation-text-appendix); `failExportSectionOnce` config → one section fails, others deliver, per-section retry available (async-contract §4); artifact expiry 7 days; the expired seeded artifact → NOT_FOUND + regenerable path; every export appends `export-run`.
- `getUsage`: window "monthly"; dispatchBatches 6, dispatchRecipients 138, exports 2 of 20 (rendered with the P14 meter on export surfaces only — the ledger/coverage surfaces render no meter by design, 06).
- Error injection per method via MockConfig `{ latencyMs, errorRate, errorCode, failDispatchRecipientOnce, failExportSectionOnce, channelConsentGranted, quotaExhausted }`; fixed correlationIds `pap-corr-0001`…; all 7 error classes injectable and typed per the 07b union (regression assertion). Named error-class fixtures: **VALIDATION** — the G1/G2/G6/G7 gates (label grammar, governing-locale body, attestation-text gate, typed-name mismatch, locale gate) with field-level details; **NOT_FOUND** — the expired seeded export artifact (regeneration returns identical digests); **PERMISSION** — viewer-role mutation attempts and EMP-1013's inactive-person session link (admin-contact copy, 11 C); **CONFLICT** — the new-key double submit after a recorded acknowledgment (returns the existing payload, appends nothing); **RATE_LIMIT** — quotaExhausted on the dispatch and export windows (campaign still launches; chase list surfaced; ledger reads unaffected); **NETWORK** — mid-submit disconnect with queued-retry semantics (the ledger reconciles on return) and stale-list re-fetch with cursor continuity; **UNKNOWN** — `pap-corr-0001` injection with typed retry.

## Test-support

`reset()` / `snapshot()` / `replay()`: full state restore, no randomness, no network, no timers beyond the declared cadences; the frozen clock restores to 2026-10-21T09:00:00+03:00. Regression assertions: coverage arithmetic is byte-identical across two replays of the same action script (determinism is the product's name); C-002 shows 0 overdue at the frozen clock and the same script run after a declared clock advance of +9d flips the 12 pending to overdue (G4 proven time-dependent but deterministic); the dedup fixture produces 28 assignments for C-001 (not 29); cancel preserves C-004's 5 acknowledgments; the inactive person's evidence survives and exports; unpaired warnings render for P-003/P-005 without blocking anything; zero escalation ledger kinds exist anywhere in the seed.
