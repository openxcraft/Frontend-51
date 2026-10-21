# 04 — Information Architecture: helpdesk-triage-desk

## Navigation model

Left rail (mirrors in RTL per rtl-rules §2): **Triage** (home + queue + ticket detail) · **Clusters** (board + editor) · **Routing** (rules console) · **Policy** (severity & SLA studio) · **SLA** (monitor) · **Team** (queues + members) · **Queue/Jobs** (jobs center + exports) · **Settings** (locale, channel bindings, capability consent, usage). Two-level IA: section → item; ticket detail and cluster editor are detail-modes of their sections. ⌘K command palette (P05, T2 mandate) reaches tickets (by number + normalized subject search), clusters (bilingual label search), queues, routing rules, and jump-to-filter presets; recent items surface on open.

## Entity overview (07a for full shapes)

**Workspace** → owns **ChannelBindings** (credentials of kind "message intake"), **Members**, **Queues**, **RoutingRules** (versioned), the **SeverityPolicy** (versioned matrix + SLA targets), and **IntentClusters** (bilingual labels + signature terms + status proposed/confirmed/archived; versioned). **Tickets** arrive via channel or paste; each carries **LanguageAssessment** (deterministic detection + optional recorded override), **SeverityAssessment** (computed from the policy version at assessment time, signals named, override history), **ClusterAssignments** (method: rule-match / assist-proposal / confirmed-cluster / manual; actor; cluster version pin), **RoutingDecisions** (rule or manual-with-reason; queue; timestamp), **SlaClocks** (first-response from receivedAt; resolution from routedAt; states running/met/at-risk/breached/paused), **ResponseLogs** (the no-live-chat boundary: references, not messages), **Dispositions** (duplicate/spam/resolved-elsewhere/pending-requester), internal **Notes**, and an **ActivityEntry** chain (P17). **Jobs** span clustering runs, severity re-assessments, exports; **ExportArtifacts** carry expiry + regeneration.

## Screen inventory (11)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Triage home | intake pulse (new/unclustered/at-risk/breached), onboarding checklist (P22) | getSession, listTickets (count queries) |
| S2 | Triage queue | the virtualized new/routed queue — filter chips + saved views (P08), per-row language chip, severity badge, SLA state | listTickets, getTicket |
| S3 | Ticket detail | body at own direction, language declaration + override, severity panel with named signals, cluster membership, routing controls, notes, activity | getTicket, updateTicket, assignToCluster, routeTicket, mergeTickets, setTicketDisposition, logTicketResponse, escalateTicket, addTicketNote |
| S4 | Cluster board | intent clusters: bilingual labels, ticket counts, language mix, provenance (rules/assist), drill-in | listClusters, getCluster |
| S5 | Cluster editor | bilingual label authoring, signature-term editor, member list with matched terms, the confirm gate (P15) | saveCluster, confirmCluster, assignToCluster |
| S6 | Routing rules console | versioned rule list, condition/queue editing, active/inactive, evaluation traces | listRoutingRules, saveRoutingRule, listQueues |
| S7 | Severity & SLA policy studio | matrix editor, SLA targets, version history, re-assessment launch | saveSeverityPolicy, runSeverityReassessment, listJobs |
| S8 | SLA monitor | per-severity tiers, at-risk/breached/met, breach ledger with timelines | getSlaOverview, listTickets |
| S9 | Queues & members | queue list (bilingual names, owners, capabilities, hours), member directory | listQueues, saveQueue, listMembers |
| S10 | Jobs center & exports | clustering/re-assessment/export jobs, artifacts | listJobs, exportTriageLog, getArtifact, getUsage |
| S11 | Settings | locale defaults, channel bindings (credential surface), capability consent, usage window | listChannelBindings, createChannelBinding, verifyChannelBinding, revokeChannelBinding, getSession, getUsage |

Mobile (≤767px): S1, S8, S10 read/monitor modes; S3 disposition + acknowledge + response-log actions work one-handed (the CP-4 phone path); S2 bulk triage and S5/S6/S7 authoring are desktop/tablet (00 surface). Every screen states its filters (P08) and enumerates its four empties per P01 (11 matrix).

## Per-screen state obligations

First-run (S1 offers the seeded starter clusters + the sample batch with the planted cross-language incident — the P22 value moment); skeletons mirror final geometry per direction (P02, RTL skeletons flip); errors per 03 mapping; copy matrix in 11.

## IA decisions and rationale

- **Triage (S1–S3) is the product's front door**, not a dashboard: the buyer's morning is a queue, and the pulse counts are jump links, not vanity tiles. A triage console that opens on charts opens on delay.
- **Clusters get a first-class section (S4/S5)**, not a tag picker: cross-language intent clustering is the unique feature; burying it in ticket-row dropdowns would bury the product.
- **Routing rules (S6) and severity policy (S7) are separate screens**: they answer different questions ("where do things go" vs "how bad are they, how fast must we be") and change at different cadences — the org changes routing weekly, policy quarterly (02 Maysoon). Both are versioned data, so both get history surfaces.
- **SLA monitor (S8) is a derived-read surface**, not stored truth — clocks compute from event history (07a), so the monitor can never disagree with the ticket ledger (the Friday-sheet problem, 02 Faisal, answered structurally).
- **Queue/Jobs (S10) is small but first-class**: clustering runs, re-assessments, and exports are the product's async Jobs (async-contract §7); the binding-failure record that explains a breach lives beside them (CP-4.5).
- **Ticket detail binds assessment + cluster + routing + notes permanently** (S3): the triage decision needs all four in one view — a detail page that hides "why is this P2" is the opacity this product exists to kill (01 q10).
