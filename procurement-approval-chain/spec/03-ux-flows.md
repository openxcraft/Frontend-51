# 03 — UX Flows: procurement-approval-chain

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation — no orphans.

## CP-1 — Draft → quotes → routing preview → submit (the requester's value proof)

1. Amal opens Requests home and starts a request: bilingual title ("طباعة مطبوعات معرض الرياض" / "Riyadh expo print materials"), cost center (Marketing), category (Events), needed-by date, first bilingual line (description + qty + estimated unit price). `createDraftRequest` · `getSession`
2. She adds the remaining lines; totals compute live per line and at header (integer minor-unit arithmetic, 07c rule 1). Draft autosaves with revision base (P10); the routing preview rail updates as totals change. `updateRequest` · `previewRouting`
3. A vendor she uses is missing from the directory — she adds it inline with both names ("مطابع المدينة / Al-Madinah Printers"). `listVendors` · `saveVendor`
4. She enters quotes by hand from the vendor conversations: vendor, total, lead time, terms, validity; an optional document reference field sits beside the total (the abstract quote-document capability when bound — typed totals always suffice, LOOP-5). `addQuote` ×3
5. She fixes a typo in one quote's total and removes one duplicate entry. `updateQuote` · `removeQuote`
6. The comparison renders: lowest named ("الأفق — الأدنى"), each other quote's delta in amount and percent, lead times side by side. She selects the non-lowest quote (on-site service) — the surface requires a written justification before selection lands. `selectQuote`
7. The routing preview names the chain that will sign: "Band 5,001–50,000 → Department Manager → Finance Manager" with the rule that fired ("default matrix rule") and the budget projection ("Marketing envelope: 62,500 committed of 100,000; with this request 74,550 — within"). `previewRouting`
8. She submits. The adapter re-routes deterministically, re-checks budget, enforces the quote-count policy, and moves the request to in-review; step 1 becomes awaiting. `submitRequest`
9. The request detail surface confirms: code PR-1041, chain rail with step states, the recorded routing decision (rule id, band label, computed at timestamp). `getRequest`

**Edges**: a line with zero quantity or negative price → inline VALIDATION at field level, never at submit only; needed-by date in the past → advisory warning, not blocking; quotes in mixed entry order → comparison sorts deterministically (lowest first, ties broken by earliest receivedAt then vendorId — 07c rule 6); a single quote on a small request below the quotes-required threshold → allowed, recorded; the preview differs from the submit-time routing (draft edited in another tab) → the submit result is authoritative and the surface shows the recomputed chain with a "routing changed since preview" notice.
**Failures**: submit with a non-lowest selection and empty justification → VALIDATION naming the rule; submit above the quotes-required threshold with too few quotes → VALIDATION naming the count needed and the sole-source exception path; submit against a blocking envelope in over state → VALIDATION naming the envelope and the breach amount; a matrix position with no assignee → VALIDATION naming the position ("the chain cannot be resolved — position 'مدير الإدارة / Department Manager' has no assignee"); stale draft edit → CONFLICT with both payloads.
**Recovery**: drafts persist across sessions (P11 recalls prior values on re-entry); failed submits never destroy the draft; every gate names the field or policy that failed and the action that resolves it.

## CP-2 — The approver's decision loop (Reem's two-minute surface)

1. Reem opens Requests home on her phone; the My-Queue view lists requests awaiting her positions, oldest first, with totals and wait age. `listRequests` · `getSession`
2. She opens PR-1041: the document-paper surface — header (title, requester, cost center, needed-by), lines with arithmetic, quote comparison with the selected quote marked, budget projection with the envelope bar, the chain rail (her step active), and the decision bar. `getRequest`
3. She approves with a note ("within plan — proceed"). The step records her member id, position, and timestamp; the chain advances: step 2 (Finance Manager) becomes awaiting, and Amal sees the movement on her request without asking anyone. `decideStep`
4. Faisal opens the same request from his queue, reviews the same evidence plus the budget projection at his level, and approves through the final level: the request becomes **approved**, the commitment lands in the envelope (in-flight → committed), and the status seal stamps onto the document header (the signature moment, 05). `decideStep`
5. Noura, covering a delegation window for a travelling manager, approves a different request; the step records both the position and the delegate identity ("approved by Noura as delegate for Department Manager, window 28 Oct–11 Nov"). `decideStep`

**Edges**: an approver who is also the requester → the step is blocked from self-approval and routes to the next holder or the position's delegate (07c rule 4); a delegate acting while the holder is present → allowed, both identities recorded; a returned request re-entering the queue → carries the return note and a change marker; needed-by passed while in-review → an advisory "overdue" flag on the row, never a state change.
**Failures**: decide on a step not assigned to the session member or their delegation → PERMISSION naming the position; decide on an already-decided step (double-click/duplicate) → idempotency returns the original decision, not a duplicate; decide on a request whose chain was superseded (a resubmission created a new chain version) → CONFLICT naming the newer version.
**Recovery**: the queue re-fetches on focus; decisions are one-click with an undo window only for the note text (the decision itself is recorded policy — P03 does not apply to authority acts; correction is a new recorded decision, never a silent edit).

