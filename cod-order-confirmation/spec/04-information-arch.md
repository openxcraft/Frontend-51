# 04 — Information Architecture: cod-order-confirmation

SME-C pass · One product, two shells, one IA. The console (desktop-first, keyboard-first) and the on-call mobile view (≥360px) are projections of the same entity graph (07a) and the same adapter (07b) — no separate information model exists. Every screen's data needs map to adapter operations; no screen renders data the contract cannot supply.

## Entity overview (navigation-relevant; full contract in 07a)

User · Buyer · CodOrder · ConfirmationAttempt · BuyerResponse · DeliveryWindow · WindowAgreement · RiskScore (+ RiskPolicy, LadderPolicy) · MessageTemplate · HandoffManifest · NotificationEvent · ActivityEntry · Job. Movement spine: **CodOrder → (triage: RiskScore) → ConfirmationAttempt(s) → BuyerResponse → WindowAgreement → confirmed → HandoffManifest (sealed) → exported artifact**, with outcome events closing the loop into Buyer history. The confirmation ledger (ActivityEntry + attempt/response/agreement chain) is a first-class IA citizen — it is the dispute destination (02 Salem), not a settings afterthought.

## Navigation model

### Console (desktop-first, ≥1280px; inline-start rail + content)

Rail: **QUEUE** (default for agent + manager roles) · **HOLDS** (manager default alternative; exceptions needing decisions) · **MANIFESTS** (default for dispatch) · **BUYERS** · **TEMPLATES** · **POLICY** · **LEDGER & JOBS** · **INBOX**. Order detail is a **drawer over QUEUE** (never a route — queue context is decision information: countdowns, aging). The agreement sheet, call-leg sheet, and message-preview sheet are stack-pushed sheets over the drawer (two levels max: rail surface → drawer → sheet). ⌘K palette (P05) reaches orders (orderRef/phone/name with Arabic normalization), buyers, manifests, templates, windows, and actions ("seal manifest", "simulate policy") with bilingual normalized search (rtl-rules §4).

### On-call mobile view (≥360px, touch)

Tabs (3): **QUEUE** (dense cards: band chip, ladder rung state, countdown) · **ORDERS** (my touched orders today) · **INBOX**. Order detail is a bottom sheet carrying the same drawer content re-flowed; decide actions (log manual contact, record response, agreement sheet) are first-class on the phone — Hessa's evening surge and Salem's weekend disputes happen here. The console NEVER renders below 768px; policy/template/rule surfaces are console-only (desktop work); 768–1279px renders the on-call view centered with console rail available to manager roles for read + decide (no authoring).

## Screen inventory (13 screens; viewport per screen)

| # | Screen | Shell / viewport | Purpose | Key data needs (→ 07b) |
|---|---|---|---|---|
| S1 | SIGN-IN | Both / all | session entry, locale pick, role routing | getSession |
| S2 | QUEUE | Console ≥1280 + on-call ≥360 | live confirmation queue: band, ladder state, countdown, aging | listCodOrders, getCodOrder, getBuyer, subscribeOrderEvents, rescheduleAttempt, logManualContact, recordBuyerResponse |
| S3 | ORDER DRAWER (Ladder Trail + Risk drill) | Console (drawer over S2) / on-call bottom sheet | the working context: trail, buyer card, risk drill, actions | getCodOrder, getBuyer, computeRiskScore, getLadderPolicy, previewMessage, rescheduleAttempt |
| S4 | AGREEMENT SHEET | Console (sheet) / on-call (sheet) | window selection + stamp; capacity-aware | proposeWindowsForOrder, listDeliveryWindows, recordBuyerResponse, computeRiskScore |
| S5 | CALL LEG SHEET | Console (sheet) / on-call (sheet) | voice-rung script, buyer history, outcome recording | listMessageTemplates, getBuyer, getCodOrder, logManualContact, previewMessage |
| S6 | HOLDS & EXCEPTIONS | Console / on-call read+decide | value-cap + risk-band + blocklist holds review | listCodOrders(held filter), getCodOrder, computeRiskScore, setOrderHold, cancelCodOrder, setBuyerStatus |
| S7 | MANIFESTS | Console (dispatch default) | draft build, rollup review, seal, export/print | listHandoffManifests, listCodOrders(confirmed filter), createHandoffManifest, sealHandoffManifest, exportManifest, getJob |
| S8 | TEMPLATES STUDIO | Console | bilingual template authoring + buyer-view preview | listMessageTemplates, upsertMessageTemplate, previewMessage |
| S9 | POLICY CENTER | Console | ladder + risk policies (simulation-gated), window catalog, people | getLadderPolicy, updateLadderPolicy, getRiskPolicy, updateRiskPolicy, simulateRiskPolicy, computeRiskScore, listDeliveryWindows, upsertDeliveryWindow, listUsers, inviteUser, updateUser |
| S10 | BUYERS DIRECTORY | Console | buyer history trails, blocklist management | listBuyers, getBuyer, setBuyerStatus |
| S11 | LEDGER & JOBS | Console | dispute chain view, activity log, exports, job center | listActivity, exportConfirmationLedger, getJob, retryJob, cancelJob, listCodOrders(context) |
| S12 | INBOX | Console + on-call | notification ladder per class, seen state | listNotifications, markNotificationsSeen |
| S13 | ONBOARDING CHECKLIST | Both / first-run overlay | P22 value milestones, four persona entry paths | (links into S2/S6/S7/S9; no own data) |

