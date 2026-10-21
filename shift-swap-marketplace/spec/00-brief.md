# 00 — Brief: shift-swap-marketplace

Family: business_ops · Tier: 1 (FLAGSHIP) · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is

A fairness-ranked shift-swap marketplace for frontline teams (retail, F&B, warehouses, clinics, logistics hubs) in MENA. Workers post a shift they need covered; qualification-matched colleagues request it; a deterministic, fully inspectable fairness engine ranks the request queue (seniority, swap balance, qualification coverage, recency of last swap, rest-compliance); the posting worker accepts from the ranked ladder, and the supervisor confirms — with every decision leaving an audit-grade fairness ledger. The product is **declared non-AI** (ai-native-patterns.md §1): the fairness ranking is a rules engine whose policy is versioned, displayable to every worker, and whose every match carries a machine-composed rationale string a worker can read in one breath. No magic, no buried model — the ranking is the trust surface.

This is plan **renegotiation**, not plan creation: schedules arrive from the schedule source (the planner product or an external roster — abstract import, 08) and the marketplace only re-shapes coverage within declared rules (blackout windows, minimum rest, weekly-hour caps, qualification requirements). Swaps are second-class citizens of the plan and first-class citizens of fairness.

## Buyer

Dual buyer by construction — the product is bought by the person who answers for coverage and used daily by the people whose shifts move:

- **Economic buyer / supervisor surface (desktop ≥1280px)**: frontline supervisors and ops managers who today arbitrate swaps over group chats and paper, with no record of who got which swap or why. Primary: shift supervisors at multi-site retail/F&B/logistics operators across MENA. Secondary (rules authority): ops leads who own qualification registries and jurisdiction rules (e.g., Saudization/Nitaqat-shaped role eligibility in KSA — 01 §5).
- **Daily user / worker surface (mobile-first ≥360px)**: the frontline workers themselves — cashiers, pickers, baristas, nurses' aides — Arabic-first, phone-only, for whom the current alternative is a group chat with screenshots of the roster (01 §3 status quo).

Full personas in 02-user-research.md (2 worker personas, 1 supervisor, 1 ops lead).

## Surface

Responsive web app with **two deliberately different faces over one IA** (04):

- **Worker surface (mobile-first, ≥360px, touch-only assumption)**: my shifts, the swap board, offer detail with fairness reveal, post-a-swap wizard, my requests with a visible status ladder, qualifications card, notification inbox. Every touch target ≥44px (a11y-baseline §2; ux-guidelines row 22).
- **Supervisor console (desktop-first, ≥1280px, keyboard-first)**: approval queue with fairness visibility per match, team schedule read-only view, rules center (blackout rules, qualifications, fairness policy weights), workers & qualifications registry, activity/audit ledger, jobs center.

One product, one adapter, two shells. No separate app binary; the console re-flows from the same routes.

## Unique feature

**Fairness-ranked swap matching with qualification match and blackout rules.** Workers see a ranked ladder, not a first-come feed: each candidate's position is decomposed into readable components (tenure, swap balance, qualification fit, rest compliance) and each accepted match carries its rationale string in both locales. Blackout rules — minimum rest between shifts (clopening prevention, with US Fair Workweek / DOL Fact Sheet 56B precedent cited in 01 §4), weekly-hour caps, qualification-required windows, jurisdiction packs — are hard gates evaluated *before* ranking, so an ineligible request never outranks an eligible one. Competitor evidence (01 §2): grab-first semantics everywhere; nobody ranks, nobody explains. The fairness ledger is exportable as the accountability artifact for grievances and audits.

## Exclusions (narrow scope, enforced by LOOP-10)

- **No full scheduling or plan creation** — attendance-shift-planner (T2, same batch) owns planning and labor-rule guardrails at plan time; this product owns renegotiation of published coverage. The adjacency is flagged in BOTH products' 12-open-questions (LOOP-3, no silent resolution; boundary: plan creation vs plan renegotiation).
- **No payroll, no pay calculations, no overtime pricing** — swap economics (premiums, allowances) are out of scope; the product records who worked what, not what it cost.
- **No messaging app** — no chat threads between workers. Communication is structured only: request notes (bounded), decision notices, notification ladder (P21). A chat surface would recreate the group-chat chaos this product replaces.
- No attendance/clock-in or time tracking hardware (attendance-shift-planner's family boundary).
- No labor-law compliance guarantee — blackout rules are configurable guardrails with cited defaults, not legal advice (copy states this plainly, 11).
- No cross-employer "gig" market — one workspace = one employer's teams.
- No AI anywhere (declared): ranking, matching, and rationale generation are deterministic rules over declared inputs (ai-native-patterns.md §1 declaration rule honored; there is no model behind any surface).

## Success signals (spec-level definition of done)

Against the Mock Adapter, with zero provider knowledge anywhere in the UI:

1. **A full worker journey on a phone-sized viewport (360px, Arabic RTL)**: a worker with one qualification gap and one rest-window edge case can — between two smoke breaks — view this week's shifts, post a swap with the eligibility pre-flight, see the board, understand why a request is ranked second (rationale string), receive the match notification, and watch the status ladder resolve to confirmed. No desktop fallback needed at any step.
2. **A supervisor can clear a 12-item approval queue in under 5 minutes** on the console: every item shows the ranked ladder it came from, the top-3 fairness snapshot, and one-keyboard-key decisions with mandatory rationale on denial.
3. **An ops lead can stand up the rules spine in under 30 minutes**: qualifications registry (paste-import), two blackout rules (minimum rest, weekly cap), and a fairness policy review — with the policy sheet renderable to workers as-is (inspectability is a feature, not a setting).
4. **The fairness ledger exports** as an audit artifact naming actor, decision, ranking snapshot, and policy version for every swap in a period.
5. **Every match in the seed data is explainable**: replaying the 07c fixture twice produces identical rankings and identical rationale strings (determinism is the trust contract).
