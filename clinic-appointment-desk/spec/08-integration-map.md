# 08 — Integration Map: clinic-appointment-desk

## Abstract needs (all optional at v1; the manual alternative is the primary path from first run — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Patient messaging channel** ("send appointment reminders, confirmation requests, and waitlist offers to patients; receive their replies") | The automated half of the ladder and the offer loop — the WhatsApp/SMS reality of MENA clinic patients (01 evidence [20][21][22][23]) | The bilingual call script (CallScriptCard, 06) — copy, call, record the outcome; `sendPath: 'phone-script'` is a first-class success state, and every reply can be recorded by staff (07c M-902 fixture) |
| N2 | **Staff notification channel** ("notify desk staff of channel replies, expiring offers, and day anomalies when the console is not open") | Cross-context delivery for the 15-minute offer clock (P21 ladder — instant tier only for the offer class) | The console itself: offer countdowns render on the waitlist console and the day board badge; return-state surfacing on re-entry (async-contract §6); the printed day sheet carries the open-slot list |
| N3 | **Inbound request channel** ("receive booking requests from external surfaces — a messaging thread or request form") | Request traffic exists beyond the phone (01 channel evidence) | Staff-entered booking from the call/message (CP-1) — the booking flow is keyboard-first for exactly this; requests arrive however they arrive, the desk books |
| N4 | **Export delivery channel** ("deliver day sheets and export artifacts to destinations") | Provider phones and the morning huddle | Artifact download + print from S9 (7-day window, regenerable — 07c E-1 fixture) |

## Consent semantics (credential-contract)

- N1 consent is per-capability-class: the clinic grants "send appointment messages and receive replies on behalf of the clinic" — displayed in capability language before save (credential-contract §4), never a vendor name. Grant extension asks explicitly if sends widen scope (new locales, new message kinds). The credential's lifecycle states surface wherever sends happen (S5 header), never only in settings; failure degrades the send action to the script path in the same surface (credential-contract §3/§6).
- **N1 privacy boundary (PHI minimum-facts — the a11y-baseline §7 discipline extended to payloads)**: outbound messages carry the clinic name, the appointment facts (date, time, provider name, visit-type label), the confirmation ask, and the clinic-authored cancellation-policy line — never the reason-for-visit note, staff notes, flag information, or any clinical text. Reply capture writes only the outcome + timestamp. Patient-facing copy NEVER mentions the no-show pattern flag (12 Q-8): flags are staff-facing and stay inside the console.
- N2: notification-tier control per class (P21) — offer-expiry is the only instant-tier class; everything else is digest or in-console only; N2 never gates a flow.
- N3: request intake never auto-books — inbound requests become staff-reviewed bookings (the desk decides, the machine records; 00 non-AI posture applied to intake).
- N4: no permanent-copy promises at the destination; artifact expiry semantics preserved (07c).

## Binding gates

- **N1 binding-time evaluation set** (12 Q-6): fixed bilingual fixtures — Arabic-script delivery fidelity (patient names with hamza/taa-marbuta variants render intact), reply round-trip capture, per-locale template rendering (ar/en), and offer-expiry semantics surviving the round-trip must all pass before the capability ships active; the phone path remains the declared rung throughout.
- **N2 binding gate**: quiet-hours behavior declared before activation (offer notifications honor clinic hours); notifications carry minimum facts (time + patient first name, never flags or notes).
- **N3 binding gate**: request deduplication (one request must not double-book — idempotency keys are the backstop) + locale detection disclosed to staff, never silently applied to the patient file.
- **N4 binding gate**: expiry + regeneration semantics preserved; PHI minimum-facts policy travels with the artifact (07a `phiPolicy: 'minimum-facts'`).

## Risk flags

- N1 is the load-bearing optional capability, and the product's promise is that it is NOT load-bearing: the script path is the tested default (07c `channelBound: false`), and a RATE_LIMIT from the channel degrades to the script path with the cadence disclosed — never a blocked outbox (11 copy).
- N1 payload privacy is the PHI risk surface: the template editor renders a minimum-facts disclosure beside every template field (what this message will contain) so scope creep is visible at authoring time, not at send time.
- N2 must not become surveillance of staff or patients — no read receipts on scripts, no presence, nothing beyond the declared classes.
- N3 duplicates are the data-integrity risk (two bookings for one request); the gate + idempotency keys are the mitigation, the append-only timeline is the audit backstop.
- Offer clock honesty: the 15-minute same-day expiry is a policy value, not a channel promise — when N1 is unbound, the phone-script offer still expires on the same clock (07c rule 5), so the waitlist never silently queues stale offers.

## Degradation map (what the UI shows when each capability is absent)

The product is **declared non-AI** (ai-native-patterns §1) — there is no AI capability to degrade; every surface below degrades only on ABSTRACT-CAPABILITY absence, and the non-AI core (day board, lifecycle, booking, waitlist ranking, flags, policies, exports) never degrades at all:

| Surface | All capabilities bound | Capability-absent state (the v1 default posture) |
|---|---|---|
| Day board / booking / lifecycle / patient records (S1–S3, S6) | full | **full — identical** (no capability touches the state machine or the ranking) |
| Waitlist console + fills + offers (S4) | offers send via channel; replies auto-capture | offers send via call script + recorded outcomes; expiry clock identical; ranked candidates identical (the ranking is pure arithmetic) |
| Messages outbox (S5) | sent/replied states from the channel | script-sent records + recorded replies; failed channel sends retry per-message or fall to script in the same surface |
| Staff notifications (N2) | instant offer-class notifications | in-console countdowns + board badges + return-state surfacing + the printed open-slot list |
| Intake (N3) | requests create staff-reviewed draft bookings | staff-entered booking (CP-1) — the designed path |
| Day sheet & exports (S9) | delivered artifacts | download + print with 7-day expiry + regeneration |

The 00 success signals pass in the capability-absent column against the Mock Adapter's `channelBound: false` default — a product useless without a credential is a rejected spec, met by construction.
