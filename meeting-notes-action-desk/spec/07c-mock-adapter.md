# 07c — Mock Adapter: meeting-notes-action-desk

In-memory, deterministic, zero external dependencies. Implements `MeetingNotesAdapterV1` (07b). Transcription (`transcribeAudio`) and assist summarization are **simulated async stages** per async-contract.md: Jobs that walk queued → running (determinate segment progress) → succeeded against fixed tables — no network, no timers beyond declared cadences, and the adapter never records or joins a call (LOOP-10: `audioRef` is an opaque handle to a file the lead already possesses).

## Seeds (fixed, named)

**Workspace W-1 — "Dana Hospitality Group"** (Dubai F&B group, 12 venues). Defaults: `defaultLocale 'en'` (bilingual-en proposal, LOOP-6), `assistDefault 'assist'`, `respondByDefaultDays 3`, `meetingTitleLanguageHint 'en'`.

**Members (8, bilingual display names — normalization fixtures included):**

| id | EN name | AR name | seat | locale |
|---|---|---|---|---|
| m-01 | Sara Al Rashid | سارة الراشد | lead | en |
| m-02 | Omar Haddad | عمر حدّاد | member | ar |
| m-03 | Layla Kassem | ليلى قاسم | member | en |
| m-04 | Faisal Al Zaabi | فيصل الزعابي | member | ar |
| m-05 | Mira Chen | ميرا تشين | member | en |
| m-06 | Yousef Bakr | يوسف بكر | member | ar |
| m-07 | Reem Nasser | ريم ناصر | lead | en |
| m-08 | Amina Farouk | أمينة فاروق | viewer | ar |

Speaker-label matching exercises rtl-rules §4 normalization: the seeded transcript says "omar haddad" (Latin, lowercase) and "ساره الراشد" (alef-variant of سارة) — both MUST resolve to their members on every run (regression assertions).

### Meeting M-000 — "Weekly Ops Huddle" / "اجتماع العمليات الأسبوعي" (held 2026-10-11, seriesLabel "Weekly Ops Huddle", open)

