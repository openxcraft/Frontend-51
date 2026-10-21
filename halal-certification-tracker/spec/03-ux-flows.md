# 03 — UX Flows: halal-certification-tracker

SME-C pass · 5 critical paths. Coverage table at end traces every 07b operation exactly once — no orphans, no phantoms. Roles referenced: Maryam (program manager), Khalid (assessor), Dr. Ahmad (committee), Fahad (director) — 02.

## CP-1 — Applicant intake → ingredient directory → first formulation (value proof)

1. Maryam opens the applicants directory and registers the applying company: bilingual legal name (required in both locales — VALIDATION refuses a one-script legal identity), trade name, contact, jurisdiction; one facility with address and activity scope. `createApplicant` · `getSession`
2. She creates the application case: kind (initial), scheme (the body's configured scheme, e.g. Gulf-scheme vs general — policy data from the ladder editor, 08-free of scheme-owner brands), product scope (named products), and the case enters stage `intake` on the typed stage ladder. `createApplication` · `listApplicants`
3. Khalid opens the ingredient directory and pastes the applicant's ingredient list (bilingual rows: name, optional E-number, optional origin note); import is a Job with row-count progress, duplicate accounting, and named bad rows (partial policy, async-contract §4). `importIngredients` · `listJobs` · `listIngredients`
4. He creates any master ingredients the directory lacks (status classification, source category plant/animal/synthetic/microbial/mineral, E-number where known) — each bilingual by construction. `createIngredient`
5. He builds the product formulation in the application workspace's formulation tab: lines bind directory ingredients with supplier, function, and — where the ingredient requires evidence — a supplier-certificate reference; per-line resolution state renders live (resolved / needs-evidence / evidence-expired / unresolved-mashbooh / haram). `setFormulation` · `getFormulation`
6. He registers supplier certificates as he goes: number, issuer, scope, issue/expiry dates, document (attached when the storage capability is bound; metadata-mode otherwise — 08 N1). `createSupplierCertificate` · `listSupplierCertificates`
7. First read: the application workspace shows formulation completeness (n of m lines resolved), the stage ladder's current stage, and the case's evidence count. `getApplication` · `listApplications`

**Edges**: one-script applicant names (VALIDATION at creation, fixable inline); ingredient rows whose Arabic spelling variants already exist (import groups them under the existing master with the normalization rule disclosed — rtl-rules §4); a line with an ingredient requiring evidence but no supplier certificate yet (renders needs-evidence, blocks nothing but the decision stage later); a supplier certificate past its expiry at creation (accepted as evidence-history with derived state expired — real bodies keep expired certificates as records); facility-less applicants (VALIDATION — the audit trail needs a site).
**Failures**: malformed paste row → VALIDATION naming the first bad row, good rows kept; duplicate import submit → idempotency key replay returns the original job (async-contract §5); storage capability unbound → document field runs metadata-mode with the reference path stated in-surface (credential-contract §6).
**Recovery**: the application persists across import failures; formulations are versioned — a failed save loses nothing (P10 autosave cycle); ingredients never dedestructively merge — variants group visibly.

## CP-2 — Evidence watch, mashbooh resolution, impact analysis (the daily loop / signature traceability)

1. Khalid opens the supplier-certificate vault sorted by derived state: SC-21 (gelatin supplier) shows **expiring-soon** (81 days). Every state is icon+text+color, never color alone. `listSupplierCertificates`
2. He drills from SC-21 to the lines it evidences — the vault's detail drawer lists formulations carrying it — then runs **impact analysis** from the ingredient side: gelatin → formulations → products → certificates → applicants, computed synchronously (deterministic graph walk, budget-bound per 10). `getIngredientImpact`
3. The impact result names it plainly: 2 products across 2 applicants, 3 issued certificates affected, ranked by days-to-expiry, severity per line state (evidence-expiring vs unresolved-mashbooh vs haram-blocking). Each row links to its certificate's ladder. `getCertificate` (linked drill)
4. Dr. Ahmad's monthly meeting: the contested-ingredients digest lists mushbooh and under-review lines with their evidence; he records a resolution (justification text, decision date, committee reference) on the E471 line. `updateIngredient` (classification) · `setFormulation` (line resolution binding)
5. Khalid replaces expiring evidence: SC-21's successor certificate arrives; he records it and binds the formulation line to it. `updateSupplierCertificate` · `setFormulation`
6. Maryam corrects the applicant's legal name typo (bilingual edit, versioned, logged). `updateApplicant` · `getApplicant`

**Edges**: an ingredient reclassified mashbooh → haram mid-cycle (impact severity becomes blocking; affected certificates surface on the register as review-needed — the register, not a person, propagates the fact); a resolution recorded on a formulation line whose ingredient later reclassifies (resolution pinned to the formulation version — the historical basis stays honest); impact on an ingredient carried by zero certificates (valid, honest result: "no issued certificate carries this ingredient"); committee viewer attempting the resolution (PERMISSION — decisions are committee-role actions).
**Failures**: stale formulation edit (another assessor saved first) → CONFLICT with both payloads side-by-side (P10); impact on a deleted-never ingredient id → NOT_FOUND; NETWORK mid-walk → typed error, retry preserves nothing half-computed (the walk is stateless).
**Recovery**: formulations version; resolutions persist; supplier-certificate history is append-oriented (a renewal adds a record, never rewrites the expired one).

## CP-3 — Audit outcome → committee decision → issuance (the gate)

1. The audit happened outside this product (LOOP-10: no scheduling) — Khalid records the outcome: date, site, auditor name (typed text), findings summary, non-conformities count and closure state, report document or metadata-mode reference; the case's audit stage lights. `recordAuditOutcome` · `getApplication`
2. The case advances through the stage ladder as work completes: intake → documents → formulation → audit → decision; each advance is a logged, typed transition; backward moves carry a reason (returned-to-applicant). `advanceApplication`
3. Dr. Ahmad's decision surface: the dossier (formulation with resolutions, evidence states, audit outcome) renders read-only; he records the committee decision (grant / reject with justification). `getApplication`
4. Issuance gate: Maryam triggers issuance; the gate is deterministic — every formulation line resolved, an audit outcome present with non-conformities closed, and a grant decision recorded. If the E120 line is still unresolved, the refusal is a typed VALIDATION naming the exact line ("التركيبة غير مكتملة: المكوّن E120 — قيد المراجعة"), never a generic rejection. She resolves, re-triggers. `issueCertificate`
5. The certificate is issued: number, scheme, scope (products), issue/expiry computed from scheme validity, ladder pinned (the scheme's rung set and offsets at issuance — policy version frozen to the certificate), status active; the register updates. `issueCertificate` · `listCertificates`
6. She exports the bilingual certificate document (the applicant-facing artifact, both scripts, Western numerals for dates and numbers) — a Job with expiry window. `exportCertificate` · `getArtifact` via jobs console `listJobs`

**Edges**: non-conformities open at decision time (gate refuses — closure recorded first); audit outcome recorded on a case with no formulation (allowed — recording precedes review ordering in real bodies; the gate still governs issuance); decision recorded by a non-committee role (PERMISSION); issuance with an evidence-expired-but-not-yet-expired supplier certificate (gate treats evidence-expired as unresolved — the line must re-evidence or carry a dated committee acceptance).
**Failures**: gate refusal → VALIDATION (named lines); export failure mid-bundle → per-format retry (async-contract §4); artifact link expired → NOT_FOUND with regenerate path.
**Recovery**: nothing is consumed by a refused issuance — the case stays at decision; re-trigger after resolution is one action.

## CP-4 — Renewal ladder + renewal case (the signature flow)

1. Maryam's Monday surface is the renewal console: the cross-certificate rung digest — every certificate's ladder rendered as rungs with states, grouped by urgency zone (steady / due-soon / overdue / lapsed). `listCertificates` (zone-filtered) · `getSession`
2. She opens a due-soon certificate: its detail shows the computed ladder timeline — rung dates derived from expiry minus the scheme's offsets, each rung upcoming / reached / cleared / missed, the pinned policy version, and the successor chain when one exists. `getCertificate` · `getRenewalLadder`
3. At the submission rung she opens the renewal case: kind renewal, linked to the expiring certificate; the case walks the same stage ladder (documents → formulation refresh → audit → decision) with the applicant's existing data recalled (P11 — no re-entry of applicant, products, or unchanged ingredients). `openRenewalCase` · `createApplication` semantics (renewal kind) · `advanceApplication`
4. Reformulation mid-cycle? The applicant changed one ingredient — the modification path: kind modification, linked certificate; on issuance the new certificate supersedes the old (premature successor, chain preserved). `setFormulation` (new version under the renewal case) · `issueCertificate`
5. Successor issuance before expiry: the old certificate's status becomes renewed (superseded), the new one active with a fresh computed ladder; the rung digest clears the row. `issueCertificate` · `listCertificates`
6. Fahad reviews ladder policy: the Gulf-scheme ladder's offsets are wrong for a new accreditation agreement; the owner edits the ladder (versioned policy — future certificates pin the new version; existing certificates keep their pinned rungs — the register never rewrites history). `updateRenewalLadder` · `getRenewalLadder`

**Edges**: expiry passes with the renewal case still open (certificate state derives lapsed; the case continues — a completed renewal after lapse issues a certificate with a gap the chain records honestly); a missed hard rung (submission date passed) → rung state missed, zone escalates, no blocking (the ladder informs, people act); renewal opened for a suspended certificate (VALIDATION — resolve suspension first); ladder edit colliding with another owner's edit (CONFLICT, both payloads).
**Failures**: openRenewalCase on an already-renewed certificate → CONFLICT naming the successor; policy edit making rung offsets non-monotonic → VALIDATION (each rung's date must sit strictly before the previous's, all before expiry).
**Recovery**: lapsed certificates re-enter via a fresh initial application linked to the expired one (chain visible); ladder policy edits never mutate computed history (immutability contract, 07a).

## CP-5 — Register, surveillance, accountability, exports (the daily surface)

1. Register home: the certificate grid with urgency zones, status filters, scheme filter, saved views (P08); virtualized beyond 200 rows (P19). `listCertificates`
2. Surveillance: an annual check on an active certificate — Khalid records the audit outcome against the certificate (not a case); findings open → suspension review. `recordAuditOutcome`
3. Suspension/withdrawal: Maryam suspends a certificate with a typed reason after a blocking ingredient finding; the register shows suspended with the reason on hover and the activity log entry; withdrawal is a P04 level-2 confirm naming the certificate and its scope ("Withdraw certificate HCT-2027-014 — 3 products decertified"). `setCertificateStatus`
4. Applicant directory management and the applications board with stage filters. `listApplicants` · `listApplications` · `getApplicant`
5. Ladder policy console + settings: scheme ladders editable (owner role), workspace defaults, direction. `getRenewalLadder` · `updateRenewalLadder`
6. Accountability: the activity log — every consequential mutation (actor, action, target, timestamp), filterable, keyboard-navigable, exportable (a11y-baseline §7 legal/audit obligation). `listActivity`
7. Exports: the bilingual register (all certificates with ladders and zones) as a Job; artifact retrieval before the 7-day expiry. `exportRegister` · `listJobs` · `getArtifact`
8. Ingredient directory maintenance: search with Arabic normalization, status edits. `listIngredients` · `updateIngredient`

**Edges**: filtered-empty declares itself with filter reset (P01); no-access applicants (another workspace) → PERMISSION surface, never "empty"; suspended certificates in the zone digest (excluded from renewal urgency — their problem is not time); >200-row register virtualizes with focus preservation.
**Failures**: NETWORK mid-list → banner + retry (P20); export quota → RATE_LIMIT with window reset stated before refusing (P14); UNKNOWN → typed retry with correlationId.
**Recovery**: all list surfaces cursor-paginated and re-fetchable; exports regenerate from register state; the log is append-only and never loses an entry to a failed view.

## Non-happy paths

- **Storage capability unbound (rung 0, LOOP-5)**: documents run metadata-mode — number, issuer, dates, and a typed reference string the staff keep in their own drive; every document-bearing surface states the manual path in place (credential-contract §6). The full CP-1→CP-5 loop completes in metadata-mode (00 success signal).
- **Notification channel unbound**: the renewal console IS the notification — in-product digests with copyable summary text a staff member can paste into email; nothing blocks on the channel (08 N2).
- **Delivery channel unbound**: certificate documents download as artifacts; the staff send them (08 N3).
- **First-run**: the register home offers the seeded sample body data — one applicant, one application, three certificates across three schemes — so the ladder moment and one impact analysis are experienceable before any real import (P22 value checklist; 07c seeds).
- **Offline (P20)**: reads work; writes queue with per-item state; jobs reconcile to authoritative state on reconnect (async-contract §5).

## Failure → error mapping

VALIDATION (malformed import rows, one-script legal identities, issuance gate refusals, stage-order violations, non-monotonic ladder offsets, renewal-on-suspended) · NOT_FOUND (stale ids, expired artifacts, deleted ingredients) · PERMISSION (viewer mutations, assessor ladder edits, non-committee decisions) · CONFLICT (concurrent formulation/applicant/ladder edits, renewal on renewed) · RATE_LIMIT (imports and exports per window) · NETWORK (list fetches, job polling, artifact delivery) · UNKNOWN (typed retry, correlationId).

## Flow → operation coverage (every 07b operation exactly once; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-1.1, CP-4.1 (role/locale) | `setFormulation` | CP-1.5, CP-2.4/5, CP-4.4 |
| `listApplicants` | CP-1.2, CP-5.4 | `getFormulation` | CP-1.7 (completeness read) |
| `createApplicant` | CP-1.1 | `listSupplierCertificates` | CP-1.6, CP-2.1 |
| `getApplicant` | CP-2.6, CP-5.4 | `createSupplierCertificate` | CP-1.6 |
| `updateApplicant` | CP-2.6 | `updateSupplierCertificate` | CP-2.5 |
| `listApplications` | CP-1.7, CP-5.4 | `issueCertificate` | CP-3.4/5, CP-4.5 |
| `createApplication` | CP-1.2, CP-4.3 (renewal kind) | `listCertificates` | CP-3.5, CP-4.1/5, CP-5.1 |
| `getApplication` | CP-1.7, CP-2 drill, CP-3.1/3 | `getCertificate` | CP-2.3, CP-4.2 |
| `advanceApplication` | CP-3.2, CP-4.3 | `setCertificateStatus` | CP-5.3 |
| `recordAuditOutcome` | CP-3.1, CP-5.2 | `openRenewalCase` | CP-4.3 |
| `listIngredients` | CP-1.3, CP-5.8 | `getRenewalLadder` | CP-4.2/6, CP-5.5 |
| `createIngredient` | CP-1.4 | `updateRenewalLadder` | CP-4.6, CP-5.5 |
| `updateIngredient` | CP-2.4, CP-5.8 | `exportRegister` | CP-5.7 |
| `getIngredientImpact` | CP-2.2 | `exportCertificate` | CP-3.6 |
| `importIngredients` | CP-1.3 | `listJobs` | CP-1.3, CP-3.6, CP-5.7 |
| `getArtifact` | CP-3.6, CP-5.7 (artifact retrieval) | `listActivity` | CP-5.6 |

32 operations, 0 orphans, 0 phantoms (Critic-verified).
