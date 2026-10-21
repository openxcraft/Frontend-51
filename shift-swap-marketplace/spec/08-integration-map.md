# 08 — Integration Map: shift-swap-marketplace

SME-G + SME-H pass · External touchpoints expressed ONLY as abstract needs (LOOP-5/7/13 discipline; credential-contract grammar). Core value requires ZERO integrations — the product is fully functional standalone against the Mock Adapter with the manual paths below. **Declared non-AI product** (ai-native-patterns §1): there is no AI capability need at all; N-list below contains no AI entry, and no AI degradation map applies — the "degradation" concept here is schedule-source staleness, handled with honest state copy (P01-adjacent), not an AI rung ladder.

## Abstract needs (all optional; none chosen)

| # | Abstract need | Why it would exist | Manual alternative (pre-integration usefulness — credential-contract §6) |
|---|---------------|--------------------|------------------------------------------------------------------------|
| N1 | **Schedule source import** ("pull published shifts from an external roster/schedule system into this workspace's read-only schedule spine") | The planner product (attendance-shift-planner, LOOP-3 adjacency) or an incumbent roster system is the plan's system of record; manual entry does not scale past ~50 shifts/week (01 §9: schedule-sync staleness is a named, public complaint in the category) | Paste-import (CSV/TSV with column mapping + row-level validation — CP-5.7) and per-shift manual entry in the read-only team schedule view. Freshness is always displayed ("آخر استيراد: قبل 3 أيام" / "last import: 3 days ago"); staleness never silently trusted |
| N2 | **Notification channel** ("deliver swap pings and digests to workers outside the app") | Workers are phone-only and mid-shift; the instant tier (match confirmed / supervisor decision) is time-critical — Amna should not have to poll the board on her break (02) | In-app inbox (S7) with the full P21 tier ladder; digest classes batch in-app by default. The channel binding upgrades delivery, not semantics — every event already exists in the contract (07b NotificationEventDTO) |
| N3 | **Worker identity source** ("prove worker identity via an external identity system") | Enterprise buyers will demand workforce SSO at purchase time; phone-number identity is v1 scale's honest choice | Phone-number invite + workspace-scoped worker records (07a); the session contract (07b) is identity-agnostic so binding later changes no UI |
| N4 | **Credential for the labor-platform class** ("read role-band eligibility status from an official labor platform") | KSA labor platforms (Qiwa class, 01 §5) already mediate role-eligibility and work permits; role-band qualifications could be verified rather than hand-maintained | Role-band qualifications are maintained by the ops lead in the registry (assign/expiry workflow, CP-5.3) with renewal digests; the jurisdiction-pack rule (07a) carries packCode references without claiming legal verification |
| N5 | **Ledger delivery destination** ("send the exported fairness ledger to an external destination") | Tariq's HR audit packet flows through email/file handoffs today (02) | Export artifact download + paste (S17); expiry window surfaced per async-contract §2 |

## Risk flags (LOOP-7 style, for binding-time owners)

- N1 binding to the planner product is a CROSS-PRODUCT contract decision (LOOP-3): both sides' specs flag the adjacency; the actual import binding (shape, frequency, conflict semantics on re-publish) is an owner decision recorded in 12 Q-5 — no silent coupling at v1.
- N1 freshness contract: an import binding must declare what happens on roster re-publish (shift moved/deleted upstream) — the spec's answer is declared behavior (cancelled-upstream + offer auto-withdraw with reason, 07a state machines); any binding must honor it or surface divergence explicitly.
- N2 channel semantics: instant-tier events are blocking-workflow class; a channel binding must not demote them to digest, and must never expose swap content beyond the workspace scope (credential-contract §7 never-events apply: no payload in URLs/logs).
- N4 is the highest-risk need: official-platform data is jurisdictional and change-controlled; the product's posture is reference-not-verify (packCode echo + owner-supplied configuration, 12 Q-8) — a binding that *verifies* would change the compliance claims the product is allowed to make (00 exclusions).

## Consent semantics (per credential-contract)

- Worker-facing surfaces never see credential kinds at all — the only credential-class surfaces are console-side (schedule source, notification channel, identity source, labor-platform reader, ledger destination), presented in capability language ("يقرأ الجداول المنشورة نيابة عن مساحة العمل" / "reads published schedules on behalf of the workspace"), kind-not-vendor.
- Grant display precedes any save (credential-contract §4): each need's grant names the operation classes it unlocks (read schedules / send swap notifications / verify role bands / deliver ledger files).
- Worker data minimality is structural: the swap contract needs display name, team, seniority anchor, qualifications, and swap history — the adapter exposes nothing else on Worker (07a), which is the consent posture expressed in Amna's objection answer (02).

## Degradation map (non-AI product — schedule-source staleness & channel absence)

| Surface | Import bound & fresh | Import stale / manual mode | Channel (N2) absent |
|---|---|---|---|
| Worker board & my shifts | live coverage states | identical function; staleness age displayed on the schedule spine; cancelled-upstream still resolves with reason | identical function; inbox only; instant events surface on next app open with return-state (async-contract §6.3) |
| Supervisor queue & schedule view | full | identical; schedule view labels source per shift (import/manual) | identical |
| Fairness engine & ledger | full | full (rules run on whatever spine exists — determinism unaffected) | full (ledger export is N5, independent of N2) |

The product remains a complete swap marketplace with fairness ledger in every column — the LOOP-5 bar ("a product that is useless without a credential is a rejected spec") is met by construction: the manual paths are the v1 primary paths, not fallback theater.

## Provider-name discipline

No integration, credential, or provider is named anywhere in the product UI; capability language per credential-contract §2.3. This file names zero providers; competitor/provider references live only in 01/02/13 per the portfolio provider-name ban (audit_batch rule 2).