- Capture revision R-000 (pasted, 8 segments — abbreviated prior-week notes).
- **A-002** (fire-safety renewal, origin manual): textEn "Renew the fire-safety inspection for the Abu Dhabi branch" / textAr "تجديد فحص السلامة من الحريق لفرع أبوظبي", owner m-04, dueOn 2026-10-17, status **proposed** — requested 2026-10-11T14:00+04:00, respondBy 2026-10-14T14:00+04:00, no response. **The both-zones-true fixture**: at MOCK_NOW it is simultaneously confirmation-overdue (7 days past respondBy) and overdue (4 days past dueOn) — the register renders BOTH zone chips with named values (03 CP-4 edge).
- **A-007** (menu photography reshoot, origin deterministic-cue): textEn "Reshoot the menu photography after color corrections" / textAr "إعادة تصوير قائمة الطعام بعد تصحيح الألوان", owner m-03, dueOn 2026-10-29, status **questioned** — confirmation requested 2026-10-11T14:05+04:00, responded 2026-10-13T10:12+04:00 with note "الألوان تحتاج تصحيح قبل التصوير — ممكن نعدّل الموعد؟" (the clarification-thread fixture; back on the lead's desk).
- Decision D-000: "Marina branch opening deferred to Q1" / "تأجيل افتتاح فرع المارينا إلى الربع الأول" (evidence span on segment 6).

### Meeting M-001 — "Weekly Ops Huddle" / "اجتماع العمليات الأسبوعي" (held 2026-10-18, seriesLabel "Weekly Ops Huddle", open) — the fully-worked fixture

Capture revision R-001 (pasted from an external notetaker; 14 segments, real code-switched Arabic-English — direction computed per the rules below):

1. Sara (ساره الراشد): "صباح الخير جميعاً، اليوم عندنا ثلاثة مواضيع: تدقيق الموردين، إطلاق قائمة الربع الثالث، والـ POS rollout." (mixed)
2. omar haddad: "أنا أتكفل بملفات تدقيق الموردين — أرسل الوثائق الناقصة قبل الجمعة." (ar; cue أتكفل + سأرسل + قبل الجمعة)
3. Layla: "I'll draft the menu launch timeline and share it with marketing by Friday." (en; cue I'll + by Friday)
4. Faisal: "شهادة السلامة من الحريق — لازم تجديد الفحص قبل 17 أكتوبر، أنا تابعته مع الدفاع المدني." (ar; cue لازم + قبل 17 أكتوبر)
5. Sara: "ميرا، راجعي فرق الـ POS في فرع أبوظبي وناقشيه مع الفروع." (mixed; third-person cue راجعي + Latin token POS embedded)
6. Yousef: "سجلات حرارة الثلاجات جاهزة، رفعتها أمس في النظام." (ar; no action cue — background fact)
7. Sara: "اتفقنا على تأجيل افتتاح فرع المارينا إلى الربع الأول." (ar; decision cue اتفقنا على)
8. Layla: "The tasting session list needs to go to the chefs before Thursday." (en; cue needs to + before Thursday)
9. Reem: "خطة الافتتاح تحتاج تحديث قبل المحضر القادم." (ar; cue تحتاج — no owner third-person, no due expression → owner null, due null: the assign-an-owner fixture)
10. omar haddad: "العروض من الموردين الجدد ثلاثة، بندرجها في مقارنة الأسعار." (ar; weak cue — deterministic passes; assist proposes it)
11. Faisal: "Fire extinguisher service contract renews automatically, no action needed." (en; explicit no-action statement — the anti-cue fixture: neither mode proposes it)
12. Mira: "I'll reconcile the POS variance once Sara clarifies the month." (en; cue I'll — assist proposes with 0.74; deterministic proposes too; the owner-question dependency fixture)
13. Sara: "نحتاج تأكيد موعد التصوير الجديد مع الاستوديو بنهاية الأسبوع." (ar; cue نحتاج + بنهاية الأسبوع)
14. Sara: "شكراً جميعاً، المحضر والمتابعة على ريّم." (ar; no cue — closing)

Summary S-001 (deterministic run on R-001, degraded: false): template paragraphs (EN + AR, mode-labeled), proposed decisions = segment 7, proposed actions = segments 2, 3, 4, 5, 8, 9, 12, 13 with owner/due guesses per the rules below.

Actions (6 + A-007 from M-000 above):

- **A-001** (from proposal on segment 2; origin deterministic-cue): textEn "Send the missing supplier-audit documents" / textAr "إرسال وثائق تدقيق الموردين الناقصة", owner m-02, dueOn 2026-10-23 (قبل الجمعة → Friday 23 Oct), status **confirmed** → **in-progress** — requested 2026-10-18T16:00+04:00, confirmed 2026-10-18T18:05+04:00 by m-02's session; statusEvent draft→proposed→confirmed→in-progress. The Ta'ahhud Settle's reference fixture.
- **A-003** (from proposal on segment 3): "Draft the menu launch timeline" / "إعداد الجدول الزمني لإطلاق القائمة", owner m-03, dueOn 2026-10-23, status **confirmed** — due-soon zone at MOCK_NOW (2 days).
- **A-004** (from proposal on segment 5): "Reconcile the POS variance for the Abu Dhabi branch" / "تسوية فرق نظام الـ POS لفرع أبوظبي", owner m-05, dueOn null, status **questioned** — requested 2026-10-18T16:02+04:00, respondBy 2026-10-21T16:02+04:00, responded 2026-10-19T09:30+04:00 'questioned' with note "أي شهر نطابق؟ هذا الشهر ولا السابق؟".
- **A-005** (from proposal on segment 9): "Update the opening plan before the next minutes" / "تحديث خطة الافتتاح قبل المحضر القادم", owner null, dueOn null, status **draft** — the assign-an-owner fixture (requestConfirmation on it → VALIDATION naming owner and dueOn).
- **A-006** (from proposal on segment 6→ reclassified: Yousef's completed report): "Submit the fridge temperature logs" / "تسليم سجلات حرارة الثلاجات", owner m-06, dueOn 2026-10-18, status **done** 2026-10-18T15:40+04:00 with no completion note (the optional-note fixture).
- **A-008** (from proposal on segment 13): "Confirm the new studio date for the reshoot" / "تأكيد الموعد الجديد للتصوير مع الاستوديو", owner m-01 (self-assignment fixture — the lead owns one too), dueOn 2026-10-22 (بنهاية الأسبوع → Thursday 22 Oct), status **proposed**, respondBy 2026-10-21T16:10+04:00 — awaiting-confirmation at MOCK_NOW (respond-by not yet passed; the countdown fixture).

Decisions: D-001 (segment 7) "Defer the Marina branch opening to Q1" / "تأجيل افتتاح فرع المارينا إلى الربع الأول".

### Meeting M-002 — "Q3 Menu Launch Review" / "مراجعة إطلاق قائمة الربع الثالث" (held 2026-10-15, open)

- Capture revision R-002 (pasted, 10 EN-dominant segments with two Arabic interjections — direction fixtures).
- Summary S-002 (**assist** run, degraded: false — the assist-provenance fixture): proposals with seeded confidences — P1 action "Book the chefs' tasting session" / "حجز جلسة تذوّق الطهاة" confidence **0.91**, owner guess m-03, due 2026-10-24; **P2 action "Remove all plastic straws from venues" / "إزالة كل المصاصات البلاستيكية من الفروع" confidence 0.62 — the planted FALSE POSITIVE** (segment 11 of R-002 is a sustainability decision statement, not an assignment): renders with the 'low' label (<0.70 threshold) and the review-hint copy; dismissing it is the P15 exercise in the 00 success signal.
- **A-009** (from P1, origin **assist-proposal** — the accepted-assist fixture): owner m-03, dueOn 2026-10-24, status confirmed → in-progress; provenance stays 'assist-proposal' through human edits (07a rule — regression assertion).

### Meeting M-003 — "Supplier Audit Prep" / "التحضير لتدقيق الموردين" (held 2026-10-16, open) — the manual-only degradation fixture

- Capture revision R-003 (**typed** — the always-available floor; 6 short typed segments, no speaker labels): includes "عمر يرسل جدول المستندات يوم الأربعاء" (third-person cue يرسل + يوم الأربعاء) and "I will collect the HACCP certificates." (en cue).
- Summary S-003 (deterministic): 2 proposals — owner guess for the first resolves via third-person cue to m-02, due 2026-10-21; the second owner null (no speaker labels: ownerGuessBasis 'none').
- **A-010** (manual, authored from cue review): owner m-02, dueOn 2026-10-21, status **done** (completed 2026-10-20).
- **A-011** (manual, draft): "Collect the HACCP certificates" — textEn only, textAr empty (the honest-empty-slot / unpaired-pair fixture: 05/06 warning renders until the lead pairs it).

### Meeting M-sample — "Menu Tasting Debrief" / "حصيلة جلسة التذوّق" (held 2026-10-14, seriesLabel "Sample")

- 8 mixed-script segments, 1 decision, 3 actions covering awaiting-confirmation / confirmed-in-progress / done; **artifact A-0 EXPIRED** (created 2026-10-07, 7-day window elapsed → getArtifact NOT_FOUND + regenerable path fixture). First-run P22 fixture: loads on S1's empty state; clears in one action and never returns (12 Q-13).

### Jobs history

import R-000 succeeded · import R-001 succeeded (14 segments, 0 invalid) · summarize S-001 deterministic (degraded false) · summarize S-002 assist (degraded false) · summarize S-003 deterministic · export minutes M-001 succeeded → **artifact A-1 expires 2026-10-28** · export register (Reem's quarterly view, filter ownerId m-04) succeeded → A-2.

## Deterministic computation rules (fixed tables — the degradation path)

1. **Segment direction** (computed at ingest, disclosed per segment): scan Unicode script classes; Arabic-script char share ≥ 70% → 'ar'; Latin-script share ≥ 70% → 'en'; otherwise 'mixed'. Segment 1 of R-001 (three Latin tokens inside an Arabic sentence incl. "الـ POS rollout") MUST compute 'mixed' on every run — regression assertion.
2. **Action cue tables**: AR — أتكفل|أتكفل بها|سأرسل|سأعد|سأجهز|سيتولى|يتولى|لا بد أن|لازم|نحتاج أن|نحتاج إلى|تحتاج تحديث|راجع(ي)?|اتابع(ي)?|قبل (الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت|الأحد)|بنهاية الأسبوع. ("بندرجها" in segment 10 is deliberately NOT a cue-table entry — deterministic mode passes it over; the assist proposes it: the mode-difference fixture.) EN — I'll|we'll|will|please|needs? to|let's|by (Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)|before \d|end of (the )?week. **Anti-cue**: a segment containing "no action needed" / "لا يحتاج إجراء" is never proposed by either mode (segment 11 fixture). Decision cues: اتفقنا على|قررنا|we agreed|we decided. Cue match → candidate with the span [charStart, charEnd) of the matched phrase, confidence 1.0, provenance deterministic.
3. **Owner matching**: speaker label → member by bilingual normalized name match (strip tashkeel; أ/إ/آ→ا; ة→ه; ى→ي; casefold Latin — "omar haddad"→m-02, "ساره الراشد"→m-01 via the alef rule). Third-person cues (name followed by راجعي/يتولى/يرسل/اتابعي): normalized leading token matched against member names — "ميرا" in segment 5 resolves to m-05. Unmatched → ownerGuessBasis 'none', owner null.
4. **Due-date parsing** (relative to heldOn; Gulf week Sun–Thu): "قبل الجمعة"/"by Friday" → next Friday strictly after heldOn (2026-10-18 → 2026-10-23) · "بنهاية الأسبوع"/"end of week" → Thursday of heldOn's ISO week (→ 2026-10-22) · "قبل 17 أكتوبر"/"before 17 Oct" → 2026-10-17 · "يوم الأربعاء"/"on Wednesday"/"before Thursday" → next occurrence strictly after heldOn. Unparsed → null. Storage is ISO; Hijri display is presentation only (P24).
5. **Confidence labeling**: deterministic proposals carry confidence 1.0 (rule-matched) and render WITHOUT a meter (06 rule); assist proposals carry the fixed seeded values (0.91 / 0.74 / 0.88 / 0.62); any confidence < 0.70 renders the 'low' label + review-hint copy (the 0.62 false positive sits under the threshold deliberately — sibling house rule).
6. **Zone derivation at read** (never stored): against MOCK_NOW 2026-10-21T08:00:00+04:00 — confirmation-overdue = status 'proposed' && respondBy < now (A-002: 7 days) · overdue = dueOn < now && status ∉ {done, withdrawn} (A-002: 4 days) · due-soon = dueOn within 48h ahead && not done (A-003: 2 days) · awaiting-confirmation = 'proposed' && respondBy ≥ now (A-008: ~8h left).
7. **Bilingual pairing policy**: pair fields are authored; the mock never machine-translates; unpaired sides render the honest empty-slot state (A-011 carries textEn only until the lead pairs it — fixture).

## Assist simulation (mode 'assist', when `assistEnabled`)

- On R-001: proposes segment 10 (vendor-quote comparison) with confidence 0.74 — beyond the 8 cue-table proposals (the mode-difference fixture; segment 12's "I'll" is a cue both modes catch). On R-002: emits P1 (0.91) and the P2 false positive (0.62). With `editPolicy` semantics on re-runs: prior accepted/edited proposals are preserved and marked human-confirmed; dismissed ones stay dismissed.
- `modeUsed` + `degraded` returned honestly: assistEnabled=false + mode 'assist' → run completes deterministic with degraded: true (rung-4 fixture, 08 map). Quota-exhausted mid-run → same degradation + the job result records it (never a silent rerun).

## Behavior

- `importNotes`: paced 60ms/segment-chunk; empty text → VALIDATION naming the segment index + prior-good segments kept (partial policy); idempotency-key replay returns the original job.
- `transcribeAudio`: consent off → PERMISSION naming the transcription capability class (credential-contract §2 kind-not-vendor language); consented → Job queued 100ms → running with determinate segment progress against a FIXED transcript table (the seeded file's segments; 12 segments for the demo audio handle) → succeeded as a new CaptureRevision with source 'transcription-capability'; `failTranscribeMidway` config → partial delivery of segments-so-far + typed error (async-contract §4 partial policy).
- `runSummarization`: paced 100ms/proposal emitted; atomic per run; deterministic mode needs no capability and no consent.
- `requestConfirmation`: no owner or no dueOn → VALIDATION naming the missing fields (A-005 fixture); stale baseVersion → CONFLICT; creates the ConfirmationRecord with respondBy = now + override or workspace default (3 days); idempotent replay returns the original.
- `respondToConfirmation`: 'questioned'/'declined' without a note → VALIDATION on the note field; racing second response → CONFLICT carrying the first recorded response; response 'confirmed' transitions the action to 'confirmed' and appends the StatusEvent; viewer seat → PERMISSION.
- `updateActionStatus`: to 'done'/'in-progress' from any status other than 'confirmed'/'in-progress' respectively → VALIDATION naming the required path (the confirmation gate); reopen path done → 'in-progress' with reason note; stale version → CONFLICT.
- `exportMinutes`: minutes format = bilingual minutes (header/participants/summary/decisions/actions with confirmation provenance) + optional register appendix; action-register format = the current register filter; unconfirmed actions export flagged 'proposed' when includeUnconfirmed; artifact expiry 7 days; A-0 expired → NOT_FOUND + regenerable; `failExportFormatOnce` → partial bundle failure with per-format retry; idempotent re-export returns the same artifact.
- `getUsage`: window "monthly"; assistRuns 3 of 10 (below the 80% warn line — no warning fixture by default); deterministicRuns unmetered; transcriptionRuns 0; exports 2; resetAt 2026-11-01T00:00+04:00.
- `listActivity`: every seeded mutation carries its ActivityEntry (meeting-created, capture-imported, summarization-run, confirmation-requested/responded, action-status-changed…); filterable per 07b.
- Error injection per method: MockConfig { latencyMs, errorRate, errorCode, assistEnabled, consentGranted, quotaExhausted, failExportFormatOnce, failTranscribeMidway }; fixed correlationIds `mnad-corr-0001`…
- **Fixed seeded clock**: MOCK_NOW frozen at 2026-10-21T08:00:00+04:00 (Gulf Wednesday morning — the desk-review moment). The clock advances ONLY via declared job cadences while a Job is observed; reset() restores the frozen instant. All zone math (rule 6) reads this clock — the same state always yields the same zones.

## Test-support

reset() / snapshot() / replay(): full state restore, no randomness, no network, no timers beyond the declared cadences. Regression assertions: direction rule computes 'mixed' on R-001 segment 1; "omar haddad" and "ساره الراشد" resolve via normalization; A-002 renders BOTH overdue and confirmation-overdue with named day counts; A-005 requestConfirmation → VALIDATION; the 0.62 assist proposal renders 'low' and is dismissible; assist-off run returns degraded:true with deterministic results; A-009 keeps origin 'assist-proposal' after edits; confirm-then-done out of sequence → VALIDATION; every error class injectable and typed per the 07b union; A-0 artifact expiry → NOT_FOUND + regenerable.
