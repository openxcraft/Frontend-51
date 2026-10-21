# 03 — UX Flows: abandoned-cart-recovery

SME-C pass · 5 critical paths, numbered steps incl. edges/failures/recovery. Coverage table at the end traces every 07b operation — no orphans. Terminology per 02: abandoned cart · shopper · recovery sequence · step · template · send window · quiet hours · deferral · send ledger · recovery queue · value band · incentive · routing · suppression · opt-out · recovery report · export.

## CP-1 — Cart intake → triage queue → first read (value proof)

1. Faisal opens the recovery queue. Empty state on first run offers the sample workspace data — carts, sequences, a deferred send, a recovered cart (P22; the value moment is *seeing the clock defer a send and a cart come back*). `listCarts`
2. Cart intake, manual path (always available, zero credentials — LOOP-5): paste cart rows (shopper handle, locale, jurisdiction + timezone, cart lines with bilingual item names, total, currency, consent basis, last-activity timestamp). Paste import is a Job per async-contract: paced, cancellable, row-count progress ("Importing 9 of 14 carts"). The abstract cart-source capability, when bound and consented, delivers carts as typed events instead — the console treats both identically (provenance field on the cart). `importCarts` · `listJobs`
3. Each imported cart passes the deterministic intake rules (07c): abandonment detection (last activity older than the workspace threshold, default 60 minutes, and no completion event), suppression check (an opt-out shopper's cart is marked `suppressed-at-intake` and never enters a sequence — recorded, not bounced silently), value-band assignment (low / mid / high against workspace thresholds), priority-score computation (exact formula, 07c §D), and routing (band → sequence per the routing policy; consent-basis mismatch with a `consent-only` sequence is recorded as a skip reason, visible in the queue).
4. The queue renders: virtualized rows with priority rank, cart total (Western numerals, currency-code-labeled), band chip, shopper locale (ar / en — renders the actual locale string), state (abandoned · in-recovery · recovered · expired · suppressed), sequence name + next send time with a deferral mark if the due time already fell inside quiet hours. `getCart` (row drawer: items, shopper, consent basis, jurisdiction, priority components with their math)
5. Nayla reads the queue top-down: 8 carts in-recovery, the highest-priority one flagged with a dispatch failure needing a decision (CP-3), the recovered set stamped with revenue (the report reconciles to SAR 939.00 in the seed — 07c).
6. Session context: role/locale render the workspace chrome (bilingual-en default; Arabic chrome is a full citizen — flip re-renders everything, 09); Karim's agency seats land in per-brand workspaces with the same deterministic state. `getSession`

**Edges**: pasted rows with empty totals (VALIDATION naming the first bad row; prior rows retained — partial policy per async-contract §4); carts for the same shopper id (allowed — each cart is its own recovery object; suppression applies to the shopper across carts); mixed-script item names (imported verbatim, bidi-isolated at render — rtl-rules §2); a cart whose last activity is *newer* than the abandonment threshold (imported, parked as `abandoned-pending` — it becomes eligible when the threshold lapses; never silently dropped); currency codes the workspace did not declare (VALIDATION listing the code and the workspace's declared set).
**Failures**: malformed paste → VALIDATION with the first bad row named and its neighborhood confirmed imported; cart-source capability unconsented → PERMISSION naming the capability class in capability language with the paste path offered inline (credential-contract §4); import job failure mid-way → typed error + retry, imported-so-far kept.
**Recovery**: carts persist across re-imports (idempotent by shopper+last-activity key); intake rules are re-runnable and deterministic — nothing reviewed is lost to a failed re-run (state derives from events, 07a).

## CP-2 — Standing up a bilingual recovery sequence (the authoring loop)

1. Faisal creates a sequence: name ("Standard 3-step"), consent basis (`any` — records the legal-basis posture visibly; `consent-only` skips shoppers whose consent basis is `unknown`, reason recorded), expiry (default 72h — the recovery-window convention, 01), status starts `draft`. `createSequence`
2. He opens the sequence studio; the step rail starts empty with the stock template library one panel away. `listSequences` · `getSequence`
3. Bilingual template authoring: the editor is two columns, English left, Arabic right, per P23 — subject + body per locale, variable chips ({{first_name}} {{cart_items}} {{cart_total}} {{checkout_url}} {{store_name}} {{discount_code}}) validated against the known variable set (unknown variable → VALIDATION naming it and its position); per-locale length budgets render live (subject ≤ 60 chars, body ≤ 900 — arithmetic, not folklore). `saveTemplate` (new draft)
4. The generation dock (conditionally-AI, 00): Faisal asks for variants of the base template — the request states the locale pair and tone, shows the metered cost estimate before running (P14), and runs as a Job. `generateMessageVariants`
5. Draft variants arrive with provenance `generated`, in a reserved region (P13 streaming discipline; stop/regenerate available). The dock renders them beside the base — never into any sequence. `getDraftVariantSet`
6. He promotes one variant: the promotion surface is a review diff (base vs draft, both locales, direction-aware per P16) with an explicit confirm — `confirmReviewed: true` is a literal type, so the adapter cannot promote an unreviewed draft (P15 made structural, mirroring the sign-off-gate pattern). Promotion creates a new *draft* template — approval is still a separate human act. `promoteDraftVariant`
7. Template approval (the library's own gate): an approved template is the only kind a sequence step can bind; approval records actor + timestamp. `approveTemplate`
8. Steps: Faisal wires step 1 (delay 60 minutes from abandonment, channel kind `email`, template t-001), step 2 (24h, `email`, t-002), step 3 (72h, `email`, t-003 + incentive reference for the mid band). Quiet-hours evaluation is deliberately NOT a per-step field: every send resolves the shopper's own jurisdiction row with the workspace default as fallback (07a's structural note — a step-level window override would contract around the recipient's jurisdiction). Saving an ACTIVE sequence creates a new draft version — the live sequence keeps serving its pinned version until promotion (version pinning, 07a). `updateSequence`
9. He retires a superseded template so no future step can bind it (retiring never touches bound steps — they keep their pinned template version). `retireTemplate`
10. He previews the whole sequence against a sample cart and timezone of his choosing: the timeline renders every step's due time, and every deferral with its reason ("step 2 due 23:40 America/New_York — outside send window 08:00–21:00 (US-TCPA row) — deferred to 08:00 next day"). Preview is a pure function: same inputs, same timeline, zero state mutated (07c rule 9). `previewSchedule`
11. Activation gate: `setSequenceStatus → active` runs the validation ladder — steps non-empty; every step binds an *approved* template for its channel kind; every step's delay lands inside the expiry window; the workspace quiet-hours policy carries a resolvable default row (the fallback every send needs). Refusals name every failed rule with links (never a generic "not ready" — P04 discipline). `setSequenceStatus`

**Edges**: a template edited after binding (bound steps keep the pinned version; rebinding is an explicit step edit); a step delay of zero (allowed — immediate send, still window-checked); delay exceeding expiry (VALIDATION at activation); two sequences targeting the same band (allowed — routing maps band → *primary* sequence; manual override per cart exists precisely for the operator's judgment, CP-3); generation Job fails mid-way (partial variants kept, marked partial, retry-continuation or discard — ai-native-patterns §2).
**Failures**: stale sequence edit (another seat saved first) → CONFLICT with both payloads; stale template edit → CONFLICT both kept; promotion without review-confirm → VALIDATION (the literal type makes it unrepresentable, the runtime makes it named); generation quota → RATE_LIMIT ladder with reset time (ai-native-patterns §5: rung 3 is the template library, labeled non-generative — the dock itself offers it).
**Recovery**: sequences are versioned end-to-end; activation promotes a version, edits fork a draft, retirement retires the version — every cart's send ledger carries the sequence version that produced it (audit honesty).

## CP-3 — The daily recovery watch (queue work, the send ledger, the human decisions)

1. Faisal opens the send ledger first — the outbox across all carts: every touchpoint attempt with state `scheduled · deferred · dispatched · delivered · clicked · failed · cancelled · skipped-suppressed`, channel kind, due/rescheduled times, and the policy row that governed each deferral. Filters by state and channel; deferred rows carry the defer reason verbatim. `listSends`
2. The deferred pair reads plainly: cart-002 step 1 — due 23:40 America/New_York, deferred to 08:00 (US-TCPA row); cart-014 step 2 — due 05:10 Asia/Riyadh, deferred to 09:00 (KSA workspace row). Nothing reschedules silently: the deferral is a first-class state with a reason string and a rescheduled timestamp (07c rule 4).
3. A dispatch failure (cart-012, step 1, NETWORK from the bound channel, or the mock's failure injection): the row shows the typed error, the retry action, and what the manual path is when no channel is bound at all (the send-list export, CP-5 — deferred dispatch is also a legitimate holding state).
4. Manual override: cart-011 (SAR 199, mid band, Standard) — Faisal knows this shopper replied to support yesterday; he assigns the High-value sequence with a recorded reason. Overrides are ledger entries and re-anchor the schedule from the assignment moment. `assignSequence`
5. A shopper event arrives through the bound event-return channel — or, with nothing bound, Dana types it: delivered, clicked, checkout-completed (the recovery moment), or opt-out (the stop moment). Manual entry is first-class: same ledger, same state machine, `provenance: 'manual'` (LOOP-5). `recordShopperEvent`
6. Checkout-completed flips the cart to `recovered`, stamps the recovered seal (the T2 signature moment, 05), cancels remaining scheduled sends, and recomputes the report. Opt-out cancels every scheduled and deferred send for that shopper *mid-flight* (state `skipped-suppressed`), writes the suppression entry, and holds future carts at intake — the compliance spine is not a settings checkbox, it is the state machine.
7. Cancelling a cart's recovery outright: reason required, recorded (P04 level-2 — names the cart, its remaining steps, and that its history stays). `cancelCartRecovery`
8. Suppressing a shopper manually (complaint, duplicate accounts): same ledger as opt-out, reason `manual`. `addSuppression`
9. The suppression ledger: entries with reason, actor, timestamp, source event; restoring a shopper is possible with a mandatory reason, and restores are themselves ledger entries (block/restore symmetry). `listSuppressions` · `removeSuppression`

**Edges**: an opt-out event racing a dispatch already in flight (the send that left wins; the suppression ledger records the race — the next send never leaves); a recovered cart whose shopper later opts out (suppression still applies — recovery and consent are separate facts); manual event for a cart outside its sequence expiry (recorded, no sends resurrect — expiry is terminal); duplicate event entry (idempotent by event key — same event twice writes once).
**Failures**: override on a suppressed shopper → VALIDATION naming the suppression entry (with a link — the operator can restore from there, CP-3.9); event entry for an unknown cart → NOT_FOUND with the paste-import path offered; concurrent overrides on one cart → CONFLICT with both payloads; NETWORK mid-ledger → banner + retry, queue state safe (P20).
**Recovery**: every queue action is versioned and logged (P17); the send ledger reconciles after reconnect; determinism means a re-derived schedule from the same events is the same schedule (07c).

## CP-4 — Margin-aware routing, incentives, and the quiet-hours policy (the policy surfaces)

1. Dana opens routing & incentives: value-band thresholds (low < SAR 150 · mid 150–400 · high > 400 in the seed), band → sequence mapping, and the per-band incentive policy (none / free-shipping / percent / fixed — the *offer shape* and its code string, issued by the merchant's own systems; this product never generates or verifies codes, LOOP-10). `getRoutingPolicy`
2. She edits: mid band keeps `none` until step 3 (a shipping offer, not a percentage); high band gets percent-off only at the final step; low band gets nothing — margin discipline as a versioned artifact, the value-proportional practice the category describes (01 q9) made inspectable. Sanity validation on save: thresholds strictly ordered (low < high), incentive percent within 0–100, code string non-empty when an incentive references one. `updateRoutingPolicy` (baseVersion → CONFLICT on stale)
3. Quiet-hours policy center: jurisdiction rows — US federal (08:00–21:00, source label "statutory anchor — 47 CFR 64.1200(c)(1)"), Florida-class stricter row (08:00–20:00), Texas-class row (09:00–21:00), KSA workspace row (09:00–21:00, source label "workspace policy — no retrieved statutory hour rule for KSA"), UAE workspace row (09:00–21:00, same honest label). Each row: jurisdiction key, send window [start, end), source label, version. `listQuietHourPolicies`
4. She adjusts the KSA row to 09:30–21:00 and notes the weekend-narrowing case for the workspace default (day-of-week window variants are a recorded v2 deferral — 12 Q-13; v1 rows are day-uniform by contract, 07a); validation: start ≠ end, midnight-crossing allowed and modeled exactly (07c rule 4), rows are per-jurisdiction (shopper timezone determines *when*, jurisdiction row determines *whether*). `saveQuietHourPolicy` (baseVersion → CONFLICT)
5. Policy edits never mutate history: past sends keep the policy row version they were evaluated against; future sends use the new version — and the send ledger displays both with their version stamps (audit honesty, 07a).
6. Preview across policies: Dana re-runs the sequence preview against each jurisdiction's sample timezone before saving, and reads exactly which sends would defer and to when (the same pure function as CP-2.10 — policy craft with the clock legible). `previewSchedule` (shared with CP-2)

**Edges**: deleting a jurisdiction row still referenced by a step (forbidden — VALIDATION naming the sequences); a window that crosses midnight (e.g. 21:00–03:00 — supported by the exact circle algorithm, 07c); a shopper timezone absent from the jurisdiction map (falls to the workspace default row — recorded on the send); incentive edits while carts are mid-sequence (in-flight sends keep the pinned incentive; later steps re-read the policy version at their evaluation time — surfaced, never silent).
**Failures**: threshold inversion (low ≥ high) → VALIDATION naming both numbers; percent outside 0–100 → VALIDATION; stale policy edit → CONFLICT both kept.
**Recovery**: routing and quiet-hours policies are versioned with diffs; every deferred send in the ledger links the policy row version that deferred it — a wrong window is correctable with evidence, not faith (the cod-order-confirmation policy posture, inherited).

## CP-5 — Recovery report, export, and the manual send path (evidence out)

1. The recovery report renders from recorded events only: carts by state, recovered revenue (SAR 939.00 across 3 carts in the seed — reconciles to the recovered carts' totals), recovery rate over entered carts with its denominator stated (3 of 14 — the metric's definition is on the surface, because benchmark definitions vary across the industry, 01), per-step funnel (scheduled → dispatched → delivered → clicked → recovered), deferral statistics (count + top jurisdictions), suppression count, and per-sequence comparison. No external benchmark is quoted in-product. `getRecoveryReport`
2. Jobs console across the product: imports, generations, exports — filterable, cancel/retry, link-to-context (async-contract §7). `listJobs`
3. Export the recovery package: formats — `recovery-report` (the month's evidence), `send-list` (the LOOP-5 manual path: per pending shopper, the copy-ready message in the shopper's locale with variables filled, the due/deferred time, and the channel kind — so a merchant with no bound channel dispatches through whatever they already use), and `sequence-archive` (the versioned sequence + templates + policies as a JSON bundle — Karim's reusable cross-brand asset). Export is a Job with expiry + regeneration; quota shown before running (P14). `exportRecoveryPackage`
4. Artifact retrieval before the 7-day expiry window; expired artifacts regenerate deterministically from state. `getArtifact`
5. Usage window: generated variants and exports consumed this window, reset time, warnings at 80% (P14) — the metered surface is generation and export, never the deterministic core. `getUsage`

**Edges**: export of a report while events are still arriving (the package carries the generatedAt stamp and the report version — reconciliation is the artifact's job, not a silent refresh); send-list export with zero pending shoppers (VALIDATION refusing an empty package with the queue state named — never a blank file); sequence-archive of a draft sequence (allowed — drafts are archived too, marked draft).
**Failures**: export quota → RATE_LIMIT ladder with reset time and the manual send-list note ("the queue itself never stops working"); export failure mid-package → per-format retry (async-contract §4); artifact expired → NOT_FOUND with regenerate; NETWORK during delivery → retry, artifact held.
**Recovery**: exports re-generate from state at any time; the jobs console reconciles after reconnect; report reads are derived and re-runnable (same events, same numbers — the determinism oracle).

## Non-happy paths

- **First-run with zero data** (P22): the queue offers the sample set — carts, a deferred send, a recovered cart, a suppressed shopper — and the checklist's first milestone is *watch a send defer and a cart recover*; the sample is clearable and never returns once cleared.
- **No channel bound** (LOOP-5): the console is complete — paste-import carts, author sequences, preview schedules, export the send-list, enter shopper events by hand, read the report. The bound-channel affordances render as optional capabilities with consent surfaces, never walls (08).
- **Generation capability unbound or exhausted** (ai-native-patterns §5): the dock offers the template library (rung 3, labeled non-generative); authoring, scheduling, and reporting are untouched — the AI surface is one dock, not the product.
- **Offline**: reads work; event entries and overrides queue with per-item state (P20) and reconcile to the authoritative ledger on reconnect.
- **Viewer seat** (Nayla's board read-only view): everything readable, nothing mutable — PERMISSION names the seat's capability in capability language.

## Failure → error mapping

VALIDATION (malformed cart rows, unknown template variables, activation-gate rules, routing threshold sanity, quiet-window sanity, override-on-suppressed, promotion-without-review, empty send-list export) · NOT_FOUND (stale cart/sequence/template/artifact links, expired artifacts, unknown event targets) · PERMISSION (capability consent for cart-source/message-channel/generation, viewer-role mutations) · CONFLICT (concurrent sequence/template/policy edits, concurrent cart overrides) · RATE_LIMIT (generation runs, export packages) · NETWORK (list fetches, job polling, artifact download, channel dispatch failures) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows |
|---|---|
| `getSession` | CP-1.6, CP-5 (viewer-seat non-happy), S11 settings (04) |
| `importCarts` | CP-1.2 |
| `listCarts` | CP-1.1, S1 queue entry surface (04) — the workspace's first screen, exercised by every persona in 02 |
| `getCart` | CP-1.4 (row drawer), CP-3.4 (override context) |
| `createSequence` | CP-2.1 |
| `listSequences` | CP-2.2, S3 studio entry (04) |
| `getSequence` | CP-2.2 (version detail), CP-2.11 (preview binding) |
| `updateSequence` | CP-2.8 (step wiring), CP-2.9 (draft fork on active edit) |
| `setSequenceStatus` | CP-2.11 (activation gate; pause/retire same op), CP-4 edge (referenced-row check) |
| `listTemplates` | CP-2.3, S4 library entry (04) |
| `saveTemplate` | CP-2.3 (draft authoring), CP-2.6 (promotion output) |
| `approveTemplate` | CP-2.7 |
| `retireTemplate` | CP-2.9 |
| `generateMessageVariants` | CP-2.5, CP-2 edge (retry-continuation) |
| `getDraftVariantSet` | CP-2.6 |
| `promoteDraftVariant` | CP-2.7 |
| `getRoutingPolicy` | CP-4.1 |
| `updateRoutingPolicy` | CP-4.2 |
| `listQuietHourPolicies` | CP-4.3 |
| `saveQuietHourPolicy` | CP-4.4 |
| `previewSchedule` | CP-2.10, CP-4.6 (policy preview) |
| `listSends` | CP-3.1, S7 send-ledger entry (04) |
| `assignSequence` | CP-3.4 |
| `recordShopperEvent` | CP-3.5 |
| `cancelCartRecovery` | CP-3.7 |
| `addSuppression` | CP-3.8 |
| `listSuppressions` | CP-3.9, S8 ledger entry (04) |
| `removeSuppression` | CP-3.9 |
| `getRecoveryReport` | CP-5.1, S9 report entry (04) |
| `exportRecoveryPackage` | CP-5.3 |
| `getArtifact` | CP-5.4 |
| `listJobs` | CP-1.2, CP-5.2, S10 jobs entry (04) |
| `getUsage` | CP-5.5, CP-2.4 (pre-generation meter), S11 settings (04) |

33 operations, 0 orphans (Critic-verified — the table above lists every 07b operation exactly once). `listCarts` is the queue-home entry surface (04 S1); `getUsage` is shared by the generation dock's pre-run meter and settings.
