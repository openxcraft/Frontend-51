# 03 — UX Flows: expense-claim-flow

SME-C pass · 5 critical paths, numbered steps incl. edges/failures/recovery. Coverage table at the end traces every 07b operation exactly once — no orphans. Terminology per 02: claim · claim item · receipt · per-diem · mileage · rate table · policy pack · policy finding · approval chain · payout.

## CP-1 — Create a claim, add a computed mileage item and a manual receipt item (value proof)

1. Huda opens claims home; the header shows her open draft claim (P11 recall — one draft is pre-created per member by workspace policy, or she starts one). She opens the composer: claim header (title, purpose, trip dates if the claim is a trip claim) on the raised surface, the item rail center, live totals on the inline-end edge with the computation breakdown area reserved (zero-reflow rule, 10). `getSession` · `listClaims` · `createClaim`
2. She adds a **mileage item**: date, from/to (free text — no routing, no travel booking, LOOP-10), distance 142 km, vehicle class "own car". Before she commits, the **computation preview** renders against the rate table effective on the item's date: rate SAR 1.10/km × 142 km = SAR 156.20, with the rate-table name, version, and effectiveFrom cited — the same preview re-renders live if she edits the distance (deterministic arithmetic, 07c rules; keystroke budget 10). `previewItemComputation` · `addClaimItem`
3. She adds a **receipt item** the manual way (OCR unbound or skipped — the always-available path): date, vendor typed in either script ("مؤسسة النور للتجهيزات" renders RTL, bidi-isolated in the field per rtl-rules §2), amount SAR 240.00, tax SAR 36.00 (15% — the ZATCA-class receipt reality, 01), receipt number, and attaches the photographed receipt (paste or file). Item lands in the rail with its amount; the receipt-required indicator is satisfied. `addClaimItem` · `attachReceipt`
4. She adds a **per-diem item**: destination tier "Dubai — regional travel", 4 days, first-day proration flagged. The breakdown renders: 3 full days × SAR 500.00 + 1 day × 75% (SAR 375.00) = SAR 1,875.00, tier and proration rule cited (the 75% first/last-day convention as a policy-pack setting, labeled a convention, never a legal claim — 01 honest gap). `previewItemComputation` · `addClaimItem`
5. Live totals update in the reserved rail: items count, computed subtotal, per-kind split (receipts / per-diem / mileage). Policy-pack badge shows which pack the claim pins (version read at submission for findings, at item-add for previews — 07a pinning).
6. Edits: she reopens the mileage item, fixes the distance to 138 km — preview recomputes; commit updates the item (baseRevision guard). She removes a mistyped item — undo window 6s (P03), removal of an item with an attached receipt keeps the receipt asset in the claim's receipt bin (nothing silently deleted). `updateClaimItem` · `removeClaimItem`

**Edges**: item dated outside the claim's trip window (advisory at findings time, not entry-blocking — the date field warns inline); distance below the rate table's minimum claimable distance if the pack sets one (advisory); per-diem days count exceeding the trip window by >1 day (VALIDATION naming both ranges); rate table with no row effective on the item's date (the preview states it plainly and offers the nearest effective table — never silently falls back); duplicate receipt number typed within the same claim (live advisory chip — the blocking finding computes at check time, 07c).
**Failures**: malformed amount (VALIDATION field-linked — "Enter an amount like 240.00"); attach of an unreadable file (VALIDATION naming the accepted kinds); NETWORK mid-save (P20 offline queue — the composer keeps working, writes queue with per-item state).
**Recovery**: drafts persist across sessions (P11); every item edit is versioned; the receipt bin keeps attachments claim-scoped until removal is confirmed past the undo window.

## CP-2 — Receipt capture with OCR assist: propose, confirm field-by-field (the conditionally-AI path)

1. Huda photographs the Arabic receipt (or pastes/uploads it). The receipt review panel opens: the image preview at its natural direction (RTL receipt renders right-to-left; Latin receipt left-to-right — never force-flipped, rtl-rules §2), and the **extraction draft region** below it, reserved to full size before the run starts (CLS budget, 10). `attachReceipt`
2. She runs the assist (one tap; metered — remaining-extraction count shown before the run per P14; quota at 80% warns first). The draft streams in field by field: vendor, date, amount, tax, receipt number — each with a **confidence band** (high / medium / low) and, on focus, the region of the receipt the value came from. `extractReceiptDraft`
3. She confirms the fields: high-confidence fields render as suggested values awaiting one-tap confirm; medium and low fields render with the confidence badge and always require explicit confirmation or correction; any field she edits keeps the edited value with the draft's original preserved for the audit trail. Arabic-numeral amounts on the receipt (٠١٢٣…) are shown converted to Western display per the numerals rule while the raw string is preserved in the draft record. `applyReceiptDraft` (per-field confirm-gated commit — P15: the promote-to-authoritative step)
4. The applied fields create/complete the receipt item in the composer; the draft region closes; the item's amount is her confirmed number, never the machine's alone.
5. **Manual path (the same surface)**: with the assist off, unbound, quota-limited, or failed, the draft region renders the manual entry form — identical fields, identical order — and she types the values from the image herself. No capability wall, ever (LOOP-5; degradation map 08).

