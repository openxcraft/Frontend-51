# 07c — Mock Adapter: field-service-dispatch

In-memory, deterministic, zero external dependencies. Implements `FieldServiceDispatchAdapterV1` (07b). Channel sends (`requestConfirmation` via the abstract customer-messaging capability) are a **simulated async stage** per async-contract.md: a Job that walks queued → running → succeeded against fixed tables — no network, no timers beyond the declared cadence (80ms/recipient). The phone-manual path touches no job, no channel, and no quota (07b rule 8).

## Fixed world clock

`2026-11-04T08:30:00+03:00` (Riyadh), a Wednesday. Every "now" read (touchpoint expiry derivation, day-plan default date, technician load) computes against this instant. Dual-calendar chip renders the fixed label **"الأربعاء 4 نوفمبر 2026 · 27 جمادى الأولى 1448هـ"** (tabular-approximation Hijri; presentation only — implementation renders per the Umm al-Qura presentation rule, _index §5 Q-5; the Gregorian date is the stored truth).

## Seeded workspace (named)

**"خدمات سند الفنية" / Sanad Technical Services** — Riyadh, 8 technicians, 12 customers, 19 job cards (17 day/history/future + 2 drafts), 22 confirmation touchpoints, 3 async-job history rows. Workspace policy: `autoRequestBooking: true` (booking touchpoint created on schedule), `dayOfReminder: true` with `dayOfLeadMinutes: 240`, `bookingExpiryLeadMinutes: 120`, `dayOfExpiryLeadMinutes: 30`, `minimumWindowMinutes: 60`, `laneOrder: [T-01..T-08]`, `defaultLocale: ar`.

### Technicians (8)

| id | nameAr | nameEn | skills | duty |
|---|---|---|---|---|
| T-01 | عبدالله الدوسري | Abdullah Al-Dosari | ac, appliance | on-duty |
| T-02 | يوسف الحربي | Yousef Al-Harbi | ac | on-duty |
| T-03 | رضا محمد | Reda Mohamed | plumbing | on-duty |
| T-04 | سالم القحطاني | Salem Al-Qahtani | electrical | on-duty |
| T-05 | أنوب جورج | Anoop George | electrical, handyman | on-duty |
| T-06 | محمود إدريس | Mahmoud Idris | appliance, handyman | on-duty |
| T-07 | فيصل العتيبي | Faisal Al-Otaibi | cleaning | on-duty |
| T-08 | راجيش كومار | Rajesh Kumar | ac | **off-duty** (duty-refusal fixture: scheduling onto T-08 → VALIDATION naming the duty fact) |

### Customers (12, bilingual mix)

C-01 نورة السبيعي / Noura Al-Subaie (ar, حي الياسمين) · C-02 فهد المطيري / Fahad Al-Mutairi (ar, حي الملقا) · C-03 ريم عبدالعزيز / Reem Abdulaziz (ar, حي النرجس) · C-04 John Whitfield (en, "الربيع — مجمع الفيلات 12", mixed-script address fixture) · C-05 Priya Nair (en, حي قرطبة) · C-06 عبدالله الشمري / Abdullah Al-Shammari (ar, حي الصحافة) · C-07 شركة واحة المكاتب / Office Oasis Co. (en-preferred contract client, حي العليا) · C-08 مها الزهراني / Maha Al-Zahrani (ar, حي غرناطة) · C-09 إبراهيم خان / Ibrahim Khan (ar-preferred, حي الربوة) · C-10 سارة الفيفي / Sarah Al-Faifi (ar, حي العارض) · C-11 شركة مدارات العقارية / Madarat Real Estate (en, طريق الملك فهد) · C-12 خالد الغامدي / Khalid Al-Ghamdi (ar, حي لبن). Phones are synthetic Saudi-format fixtures (+966 5X XXX XXXX, Western numerals, never flipped).

### Job cards — the seeded day 2026-11-04 (the board's "today")

