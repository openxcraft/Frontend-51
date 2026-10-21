# 08 — Integration Map: loyalty-stamp-card

## Abstract needs (all optional at v1; the manual alternative is the PRIMARY path from first run — LOOP-5)

| # | Abstract need | Why | Manual alternative (always available) |
|---|---------------|-----|----------------------------------------|
| N1 | **Sale-event capability** ("report that a qualifying sale completed at this store's register") | Lets a stamp attach to the recorded purchase automatically instead of the staff member judging eligibility | The staff-verified stamp at the counter — the primary path by design, not a fallback (00: the counter moment is the product). Sale-aware auto-stamping is a binding-time posture the owner chooses; the console is fully functional without it |
| N2 | **Pass delivery channel** ("place the loyalty pass into the member's phone wallet") | Members who keep transit and boarding passes in a wallet want the loyalty card beside them | The in-browser pass view (S7) with its shareable link and printable QR sheet — readable at the counter from any phone screen, no wallet required |
| N3 | **Transactional member notification** ("notify one member about their own card event: reward-ready, tier-redeemed confirmation, expiry warning") | Closes the loop on the member's own state at the moment it changes | The pass itself refreshes on open; the counter surface shows reward-ready at the next visit; expiry warnings render on the pass and at the counter — no persuasion messaging exists anywhere (LOOP-10 boundary) |
| N4 | **Counter print channel** ("print the join-QR counter sheet and pass re-issue slips") | Durable join signage at the register and re-issue slips for members who lose phones | On-screen QR display at the stamper + downloadable print-ready sheet rendered in-product; the counter screen is itself the signage |

## Consent semantics (credential-contract)

- **Kind, not vendor**: the credential surfaces say "Sale-event reporter credential", "Pass delivery credential", "Member notification credential", "Counter print credential" — capability language with the granted classes displayed before save (credential-contract §4); the UI never names a vendor, and no vendor name appears in this spec.
- **Scoping**: N1 grants "report completed sales for stamp eligibility" — nothing else; auto-stamping widens N1's scope and requires an explicit extension (never blanket-implied). N3 grants per-member transactional events only; any broadcast ambition is structurally absent (marketing automation is LOOP-10-rejected, not merely unconsented).
- **Lifecycle surfaces**: credential health states render where the capability is used (the stamper for N1, the pass panel for N2/N3, the print action for N4) — never only in settings; a failed N1 degrades to the manual stamp path **in the same surface** with the manual path stated (credential-contract §3/§6).
- **Audit**: every credential event (create, verify, rotate, revoke, extension, failure) appends to the audit ledger with actor and timestamp (P17) — the same append-only surface as stamps.
- **Never events honored**: no secret in a URL, log line, export, notification, or announcement; "test connection" only after a real capability round-trip; no silent reuse for an ungranted class.

## Risk flags

- **N1 binding-time gate**: the sale event must carry enough truth to answer eligibility (qualifying amount, timestamp, register identity) — a fixed evaluation set must pass before the capability ships active, including double-event handling (one sale → one stamp, idempotent by sale identifier) and refund semantics (a refunded sale's stamp is a manager correction, never an automatic subtraction — the append-only posture).
- **N1 posture risk**: auto-stamping on sale events changes the staff-verified promise into a machine-verified one — the binding is opt-in per workspace and the UI keeps labeling stamp provenance ('counter' vs 'sale-event' in the audit trail), so Majed's ledger stays honest either way.
- **N2 geometry risk**: wallet pass templates have vendor-specific geometry and refresh behavior — the binding gate is a dual-script render test (both directions, worst-case Arabic tier names per rtl-rules §5) before the channel goes active.
- **N3 quiet-hours posture**: transactional notifications declare delivery windows honoring the member's locale region defaults; a notification that wakes a member at 02:00 for a cookie is a design failure even inside the transactional class (P21 tier discipline).
- **N4 print stock**: the join sheet targets declared stock sizes with geometry verification as its gate; the on-screen path never depends on it.

## Degradation map (what the UI shows when each capability is absent)

| Capability absent | Console behavior | Member-facing behavior |
|---|---|---|
| N1 sale-event unbound | identical — the staff-verified stamp IS the primary path; the settings surface shows the capability as available-to-bind, not as a missing feature | identical (stamps land at the counter as always) |
| N2 pass delivery unbound | pass panel shows the in-browser pass link + printable QR sheet (the default presentation) | pass opens as a web view with full card, tiers, and QR — complete function, no wallet |
| N3 notification unbound | reward-ready renders on the card sheet at the next visit; expiry on the ExpiryBadge | the pass shows tier distances and expiry on open — self-serve state, zero waiting |
| N4 print channel unbound | counter screen displays the join QR full-screen on demand | members scan the screen directly |
| ALL four unbound | **the 00 success signal**: enroll → pass → stamp → redeem → audit → export completes end-to-end; the product is a complete loyalty console on manual paths alone | the member's entire experience is intact |

Non-AI core (every workflow) requires no capability to function — the declared non-AI posture means there is no model surface to degrade (ai-native-patterns §8 applies vacuously and the map above is the full degradation truth).