**Edges**: draft returns a low-confidence amount on a crumpled receipt (the low band is not an error — it is the honest state; she confirms or types); the vendor name extracted in Arabic while her claim header is English (both scripts are first-class data — nameEn/nameAr sibling fields on vendors are entered, never transliterated); draft fields arriving empty for tax (many receipts carry none — field optional per policy pack's tax-required setting); a re-run of extraction on the same receipt (idempotent per receipt — returns the same draft, never double-metered); extraction on an English receipt in the ar-primary workspace (direction follows content, not chrome).
**Failures**: assist capability unbound → the manual form is the default posture, rendered without an error (this is the designed state, not a failure — 08); assist run fails mid-stream → the draft region keeps the partial fields, marks them partial, offers retry or manual (ai-native-patterns §2 stall/failure discipline); RATE_LIMIT on the metered window → the ladder notice with reset time and the manual path offered inline (ai-native-patterns §5 — the product stays fully useful); VALIDATION on attach of an oversized image.
**Recovery**: drafts never auto-apply; a discarded draft leaves the receipt attached and the manual form ready; the metered count only decrements on completed runs.

## CP-3 — Submit, route, decide: the approval chain with the findings gate

1. Huda submits. The submission runs the deterministic **policy check** (07c rules) and computes the **approval route** from the policy pack's matrix against the claim total. Empty claim → VALIDATION naming the count. The claim state moves draft → submitted; the chain renders as steps with the current level active. `submitClaim` (internally: policy-check computation, 07c rule 7)
2. The route: matrix entries whose threshold covers the claim total, ordered ascending — e.g. SAR 2,500 → Salem (level 1), SAR 10,000 → Faisal (level 2). Every step shows approver name (bilingual), status, and decided-at. Salem gets the queue entry; Huda sees "with Salem — level 1 of 2" on her claim card (the chain is never a black box — digest q8's pain).
3. Salem opens the approval workspace: item table (kind, date, description, computation/amount, receipt state), findings rail (blocking first, then advisories), totals, the approval-chain header. He reviews a per-diem item's breakdown — it cites the tier, days, proration, and table version; he can open the rate table read-only from the citation (inspectability is the trust mechanism, 00). `getClaim` · `listPolicyFindings`
4. **The gate**: a claim with unresolved blocking findings refuses approval — the refusal names the blockers with links (missing receipt on item 4; duplicate receipt number with item 2). Salem does not have to be the one to fix them: Huda attaches the missing receipt from her phone (the claim returns to *queried-attention* state only if he queries; attaching does not unsubmit — the findings recompute live), or he rejects with a reason, or he queries back. `decideClaim` (gate refusal = VALIDATION with named blockers, 07b rule 4)
5. Findings resolve the honest ways: **edit-resolved** (the item changes and the rule now passes — recomputed, never hand-closed), **false-positive** (recorded with the rule's input values), **override with reason** (advisory findings and, where the pack permits, blocking ones — always logged, always exported). `resolvePolicyFinding` · `attachReceipt` · `updateClaimItem`
6. Approve advances the chain (level 1 → level 2); Faisal approves at level 2 → claim state approved. Reject (any level) returns the claim rejected with reasons — Huda edits and resubmits (rejected → draft on her edit, history kept). Query opens a query thread to the claimant; her answer appends; the approver re-decides. `decideClaim` · `updateClaim` (post-reject edit) · `submitClaim` (resubmit)
7. Delegation: Salem is traveling — he reassigns his pending step to the deputy with a note; provenance is recorded on the step (delegated-from, delegated-to, at). `reassignApprovalStep`
8. Withdrawal: before any step approves, Huda can withdraw the claim to draft (she noticed a wrong amount); after a first approval, withdrawal is refused (the chain has begun — she asks Salem to reject or waits; the refusal is honest, not a silent block). `withdrawClaim`

**Edges**: claim total moves across a threshold boundary after an item edit pre-submission (route recomputes — shown live in the composer's totals rail); approver is the claimant (self-approval guard: the step is reassigned to the next level automatically — VALIDATION if no other approver exists); duplicate receipt number across *another member's* claim (cross-claim advisory listing the sibling claim — finance resolves, CP-3 step 5 rules); late submission advisory (last item date → submittedAt gap exceeds the pack's window — advisory by default, pack can escalate to blocking, 12 Q-8); per-diem double-dip (a meals receipt item dated inside a per-diem-covered window — advisory naming both items).
**Failures**: decide on a claim already decided at this level by another seat → CONFLICT with current state shown; findings computed against an older pack version (claims pin the pack version at submission — findings always name the version; a pack edit never retro-mutates, 07a); NETWORK on queue fetch → banner + retry, decisions safe (P20).
**Recovery**: every decision, resolution, override, delegation, and withdrawal is versioned and logged (P17); a rejected claim's fix-resubmit cycle retains the full history; the chain reconciles after reconnect to authoritative step state (async-contract §5).

## CP-4 — Policy studio: author the rate table and the policy pack (Faisal's control path)

1. Faisal opens the policy studio: **rate tables** list (name, currency, effective range, version, entry counts) and **policy packs** (the binding of a rate table + thresholds + matrix). `listRateTables` · `listPolicyPacks`
2. He authors the 2026-07 rate table: per-diem tiers (Riyadh — domestic 400.00; Dubai — regional 500.00; Europe — international 950.00 — example fixtures, labeled, 07c), mileage rates (own car 1.10/km; motorcycle 0.55/km; rental excluded → receipts), first/last-day proration 75%, effectiveFrom 2026-07-01, source note "2026 travel policy memo v3 — verify against current policy". Saving validates: overlapping effective ranges for the same tier name → VALIDATION naming both tables; a tier amount of zero → VALIDATION. Versioning: a saved table bumps version; claims computed earlier keep their pins. `saveRateTable` · `getRateTable`
3. He edits the **policy pack**: approval matrix rows (up to SAR 2,500 → Commercial Head; up to SAR 10,000 → Finance Manager; up to SAR 50,000 → CFO), receipt-required-above SAR 75.00, submission window 45 days, late-submission severity advisory, tax-required on receipt items. The matrix editor previews the route for a sample amount as he types (the same routing rule as 07c — one engine, two surfaces). `savePolicyPack` · `previewItemComputation` (per-diem/mileage preview against the draft table)
4. Member directory check: approver rows reference members by id; the directory lists bilingual names and roles so the matrix never points at a stale email. `listMembers`
5. Pack activation: the workspace's active pack switches; claims already submitted keep their pinned pack version; new claims pin the new one. The activation is logged with actor and diff summary (P17).

**Edges**: a pack whose matrix rows are out of order or share a threshold (VALIDATION naming both rows); a matrix row with no approvers (VALIDATION); a claim total above the highest row's threshold (submission refuses — "SAR 12,000 exceeds the matrix's highest authority, SAR 10,000 — finance must add a top row"; the studio's route preview renders the same refusal before it can happen); a rate table in a different currency than the workspace (VALIDATION — single-currency v1, 12 Q-5); effectiveFrom in the past (allowed — backdated claims compute against the then-effective table, the dated-data rule); deleting a table referenced by a pack (refused — VALIDATION naming the pack).
**Failures**: stale baseVersion on concurrent edits → CONFLICT with both payloads; PERMISSION for non-admin members on all studio writes (07b rule 5).
**Recovery**: tables and packs are versioned; a bad activation reverts by activating the prior version (logged); nothing a claimant does ever mutates policy data.

## CP-5 — Payout recording, export, and the audit handoff (Amal's close)

1. Amal opens the payouts view: approved claims queue, oldest first, each with total, chain-complete badge, and blocking-findings-zero state (approval implies the gate passed). `listClaims` (finance queue, status approved)
2. She records the payout: method (bank transfer / cash / payroll-adjustment — workspace-configured list), reference (transfer number), date, and the amount as actually paid. The payout record appends with her actor stamp; claim state moves approved → paid. The **signature moment** lands here — "The Reimbursement Stamp" (05): the claim summary card lifts once and the paid seal stamps in with the single controlled overshoot, amount and method announced politely. `recordPayout`
3. Correction edge: she mistyped the reference — a payout correction appends a superseding record with a reason; records never rewrite (07a obligation).
4. Export the evidence pack: per claim or per period (month/quarter) — claim ledger (items with computation breakdowns), receipts manifest, findings + resolutions (every override reason), approval trail (steps, decisions, delegations), payout records. A Job with expiry + regeneration per async-contract; quota shown before running (P14). Manual handoff is the default: download; the abstract "finance document channel" delivers when bound (08 N2). `exportClaimPackage` · `getArtifact`
5. Jobs console: exports and any long runs, filterable, cancel/retry, link-to-context (async-contract §7). Usage window visible (extractions, exports) with the metered ladder state (P14). `listJobs` · `getUsage`

**Edges**: exporting a claim whose payout record was corrected after a previous export (the package carries both records with reasons — honesty at handoff); export of a rejected-and-resubmitted claim (the full history ships: rejection reasons are evidence too); artifact expired → NOT_FOUND with regenerate (state unchanged — regeneration is deterministic).
**Failures**: export quota → RATE_LIMIT ladder with reset time; per-format failure mid-package → partial delivery with per-format retry (async-contract §4); NETWORK during delivery → retry, artifact held.
**Recovery**: payout records and exports are append-only; packages regenerate from claim state at any time; the jobs console reconciles after reconnect.

## Non-happy paths

- **OCR assist unbound** (the default v1 state, LOOP-5): CP-2's manual form is the primary posture; the assist renders as an optional affordance with its consent surface, never a wall (08 N1). The 00 success signals pass with the capability unbound.
- **No policy pack yet** (first-run): the workspace seeds with the sample pack + sample rate table (clearable, flagged `sample: true`); claims compute against the sample and carry its badge; the studio's first-run empty teaches the two-object model (rate table = numbers, policy pack = rules + matrix) — P22 value checklist; the parity moment is *submitting the sample claim and watching the gate refuse on the planted missing receipt* (11).
- **Offline**: composer and capture keep working; item writes queue with per-item state and baseRevision anchors; extraction requires the capability (queued items surface the manual form while offline); submission and decisions queue and reconcile (P20).
- **Rejected → fix → resubmit**: the rejected claim reopens to draft on the claimant's edit with rejection reasons rendered at the item level where applicable; resubmission re-pins the current pack version and recomputes findings (the earlier pins and findings stay in history).
- **Late submission**: the advisory states the gap ("Last item 12 Feb; submitted 4 Apr — 51 days, window is 45"); if the pack escalates to blocking, the gate names it like any other blocker.

## Failure → error mapping

VALIDATION (empty submission, malformed amounts/dates, matrix gaps, overlapping effective ranges, payout correction without reason, gate refusal with named blockers, self-approval dead-end) · NOT_FOUND (stale claim/item/receipt/artifact links, expired artifacts) · PERMISSION (studio writes by non-admins, payout recording by non-finance roles, cross-member draft access, consent-gated assist) · CONFLICT (concurrent item edits, concurrent claim-header edits, decide/reassign on already-decided steps, payout double-record without correction semantics, stale table/pack baseVersion) · RATE_LIMIT (OCR extraction window, export packages) · NETWORK (queue fetches, artifact delivery, job polling) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows |
|---|---|
| `getSession` | CP-1.1, CP-5.5 |
| `listClaims` | CP-1.1 (my drafts), CP-3.2 (approver queue), CP-5.1 (approved payouts queue) |
| `getClaim` | CP-3.3 (approval workspace), CP-3.4 (gate state), CP-1.1 (composer boot) |
| `createClaim` | CP-1.1 |
| `updateClaim` | CP-3.6 (post-reject header edit), CP-1.6 (draft header edits) |
| `addClaimItem` | CP-1.2, CP-1.3, CP-1.4, CP-2.4 (applied draft creates the item) |
| `updateClaimItem` | CP-1.6, CP-3.5 (edit-resolve), CP-2.4 (completing a manual item with applied fields) |
| `removeClaimItem` | CP-1.6 |
| `attachReceipt` | CP-1.3, CP-2.1, CP-3.5 (resolve missing-receipt from the approver side) |
| `extractReceiptDraft` | CP-2.2 |
| `applyReceiptDraft` | CP-2.3 |
| `previewItemComputation` | CP-1.2, CP-1.4, CP-4.3 (matrix/rate preview) |
| `submitClaim` | CP-3.1, CP-3.6 (resubmit), non-happy sample claim |
| `withdrawClaim` | CP-3.8 |
| `runPolicyCheck` | CP-3.4 (explicit re-check after fixes — findings also compute at submit and live on edits, 07c) |
| `listPolicyFindings` | CP-3.3, CP-3.4 |
| `resolvePolicyFinding` | CP-3.5 |
| `decideClaim` | CP-3.4 (refused), CP-3.6 (approve/reject/query), CP-3.5 |
| `reassignApprovalStep` | CP-3.7 |
| `recordPayout` | CP-5.2, CP-5.3 (correction appends via the same operation with supersede semantics) |
| `listRateTables` | CP-4.1 |
| `getRateTable` | CP-3.3 (citation drill-through, read-only), CP-4.2 |
| `saveRateTable` | CP-4.2 |
| `listPolicyPacks` | CP-4.1 |
| `savePolicyPack` | CP-4.3, CP-4.5 |
| `listMembers` | CP-4.4 |
| `exportClaimPackage` | CP-5.4 |
| `getArtifact` | CP-5.4 |
| `listJobs` | CP-5.5, CP-2.2 (assist job visibility when long-running) |
| `getUsage` | CP-2.2 (pre-run meter), CP-5.5 |

30 operations, 0 orphans (Critic-verified — the table above lists every 07b operation exactly once; scripted check in the self-audit).