| code | customer / title | window | tech | state | gate fixture |
|---|---|---|---|---|---|
| JOB-1001 | C-01 · صيانة مكيف سبليت — غرفة المعيشة | 09:00–11:00 | T-02 | **closed** | full journey: booking TP confirmed via channel 03-19:12 → dispatched 08:10 → check-in 08:55 → start 09:02 → complete 10:35 (note: "تم تنظيف الفلاتر وتعبئة الفريون، يُنصح باستبدال الضاغط خلال 6 أشهر") → completion-sign-off TP confirmed via channel 10:40 → closed 10:45. 6 state events + 2 touchpoints = the timeline-read fixture |
| JOB-1002 | C-02 · ضعف تبريد المكيف المركزي (urgent) | 09:00–12:00 | T-01 | customer-confirmed | booking confirmed via channel (reply "YES") — ready to dispatch (CP-2 demo start) |
| JOB-1003 | C-04 · Intermittent power — villa circuits (mixed-script title) | 10:00–12:00 | T-05 | scheduled | booking TP **expired** at read (requested 03-18:00, expiresAt 04-08:00 = window.start − 120m; clock 08:30 > expiry) — the queue's expired row with the two honest paths |
| JOB-1004 | C-03 · الغسالة لا تدور | 11:00–13:00 | T-06 | customer-confirmed | phone-manual booking confirmation recorded by dispatcher m-02 at 04-07:40 |
| JOB-1005 | C-06 · تسريب تحت حوض المطبخ | 12:00–14:00 | T-03 | scheduled | booking pending + day-of TP pending (requested 08:00 per dayOfLeadMinutes 240) — the evening-sweep fixture |
| JOB-1006 | C-07 · عقد الصيانة الشهرية: فحص 6 وحدات | 13:00–16:00 | T-02 | customer-confirmed | contract visit, en-preferred customer, ar title retained |
| JOB-1007 | C-05 · تركيب رفوف وستائر | 14:00–16:00 | T-05 | scheduled | **reschedule chain**: original booking for Wednesday morning declined on 11-03 ("Wednesday morning won't work" reply note) → rescheduled to Wednesday afternoon (rescheduleCount 1, old TP superseded with supersededById link, new booking pending) |
| JOB-1008 | C-08 · تنظيف عميق قبل قدوم الضيوف | 15:00–18:00 | T-07 | customer-confirmed | booking confirmed via link (via: 'link') |
| JOB-1009 | C-09 · ضجيج من الوحدة الخارجية | 16:00–18:00 | T-01 | en-route | **the honest bypass**: booking TP unanswered → `unconfirmedDispatch` recorded 08:15, reason "اتفاق هاتفي مع العميل هذا الصباح دون رد كتابي" → dispatched legally, card carries the waiver forever |
| JOB-1010 | C-10 · انسداد رئيسي (urgent) | 09:30–11:30 | T-03 | en-route | booking confirmed via phone-manual 08:05; arrival-notice TP pending |
| JOB-1011 | C-12 · الثلاجة لا تجمد | 17:00–19:00 | T-06 | scheduled | booking pending (expires 15:00) |
| JOB-1012 | C-11 · Repair corridor lighting — Madarat building | — | unassigned | **draft** | intake-lane fixture (en title + ar note) |
| JOB-1013 | C-01 · متابعة زيارة JOB-1001: فحص الضاغط | — | unassigned | draft | follow-up-reference fixture (note links the closed job by code — plain text, no entity link) |

### History & adjacent days

- **JOB-0990** (2026-11-03, C-08, ac, فحص سنوي, 10:00–12:00, T-02): closed via **staff-attest** completion sign-off (customer unreachable; attested by owner m-01 at 17:30) — the attest-path fixture and the primary `exportJobHistory` target.
- **JOB-0991** (2026-11-03, C-10, appliance, 14:00–16:00, T-06): **no-show** terminal — events: scheduled → booking confirmed → dispatched → check-in 14:10 → no-show recorded 14:35 with note "العميل غير موجود، انتظرنا 25 دقيقة".
- **JOB-0992** (2026-11-03, C-07, cleaning, 09:00–11:00, T-07): **cancelled-after-dispatch** — cancelled from en-route at 08:50, reason "إلغاء العقد من قبل إدارة المبنى" (card retains the arrival-notice TP history).
- **JOB-1014 / JOB-1015** (2026-11-05, T-04, electrical, 09:00–12:00 and 12:00–15:00): the **back-to-back adjacency fixture** — touching edges allowed by the overlap formula (regression assertion: no conflict raised between these two).
- **JOB-1016** (draft, C-11, electrical, إنارة الطوارئ): seeded with note "جرّب جدولتها على سالم 11:00–13:00" — scheduling it onto T-04 at 11:00–13:00 on 11-05 overlaps JOB-1014 (11:00 < 12:00) → the **planted VALIDATION overlap fixture** (regression assertion: error names both codes and both windows).

