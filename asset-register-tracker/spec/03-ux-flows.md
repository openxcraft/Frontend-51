# 03 — UX Flows: asset-register-tracker

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation — no orphans. The two state machines behind every flow: **label** (requested → printed → applied → damaged|missing → retired) and **custody** (in-stock → with-holder → return-pending → in-stock; append-only events).

## CP-1 — Register first assets → QR label request → print → apply (value proof)

1. Maha sets up the register's spine: categories in both locales (`createCategory` — e.g. "Laptops / حاسوب محمول") and the location tree (`createLocation` — building → floor → room: "Riyadh HQ / المركز الرئيسي" → "Floor 3" → "Storeroom 3-B"). `listCategories` · `listLocations` confirm what exists before creating (duplicate names → inline suggestion, no silent dedupe).
2. She registers assets: quick-add rows in the registry grid (tag auto-assigned next-in-sequence, bilingual name, category, location, serial, model; P11 recalls last-used category/location per session) or the single-asset form. `createAsset` per row; draft assets appear immediately (`listAssets` refresh with the new row's `labelState: 'none'`).
3. She selects the new assets (P07 bulk select) and requests labels: label size (25/40/60mm — with the minimum-scannable note) and sheet layout (A4 65-up / 24-up / 1-up) chosen in the request dialog. `requestLabelBatch` → Job; per-asset labels created in state `requested`; the batch paces deterministically (async-contract §3 progress in labels). `listJobs`
4. Batch ready → `getLabelBatch` renders the **sheet preview** (QR + tag + bilingual name per label cell, print-safe) and the print-ready artifact download. `getArtifact` (artifact expiry declared at creation; renewal per async-contract §2). Manual path is the default path: download the sheet, print on standard label stock — zero integrations required (08 N1).
5. She prints, peels, applies. Confirming application: she scans each label with the scan companion (`lookupByScan` → asset identified) and taps **Label applied** (`confirmLabelApplied` → label `applied`, asset `status: 'active'`), or marks applied from the batch screen's checklist (`confirmLabelApplied` per row). The apply step is the lifecycle's honesty: a printed label is not an applied label (07b rule 3).
6. Usage meter check before/after the batch (`getUsage` — label batches and exports in window; P14).

**Edges**: asset already carrying an active label → `requestLabelBatch` for it returns VALIDATION naming the asset and pointing to the damaged/missing path (never silent double-labeling); label size changed mid-batch → new batch, prior batch unaffected; partially-applied batch (57 of 60) is a normal long-lived state — the batch screen shows applied/pending counts, no nudge; printing fails on paper (manual retry is printing, not product state — pending labels simply remain pending); quick-add row with missing required field → row-level inline validation, row stays editable, other rows unaffected.
**Failures**: malformed sheet export → typed error, retry, labels remain `printed` (no data loss); artifact expired before download → NOT_FOUND with renew action; label-batch job failure → typed error + retry scoped to the batch (labels in `requested` remain, never half-printed — atomic per batch).
**Recovery**: labels are re-requestable per asset; applied history persists per label; the register never loses assets to a print failure.

## CP-2 — Signed custody hand-off: assign → return → transfer (the daily loop)

1. Tariq opens the scan companion on his phone and scans the laptop's label (`lookupByScan` → asset summary card: tag, name, category, current holder, label state).
2. **Assign**: he chooses Hand off → picks the receiving person (`listPeople` — searched, normalized bilingual per rtl-rules §4; the person can be created inline if absent: `createPerson`, no seat needed) → optional due-back date, condition note, hand-over location auto-filled from scan context.
3. The receiver signs: typed name (keyboard path — the a11y default), drawn mark (SignatureCapture), or scan-acknowledgement (the receiver scans the same label on their own phone and taps acknowledge — the two-device path Noor's freelancers use). `recordCustodyEvent` with `kind: 'assign'`, `toPersonId`, signature by the accepting party. Event is append-only; custody moves to `with-holder` (`return-pending` when a due date passes without return).
4. **Return**: days later, either party scans (`lookupByScan`) → Return → condition recorded (good / damaged / needs-attention) → the accepting side (registry staff) attests → `recordCustodyEvent` with `kind: 'return'`, custody back to `in-stock` at the scanned location. A damaged condition on return offers the maintenance note field (free text — no work orders, LOOP-10) and, if the label itself is wrecked, jumps to the label report path (CP-3).
5. **Transfer**: person-to-person (person leaving, equipment staying) — both scan or the staff member mediates; signature from the new holder; `recordCustodyEvent` with `kind: 'transfer'`.
6. The asset's timeline renders the chain (`listCustodyEvents` — every event with actor, parties, location, condition, signature mark, timestamp; timeline order mirrors in RTL).

**Edges**: receiver not in the people list → inline `createPerson` (full name, department, contact note — custody history must name real people; 12 Q-8 records the no-deletion policy); due date passes → `return-pending` chip + digest-tier notification per P21 ladder (never page-visible nagging); wrong asset scanned during hand-off (two identical laptops) → the summary card shows tag + holder + serial prominently so the error is caught pre-signature, and the post-hoc fix is a **correction event** (`recordCustodyEvent` with `kind: 'correction'`, referencing the erroneous event, stating what actually happened — history is never edited, 07b rule 4); assign attempted on a retired asset → VALIDATION naming the retirement; hand-off on a label-less asset (draft) → allowed but the card says "no label — scanning is the only lookup path" (registry truth held in data, not in hardware); signature declined/abandoned → event never recorded, custody unchanged (no half-signed states).
**Failures**: offline in the storeroom → event queues locally with per-item state (P20) and reconciles with idempotency key on reconnect (`recordCustodyEvent` idempotent — double-submits never double-append); stale asset edit from another surface → CONFLICT with both payloads; person record mid-creation collision (two staff adding the same person) → CONFLICT, both kept, merge is a `listPeople` edit at v1 (12 Q-8).
**Recovery**: every custody event is immutable; mistakes append corrections; queued offline events are individually cancellable before reconnect flush.

## CP-3 — Mobile scan lookup (the everyone surface)

1. Anyone — seat or no seat — opens the scan companion (web link or the QR on a poster by the storeroom) and scans a label. `lookupByScan`
2. The asset card renders: tag (bidi-isolated), bilingual name, identity block (category, serial, model — no photos at v1, 12 Q-12), current holder, custody state, location, label state, and the asset's own scan-lookup deep link.
3. Actions scoped to role: registry members see Hand off / Return / Transfer / Report label / Retire; non-members (shared link) see read-only identity + "contact the register owner" — custody actions always require a registry actor (audit chain names accountable members).
4. **Report label state**: damaged or missing label reported from the scan card (`reportLabelState` — label moves to `damaged`/`missing`, note recorded, actor logged) → the replacement path lights up: request a single-label batch for that asset (CP-1.3 flow, `requestLabelBatch` now valid because no active label exists) → print → apply → `confirmLabelApplied`. The dead label's history stays on the asset forever (which label, when it died, who reported).
5. Wrong/unknown code scanned (label from a retired register, typo, foreign QR) → NOT_FOUND card with the code's last 4 characters shown and next actions (re-scan / search by tag).

**Edges**: low-light or damaged code that won't decode → manual tag entry field on the same screen (numerals Western, hyphen-safe isolation — tag "AST-0107" inside Arabic chrome never reorders); the same label scanned twice quickly → idempotent lookup, no duplicate events (lookups are reads — only explicit actions write); camera permission denied → manual tag entry is a first-class equal path, never an error dead-end (a11y-baseline §5 spirit).
**Failures**: NETWORK mid-lookup → stale card with reconnect banner (P20); lookup throttling → RATE_LIMIT with a clear retry window (abuse posture only — human scan rates never hit it).
**Recovery**: lookup is read-only; no state to lose. Manual tag entry works for every lookup operation (`listAssets` search by tag is the desktop equivalent).

## CP-4 — Registry table, asset detail, and audit-trail review (the daily surface)

1. Registry home: virtualized asset table (`listAssets` — filters: status, category, location, custodian, custody state, label state; P08 chips + saved views; normalized bilingual search; P19 virtualization past 200 rows). `getSession` for role/locale; `getUsage` surfaces plan posture in settings.
2. Inline edits: rename, re-categorize, re-locate from the grid (P06 inline edit with escape hatch; `updateAsset` with baseVersion). Bulk relocate / re-categorize via action bar (P07) — each row's change logged (P17).
3. Asset detail: profile (identity, serial, category, location, label block with lifecycle state + replacement link) + custody timeline (`listCustodyEvents` filterable by kind/person/date) + label block + retirement block when present.
4. People view (`listPeople`): per-person custody ledger — everything a person currently holds and the open return-pending list; the عهدة view Gulf offices already keep by hand, now queryable.
5. Activity log (`listActivity`): every consequential mutation — actor, action, target, timestamp (P17; the audit surface, exportable via CP-5).
6. ⌘K palette reaches assets, people, locations, categories (T3 with >3 list surfaces; bilingual normalization per P05).

**Edges**: filtered-empty declares itself with filter reset (P01); no-access workspace → PERMISSION surface, never "empty"; retired assets excluded by default, included under the retired filter (their custody timelines stay readable — retirement freezes, never deletes); >5,000 assets → pagination cursor discipline unchanged, virtualization does the work (10-performance); person with zero history (created by mistake) → person detail offers archive (people are never deleted — custody chains must keep their names, 12 Q-8).
**Failures**: stale baseVersion on inline edit → CONFLICT with both values; NETWORK on list fetch → banner + retry (P20); activity log fetch partial → page-per-cursor, honest "older entries" affordance.
**Recovery**: filters and saved views are client state; data is cursor-recoverable; every edit versioned.

## CP-5 — Audit walk (sightings), retirement, and the evidence export

1. Saad starts an audit walk at a location: the scan companion in walk mode — scan each asset → **Sighting** (`recordCustodyEvent` with `kind: 'sighting'`: location confirmed, condition noted, no custody change, no signature — a verification, not a hand-off). Expected-vs-seen is computed against `listAssets` filtered to that location; unscanned listed assets and scanned unlisted items both surface (the reconciliation view).
2. **Retire an asset**: from asset detail or bulk from the grid (P04 level 3 for bulk — type-to-confirm with the count): method (sold / donated / recycled / destroyed / transferred-out / lost write-off), disposal date, counterparty, certificate/receipt reference (the certificate-of-destruction field for data-bearing devices — reference string only, no document storage), note. `retireAsset` with baseVersion + idempotency key → asset `retired`, its label `retired` with it, retirement record appended to the chain; custody must be resolved first (a with-holder asset cannot retire — VALIDATION names the holder).
3. **Evidence export**: register export with filter scope (all / by location / by category / retired-only), format CSV or JSON, custody history included or summary-only. `exportRegister` → Job → artifact with expiry (`getArtifact`, renewal path). The pack Maha hands the external accountant: register rows + custody chains + disposal records (existence evidence — valuation stays with accounting, LOOP-10).
4. Jobs console: label batches and exports with state, cancel/retry, link-to-context (`listJobs`).

**Edges**: sighting at a different location than the register's → the event records the actual scanned location and the asset's location updates (a sighting is location evidence — the update is the point, and it is logged); asset found with a dead label during a walk → report from the same screen (CP-3.4 path); retirement with open return-pending → blocked with the holder named (resolve or correct custody first); export scoped to zero assets (over-narrow filter) → VALIDATION naming the empty scope before the job runs; certificate reference left blank on a `destroyed` data-bearing device → allowed with an explicit "unreferenced" flag in the export (honest, not blocking).
**Failures**: export job failure → typed error + retry; artifact expired → NOT_FOUND + regenerate (register state unchanged); idempotent re-submit of the same retirement → same record (no double-retire).
**Recovery**: retirement records are immutable (corrections via note append on the activity log, never edits); exports regenerate from register state at will.

## Non-happy paths

- **First-run (empty register)**: the registry home teaches the loop in three moves — create a category, register one asset, request a one-label batch; a sample asset with a pre-printed sample sheet is offered so the scan-to-apply moment is experienceable before any real printing (P22 value checklist).
- **No print capability at all (LOOP-5)**: label sheets download as print-ready files; hand-offs work entirely scan-to-scan; exports download directly — the full loop (CP-1 through CP-5) completes with zero bound capabilities.
- **Offline (storeroom basement)**: reads cached where rendered; custody events and label-applied confirmations queue locally with per-item state and reconcile idempotently on reconnect (P20; async-contract §5).
- **Directory capability unbound**: people are entered by hand (`createPerson`) or created inline mid-hand-off (CP-2.2) — identical UX, one extra field (08 N3 manual alternative).
- **Notification channel unbound**: return-pending lists are in-product surfaces (people view, registry filter); no email/push required for the core loop (08 N2 manual alternative).

## Failure → error mapping

VALIDATION (label double-request, custody-signature shape, retirement with unresolved custody, empty export scope, malformed inputs) · NOT_FOUND (unknown scan code, stale asset/batch/artifact links, expired artifacts) · PERMISSION (workspace scoping, non-member scan actions, viewer-role mutations) · CONFLICT (concurrent asset edits, person-creation collisions) · RATE_LIMIT (scan-lookup throttling, export/label-batch quotas) · NETWORK (list fetches, job polling, artifact delivery, offline reconciliation) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-4.1, entry (role/locale), settings | `reportLabelState` | CP-3.4, CP-1.3 edge (replacement gate), CP-5.2 edge |
| `listAssets` | CP-4.1, CP-1.2 (grid refresh), CP-5.1 (expected set) | `recordCustodyEvent` | CP-2.3/4/5, CP-2 edge (correction), CP-5.1 (sighting) |
| `createAsset` | CP-1.2 | `listCustodyEvents` | CP-2.6, CP-4.3, CP-5.3 (history-in-export preview) |
| `getAsset` | CP-1.5 (batch checklist), CP-3.2, CP-4.3 | `lookupByScan` | CP-2.1, CP-3.1, CP-1.5 (apply-by-scan), CP-5.1 (walk scan) |
| `updateAsset` | CP-4.2 | `listPeople` | CP-2.2, CP-4.4, CP-5.2 edge (holder lookup) |
| `retireAsset` | CP-5.2 | `createPerson` | CP-2.2 (inline) |
| `listCategories` | CP-1.1 (dedupe check), CP-4.1 (filter) | `listActivity` | CP-4.5 |
| `createCategory` | CP-1.1 | `listJobs` | CP-1.3, CP-5.4 |
| `listLocations` | CP-1.1 (dedupe check), CP-4.1 (filter), CP-5.1 | `exportRegister` | CP-5.3 |
| `createLocation` | CP-1.1 | `getArtifact` | CP-1.4 (label sheet), CP-5.3 (evidence pack) |
| `requestLabelBatch` | CP-1.3, CP-3.4 (replacement) | `getUsage` | CP-1.6, CP-4.1 (settings posture) |
| `getLabelBatch` | CP-1.4/5 | | |

24 operations, 0 orphans (Critic-verified).