## CP-3 — Return → edit → resubmit; withdraw; cancel-approved (the revision and release loop)

1. Faisal opens a request whose quote selection is unjustified in his judgment; he **returns** it with a note ("get the third quote from the low bidder before we commit"). The active chain terminates as returned; the commitment releases; Amal receives the return state on her register row. `decideStep` · `listRequests`
2. Amal opens the returned request: the previous chain is preserved read-only beneath the edit surface (what was decided, by whom, why it came back). She edits the lines, adds the third quote, re-selects, and rewrites the justification. `getRequest` · `updateRequest` · `addQuote` · `selectQuote`
3. She resubmits: a **new chain version** computes (same rule, same band — or a different one if the total moved bands); the previous version stays in the request's history; approvers see "resubmitted — what changed" with the delta note she wrote. `resubmitRequest`
4. Alternatively, before any decision, she withdraws a request that is no longer needed; the chain terminates as withdrawn and the commitment releases. `withdrawRequest`
5. After full approval, the purchase is cancelled (event postponed): Faisal cancels the approved request with a reason; the status becomes cancelled-after-approval, the commitment releases from the envelope, and the release is activity-logged with both amounts. `cancelApprovedRequest` · `listBudgetEnvelopes`
6. Every mutation above appears in the activity log with actor, action, target, and detail. `listActivity`

**Edges**: resubmission after rejection (not return) → same loop, the rejection note carried; a returned request edited past a band boundary (total grew from 8,200 to 54,000) → the new chain version has more steps and the surface names the band change explicitly; withdrawal during an active decision race (approver clicks as requester withdraws) → first write wins, the other side sees CONFLICT with the newer state.
**Failures**: resubmit without resolving the named gate (still too few quotes) → VALIDATION again, gate named; cancel-approved on an already-cancelled request → CONFLICT; withdraw a decided request → VALIDATION naming its current state.
**Recovery**: chain versions are immutable history; a request never loses its decision trail on any edit; commitments are recomputed deterministically from live request states on every envelope read (never stored stale).

## CP-4 — Policy studio: matrix, policy pack, envelopes, org & delegation (Faisal's admin surface)

1. Faisal opens the Approval Matrix studio: rules listed by specificity (workspace default, per-cost-center, per-category), each with its bands and chains, the matrix version, and the policy pack (quotes-required threshold, minimum quote count, near-limit percentage, over-budget default). `getApprovalMatrix` · `getPolicyPack`
2. He edits the default rule's bands (5,000 / 50,000 boundaries) and saves; band validation fires inline (ascending, non-overlapping, terminal band unbounded — a gap or overlap is named at save, 07c rule 2). `saveApprovalRule`
3. He adds a scoped rule for the Facilities cost center (≤10,000 → Department Manager only) and later removes an obsolete category rule. `saveApprovalRule` · `removeApprovalRule`
4. He sets the policy pack: quotes required above 25,000, minimum 3 quotes, near-limit at 80%, over-budget advisory at workspace default. `savePolicyPack`
5. He opens Budgets and authors the period's envelopes (cost center × category × fiscal period, allocated amount, over-budget behavior — advisory or blocking per envelope). The commitment bar shows committed (in-flight + approved) against allocation as he saves. `listBudgetEnvelopes` · `saveBudgetEnvelope`
6. He opens Org & Delegation: positions with their levels and assigned members; he assigns a member to the Finance Manager position; he sets Reem's two-week delegation to Noura with a window and note; later he clears it. `listPositions` · `savePosition` · `setDelegation` · `clearDelegation`
7. He maintains reference data: cost centers and the vendor directory (bilingual names, notes). `listCostCenters` · `saveCostCenter` · `listVendors` · `saveVendor`

**Edges**: saving a rule that duplicates an existing scope exactly → VALIDATION naming both rules (ambiguity refused at authoring, never at routing); bands that leave a gap above the highest finite band without an unbounded terminal → VALIDATION naming the gap; deleting a rule while requests are in-flight under it → in-flight chains complete under their pinned rule version; new submissions use the new matrix version (07a state obligation).
**Failures**: envelope allocation edits with a stale base version → CONFLICT with both payloads; delegation window with end before start → VALIDATION; delegation to a member with no position → VALIDATION naming the requirement (a delegate must be a workspace member).
**Recovery**: the matrix and policy pack are versioned; every save appends to the activity log; envelopes recompute commitments from request states, so no migration is needed after edits.