### Touchpoints (22, summarized)

2 on JOB-1001 (booking confirmed / completion confirmed) · 1 booking confirmed on JOB-1002 · 1 booking expired-derived on JOB-1003 · 1 booking phone-confirmed on JOB-1004 · 2 on JOB-1005 (booking pending + day-of pending requested 08:00) · 1 booking confirmed on JOB-1006 · 2 on JOB-1007 (superseded declined + pending) · 1 booking link-confirmed on JOB-1008 · 1 unanswered + arrival-notice pending on JOB-1009 · 2 on JOB-1010 (phone-confirmed + arrival-notice pending) · 1 booking pending on JOB-1011 · 1 booking confirmed + 1 staff-attest completion on JOB-0990 · 1 booking confirmed on JOB-0991 · 1 arrival-notice pending on JOB-0992 · 1 booking confirmed each on JOB-1014/1015.

### Async-job history (3)

confirmation-send succeeded (03-18:05, 9 recipients, determinate progress rows) · day-sheet-export succeeded with artifact A-1 (**expired** — 7-day window elapsed → `getArtifact` NOT_FOUND + regenerable fixture) · job-history-export succeeded with live artifact A-2.

## Deterministic computation rules (EXACT — the mock's law)

1. **Expiry derivation at read**: a pending touchpoint renders `expired` iff `clock > expiresAt`; `expiresAt = window.start − bookingExpiryLeadMinutes` for booking-kind, `window.start − dayOfExpiryLeadMinutes` for day-of, `window.end + 1440` minutes for completion-sign-off; arrival-notice carries no expiry (informational). Expired is never written back.
2. **Dispatch gate at read**: the gate is the state of the **newest non-pending, non-superseded booking-or-day-of touchpoint** (a later pending reminder never revokes an earlier confirmation — the newest RESOLVED state governs, so a day-of decline after a confirmed booking reads declined); if every such touchpoint is pending (or none exists) the gate reads awaiting; draft cards render `not-required`. `unconfirmedDispatch` renders `waived` only while the gate is not `confirmed` (a late confirm upgrades the gate to confirmed; the waiver record remains visible on the card forever — both facts coexist honestly).
3. **Overlap check** (scheduleJobCard): conflict iff same technician ∧ same date ∧ `startA < endB ∧ startB < endA`. Touching edges allowed (JOB-1014/1015 regression pair). Travel time is never modeled.
4. **Minimum window**: `end − start ≥ 60` minutes, else VALIDATION naming the minimum and the attempted duration.
5. **Terminal-state idempotence**: re-invoking the action matching the current state (e.g., check-in while on-site) returns the current summary with a calm `note` and appends NO event (07b rule 7). Illegal transitions → VALIDATION with `details: { currentState, attempted, legalNext }`.
6. **Reschedule**: scheduleJobCard on a job in scheduled/customer-confirmed → events appended (→ rescheduled → scheduled), `rescheduleCount++`, prior non-superseded touchpoints → `superseded` with `supersededById` → new booking touchpoint (auto-request per policy).
7. **Tally computation** (getDayPlan): over the day's job cards in states scheduled..work-done, map each card's gate per rule 2 (confirmed/declined/expired/unanswered/awaiting-as-pending); cards with no touchpoint count as pending; waived cards count by their gate state (the waiver never launders the tally).
8. **Lane load**: `minutes = Σ(end − start)` over non-terminal (non-closed/cancelled/no-show) cards per technician/date; `jobCount` = card count.
9. **Job codes**: sequential zero-padded `JOB-####`; next issue after seed = **JOB-1017**; codes are never reused (07a obligation).
10. **Day-sheet order**: lanes in workspace `laneOrder`; jobs by `windowStart` then `code`. Job-history export renders the full event + touchpoint chain in append order with actors' bilingual names.
11. **Normalization** (search): strip tashkeel; أ/إ/آ → ا; ة → ه; ى → ي (rtl-rules §4) — disclosed in-product; regression pair: searching "شركه" matches "شركة" rows (the taa-marbuta fixture across C-07/C-11).
12. **Channel simulation**: `requestConfirmation` with the channel unbound (default `channelBound: false`) returns a pending touchpoint with `via: 'link'` and the fixed confirmation-link string `fsd-confirm/<touchpointId>` rendered for copying — no job, no quota. With `channelBound: true`, a send Job paces 80ms/recipient with determinate progress; replies land ONLY via `recordTouchpointReply` (the harness drives channel-inbound explicitly — determinism preserved).

