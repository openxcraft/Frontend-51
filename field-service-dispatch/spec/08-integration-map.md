# 08 — Integration Map: field-service-dispatch

## Abstract needs (all optional at v1; the manual alternative is the primary path from first run — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Customer confirmation channel** ("send confirmation requests and arrival notices to customers; receive their replies") | The touchpoint loop's automated half — the 85%-WhatsApp-channel reality of MENA customers (01 evidence) | The copyable confirmation link (dispatcher pastes it into whatever channel the customer actually uses) + phone-outcome recording (`recordTouchpointReply` via phone-manual) — the queue is identical either way; the tested default state |
| N2 | **Technician notification channel** ("notify technicians of new assignments and day changes") | Push-style delivery for the mobile shell when the technician is not looking | My-day pull on app open + the printable day sheet (S8) for the morning meeting; offline queue reconciles state (P20) |
| N3 | **Inbound request channel** ("receive service requests from external surfaces — a website form or request inbox") | Phone intake is the norm, but request-form traffic exists | Dispatcher creates the job card from the call/request (CP-1) — intake is designed keyboard-first for exactly this |
| N4 | **Export delivery channel** ("deliver day sheets and job-history artifacts to destinations") | Email-style handoff of dispute evidence (02 Basma) | Artifact download from S8 (7-day window, regenerable) |

## Consent semantics (credential-contract)

- N1 consent is per-capability-class: the workspace grants "send confirmation messages and receive replies on behalf of the workspace" — displayed in capability language before save (credential-contract §4), never a vendor name. Grant extension asks explicitly if sends widen scope (new customer locales/templates). The credential's lifecycle states surface wherever touchpoints are requested (S4 queue header), never only in settings; failure degrades the send action to the copy-link path in the same surface (credential-contract §3/§6).
- N1 privacy boundary (ai-native-patterns §9 discipline applied to non-AI sends): outbound touchpoints carry minimum facts — customer name, job title, window, and the confirmation link — never job notes, asset tags, technician phones, or address beyond what the visit requires; reply capture writes only the outcome + timestamp to the job card.
- N2/N3/N4: notification-tier control per class (P21); request intake and export delivery never require N2; no capability's failure blocks a core flow (never-events honored: no secret in a touchpoint, artifact, or announcement).

## Binding gates

- **N1 binding-time evaluation set** (12 Q-6): bilingual send/receive round-trip on a fixed fixture set — Arabic-script delivery fidelity, reply capture latency, and template-locale rendering (ar/en) must pass before the capability ships active; the phone path remains the declared fallback rung throughout.
- **N2 binding gate**: delivery latency and quiet-hours behavior declared before activation; technician duty is never inferred from channel activity (the duty flag stays manual — LOOP-3 boundary with attendance-shift-planner).
- **N3 binding gate**: intake deduplication (a request must not double-create job cards) + locale detection disclosure; phone intake remains first-class.
- **N4 binding gate**: artifact expiry + regeneration semantics preserved at the destination (no permanent-copy promises).

## Risk flags

- N1 is the load-bearing optional capability: the product's promise is that it is NOT load-bearing (the phone path is the tested default; 07c's `channelBound: false` is the audited state). Send quota (RATE_LIMIT) must degrade to the copy-link path, never to a blocked queue.
- N2 must not become a presence system — no read receipts, no technician-location anything (LOOP-10 GPS exclusion is absolute).
- N3 duplicates are the data-integrity risk (two job cards for one request); the gate is the mitigation, the code-never-reuse rule (07a) is the backstop.
- N4 artifacts contain customer contact minimum-facts; dispute exports keep phone numbers (Basma needs them) but never notes' full text unless the exporter opts in — declared per-export, not blanket (12 Q-8).

## Degradation map (what the UI shows when each capability is absent)

The product is **declared non-AI** (ai-native-patterns §1) — there is no AI capability to degrade; every surface below degrades only on ABSTRACT-CAPABILITY absence, and the non-AI core (board, lifecycle, gates, queue, register, exports) never degrades at all:

| Surface | All capabilities bound | Capability-absent state (the v1 default posture) |
|---|---|---|
| Dispatch board / job cards / lifecycle / gates (S1–S3, S10) | full | **full — identical** (no capability touches the state machine) |
| Confirmation queue (S4) | send + auto-reply capture; quota meter when the channel meters | copy-link action + phone-outcome recording; NO meter renders (07b rule 8); expiry + the two honest paths unchanged |
| Technician mobile (S10) | push notifications on assignment | pull-on-open + queued offline actions (P20) + the printed day sheet |
| Intake (S3) | request channel creates drafts | dispatcher-entered intake (keyboard-first, CP-1) |
| Day sheet & exports (S8) | delivered artifacts | download with 7-day expiry + regeneration |

The 00 success signals pass in the capability-absent column against the Mock Adapter's `channelBound: false` default — a product useless without a credential is a rejected spec, met by construction.
