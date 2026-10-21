# 03 — UX Flows: contract-lifecycle-manager

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation exactly once — no orphans, no phantoms.

## CP-1 — Contract intake → bilingual metadata → vault record (value proof)

1. Omar opens the intake wizard from the vault home ("New contract"). Step 1 identifies the counterparty: search the directory (Arabic-normalized — rtl-rules §4: alef variants, taa marbouta, yaa forms) or create one with bilingual legal names and registry identifiers. `listCounterparties` · `createCounterparty`
2. Step 2 captures identity metadata: internal title EN + AR (either side alone is valid; both render in the detail panel per-side direction), contract type (MSA / SOW / lease / supply / NDA / other), value + currency, owner, language(s) of the document. `createContract`
3. Step 3 uploads the document (PDF/image class bytes abstracted by the adapter; the wizard names size and page count). Upload lands as the contract's primary document version. `uploadDocument`
4. Optional step 4 (the assist, consent-gated): run extraction on the uploaded document. A Job per async-contract (page-count progress, cancellable); suggestions arrive as drafts — metadata fields (dates, value, notice window, auto-renew) and proposed obligations, each with confidence and a document anchor. `runExtraction` · `listSuggestions`
5. Omar reviews the suggestion panel: accept (creates the real field value / obligation), edit-then-accept, or dismiss — including the planted low-confidence false positive, which the review discipline exists to catch (P15 trust checkpoint). `resolveSuggestion`
6. The wizard closes into the contract detail surface: bilingual metadata panel, document version, obligation ledger (however many exist — zero is valid), and the derived reminder schedule already computed. `getContract` · `listReminders`
7. Layla reads the vault home: the new record sits in the register with its status seal and urgency chips. `listContracts`

**Edges**: document in Arabic with English annex (language field records both; bilingual fields authored per side); a metadata field the assist filled that Omar overrides (suggestion provenance retained on the field — "assist-proposed, human-edited"); contract with no termination date (open-ended — no expiry derivation, renewal obligations still schedulable); value in a third currency (free-text currency code, Western numerals).
**Failures**: malformed metadata (VALIDATION with the named field and rule); upload too large / unreadable (VALIDATION naming the limit); assist unconsented (PERMISSION naming the capability class, with the manual path offered in the same surface); assist quota exhausted (RATE_LIMIT ladder, manual path unaffected); assist Job fails mid-run (partial suggestions delivered and marked, per-item retry — async-contract §4).
**Recovery**: the contract record persists with whatever metadata was saved; extraction is re-runnable on the same document version; nothing is lost to an assist failure (the record never depended on it).

## CP-2 — Obligation capture → derived reminders → completion (the daily loop)

1. Nadia adds an obligation by hand on a contract: direction (we-owe / they-owe), plain bilingual summary, kind (renewal-notice / expiry / payment / deliverable / report / certificate / other), due date or recurrence (e.g. quarterly payment), owner, lead-time override. `createObligation`
2. The derived reminder schedule recomputes instantly: reminder entries at D−30 and D−7 (workspace defaults, overridable), the due date itself, then daily overdue entries — deterministic from obligation state + workspace defaults + the seeded clock (07c formulas). `listReminders` · `getWorkspace`
3. The obligations console shows urgency zones: overdue (due date passed), imminent (≤7 days), approaching (≤30 days), later — as icon+text chips, never color alone. `listObligations`
4. An owner completes an obligation with evidence (date, note, optional document reference). The ledger row settles to completed; the zone clears; the activity log records actor-action-target-timestamp. `completeObligation` · `listActivity`
5. Nadia edits an obligation's dates or owner (ownership handover when a department changes). Stale baseRevision → CONFLICT with both payloads. `updateObligation`
6. Workspace defaults adjusted once, globally: first lead 30 → 45 days for certificate kinds, etc. `updateWorkspace`

