# 04 — Information Architecture: shift-swap-marketplace

SME-C pass · One product, two shells, one IA. The worker surface and the supervisor console are navigation experiences over the same entity graph (07a) and the same adapter (07b) — no separate information model exists, only viewport- and role-shaped projections. Every screen's data needs map to adapter operations; no screen renders data the contract cannot supply.

## Entity overview (navigation-relevant; full contract in 07a)

Worker · Qualification · WorkerQualification · Shift · SwapOffer · SwapRequest · FairnessScore (+ FairnessPolicy) · SwapMatch · BlackoutRule · ApprovalRecord · NotificationEvent · ActivityEntry · Job. Movement spine: **Shift → SwapOffer → SwapRequest(s) → (ranked) SwapMatch → ApprovalRecord → confirmed coverage**. The fairness ledger (ApprovalRecord + ActivityEntry chain) is a first-class IA citizen — it is the product's accountability destination, not a settings afterthought.

## Navigation model

### Worker surface (mobile-first, ≥360px; bottom tab navigation, RTL-mirrored rail)

Bottom tabs (4): **MY SHIFTS** (default) · **BOARD** · **MY SWAPS** (requests + offers, the status ladder) · **INBOX** (notifications). Profile/qualifications card lives behind the MY SHIFTS header avatar (one level deep). Offer detail, post-a-swap wizard, policy sheet, and worker profile are stack-pushed sheets over the tabs. Model: two levels — tab surfaces → detail sheets; no nested routes beyond detail + sub-detail (rationale drill). ⌘K palette (P05) is available on hybrid/touch-keyboard devices (tablets, desktop-resize) with bilingual normalized search (rtl-rules §4); on pure-touch phones the board's filters are the primary retrieval mechanism (search is not the CTA here — unlike a consumer marketplace, the board is bounded to the worker's own site/team scope).

### Supervisor console (desktop-first, ≥1280px; inline-start rail + content)

Rail: **QUEUE** (approval queue, default for supervisors) · **SCHEDULE** (read-only team schedule) · **RULES** (blackout rules + fairness policy) · **PEOPLE** (workers + qualifications) · **LEDGER** (activity + fairness export) · **JOBS**. Ops-lead role lands on RULES by default (persona-optimized entry, 02). Match review is a drawer over QUEUE (not a route — decisions happen in queue context, CP-4). ⌘K palette (P05) reaches queue items, workers, rules, actions (approve/deny on focused row), and the ledger filters.

## Screen inventory (17 screens; viewport per screen)

Label map: 03's flow shorthand maps onto this inventory — worker-surface labels M1=S1 (MY SHIFTS), M2=S2 (THE BOARD), M3=S3 (OFFER DETAIL), M5=S5 (MY SWAPS), M6=S7 (INBOX); console labels D1=S11 (CONSOLE QUEUE), D3=S13 (TEAM SCHEDULE), D4=S14 (RULES CENTER), D5=S16 (PEOPLE & QUALIFICATIONS), D7/D8=S17 (LEDGER & JOBS — the ledger and job-center views share the S17 console screen). One inventory, two shells, one set of identifiers.

