# 03 — UX Flows: patient-intake-forms

SME-C pass · 5 critical paths, numbered steps incl. edges/failures/recovery. Coverage table at the end traces every 07b operation exactly once — no orphans, no phantoms. Terminology per 02: intake form · section · question/field · symptom field · symptom vocabulary · term · colloquial variant · match · normalization · pending confirmation · unmatched · urgent flag · escalation · review · submit · resume · export.

## CP-1 — Author and publish a bilingual intake form (Nour's builder loop)

1. Nour creates a form from the forms library: name (bilingual pair required), visit type tag (new-patient / follow-up / procedure), starting structure (blank · duplicate an existing form · sample form). `createForm` · `duplicateForm` (when duplicating) · `listForms`
2. The builder opens a three-region layout: section canvas (the form's structure) inline-start, field palette + inspector inline-end. She adds sections (Patient details · Medical history · Current symptoms · Consent) and fields from the palette: short text, long text, select-one, select-many, date, number, pain scale, contact, consent — each field inspector demanding label + help text in BOTH locales (placeholders-as-labels are structurally impossible: labels are persistent chrome — NN/g placeholders-harmful evidence, research S8). `saveForm` (draft autosave, P10 indicator in the builder header)
3. She drops a **symptom field** into Current symptoms: the inspector shows it binds to the workspace symptom vocabulary (selectable vocabulary scope), whether multiple symptoms are allowed, and whether free text is permitted alongside matches. `getForm` (reload) · `listSymptomTerms` (inspector's bound-vocabulary preview)
4. Options authoring: each select option is a bilingual pair; the inspector shows per-option completeness (both-locale check mark) and warns on options whose two locales differ wildly in length (length-aware budgeting, 10 — no assumed expansion folklore, 12).
5. **Preview both ways**: the preview surface renders the form exactly as the patient will see it — one question per screen, either locale, either direction — from the builder's preview toolbar. Field order, section breaks, required marks, and help text all render per direction; the preview is the publish gate's visual half. `getForm` (preview reads the draft)
6. **Publish gate**: she hits Publish; the adapter validates — every field label + help text + every option present in BOTH locales; ≥1 consent field with attestation text in both locales; ≤10 sections and ≤120 fields (07c rule 6); a non-empty bilingual form title. Any gap → VALIDATION naming the exact fields and locales missing (never a generic "form incomplete"). Success → the form's status flips to active at a new version; prior submissions keep the version they were answered on. `publishForm`
7. Post-publish edit: she fixes a typo in the Arabic help text; the edit saves as a new draft version and re-publishes — submissions in flight on the old version complete on it (version pinning, 07a). `saveForm` · `publishForm`
8. Retiring a form: archive is a P04 level-2 confirm naming the form and its open-submission count; archived forms stop accepting new fill sessions, existing drafts complete. `archiveForm`
9. Session context: her role renders the console chrome; the forms library is the console's first screen for every staff persona. `getSession`

**Edges**: a field duplicated within a section (allowed; the inspector names the twin); an option list over 40 entries (inspector suggests a searchable select — a hint, never a block); a consent field deleted while submissions exist (allowed with confirm; the export notes the version difference); vocabulary scope change after submissions exist (existing submissions keep the vocabulary version they matched against — 07a pinning).
**Failures**: publish with half-translated copy → VALIDATION listing each field and locale; stale concurrent edit (Huda editing from her seat) → CONFLICT with both payloads side by side (P10 conflict discipline — never silent overwrite); draft autosave offline → queued with per-field state (P20).
**Recovery**: drafts persist across sessions (P11 — the builder recalls the last edit position); publish is re-attemptable after fixes; every version is restorable via the form's version history (07a).

## CP-2 — The patient fill journey (Amira's flow — the value proof)

1. Amira receives the form three ways, all exercised in this path: a link the receptionist reads to her over the phone or sends by message, a **printed QR** at the front desk, or the **kiosk tablet** in the waiting room. The staff console creates a fill session first: `openFillSession` (input: formId, channel: link | kiosk | printed-qr, optional patient prefill for kiosk name/DOB entry by staff) → a fill token with a declared expiry window (workspace policy, default 72h; kiosk sessions are short-lived with inactivity expiry).
2. She opens the fill surface on her phone (360px, RTL-first): a locale door offers العربية / English — Arabic default, English a full citizen, switchable once at entry (mid-flow switching re-renders answered questions' labels but never re-asks — P11). `resumeFillSession` (returns the form's patient-facing summary + answers-so-far marked as **recalled** when resuming)
3. The flow is **one question per screen** (form-craft law — research S9; the category's own conversion practice), each screen: persistent label (never a placeholder — S8), optional help text below it in plain MSA (health-literacy register, 02), progress spine showing section positions, autosave indicator cycling saving→saved (P10). Every answer autosaves on commit: `saveDraftAnswers` (idempotent; returns the draft state)
4. **The symptom field** (Current symptoms section): she types "وجع راس من يومين وماشي معايا دوخة" — colloquial, two symptoms, an English drug name may appear in the medications field later. As she types, the deterministic core runs (keystroke budget ≤16ms paint, suggestion chips ≤120ms — 10): suggestion chips surface candidate vocabulary terms ("صداع — headache", "دوخة — dizziness") each carrying its match mode; a chip she accepts replaces the phrase with the canonical term pair visibly (her raw text is preserved verbatim underneath — never silently rewritten). `normalizeSymptomText` (live, per-entry)
5. If the normalization capability is bound (conditionally-AI), additional assist suggestions may arrive for phrases the dictionary missed (streamed into a reserved region ≤900ms — 10), each visually marked "suggested — needs confirmation" at the patient surface as a neutral hint and always **deferred to staff confirmation** (P15: the patient-side chip accepts only dictionary-exact/normalized matches; assist matches land as pending-confirmation entries in the review console — 07c rule 3).
6. Interruption (by design): a call pulls her away; she locks the phone. The session's inactivity window lapses — when she returns via the same link, `resumeFillSession` restores every answer marked as recalled (P11), and the flow re-opens at the exact question she left. On timeout near expiry, the surface offers "keep my place" (extends once) before the token expires (declared window honored — 11 copy).
7. Required-field discipline: advancing past an unanswered required question is blocked with a field-anchored inline message naming the question (labels only — never echoes answers, a11y-baseline §7); error summary appears on submit-attempt only (premature errors are hostile — research S22). Validation on blur-or-submit, never per-keystroke.
8. **Review-and-attest step**: the flow ends with a summary screen — every question label with its answer (this is Amira reading her own data: full echo is correct HERE), the attestation text in her locale, and the Submit control. She attests and submits. `submitIntake` (VALIDATION if required fields are empty — listing labels; idempotency key so a double-tap never double-submits)
9. **The calm hand-off** (T2 signature moment, 05): the multi-step flow settles into a single confirmation card — section counts, the clinic's bilingual name, and the next step ("hand this to the front desk" / "your answers are with the clinic") — 280ms ease-in-out settle, no bounce, no confetti. Reduced-motion: instant render + polite announcement carrying counts only (no PHI in announcements, 09).
10. Kiosk variant: the same flow ends with a "hand the tablet back to the front desk" confirmation and the session closes (token invalidated on submit — 07a state obligation).

**Edges**: mixed-script answers (Latin drug name inside Arabic text — bidi-isolated render, rtl-rules §2); an answer longer than the field budget (autosize + word-boundary truncation only in preview contexts); expired token on return → NOT_FOUND with a named re-open path (staff re-issues the link; answers from the expired draft are retained per retention policy — never silently lost); a form archived while she fills → the draft completes on its pinned version (07a).
**Failures**: submit with missing requireds → VALIDATION listing question labels + first-error focus (a11y-baseline §5); network drop mid-flow → offline banner, answers queued locally, resubmit on reconnect (P20 — the draft state is the source of truth); normalization capability failure mid-typing → the deterministic chips continue without interruption (degradation by construction — 08); token tampering → PERMISSION (opaque tokens, no PHI inside — 09).
**Recovery**: everything saved is recoverable through the same link until expiry; after expiry, the staff console can re-open a fill session for the same patient context (a new token, blank or pre-filled — the old answers are never merged silently).

## CP-3 — Review, confirm, escalate (Tariq's console loop)

1. The submissions console opens as the review role's default landing: a queue with state (in-progress · submitted · flagged · reviewed · exported), urgent-flag count, pending-confirmation count, form, and age. Filters + saved views (P08); virtualization beyond 200 rows (P19). `listSubmissions` · `getSession`
2. Tariq opens a submission: the review workspace renders answers grouped by section — the patient's locale answers verbatim (bidi-isolated), canonical vocabulary pairs beside symptom answers, the normalization panel inline-end. `getSubmission`
3. **The normalization panel** lists every symptom entry: matched term + mode (exact / normalized / assist / unmatched) + matched-text span + the vocabulary version it matched against. Assist-mode entries carry "pending confirmation" and a confirm/correct control — P15: an assist match becomes canonical ONLY through his action (`resolveSymptomMatch`); correcting opens the vocabulary picker (never edits the patient's words — her text is immutable, the mapping is his).
4. Unmatched free text renders verbatim with a "map to vocabulary" affordance: he can map it (creating a mapping recorded on the submission — and optionally "add this phrase as a variant" which opens the vocabulary editor prefilled — LOOP-4-free: it is the existing `saveSymptomTerm` op, no new capability). `saveSymptomTerm` (from the mapping shortcut)
5. **Urgent flag**: any matched term whose vocabulary entry carries urgentAttention=true (clinic-configured) surfaces as a red-flag count in the queue row and a flag banner in the workspace, linking the exact answer spans. One click escalates: the flag action records actor + timestamp + note and routes to the clinic's declared escalation target (the nurse line — an in-console surface; no outbound paging at v1). `flagSubmission`
6. He marks the submission reviewed — the console requires zero pending confirmations first (the review gate mirrors the bilingual publish gate's discipline: state changes are earned, never defaulted). Note optional. `setSubmissionReviewState`
7. The provider package: he exports the intake record (bilingual PDF/CSV) or prints; the artifact lands in the exports surface with expiry + regeneration. `exportIntakePackage` · `getArtifact`
8. Queue hygiene: incomplete submissions age visibly; a resend decision re-opens a fill session for the same patient context (`openFillSession` with prefill from the stale draft's basics — names only, never clinical answers; P11 scoping honored).

**Edges**: a submission answered on an older form version (pinned version rendered, difference noted); two staff reviewing simultaneously (CONFLICT on review-state change, both states shown); an assist match the vocabulary has since deprecated (match pins the vocabulary version — 07a audit honesty); zero-symptom submissions (panel renders the honest empty — 11).
**Failures**: resolving an already-resolved match → CONFLICT with current state; export quota → RATE_LIMIT ladder with reset (P14); network mid-queue → banner + retry, review state safe (P20).
**Recovery**: every confirmation, flag, and review transition appends to the activity chain (P17); a submission can be un-reviewed only by an explicit, logged action (never silently).

## CP-4 — The symptom vocabulary (Nour's linguistic asset)

1. The vocabulary manager lists terms: canonical ar + en, variant count, urgent flag, status (active/deprecated), version. Normalized bilingual search (alef/hamza, taa marbuta, yaa forms, tashkeel-stripped — rtl-rules §4; ruleset disclosed in-panel per ai-native-patterns §7.4). `listSymptomTerms`
2. Term authoring: canonical pair (both locales required), variants list (colloquial/dialect tags optional — Gulf / Levantine / Egyptian / MSA-adjacent), body-system tag (organizing hint only — never used for inference), urgentAttention boolean (clinic-owned clinical policy), note for reviewers. `saveSymptomTerm` (baseVersion → CONFLICT on stale)
3. Bulk intake by paste: rows `canonical-ar | canonical-en | variants (؛-separated) | urgent (yes/no) | note` — a Job with row-count progress and named invalid rows; malformed rows are named, valid rows land (partial policy). `importVocabulary`
4. Editing a term that submissions have matched against: the edit re-versions the entry; existing matches keep the version they were computed against; the next normalization run uses the new version — the panel shows both when relevant (version pinning, 07a). `saveSymptomTerm`
5. Deprecating/deleting: deprecate is reversible (checks stop, history stays); delete is P04 level-2 naming the entry and its open-match count — open matches stay pinned to the deleted version and close only on re-normalization. `deleteSymptomTerm`
6. The deterministic rules are inspectable in-product: the normalization panel's "how matching works" discloses the exact pipeline (07c rule 1) — the non-negotiable transparency posture for a medical-adjacent matcher (ai-native-patterns §7.4).

**Edges**: two active canonical terms normalizing to the same string (VALIDATION on save naming both); a variant identical to another term's canonical (allowed with a warning chip — ambiguity surfaces at match time as multiple dictionary candidates ranked by exact-then-normalized — 07c rule 2); an urgent flag toggled while submissions are in flight (applies at next panel render — the count recomputes live, 07c rule 4).
**Failures**: import row without canonical pair → named invalid row; stale edit → CONFLICT both kept.
**Recovery**: terms are versioned; the vocabulary snapshots with the workspace (07c); every mutation logs (P17).

## CP-5 — Export, handoff, and the EHR boundary (the honest edge)

1. From any submission (or a bulk selection — P07 action bar naming the count), Tariq exports the intake package: bilingual intake record (PDF), structured answers (CSV), normalization annex (matched terms + modes + matched text). `exportIntakePackage` (Job with per-format progress; quota surfaced before running — P14)
2. The abstract **intake-delivery channel** (08 N2) can deliver files to a destination when bound; the DEFAULT is download — the manual path is first-class (LOOP-5). `getArtifact` (expiry stated, regenerable — deterministic from submission state)
3. The boundary renders honestly in-product: the export surface states what the product is NOT ("this is an intake record, not a chart entry; no system writes happen from here" — 11 copy names the LOOP-10 exclusion rather than hiding it).
4. Jobs console: exports and vocabulary imports with states, cancel/retry, link-to-context. `listJobs`
5. The audit chain: workspace activity — form publishes, submissions, confirmations, flags, reviews, exports — filterable and exportable as the accountability artifact (P17; the healthcare overlay's answer to "who touched this intake"). `listActivity`
6. Settings: workspace locale defaults, fill-token expiry window, retention policy (default 90 days post-resolution — owner-configurable, stated at attestation), capability consents in kind-not-vendor language. `getSession` · `updateWorkspace` · `getUsage` (metered-window posture — normalization calls are NOT metered; only export packages and vocabulary imports count against the generous window — P14)

**Edges**: export of a submission with pending confirmations (allowed — the annex marks them pending; the honest handoff names what is unconfirmed); artifact expired → NOT_FOUND with regenerate (submission state unchanged — deterministic regeneration); bulk export across mixed forms (per-format partial policy — async-contract §4).
**Failures**: export quota → RATE_LIMIT ladder; partial format failure → per-format retry; channel delivery failure when bound → typed error + download fallback offered inline (08 degradation map).
**Recovery**: artifacts regenerate identically from submission state; the queue reconciles after reconnect (async-contract §5).

## Non-happy paths

- **First-run** (no forms, no vocabulary): the forms library offers the sample form + sample vocabulary (P22 value checklist — the planted colloquial symptom and the red-flag escalation are the first-session proof). `createForm` on the sample or `listForms` empty state (11).
- **Normalization capability unbound** (the default v1 state): the deterministic dictionary carries the product — the 00 success signals run end-to-end with the capability off; assist suggestions simply never appear (08 degradation map row 1).
- **The kiosk-only clinic**: every flow above runs from printed QR + kiosk; links are a channel, never a requirement (LOOP-5 posture inverted: the manual channel is a first-class surface).
- **Offline patient** (bad connectivity at the door): the fill surface queues answers locally with per-question state and completes the submit on reconnect (P20; the draft state is authoritative until submit).
- **A patient who cannot complete intake digitally**: staff complete the form on the patient's behalf from the console (a staff-authored submission recorded with actor attribution — the honest paper alternative inside the product, 08).

## Failure → error mapping

VALIDATION (publish-gate bilingual completeness, required-field submission attempts, malformed vocabulary rows, fill-token creation sanity, resolve-without-target) · NOT_FOUND (expired fill tokens, stale submission/form/artifact links, expired artifacts) · PERMISSION (patient-token scope violations, reviewer-role builder writes, unconsented capability use, cross-workspace access) · CONFLICT (concurrent form edits, concurrent review-state changes, resolving already-resolved matches, stale term edits) · RATE_LIMIT (export packages, vocabulary imports) · NETWORK (list fetches, job polling, artifact delivery, patient autosave round-trips) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation exactly once; no orphans)

| Op | Flows |
|---|---|
| `getSession` | CP-1.9 (builder session), CP-3.1 (reviewer landing), CP-5.6 (settings context) |
| `listForms` | CP-1.1 (library first screen), non-happy first-run |
| `createForm` | CP-1.1, non-happy sample-form adoption |
| `getForm` | CP-1.3 (reload/inspector), CP-1.5 (preview), CP-1.7 (version history reads) |
| `saveForm` | CP-1.2, CP-1.7 (draft autosave + post-publish edit) |
| `publishForm` | CP-1.6, CP-1.7 |
| `archiveForm` | CP-1.8 |
| `duplicateForm` | CP-1.1 (duplicate starting structure) |
| `openFillSession` | CP-2.1 (link/QR/kiosk), CP-3.8 (resend for incomplete submission) |
| `resumeFillSession` | CP-2.2 (locale door + form summary), CP-2.6 (interruption return) |
| `saveDraftAnswers` | CP-2.3 (autosave on commit) |
| `submitIntake` | CP-2.8 (attested submit) |
| `normalizeSymptomText` | CP-2.4 (live dictionary chips), CP-2.5 (assist layer when bound) |
| `listSubmissions` | CP-3.1 (queue), CP-5.1 (bulk export selection source) |
| `getSubmission` | CP-3.2 (review workspace) |
| `resolveSymptomMatch` | CP-3.3 (confirm/correct assist + unmatched mapping) |
| `flagSubmission` | CP-3.5 (urgent escalation) |
| `setSubmissionReviewState` | CP-3.6 (reviewed gate), recovery (explicit un-review) |
| `exportIntakePackage` | CP-3.7 (provider package), CP-5.1 (bulk package) |
| `getArtifact` | CP-3.7, CP-5.2 (download/delivery + expiry) |
| `listSymptomTerms` | CP-1.3 (bound-vocabulary inspector preview), CP-4.1 (vocabulary manager) |
| `saveSymptomTerm` | CP-3.4 (variant shortcut from unmatched mapping), CP-4.2, CP-4.4 |
| `deleteSymptomTerm` | CP-4.5 |
| `importVocabulary` | CP-4.3 (termbase paste/import Job) |
| `listJobs` | CP-5.4 (jobs console), CP-4.3 (import progress) |
| `listActivity` | CP-5.5 (audit surface) |
| `getFormOverview` | S1 forms library counters (04) — submissions, completion rate, flagged, pending counts per form; the operational-counter ceiling (12 Q-6) |
| `updateWorkspace` | CP-5.6 (locale defaults, fill-token expiry, retention policy) |
| `getUsage` | CP-5.6 (export/import window posture) |

29 operations, 0 orphans (Critic-verified — every 07b operation listed exactly once above; check_coverage.py confirms). `getFormOverview` is the forms-library counter read (04 S1) — operational counters only, the funnel-explorer boundary holds (12 Q-6).