**Edges**: recurring obligation (next occurrence computed from the last completion — deterministic next-due rule in 07c); acknowledged-not-completed state (owner confirms awareness; reminder continues, zone unchanged); obligation on a terminated contract (auto-closed with the termination — never silently dropped, logged); no-access viewer completing (PERMISSION — completion is an editor action).
**Failures**: VALIDATION (due date before the contract's effective date — warned, allowed with the warning recorded); CONFLICT (concurrent edit); NETWORK (queue + retry per P20).
**Recovery**: completions are append-only events; edits are versioned; the schedule always recomputes from current state.

## CP-3 — Renewal window defense → renewal or termination (the money path)

1. The vault home digest surfaces a contract whose derived renewal-notice deadline (termination date − notice window) is now within the decision window: "notice by 12 Dec or it renews to 31 Dec". `listContracts` (derived fields)
2. Layla opens the contract detail: the renewal window bar shows termination date, notice window days, the computed notice deadline, and days remaining (from the seeded clock — deterministic arithmetic, 07c). `getContract`
3. The team decides: (a) record the renewal term — new termination date + note, term history appended; obligations carry forward; or (b) begin termination. `recordRenewalTerm` · `markTerminated`
4. If terminating: effective date + reason are recorded; status becomes terminated; open obligations auto-close with the termination event listed per obligation (never silently dropped). `markTerminated`
5. Every step appends to the activity log with actor and timestamp — the auditor's thread for this contract. `listActivity`
6. Nadia exports the obligations schedule for the quarter as the follow-up artifact. `exportRegister` · `getExportArtifact`

**Edges**: auto-renew flag off (window bar shows expiry instead — different copy, same arithmetic); contract in active status past its termination date (derived "expired" chip — honest display state, not a stored mutation); missed window already (copy states the consequence plainly per [23][24] posture — no blame language); notice window larger than the remaining term (VALIDATION at metadata save time).
**Failures**: VALIDATION (new termination date before current effective date); CONFLICT (concurrent edit on the contract record); RATE_LIMIT (export quota).
**Recovery**: term history is append-only and exportable; a wrongly recorded renewal is corrected by a new term record referencing the erroneous one (correction grammar per asset-register-tracker's house precedent — never editing history).

## CP-4 — Review workflow → execution record → activation

1. A draft contract record (created via CP-1 on a request) is submitted for legal review with an assignee and a note. `requestReview`
2. The assignee records a decision: approve (proceed to execution) or return (with comments — status back to draft). `recordReviewDecision`
3. Approved-for-execution: the contract moves to awaiting-execution. Sending for signature happens through the abstract execution channel when bound (08 N2), or manually — download the document, arrange signature outside the product entirely (the LOOP-10 boundary), upload the executed copy as a new document version. `getDocumentArtifact` · `uploadDocument`
4. Execution is recorded: execution date + channel note (abstract-channel delivery when bound; manual record otherwise). This is an attestation-shaped confirmation: focus walks the metadata confirmation in order, the timestamp is announced with the action (a11y-baseline §7). `recordExecution`
5. The contract becomes active with the "Seal Settles" moment (05 signature interaction — the one stately success treatment): the status seal settles, the four core metadata fields stagger-beneath (≤60ms stagger), and a polite announcement carries the same facts.
6. Active contracts unlock their obligation ledger's reminder schedule; the activity log now carries the full intake → review → execution thread. `listReminders` · `listActivity`

**Edges**: counter-signature pending (awaiting-execution persists until the executed copy is recorded — no timeout auto-activation); document replaced after review approval (review track shows the new version, status returns to draft — honest re-review); multi-step review (second reviewer requested before execution — review track lists steps in order). 
**Failures**: VALIDATION (execution date before review approval); PERMISSION (viewer attempting recordExecution — editor-only actions); NOT_FOUND (stale contract/document link).
**Recovery**: the review track is append-only; returned contracts re-enter review without losing history; execution records are never edited — corrections append a referencing event.

## CP-5 — Register reading, audit, and administration (the accountability surface)

1. Layla filters the vault: by status, counterparty, owner, type, urgency zone, tag; saved views (P08) for "my renewals this quarter" and "auditor's slice". `listContracts`
2. Faisal (viewer) opens his scoped view of the register and a contract's detail; he can complete obligations he owns but cannot mutate contract metadata. `getSession` · `getContract`
3. Audit surface: the activity log — filterable by actor, action class, target, date range; keyboard-navigable; exportable as the accountability artifact (a11y-baseline §7 obligation). `listActivity`
4. Register export for the audit conversation: contracts scope, obligations scope, or activity scope; a Job with expiry + regeneration per async-contract. `exportRegister` · `getExportArtifact` · `listJobs`
5. Counterparty hygiene: merge-safe edits, registry identifiers updated from the trade license by hand (the party-registry capability is optional — 08 N4). `listCounterparties` · `updateCounterparty`
6. Settings: workspace defaults (reminder lead times), locale flip (workspace re-renders; data untouched — display is formatting), consent state for the extraction capability (kind, not vendor — credential-contract §2). `getWorkspace` · `updateWorkspace` · `getSession`
7. Usage meter visible before/after assist runs (P14). `getUsage`

**Edges**: filtered-empty declares itself (P01); >200 register rows virtualize (P19); no-access contracts → PERMISSION surface, never "empty"; archived contracts excluded from default views but exportable on request (archive is reversible-by-view, not deletion — Q-6).
**Failures**: NETWORK (banner + queued writes, P20); RATE_LIMIT (export/assist metering); UNKNOWN (typed retry with correlationId).
**Recovery**: all list surfaces cursor-paginated and re-fetchable; jobs reconcile to authoritative state on reconnect.

## Non-happy paths

- **Extraction assist unavailable** (unbound, unconsented, exhausted, or failed — rung 4, 08 map): the intake wizard skips step 4 with a one-line notice; the hand-entry checklist (the [19] top-ten-field discipline) IS the form; reminders, workflow, and audit are fully unaffected — the 00 success signal tests exactly this configuration.
- **First-run**: vault home offers a sample contract (bilingual metadata, one obligation due soon, one overdue) so the reminder schedule is experienceable before real work is loaded (P22 value checklist).
- **Viewer-only session**: register + detail + own-obligation completion work; every mutation surface degrades to read + request-change (PERMISSION copy names the role, not a dead end).
- **Offline**: reads work; obligation completions and metadata edits queue with per-item state (P20); jobs reconcile on return.

## Failure → error mapping

VALIDATION (metadata rules, upload limits, date logic, review-gate violations) · NOT_FOUND (stale contract/document/obligation/artifact/counterparty links) · PERMISSION (viewer-role mutations, capability consent, workspace scoping) · CONFLICT (concurrent contract/obligation/counterparty edits) · RATE_LIMIT (assist runs, exports) · NETWORK (list fetches, job polling, export delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-5.2/6, entry (role/locale) | `listObligations` | CP-2.3 |
| `getWorkspace` | CP-2.2, CP-5.6 | `getObligation` | CP-2 (detail-with-history view) |
| `updateWorkspace` | CP-2.6, CP-5.6 | `createObligation` | CP-2.1 |
| `listContracts` | CP-1.7, CP-3.1, CP-5.1 | `updateObligation` | CP-2.5 |
| `getContract` | CP-1.6, CP-3.2, CP-5.2 | `completeObligation` | CP-2.4 |
| `createContract` | CP-1.2 | `runExtraction` | CP-1.4 |
| `updateContract` | CP-3 metadata edits (title/owner/tag corrections) | `listSuggestions` | CP-1.4/5 |
| `uploadDocument` | CP-1.3, CP-4.3 | `resolveSuggestion` | CP-1.5 |
| `getDocumentArtifact` | CP-4.3, CP-5 document reads | `listReminders` | CP-1.6, CP-2.2, CP-4.6 |
| `requestReview` | CP-4.1 | `listActivity` | CP-2.4, CP-3.5, CP-4.6, CP-5.3 |
| `recordReviewDecision` | CP-4.2 | `exportRegister` | CP-3.6, CP-5.4 |
| `recordExecution` | CP-4.4 | `getExportArtifact` | CP-3.6, CP-5.4 |
| `recordRenewalTerm` | CP-3.3a | `listJobs` | CP-5.4 |
| `markTerminated` | CP-3.3b/4 | `getUsage` | CP-5.7 |
| `archiveContract` | CP-5.2 (viewer-safe archive action on owned contracts — editor-only) | `listCounterparties` | CP-1.1, CP-5.5 |
| `createCounterparty` | CP-1.1 | `updateCounterparty` | CP-5.5 |

32 operations, 0 orphans, 0 phantoms (Critic-verified; scripted check passes).