| # | Screen | Shell / viewport | Purpose | Key data needs (→ 07b) |
|---|---|---|---|---|
| S1 | MY SHIFTS | Worker / 360px+ | 14-day schedule, coverage states, entry to post-a-swap | listShifts(Query), getShift(id), subscribeSwapEvents |
| S2 | THE BOARD | Worker / 360px+ | open swap offers, filters, visible-but-gated ineligible cards | listSwapOffers(Query), checkSwapEligibility, subscribeSwapEvents |
| S3 | OFFER DETAIL (Fairness Reveal) | Worker / 360px+ | shift facts, viewer eligibility panel, rank preview ladder, policy sheet link | getSwapOffer, checkSwapEligibility, computeFairnessRanking, createSwapRequest, getFairnessPolicy |
| S4 | POST-A-SWAP wizard | Worker / 360px+ | 3-step progressive form: shift → pre-flight → note | listShifts, getShift, checkSwapEligibility, createSwapOffer |
| S5 | MY SWAPS (status ladder) | Worker / 360px+ | my offers + my requests with live rank and outcome states | listMySwapRequests, listSwapOffers(filter mine), cancelSwapRequest, cancelSwapOffer, subscribeSwapEvents |
| S6 | RANKED LADDER (offerer view) | Worker / 360px+ | full ranked queue for my offer; rationale drill; accept | listRequestsForOffer, computeFairnessRanking, acceptSwapRequest, denySwapRequest |
| S7 | INBOX | Worker / 360px+ | notification ladder per class, seen state | listNotifications, markNotificationsSeen |
| S8 | WORKER PROFILE & QUALIFICATIONS | Worker / 360px+ | my qualification cards, expiries, swap balance, seniority band | listWorkers(filter self), listQualifications, assignQualification(read-only at worker role) |
| S9 | POLICY SHEET | Worker / 360px+ (also console) | worker-readable fairness policy + blackout rules, versioned | getFairnessPolicy, listBlackoutRules |
| S10 | SIGN-IN | Both / all | session entry, locale pick, role routing | getSession |
| S11 | CONSOLE QUEUE | Console / 1280px+ | approval queue, aging, rule flags, bulk-safe select | listMatches(Query), recordSupervisorDecision, denySwapRequest |
| S12 | MATCH DRAWER | Console / 1280px+ | ladder snapshot, rationale chips, rest ribbons, decide | listRequestsForOffer(snapshot via match), getSwapOffer, getShift, listWorkers |
| S13 | TEAM SCHEDULE | Console / 1280px+ | read-only imported schedule; swap coverage overlay | listShifts(Query), getShift, importScheduleSource(manual entry path) |
| S14 | RULES CENTER | Console / 1280px+ | blackout rules CRUD w/ plain-language previews | listBlackoutRules, upsertBlackoutRule, archiveBlackoutRule |
| S15 | FAIRNESS POLICY (edit + simulate) | Console / 1280px+ | weights, tiebreaks, caps; before/after simulation | getFairnessPolicy, updateFairnessPolicy, computeFairnessRanking, listSwapOffers |
| S16 | PEOPLE & QUALIFICATIONS | Console / 1280px+ | worker roster, qualification registry, paste-import, assignment | listWorkers, inviteWorker, updateWorker, listQualifications, upsertQualification, assignQualification |
| S17 | LEDGER & JOBS | Console / 1280px+ | activity log, fairness ledger export, job center | listActivity, exportFairnessLedger, getJob, retryJob, cancelJob |

Responsive behavior: the worker surface is the base layout (mobile-first — ux-guidelines row 1: design for mobile then enhance); 768–1279px (tablet) renders worker tabs + console rail in a hybrid layout where QUEUE/SCHEDULE become available to supervisor-role sessions; ≥1280px is the full console. The console NEVER renders below 768px — supervisor decisions are keyboard/dense-surface actions (02 personas; a phone-sized approval queue would recreate the chat-group ergonomics this product replaces). Workers on desktop-width browsers get the worker surface centered at a comfortable reading column, not a fake console.

## Per-screen state obligations

Each screen declares its four empties (P01), loading shape (P02 skeletons mirroring final geometry, RTL-flipped), and error classes (03 mapping) in the 11 matrix. Board-specific empties are persona-critical: first-run (no offers — teach the posting loop), no-data-after-activity (offers existed; all matched/expired — show outcomes), no-access (worker scoped to another site), filtered-empty (offers exist outside the qualification filter — offer filter reset + name the missing qualification, never a silent blank) (02 objection matrix: "certificate expired → board silently hid things").

## IA decisions and rationale

- **The board is bounded, not searchable-at-scale**: retrieval is by filters over the worker's site/team scope — a bounded market, not an open search index (rejects the consumer-marketplace "hero search" pattern; this is an ops tool where predictability beats discovery). Search (⌘K) serves navigation and the console, not the board.
- **The status ladder is one screen (S5), not scattered states**: Yusuf/Amna live in MY SWAPS as the home of "where do I stand" — rank deltas, outcomes, and history co-located (02: transparency of position is the daily question).
- **The policy sheet is a worker-facing screen (S9), not an admin artifact**: inspectability is the trust feature (00); workers reach it in two taps from any rationale chip.
- **Supervisor decisions live in a drawer, not routes**: queue context preserves the aging/flag information that a standalone match page would lose; keyboard flow stays j/k → A/D (CP-4).
- **The ledger is top-level (S17)**: accountability is a destination for Noora/Tariq (grievance packets, HR audits) — not buried in settings (P17 discipline).
- **Qualifications are one registry with two projections** (S8 worker view, S16 admin view): same entity, different permissions — prevents the spreadsheet-drift failure mode (02 Tariq).
