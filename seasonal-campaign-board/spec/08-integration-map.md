# 08 — Integration Map: seasonal-campaign-board

Abstract capabilities only — no providers, no vendor names (hard rule 1). Every abstract need has a manual alternative (LOOP-5): the product is fully useful with zero credentials bound. Consent semantics per credential-contract.md.

## Abstract needs (3)

| # | Abstract need | Why | Consent & grant display | Manual alternative (always-first-class) |
|---|---------------|-----|--------------------------|------------------------------------------|
| N1 | **Calendar sync capability** ("write campaign anchors, phases, and due dates into the team's existing calendars") | Readiness dates land where the team already looks; phase windows become visible outside the board | Grant displayed per capability: "Writes calendar events for campaign anchors and due dates on behalf of the workspace" — event-class scoped, never blanket | **Calendar file export** — download a standard calendar file of the season's anchors/phases/due dates and import anywhere; plus the in-app dual-calendar strip itself |
| N2 | **Notification channel capability** ("send deadline reminders for at-risk, overdue, and blocked items") | Countdown-linked deadlines only work if owners hear them (P21 ladder: at-risk daily digest, overdue instant when permissioned, closure pending weekly digest) | Grant: "Sends deadline reminders to workspace members on behalf of the workspace" — per notification class; member opt-in tiers per P21 | **In-app Today view + task handoff export** — the board's intervention cluster and the forwardable handoff list (Yousef's floor path) carry the same information with zero send infrastructure |
| N3 | **File storage capability** ("store export artifacts for retrieval") | Readiness reports and handoff lists need a retrieval surface with a retention window | Grant: "Writes export files on behalf of the workspace" — artifact-class only | **In-app artifact view + copy/print** — every export renders in-app (readable, printable, copyable) before any storage binding exists |

## Credential semantics (credential-contract)

All three are workspace-level abstract bindings; UI copy names kinds, never vendors ("Calendar sync credential", "Notification sender credential", "Export storage credential"). Lifecycle states surface where the capability is used: a failed notification credential degrades reminders to in-app-only with the digest ladder intact ("Deadline reminders are paused — the notification sender credential failed verification; the Today view keeps the same deadlines"); an expiring storage credential surfaces on the artifact list with renewal — never only in settings. Every credential event appends to the activity log (P17). Session tokens of members are not credentials (07b session model stays auth-agnostic).

## Risk flags

- N1 write-scope creep is the real risk (a "sync" that mutates events it did not create): binding-time rule — the capability writes only events it owns, identified by campaign correlation; deletion is never propagated silently (LOOP-7 posture, assessed per binding).
- N2 quiet-hours discipline: reminder sends must respect regional night patterns (Ramadan nighttime economy inverts working hours — 02/01 evidence); the digest ladder (P21) is the guard, declared per class at binding time.
- N3 artifacts carry campaign names only — no customer data, no pricing beyond list prices; still treated as workspace-confidential with the standard retention window.

## Degradation map (ai-native-patterns §8 — non-AI product declaration)

This product is **declared non-AI** (00, 07a, 07b): no AI capability exists to degrade — every surface is deterministic (moment data, checklist math, readiness derivation, exports). The degradation map that matters here is *credential* degradation: N1/N2/N3 unbound or failed → the manual alternatives above at full parity; board, checklist, readiness, closure, and templates function with **zero** external capabilities bound. There is no quota ladder for AI rungs because there is no AI — the only metered surface is export count (07b getUsage), whose exhaustion pauses exports alone (11 RATE_LIMIT row).
