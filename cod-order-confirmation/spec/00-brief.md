# 00 — Brief: cod-order-confirmation

Family: commerce_integrations · Tier: 1 (FLAGSHIP) · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is

A confirmation console for merchants who sell on cash-on-delivery terms. COD drafts arrive from an order source (an abstract channel — the storefront or marketplace the merchant already runs; this product has no storefront of its own), and every draft carries the same unresolved question: **will a human actually be home, with cash, when the courier knocks?** The console answers that question before anything ships. Each order enters a **multi-attempt confirmation ladder** — a configurable, inspectable state machine of buyer contact attempts (rich interactive message first, plain text second, voice call third, human agent last) with cooldowns, quiet hours, and a hard expiry — and every buyer reply, non-reply, cancellation, and wrong-number complaint is captured as first-class data. When a buyer confirms, the confirmation lands as a **delivery-window agreement**: the buyer (through the channel's own interactive surfaces) or the agent (through the console) selects a concrete delivery slot from a capacity-aware window catalog, and that agreement is stamped onto the order record as ledger-grade evidence. Before, during, and after the ladder, a deterministic **RTO-risk scorecard** decomposes each order into readable components — buyer delivery history, order value against the workspace value cap, address quality, confirmation latency, channel engagement, buyer tenure — and renders the number WITH its math, never as an oracle.

The product ends at the courier's door, deliberately. Confirmed orders with agreements compile into a **courier handoff manifest** — a sealed, exportable batch artifact carrying each order's window, risk band, and confirmation evidence — which the merchant hands to whatever courier channel they use through an abstract handoff channel or the manual path (download/print/paste). There is no courier booking, no route optimization, no fleet logic at v1 (LOOP-10): the region's last-mile ecosystem is a binding-time decision for the owner, not a product promise. And there is no payment processing anywhere: the product never touches money, cards, or gateways; it touches intent, agreement, and evidence.

The AI stance is **conditionally-AI** (declared in 07a/07b/08): exactly one surface — the RTO-risk score — may be enriched by an abstract model capability when a workspace binds one; the contract guarantees the deterministic rule scorecard as the floor and the UI displays the engine's provenance honestly (`rule-scorecard` vs `model-assisted`). When the capability is unbound, rate-limited, or fails, the product is fully functional on the scorecard alone — no other surface reads a model, and no AI writes buyer messages (templates are human-authored, bilingual, versioned data).

## Buyer

- **Economic buyer**: the founder or e-commerce manager of a MENA D2C merchant running COD-heavy volume on a regional storefront platform — the person who reads the RTO line on the P&L and answers for double shipping fees and blocked inventory. Persona: Fahad (02). Every retrieved market signal (01 §3) says this buyer already pays for the problem in courier fees.
- **Daily users**: the **confirmation agent** (Hessa) who works the queue — today she works from a paper list and a phone dialer; the **dispatch/warehouse lead** (Munira) who refuses to ship unconfirmed boxes and needs the manifest gate; the **multi-site ops manager** (Salem) who sets per-site policies, quiet hours, and answers buyer disputes with the ledger. Four personas, 02.

Full persona set in 02-user-research.md.

## Surface

Responsive web console, desktop-first (≥1280px, keyboard-first — the queue is a speed surface: j/k row navigation, one-key actions, dense A-radius rows), with a first-class **on-call mobile view** (≥360px, touch) for manager exception review and agent call-leg work away from the desk. One IA, two shells (04): the console (queue, order detail with the Ladder Trail, agreement sheet, buyer profiles, holds, manifests, templates studio, policy center, ledger & jobs, inbox) and the on-call view (queue + order detail + decide actions only). No buyer-facing surface is rendered by this product — buyer touchpoints happen through abstract outbound channels (interactive messages, SMS-class text, voice/IVR-class calls) whose replies return as structured events; the console is the merchant's side of the conversation (LOOP-10: no storefront).

## Unique feature

**Multi-attempt confirmation ladder with delivery-window agreement and RTO-risk score.** Three interlocking mechanisms, all inspectable:

1. **The ladder as a state machine, not an automation vibe.** Competitor evidence (01 §2): the category sells single-channel blast apps ("send a WhatsApp confirmation") or closed network risk interception at checkout. Nobody ships the ladder itself — attempt kinds, cooldowns, quiet hours, expiry, escalation to a human with a call script — as configurable, versioned, replayable data. Every attempt renders in the Ladder Trail (the product's signature navigation object) with its state, timestamp, channel kind, and the buyer's response verbatim; agents never wonder "did we already call this person?".
2. **The window agreement as part of confirmation.** Delivery-slot selection exists as a checkout plugin category and as a last-mile concept (01 §5) — but no retrieved tool ties the agreed window to the confirmed COD order as evidence. Here the agreement is captured at the confirmation moment (quick-reply windows in the message, keypad menu on the voice leg, or two-tap picker in the agent sheet), capacity-aware against the window catalog, and stamped onto the order (the Agreement Stamp, 05/13) with the attempt that produced it — so a buyer who later claims "I never agreed to be home Thursday evening" meets a ledger entry, not a shrug.
3. **The risk score you can read.** A deterministic scorecard (07c §2: exact component formulas, weights, thresholds) that degrades from nothing — the conditionally-AI enrichment is optional and labeled. High-risk orders route to holds, value-cap gates, and ladder escalation; the scorecard sheet renders to agents and managers the way shift-swap-marketplace renders its fairness policy: inspectability is the feature.

## Exclusions (narrow scope, enforced by LOOP-10)

- **No storefront** — the product renders no buyer-facing commerce surface. Buyer interactions are authored as channel-abstract content (templates, window options, IVR menus) delivered through abstract channels; replies return as typed events. The order source is an abstract import (08 N1).
- **No courier booking at v1** — abstract handoff channel only (manifest export + manual download/print path); no route optimization, no courier selection, no courier API bindings, no fleet tracking claims. The manifest is the boundary artifact (LOOP-3 mirror: shipping-rate-comparator owns rate comparison, 12).
- **No payment processing** — no gateway, no card data, no COD-fee collection, no reconciliation of cash. The product records intent and evidence; money is the courier/merchant's existing process.
- **No buyer chat** — communication is structured: templates, quick replies, keypad menus, logged manual calls. A chat thread would recreate the group-chat chaos this product replaces.
- **No return logistics / no NDR re-attempt management at v1** — post-handoff outcomes (delivered/refused/returned) are recorded as buyer-history inputs when the channel reports them; the re-attempt/returns workflow itself is out of scope.
- **No AI-written messages, no AI calls** — the only model-touching surface is optional risk-score enrichment, labeled and degradable (conditionally-AI declaration, ai-native-patterns §1).
- **No buyer identity verification guarantee** — OTP-class checks are an abstract capability (08 N5) with a manual alternative; the product never claims a verified identity, only a recorded confirmation.

## Success signals (spec-level definition of done)

Against the Mock Adapter, with zero provider knowledge anywhere in the UI:

1. **An agent clears a 12-order live queue in under 6 minutes** on the console: every row shows risk band, ladder state, and time-to-next-attempt without opening the drawer; one keystroke sends the next attempt or opens the agreement sheet; the call-leg script renders with buyer history beside it.
2. **A full order journey on the Mock**: a COD draft imports from paste (LOOP-5 manual path), triages to risk 82 (low), auto-starts attempt 1 (message), gets no reply, escalates through the cooldown chain to the voice leg, the buyer confirms via keypad with window choice, the Agreement Stamp lands, the risk score recomputes to reflect the agreement, and the order compiles into a sealed manifest — all replayed deterministically twice with byte-identical state.
3. **A manager stands up the spine in under 30 minutes**: ladder policy (3 attempts, quiet hours, 48h expiry), risk policy v1 (weights + value cap), window catalog for one zone (4 windows, capacities), two bilingual templates with preview, and one blocklisted buyer — with every policy renderable as the same sheet agents see.
4. **The dispute test**: a buyer claims they never confirmed; the ledger view shows the attempt, the channel kind, the timestamp, the response verbatim, and the stamped window agreement in two clicks — exportable as the evidence artifact before its expiry window closes.
5. **The degradation test**: with every abstract channel unbound (messaging, SMS, voice, courier handoff, model enrichment), the product remains a complete confirmation desk — manual calling with logged outcomes, paste import, printed manifests, deterministic risk bands, and the full ledger (LOOP-5 bar).
