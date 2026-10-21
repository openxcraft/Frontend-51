# 08 — Integration Map: ad-spend-consolidator

Declared non-AI (ai-native-patterns §1): no operation on the adapter (07b) invokes an AI capability, and no abstract need below is required by any core workflow — the consolidation engine, the overlap detector, the overlay engine, and the pacing calculator are deterministic local rules (07c §2); the ledger, the reconciliation console, the comparisons, and pacing complete with every capability unbound (the 00 success signal, tested against the Mock Adapter's capability-off configuration). Architecture speaks only in abstract capabilities; UI copy says kind, not vendor (credential-contract §2).

## Abstract needs (4 — all optional; manual alternatives per LOOP-5)

| # | Abstract need | Why it exists | Consent semantics (credential-contract §4) | Manual alternative (always first-class) |
|---|---------------|---------------|---------------------------------------------|------------------------------------------|
| N1 | **Spend reporting channel** — "reads spend reports from a connected ad channel" | Five channels × weekly/monthly cadences is paste-hostile at scale; the analyst wants pulls, not downloads | Grant displayed as: "Reads spend reports from this channel's account for the windows you select" — read-only class, scoped per connection; extension to a new report shape asks explicitly | **Paste and file upload** of spend line items (07c row format) through the same parser — the primary path from first run; the sample workspace demonstrates the format before any credential exists. A workspace may run forever paste-only |
| N2 | **Report destination** — "writes exported report packs to a destination" | Finance-facing teams want packs filed to a vault/folder rather than downloaded | Grant: "Writes report export files on behalf of the workspace" — write class scoped to the export artifact class only | **Download/copy** the pack (consolidated statement, reconciliation ledger, overlay analysis, raw line items) — the default handoff; artifacts regenerable for 7 days, deterministically |
| N3 | **FX rate source** — "proposes exchange-rate rows for declared currency pairs" | Maintaining a declared rate table by hand is the paste-era chore the rate table exists to end | Grant: "Proposes exchange-rate rows for the currency pairs this workspace consolidates — every proposal requires your acceptance before it enters the table" — proposals ONLY, never auto-write (P15 on data, not just text) | **Paste/enter declared rate rows** directly (07c table; the seeded table carries both bases); the table always discloses itself as declared workspace policy — never a market feed. A bound source only pre-fills the accept queue |
| N4 | **Notification channel** — "notifies members outside the app" | Revision arrivals and export readiness matter to people who are not watching the console | Grant: "Sends notifications about revision arrivals, consolidation completions, and export readiness to workspace members" — message class only, per P21 tier control | **In-app notification center + daily digest** on the dashboard; revisions surface on app entry (return state, async-contract §6.3) — never orphaned in email only |

## Capability binding gates (LOOP-7 posture — evaluated at binding time, not now)

- **N1 read fidelity**: a fixed evaluation set (line-item field mapping, cadence preservation, revision-batch recognition) must pass before N1 ships active — import errors poison every downstream receipt and total (07c rule: snapshots derive from line items; a mis-mapped window is a wrong number finance will reconcile against).
- **N1 scope honesty**: the granted read window and the pulled window must agree — a pull outside the granted scope is a PERMISSION, never a silent clamp (07b rule 5).
- **N2 delivery fidelity**: pack integrity at destination (the reconciliation ledger is a governance artifact — corruption or partial delivery must surface as typed errors, not silent truncation).
- **N3 proposal discipline**: a bound rate source NEVER writes to the table directly; every row enters through the explicit accept step with basis and effective dates visible (ai-native-patterns §6 posture applied to data ingestion; the receipt records `source: 'accepted-proposal'` vs `declared-policy'` — provenance survives the audit).
- **N4 address hygiene**: consent-scoped recipients only; notifications carry counts and window names, never line-item payloads (data-minimization posture per credential-contract §7).

## Degradation map (ai-native-patterns §8 — trivial by declaration, stated for completeness)

| Surface | All capabilities unbound (default v1 state) | Any capability failing mid-session |
|---|---|---|
| Dashboard, timeline, breakdown, receipts, comparisons, pacing, reconciliation, snapshots | **Full function** — every engine is a deterministic local rule (07c); nothing pauses | Full function — capability failures surface only on their own affordances (channel pulls, pack delivery, rate proposals, outbound notify), typed per the 7-class taxonomy |
| Line-item intake | Paste + file upload (the primary paths) | N1 failure → typed error + paste path offered inline; the connection's freshness surface names the failed pull (never a silent gap) |
| FX rate table | Declared-policy rows entered/pasted by members | N3 failure → the accept queue simply stops receiving proposals; the table and every receipt are unchanged |
| Report packs | Download/copy artifacts | N2 failure → per-format retry + manual download of what delivered |
| Notifications | In-app center + digest | N4 failure → in-app surfaces unchanged |

Quota ladder (ai-native-patterns §5) applies only to the metered platform operations (consolidation runs, report-pack exports — P14, 07b getUsage); the deterministic engines themselves are never metered and never degrade — there is no AI rung to fall from, and the product must not fabricate one (no "reduced checking" states exist; a consolidation either runs or fails typed). The credential state surface (S8 connection rows) is where every N1/N3 health state renders — never a settings graveyard (credential-contract §3).

## Risk flags for the owner

- **N1 is the highest-leverage binding** and the highest-risk one: a mis-mapping at bind time corrupts receipts silently if the gate is weak — the fixed evaluation set is the gate, and the paste path remains the escape hatch and the cross-check (a paste-imported month beside a pulled month is the operator's own fidelity audit).
- **N3's proposal-only discipline is a product promise**: if a future rate source demands auto-write, that is a LOOP-4 re-opening of this map with the owner — receipts would need a new provenance class and finance would need to be told (12 Q-6 records the FX-basis default; N3's accept gate is the structural guard).
- **Paste-scale ceiling without N1**: the manual path comfortably carries hundreds of line items per import (07c fixtures run at 180); a five-channel daily operation is ~150 rows/day of paste — survivable for a transition, miserable as a permanent state. The 12 Q-10 recommendation states the trigger honestly.
