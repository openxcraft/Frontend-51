# 07c — Mock Adapter: patient-intake-forms

In-memory, deterministic, zero external dependencies. Implements `PatientIntakeAdapterV1` (07b) over the entities of 07a. No randomness, no network, no timers beyond the declared cadences; identical call sequences produce identical states (the determinism contract is the mock's own test oracle). The assist capability is simulated by a FIXED mapping table (declared below) — a deterministic stand-in for a nondeterministic service, honestly labeled everywhere it surfaces.

## Seed dataset (fixed, named)

**Workspace** — "Al-Rahma Family Clinic / عيادة الرحمة العائلية" (defaultLocale `ar`; policies: fillTokenExpiryHours 72, retentionDays 90; seeded clock base 2026-10-17T09:00+03:00, advancing only on declared actions — each mutation +1 simulated minute).

**Symptom vocabulary** (`voc-001`, 36 active + 2 deprecated entries). Representative verbatim fixtures (all strings real Arabic; variants carry dialect tags):

| id | canonical ar | canonical en | variants (locale · tag) | urgent | provenance |
|---|---|---|---|---|---|
| term-001 | صداع | headache | وجع راس (ar · gulf/levantine) · الم في الراس (ar) | no | seeded-spec |
| term-002 | الشقيقة | migraine | (none — the colloquial phrasing "وجع نص راس" is resolved ONLY by the assist table below; the honest dictionary gap made structural) | no | seeded-spec |
| term-003 | حمى | fever | سخونية (ar · gulf/levantine) · حرارة (ar) | no | seeded-spec |
| term-004 | سعال | cough | كحة (ar · levantine/egyptian) | no | seeded-spec |
| term-005 | دوخة | dizziness | دوامة (ar · gulf) · دوران (ar) | no | seeded-spec |
| term-006 | غثيان | nausea | غثيه (ar · egyptian) | no | seeded-spec |
| term-007 | تقيؤ | vomiting | استفراغ (ar · gulf/levantine) · ترجيع (ar · egyptian) | no | seeded-spec |
| term-008 | ألم في البطن | abdominal pain | وجع البطن (ar) · الم المعدة (ar) | no | seeded-spec |
| term-009 | ضيق التنفس | shortness of breath | ضيق نفس (ar) · لهاث (ar · gulf) | **YES** | seeded-spec |
| term-010 | ألم في الصدر | chest pain | الم الصدر (ar) · وجع الصدر (ar · levantine) | **YES** | seeded-spec |
| term-011 | نزيف | bleeding | ينزف دم (ar) | **YES** | seeded-spec |
| term-012 | فقدان الوعي | loss of consciousness | غيبوبة (ar) | **YES** | seeded-spec |
| term-013 | أفكار إيذاء النفس | thoughts of self-harm | يأذي نفسه (ar) | **YES** | seeded-spec |
| term-014 | حساسية | allergy | تحسس (ar) | no | seeded-spec |
| term-015 | التهاب الحلق | sore throat | الم الحلق (ar) · بحة (ar) | no | seeded-spec |
| term-016 | زكام | common cold | برد (ar · gulf) · كتمان (ar · gulf) | no | seeded-spec |
| term-017 | حرقة المعدة | heartburn | حموضة (ar) · حرقان (ar · gulf) | no | seeded-spec |
| term-018 | أرق | insomnia | سهر (ar) | no | seeded-spec |
| term-019 | تعب وإرهاق | fatigue | تعبان (ar · levantine) · خمول (ar) | no | seeded-spec |
| term-020 | آلام المفاصل | joint pain | وجع المفاصل (ar) | no | seeded-spec |
| … 16 further entries of the same shape (آلام الظهر/back pain · إسهال/diarrhea · إمساك/constipation · طنين الأذن/tinnitus · حكة/itching (variant: هرش · egyptian) · فقدان الشهية/loss of appetite · الم الأسنان/toothache · احمرار العين/eye redness · التبول المؤلم/painful urination · العطش الشديد/excessive thirst · رجفة/tremor · تورم/swelling · تغيب الرؤية/blurred vision · سلس البول/urinary incontinence · بقع جلدية/skin spots · ضعف السمع/hearing loss), plus 2 `deprecated` entries (an old "دوار" canonical merged into دوخة) proving deprecation keeps history and stops matching. Two entries are `clinic-authored` provenance (fixtures for the provenance chip — 05). |

**Intake forms** (4):
1. **`form-001` "New Patient Intake — Adult / استمارة قبول مريض جديد — بالغ"** (active, version 3; 4 sections, 18 fields): Patient details (display name · date of birth · sex · contact phone) · Medical history (conditions select-many · surgeries long-text · medications long-text · allergies long-text) · Current symptoms (**symptom field `fld-014`** bound to `voc-001`, allowMultiple, allowFreeText · pain scale · since-when date) · Consent (attestation consent field). Representative bilingual fixtures: label `{ar: "ما الأعراض التي تشعر بها حالياً؟", en: "What symptoms are you currently experiencing?"}`; help `{ar: "اكتبها كما تقولها عادةً — بالعربية أو بالإنجليزية.", en: "Write them the way you usually say them — in Arabic or English."}` (the raw-voice instruction — the product's linguistic honesty in one string).
2. **`form-002` "Follow-up Visit Update / تحديث زيارة متابعة"** (active, version 2; 8 fields; symptom field bound).
3. **`form-003` "Pre-procedure Checklist / قائمة ما قبل الإجراء"** (**draft, half-translated — the publish-gate fixture**: 3 named gaps — `fld-022` label missing `en`, `fld-025` option "صائم/fasting?" missing `ar`, consent helpText missing `en`; the gate report lists exactly these, in section order — 07c rule 6).
4. **`form-s01` "Sample — see the vocabulary work / عيّنة — شاهد عمل المسرد"** (flag `sample: true`, clearable; 12 fields, 1 symptom field): **the P22 value moment** — a planted colloquial phrase ("سخونيه من يومين") that resolves via the dictionary's normalized variant, one assist proposal ("وجع نص راس" → الشقيقة) landing pending-confirmation, and one red-flag entry (ضيق نفس) that raises an urgent flag the reviewer escalates.

**Fill sessions & submissions** (6):
- `fs-001` (channel link, open, expires base +72h) → **`sub-001` in-progress**: Amira's fixture — 6 of 18 fields answered; `currentFieldId: fld-014` (the symptom field); the resume/recall fixture (P11) — answers carry `savedAt` stamps that render as recalled marks.
- `fs-002` (submitted) → **`sub-002` submitted**: 18/18 answered, patientLocale `ar`, 3 symptom entries: `se-a` rawText "صداع" → term-001, mode `exact`; `se-b` rawText "سخونيه من يومين" → term-003, mode `normalized` (the typed ه vs dictionary ة — pipeline rule 1); `se-c` rawText "وجع نص راس" → dictionary finds nothing covering the phrase (وجع راس is broken by نص) → **assist proposal only when the capability is bound**: term-002 (الشقيقة), confidence 0.86, `confirmation.state: 'pending'` — THE P15 fixture; unbound, `se-c` stays `unmatched`, verbatim, flagged for staff.
- `fs-003` (submitted) → **`sub-003` flagged**: rawText "ضيق نفس شديد" → term-009 variant `ضيق نفس`, mode `exact` → **urgent flag count 1** (term-009 urgentAttention, version pinned); escalation fixture: escalatedBy Tariq-seed with note, state `flagged`.
- `fs-004` (submitted) → **`sub-004` reviewed + exported**: clean dictionary matches only (صداع exact · كحة → term-004 variant كحة, normalized after ة→ه of typed "كحه"); review gate passed; export job `job-002` → artifact `art-001` (all 3 formats; expiresAt = seed + 7 days; regenerable).
- (no fill session) → **`sub-005` staff-authored**: authoredBy `staff` (Nour-seed), attribution fixture for the honest paper path (08); 2 symptom entries mapped by staff.
- `fs-006` (**expired**) → **`sub-006` in-progress/abandoned**: token expired at base +72h with 4 answers retained; the retention + re-open fixture — answers visible per policy, never silently merged into a new session.

**Jobs history**: `job-001` vocabulary import succeeded (36 imported, 2 invalid rows named: row 9 missing canonical-en, row 21 malformed variants column) · `job-002` export succeeded (`art-001`) · `job-003` export **failed** (per-format partial fixture: PDF + CSV delivered, normalization annex failed — NETWORK, per-format retry affordance). **Activity entries**: ~40 seeded covering every action kind in 07a (incl. two match-confirmed, one match-corrected, one flag-escalated, one policy-change, one consent-change).

## Deterministic computation rules (the whole engine — specified exactly)

1. **Normalization pipeline** (applied to symptom text, vocabulary canonical/variant strings, and every search input; ruleset disclosed in-product per ai-native-patterns §7.4): strip tashkeel (U+064B–U+065F, U+0670) and tatweel (U+0640); unify alef variants (أ إ آ ٱ → ا); taa marbuta (ة → ه); alif maqsura (ى → ي); for Latin: case-fold, trim, collapse internal whitespace. Applied identically on both sides of every comparison.
2. **Dictionary matching** (word-boundary containment on normalized strings; boundaries = whitespace/punctuation per the pipeline): for every **active** term, candidates = [canonical-ar, canonical-en, every variant]; a candidate present in the normalized text → suggestion. Mode: raw-string (pre-pipeline) containment → `exact`; containment only after normalization → `normalized`. Conflict rule (total order, deterministic): longer candidate wins (specificity), tie → the term with fewer total candidates, tie → lower termId. `matchedText` = the raw substring, offsets computed against the fixed normalization map (no runtime search ambiguity). Identical (text, vocabulary versions) → identical suggestions, always.
3. **Assist layer** (fires ONLY when `assistCapabilityBound: true` in MockConfig — the 08 N1 simulation): a FIXED table; entries fire when the normalized FULL text matches a table key exactly. Seeded table (verbatim): `وجع نص راس` → term-002 (الشقيقة), confidence 0.86 · `دوامه قويه` → term-005 (دوخة), 0.82 · `معي سخونيه من امس` → term-003 (حمى), 0.90 · `شايل هموم وما ينام` → term-018 (أرق), 0.79 · `بطني تتقطع عليه` → term-008, 0.83. Rules: confidence < 0.75 → not proposed (display floor); every assist proposal carries `requiresStaffConfirmation: true`; a patient-side accept creates a SymptomEntry with `matchMode: 'assist'`, `confirmation.state: 'pending'`, rawText preserved — canonical state only via `resolveSymptomMatch` (P15). With the capability unbound/failed/rate-limited, suggestions contain the dictionary results only and `engine: 'dictionary'` (degradation identical to the unbound state).
4. **Urgent-flag derivation** (arithmetic, recomputed on every submission state change and match resolution): for every SymptomEntry with a matchedTermId whose PINNED term version carries `urgentAttention: true` and matchMode ∈ {exact, normalized, assist-with-confirmation ≠ pending} → one flag per distinct term, carrying the canonical pair (never raw text), the term version pin, and `escalated: false` until a staff escalation write. Count surfaced in queue rows and the banner. The system never grades, ranks, or scores urgency — it counts clinic-configured vocabulary (07b rule 2).
5. **Review gate**: `setSubmissionReviewState('reviewed')` requires zero SymptomEntries with `confirmation.state: 'pending'` → VALIDATION naming the pending entries; otherwise writes the ReviewRecord (actor, note, timestamp) and sets state. Un-review is an explicit logged transition back to `submitted` — never silent.
6. **Publish gate** (deterministic completeness walk, in section order → field order → kind order): every field label non-empty in BOTH locales; helpText, when present, in both; every option label in both; ≥1 consent field whose helpText (the attestation line) is non-empty in both; sections ≤ 10; fields ≤ 120. Violations → the gap list (fieldId + locale + kind), stable-ordered; `publishForm` VALIDATION carries it. Drafts may be half-translated (gate state renders live in every form read — 07b).
7. **Submit gate**: required fields all answered (VALIDATION listing missing field LABELS only — never values, 07b rule 6); consent field `attested: true` required; idempotency: a repeated `submitIntake` key returns the original submission; kiosk tokens invalidate at submit; `in-progress → submitted` only here or via staff authoring.
8. **Expiry arithmetic** (fixed seeded clock — advances only on declared actions; +1 simulated minute per mutation; jobs advance per pacing rule below): link/QR fill tokens expire at createdAt + fillTokenExpiryHours (72); kiosk tokens at createdAt + 6h (inactivity proxy, declared); terminal submissions expire at terminal-transition + retentionDays (90); artifacts at createdAt + 7 days. Expiry events append to the activity chain. Expired token → NOT_FOUND with re-open guidance (11 copy).
9. **Job pacing**: vocabulary import 40ms per 10 rows (determinate "row n of total"); export 60ms per format; import partial = valid rows + named invalid rows; export partial = per-format delivery with per-format retry (async-contract §4).
10. **Completion counters** (`getFormOverview`): completionRate = submitted ÷ (submitted + expired-open), rounded to 2 decimals; medianCompletionSeconds over submitted submissions' (submittedAt − createdAt), Western numerals. Counters are the analytics ceiling (12 Q-6).

## Behavior (per operation class)

- `createForm` — blank/duplicate/sample structures; the sample carries its planted fixtures; bilingual title required (VALIDATION otherwise). `duplicateForm` — new draft version 1, fields deep-copied with new ids.
- `saveForm` — stale baseVersion → CONFLICT both payloads; draft version bumps; the gate report recomputes on every save (rule 6).
- `publishForm` — gate-clean → active at new version; FormVersion snapshot pinned (existing submissions keep theirs).
- `archiveForm` — confirm.openSubmissionCount verified against live in-progress count; drift → CONFLICT with the recounted number; archived forms refuse `openFillSession` (VALIDATION).
- `openFillSession` — active forms only; prefill basics only (clinical fields structurally absent from the input — 07b); token = `fs-{seq}` opaque, no PHI inside.
- `resumeFillSession` — open token → form summary + draft (answers + currentFieldId + recalled marks); expired → NOT_FOUND (+ re-open path copy); tampered → PERMISSION.
- `saveDraftAnswers` — full-draft-state writes, idempotent; returns savedAt + expiresAt; offline queue replays in order (P20).
- `submitIntake` — rule 7; the confirmation payload carries sectionCounts only (PHI-free by type — 07b rule 6).
- `normalizeSymptomText` — rules 1–3; `engine` provenance honest; identical inputs → identical outputs (test oracle).
- `listSubmissions`/`getSubmission` — list rows carry counts/pairs only; `getSubmission` (staff role) is the single answer-bearing read (07b rule 9).
- `resolveSymptomMatch` — confirm (assist → canonical, actor recorded) or correct (remap; rawText immutable); already-resolved → CONFLICT; correct without termId → VALIDATION.
- `flagSubmission` — rule 4; escalation writes actor + note + timestamp (P17).
- `setSubmissionReviewState` — rule 5; concurrent baseRevision drift → CONFLICT both states.
- `exportIntakePackage` — per-format partial (rule 9); quota exhaustion injectable (RATE_LIMIT ladder copy — 11); idempotent re-submit returns the original job.
- `getArtifact` — expired → NOT_FOUND + regenerate (deterministic — regeneration is byte-identical from submission state).
- `saveSymptomTerm` — canonical pair both locales → VALIDATION otherwise; two active terms normalizing identically → VALIDATION naming both; urgentAttention toggles apply to the NEW version only (pins stand); stale baseVersion → CONFLICT.
- `deleteSymptomTerm` — confirm.openMatchCount verified; open matches stay pinned to the deleted version and close only on re-normalization.
- `importVocabulary` — row format `canonical-ar | canonical-en | variants (;-separated) | urgent (yes/no) | note`; named invalid rows (partial); identical-canonical rows import as deprecation-merge notices (07c seed's دوار precedent).
- `updateWorkspace` — policy edits log `policy-change` and apply to NEW sessions/submissions only (never retroactively — the honesty rule); stale baseUpdatedAt → CONFLICT.
- `getUsage` — fixed window with seeded export/import counts; `normalizationCalls: 'unmetered'` (the typed literal — normalization is never a quota surface).

## Failure injection

`MockConfig { latencyMs (default 90), errorRate (default 0), errorCode?, failImportAtRow?, failExportFormat?, assistCapabilityBound (default **false** — the audited unbound state), quotaExhausted? }` — per-method injection; fixed correlationIds `pif-corr-0001`…; failure responses follow the 7-token taxonomy of 07b exactly — VALIDATION (named gaps/rows/labels), NOT_FOUND (expired tokens, stale links, expired artifacts), PERMISSION (token-scope, role, unconsented capability), CONFLICT (stale versions, resolved matches, count drift), RATE_LIMIT (export/import windows with reset time), NETWORK (queue fetches, autosave round-trips, per-format partial delivery), UNKNOWN (typed retry with the `pif-corr-NNNN` reference quoted verbatim in the 11 copy). No random jitter: latency and failure points are configuration, not chance.

## Test-support

`reset()` → seed state; `snapshot()` → named state capture; `replay(events)` → deterministic re-derivation; state hashes stable across runs (determinism oracle). Zero external deps; no `Date.now` anywhere in computation (the seeded clock is the only time source; it advances only on declared actions). The unbound-assist configuration is the DEFAULT — the 00 success signals and the 08 degradation test run against it and must complete identically with `assistCapabilityBound: true` minus the assist fixtures (the two states are the mock's own A/B oracle).