## CP-5 — Register, activity, exports, jobs (the accountability surface)

1. Requests home: the register with filters (status, cost center, requester, band, overdue) + saved views (P08); rows carry code, bilingual title at its own direction, total, status seal, current step, wait age. `listRequests`
2. Amal drills into any request she can see; no-access rows never render as "empty" (P01 no-access state). `getRequest`
3. The activity log: filterable by actor, action, and target; every consequential mutation present (P17). `listActivity`
4. Faisal exports one approved request's approval package (request + quotes + comparison + budget evidence + chain + activity appendix) for the auditor. `exportRequestPackage`
5. He exports the audit register (matrix versions, policy pack versions, envelope states, activity appendix) at period close. `exportAuditRegister`
6. Both exports are Jobs with declared artifact expiry; he retrieves the artifact link before the window closes. `listJobs` · `getArtifact`

**Edges**: filtered-empty declares itself (P01); >200 register rows virtualize (P19); an expired artifact → NOT_FOUND with a regeneration path (the request state is unchanged); offline → reads work, queued writes with per-item state (P20).
**Failures**: NETWORK mid-list → banner + retry; export partial failure → per-format retry (async-contract §4); artifact expired → NOT_FOUND + renew.
**Recovery**: all list surfaces cursor-paginated and re-fetchable; exports re-generate from live state; nothing is ever lost to an export failure.

## Non-happy paths

- **Every abstract capability unbound (LOOP-5 bar, the 00 success signal)**: quotes typed by hand (no quote-document capability), review and decision in-product (no notification channel needed for the loop), export downloaded and carried by hand (no finance document channel), members typed into positions (no directory sync). The full loop completes.
- **First-run**: Requests home offers a sample request with quotes, chain, and budget pre-loaded so the routing-preview moment is experienceable before real policy exists (P22); one action clears it forever.
- **No envelope for the cost center**: submission proceeds with a recorded advisory finding ("no envelope mapped for Marketing × Events in FY2026") — the discipline degrades honestly, never blocks silently.
- **Approver absence**: a position with no assignee and no delegation → submission refuses with the named position (better honest refusal than a chain that waits forever); with a delegation window covering the clock, the delegate decides and the record shows both.
- **Offline**: drafts queue locally; decisions require connection (authority acts are never queued blind — declared deviation from P20's optimistic writes, recorded here and in 09).

## Failure → error mapping

VALIDATION (band gaps/overlaps at matrix save, quote-count gate, non-lowest justification gate, blocking budget breach, unroutable position, self-approval attempt, malformed lines, delegation window) · NOT_FOUND (stale request/step/artifact links, expired artifacts) · PERMISSION (deciding a step not yours, no-access register rows, viewer-role mutations) · CONFLICT (concurrent draft edits, superseded chain versions, stale envelope base versions, decide/withdraw races) · RATE_LIMIT (defensive: export bursts) · NETWORK (list fetches, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-1.1, CP-2.1 (role/queue) | `getApprovalMatrix` | CP-4.1 |
| `createDraftRequest` | CP-1.1 | `saveApprovalRule` | CP-4.2/3 |
| `updateRequest` | CP-1.2, CP-3.2 | `removeApprovalRule` | CP-4.3 |
| `addQuote` | CP-1.4, CP-3.2 | `getPolicyPack` | CP-4.1 |
| `updateQuote` | CP-1.5 | `savePolicyPack` | CP-4.4 |
| `removeQuote` | CP-1.5 | `listBudgetEnvelopes` | CP-4.5, CP-3.5 |
| `selectQuote` | CP-1.6, CP-3.2 | `saveBudgetEnvelope` | CP-4.5 |
| `previewRouting` | CP-1.2/7 (the preview rail) | `listPositions` | CP-4.6 |
| `submitRequest` | CP-1.8 | `savePosition` | CP-4.6 |
| `listRequests` | CP-2.1, CP-3.1, CP-5.1 | `setDelegation` | CP-4.6 |
| `getRequest` | CP-1.9, CP-2.2, CP-3.2, CP-5.2 | `clearDelegation` | CP-4.6 |
| `decideStep` | CP-2.3/4/5, CP-3.1 | `listCostCenters` | CP-4.7 |
| `resubmitRequest` | CP-3.3 | `saveCostCenter` | CP-4.7 |
| `withdrawRequest` | CP-3.4 | `listVendors` | CP-1.3, CP-4.7 |
| `cancelApprovedRequest` | CP-3.5 | `saveVendor` | CP-1.3, CP-4.7 |
| `listActivity` | CP-3.6, CP-5.3 | `exportRequestPackage` | CP-5.4 |
| `exportAuditRegister` | CP-5.5 | `listJobs` | CP-5.6 |
| `getArtifact` | CP-5.6 | | |

35 operations, 0 orphans (Critic-verified).