## Behavior

- `dispatchJobCard` on JOB-1003 as-seeded → VALIDATION naming the gate ("awaiting/ expired confirmation") and the two honest paths — the first-session proof of the unique feature. After `recordTouchpointReply(confirmed)` or `recordUnconfirmedDispatch(reason)`, the same call succeeds.
- `closeJobCard` without a completion-sign-off resolution → VALIDATION naming the attest path; with `via: 'staff-attest'` resolved by a dispatcher/owner member, closes (JOB-0990 is the seeded proof).
- `recordTouchpointReply` on a terminal touchpoint → CONFLICT naming the existing outcome; `updateJobCard` with stale `baseVersion` → CONFLICT with both payloads.
- `scheduleJobCard` onto T-08 (off-duty) → VALIDATION naming the duty fact; onto T-04 11:00–13:00 on 11-05 for JOB-1016 → VALIDATION naming JOB-1014 and both windows.
- Technician session (member m-03, role technician, T-02): `getJobCard(JOB-1002)` (assigned to T-01) → PERMISSION; mobile actions on own JOB-1001 (already closed) → VALIDATION terminal-state refusal naming the legal path (new job card).
- `exportDaySheet` / `exportJobHistory`: Job → artifact with 7-day expiry; A-1 expired → `getArtifact` NOT_FOUND + `regenerable: true` + renewal; `failExportOnce` config → partial-failure with retry per async-contract §4; idempotent re-submit returns the original job.
- `getUsage`: window "monthly"; channel sends 12 of 30 (under the 80% warn line); phone-manual resolutions contribute ZERO (07b rule 8 — the queue never meters Nora's calls).
- Error injection per method: MockConfig `{ latencyMs, errorRate, errorCode, channelBound, quotaExhausted, failExportOnce }`; fixed correlationIds `fsd-corr-0001`…; every one of the 7 error classes injectable and typed per the 07b union.
- Session fixtures: m-01 owner (سالم الراشد — the owner-dispatcher persona), m-02 dispatcher (نورة الحمود — the dispatcher persona), m-03 technician (وليد — the senior-AC-technician persona, T-02).

## Test-support

`reset({ mode: 'seeded' | 'empty' })` — seeded restores the full Sanad workspace (the default; `empty` yields the true first-run workspace for P01 empty-state tests) · `snapshot()` / `replay()`. No randomness, no network, no timers beyond the declared cadences. Regression assertions: the JOB-1003 gate refusal fires as seeded; the waiver on JOB-1009 renders `waived` and survives every re-read; the 1014/1015 back-to-back pair never conflicts while JOB-1016-at-11:00 always does; tally arithmetic matches the seeded touchpoint states exactly (confirmed 5 · declined 0 · expired 1 · unanswered 1 · pending 3 for 2026-11-04); JOB-0991 no-show and JOB-0992 cancelled-after-dispatch are terminal; expired artifact A-1 → NOT_FOUND + regenerable; `شركه` search matches `شركة` rows; every error class injectable and typed.