Responsive behavior: the console is the base layout; below 768px the on-call view takes over (queue/orders/inbox tabs); 768–1279px hybrid (on-call layout + console rail for manager read/decide). Workers-on-phone never see authoring surfaces (policy, templates, catalog) — those are desktop judgment surfaces by persona (02).

## Per-screen state obligations

Each screen declares its four empties (P01), loading shape (P02 skeletons mirroring final geometry, RTL-flipped), and error classes (03 mapping) in the 11 matrix. Queue-specific empties are persona-critical: first-run (no orders — teach the paste-import loop), no-data-after-activity (orders existed; all resolved — show outcomes), no-access (agent scoped out of a site), filtered-empty (orders exist outside the band filter — reset + name what exists). Manifests empties distinguish "nothing confirmed yet today" (teach the ladder) from "all confirmed orders already sealed" (show the sealed set + next-manifest path).

## IA decisions and rationale

- **The queue is the product's home, and it is a work-order, not a feed**: sorting by time-to-next-attempt + risk makes the queue self-explanatory — the agent's next action is always the top row (rejects consumer-inbox patterns; Hessa's paper list is the incumbent).
- **Order detail is a drawer, not a route**: countdowns and aging are decision information that a standalone page would orphan; keyboard flow stays j/k → Enter → action (CP-2).
- **The Ladder Trail is the navigation object inside the drawer**: attempts are a chronological spine with states — the trail replaces both "activity feed" and "status field" with one inspectable object (13 §B1).
- **The agreement is a SHEET, not a modal confirmation**: window selection is a real decision with capacity data, not a confirm dialog (P04's spirit — no "Are you sure?" grammar anywhere).
- **Holds are a separate rail destination (S6)**: decisions pending human judgment get their own queue — mixing holds into the work queue would blur engine-decided vs human-decided states (02 Fahad's "no black boxes" answer).
- **Manifests default for dispatch, queue for agent/manager**: role-optimized entry per persona (02 onboarding motives; the ssm house pattern).
- **The ledger is top-level (S11)**: dispute resolution is a destination, not a tab on the order (Salem's two-click test — CP-4.5); exports live beside it (artifact + expiry, async-contract §2).
- **Templates and policy are adjacent rail items (S8/S9)**: both are versioned authored data that shape the ladder; the simulation gate lives where the policy lives (CP-6.2).
- **The on-call view carries decide-actions, not authoring**: the phone is for the evening surge and weekend disputes; authoring surfaces stay desktop (density + keyboard verification, 09).
- **One catalog, three rungs (windows)**: the window catalog is authored once (S9) and consumed by message quick-replies, voice keypad menus, and the agent sheet — the agreement never depends on which channel answered (CP-3.3).
