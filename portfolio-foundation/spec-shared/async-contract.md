# Async Contract — Long-Running Operations

Status: SHARED FOUNDATION · How every product in the portfolio communicates operations that cannot complete within a single interaction.

---

## 1. Threshold

Any operation with expected duration > 2 seconds, or unbounded duration (imports, exports, transcodes, bulk edits, batch generation), is a **Job**. Jobs are modeled as first-class entities in the product's data contract (07a) and as typed operations on the adapter (07b). The UI never simulates synchronous completion of a Job, and never blocks a surface on one.

## 2. Job States

`queued → running → (awaiting-input)? → succeeded | failed | cancelled | expired`

- **queued**: position or wait estimate when fair; honest "waiting" when not estimable. The queue is visible without navigation (P12).
- **running**: progress is determinate (units done/total) when the operation knows, indeterminate-with-milestones otherwise. An indeterminate bar claiming percentage is forbidden.
- **awaiting-input**: the job paused for a human decision (conflict, ambiguous import row, quota consent). The decision surface links directly to the job. Jobs do not silently fail because a prompt went unseen — they wait, with a declared timeout.
- **succeeded**: deliverable is linked, not just "done". For exports: the artifact and its expiry window.
- **failed**: typed error + retry action + what was completed before failure (partial-result policy §4).
- **cancelled**: cancellation is real and fast — within one interaction, no zombie "cancelling…" for minutes; the artifact of partial work is kept or discarded per the product's declared policy.
- **expired**: artifacts (e.g., export files) have a retention window, declared at creation, with renewal action.

## 3. Progress Honesty

Progress reflects work, not hope. Long imports show rows; transcodes show timecoded ranges; bulk edits show item counts. A job at 99% for more than a few seconds declares a stall (ai-native-patterns.md §2 applies). Progress labels are written copy, not percentages alone ("تحويل ٣ من ١٢ مقطع" / "Converting clip 3 of 12").

## 4. Partial Results

Jobs that produce per-item outputs declare a partial-results policy: deliver what succeeded, mark what did not, and provide a per-failure retry scoped to failed items only. All-or-nothing is acceptable only where atomicity is semantically required (financial postings, attestations) — and that requirement is declared.

## 5. Cancellation & Idempotency

Cancel is offered whenever meaningful. Retries and resubmits carry idempotency keys (07b) so a double-submitted job does not double-charge quota or duplicate artifacts. After a connection loss, the surface reconciles to authoritative job state rather than guessing.

## 6. Completion Delivery Ladder

1. **In-context completion**: if the user is on the surface, complete there (inline reveal, toast with artifact link).
2. **Cross-context notification**: if the user navigated away, a permissioned notification (P21 ladder — instant for blocking workflows, digest for ambient ones).
3. **Return state**: on app re-entry, unfinished and recently-finished jobs are surfaced on the relevant surface — never orphaned in a notification center only.

## 7. Job Center

Every product with more than one job class exposes a jobs surface: filterable by state, link-to-context on every row, cancel/retry actions, and per-job detail with progress history. Tier 3 products may consolidate this into an activity surface; Tier 1/2 products give it dedicated IA (04-information-arch.md).

## 8. Copy Rules

Job copy follows copy-voice.md: present tense for state ("Exporting…"), past for outcome ("Export ready"), the artifact named, and failure copy always containing the next action. Time estimates use ranges ("about 2–3 minutes"), never false precision. Arabic job copy respects numeral-system and direction rules (rtl-rules.md §3).
