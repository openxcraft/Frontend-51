# 04 — Information Architecture: legal-case-tracker

## Navigation model

Left rail (mirrors in RTL per rtl-rules §2), palette-first skip link (skill row 45, a11y-baseline §3): **Docket** (S1 — the home surface: hearing board + matters triage) · **Matters** (S2 chronicle — entered from S1 rows, the ⌘K palette, or permalinks) · **Clients** (S6) · **Rules** (S7) · **Jobs** (S9) · **Activity** (S10) · **Settings** (S11). Documents (S4/S5) and Closure & Export (S8) are matter-context zones reached from the matter view's segment control (التسلسل الزمني timeline · المستندات documents · الإقفال closure). Two-level IA: section → item; the matter view is the workspace's organizing item, the timeline is its body. ⌘K command palette (P05, T2 mandate): bilingual normalized search over matters (titles, case numbers, courts), clients, events, documents; jump-to-matter and jump-to-date on the board; grouped results, recent items.

## Entity overview (07a for full shapes)

**Workspace** (policy defaults: weekend shift, original tracking, stock rules) → owns **Clients** · **Matters** · **DeadlineRules** · members (roles owner/attorney/paralegal/viewer). A **Matter** → contains **TimelineEvents** (polymorphic: hearing/deadline/filing/note/custom; hearings carry reschedule history + outcome chain; deadlines carry rule lineage) and **DocumentRecords** (version lineage append-only + custody chain append-only, seq contiguous from 1). Derived at read: **HearingCountdown** (zone), the cross-matter **HearingBoard**, the **closure gate**. **Job** (export), **ExportArtifact**, **ActivityEntry** (P17), **Session** (auth-agnostic).

## Screen inventory (11)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|--------|---------|---------------------|
| S1 | **Docket home** | the morning surface: cross-matter hearing board (zone-sorted, overdue first, prep-deadline column) + matters triage (urgencyZone / hasOverdue filters, counts, next-hearing column) + first-run value checklist (P22) + sample matter offer | listHearingBoard, listMatters, getSession |
| S2 | **Matter chronicle** | the matter's timeline bed: events in the recessed stratum, hearing cards with countdown rings, generated deadlines carrying rule names, parties rail, counts, gate summary chip, segment control (timeline/documents/closure) | getMatter, listTimelineEvents, updateTimelineEvent (reschedule entry), recordHearingOutcome (in-place recorder), completeDeadlineEvent |
| S3 | **Event detail** | one event full-frame: outcome history + correction chain, reschedule history, generated-deadline lineage (rule + source trigger), linked documents, countdown | getTimelineEvent, getDocument (linked), createTimelineEvent (related-note entry) |
| S4 | **Documents & custody register** | the matter's documents: kind/original/version-count/chain-length/last-action columns, unreturned-only companion view, register-document entry | listDocuments, registerDocument |
| S5 | **Document detail** | versions lineage (sealed marks), the custody strip rendered on the timeline bed (umber), verify state, add-version/seal/check-out/in actions | getDocument, addDocumentVersion, sealDocumentVersion, addCustodyEntry, verifyChain |
| S6 | **Clients directory** | clients list with matter counts, normalized bilingual search, client drawer with its matters | listClients, createClient, getClient, updateClient |
| S7 | **Deadline rules console** | the engine's parameters: stock vs firm rules, trigger/offset/lead/scope columns, author/edit/delete with forward-only regeneration surfacing, deactivation alternative | listDeadlineRules, saveDeadlineRule, deleteDeadlineRule |
| S8 | **Closure & export** | the gate (live blockers with jump links), the ClosureRecord + resolution ledger, export package composer (formats, quota, determinate progress), artifact list with expiry | getMatter (gate), closeMatter, getUsage, exportMatterPackage, getArtifact |
| S9 | **Jobs console** | export jobs: state filters, link-to-context (matter), cancel/retry, per-format partial recovery — referenced by 07b/07c as the jobs surface | listJobs |
| S10 | **Activity log** | every consequential mutation: actor, action, target, detail, timestamp; filter by actor/action/matter; keyboard-navigable, exportable (a11y-baseline §7) | listActivity |
| S11 | **Settings** | workspace policy defaults (weekend shift, original-tracking, stock-rules-on), locale/direction default, capability consent (kind-not-vendor), usage window | getSession, getUsage |

Mobile (≤767px): S1 board as a single-column zone list (overdue → today first); S2 timeline reads as a vertical chronicle (the bed keeps its strata semantics); outcome recording and custody check-in/out work at 360px (the corridor reality, 02 Layla/Faisal); S4–S11 read modes with desktop-first editing. Every screen declares its filters (P08) and its four empties per P01 (11 matrix).

## Workspace & permission structure

One workspace per firm; members carry the 07b roles — **owner** (Abdullah: rules save/delete, closure, everything), **attorney** (Layla/Omar: full matter work incl. closure, not rule management), **paralegal** (Faisal: matters/events/documents/custody, not closure or rule deletion), **viewer** (Hind: attached matters' timeline + hearing dates, read-only, free seat). The viewer's home is a scoped matters list (her matters with next-hearing countdowns) — the firm-wide board, rules, clients directory, documents, activity, and jobs are not rendered for her seat at all (absent, not disabled-with-mystery). Client-side data exposure stays matter-scoped: no client lists, no other matters, no activity log (07b rule 4).

## Per-screen state obligations

First-run (S1: sample matter m-s01 offer + P22 checklist — the value moment is watching the gavel settle); skeletons mirror final geometry per direction (P02 — RTL skeletons flip; the board's skeleton keeps the zone column order); errors per the 03 mapping (7-token table in 11); every list surface virtualizes past 200 rows (P19). The timeline's sticky date rail clears focus (2.4.11) and the board's sticky zone header compensates padding (skill row 2).

## IA decisions and rationale

- **The docket is the home, not a matters table**: litigation teams open the product to answer "what needs me now" (02 J1) — zone-sorted consequence beats alphabetical case numbers; the matters triage with urgency filters sits *beside* the board for Abdullah's whole-firm scan.
- **The chronicle is the matter view's body**: the timeline bed is the product's identity surface (05 — events happen IN time); documents and closure are segment-mates, not separate nav nodes, because they are always matter-scoped work.
- **Event detail is a first-class screen**: outcomes have correction chains, reschedules have history, generated deadlines have lineage — these audit shapes need room the timeline card cannot give (S3).
- **Rules console is top-level, owner-discipline framed**: the engine's parameters are the firm's practice codified (02 Abdullah) — hiding them in settings would hide the product's determinism from its buyer.
- **Closure & export share one screen (S8)**: the gate, the record, and the archive are one narrative — "what blocks it, what closed it, what leaves the building" (02 J5/J9).
- **Jobs console is S9, exactly as 07b/07c reference it**: exports are the only async class (07a JobKind), but the surface is first-class per async-contract §7 (T2 gives it dedicated IA).
- **Activity log is top-level (S10)**: the accountability surface is a destination (auditor walks in through it), not a drawer — a11y-baseline §7's legal/audit obligation.
