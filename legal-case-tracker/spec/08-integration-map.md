# 08 — Integration Map: legal-case-tracker

Backend-agnostic by rule (brief §7.1): channel/capability language only, zero providers, zero vendors. **AI declaration: none** (07a) — no AI capability is bound, none is declared on the adapter (07b preamble), and no surface leaks AI affordances. The AI degradation map therefore has one line: every core workflow (matters, timeline, outcomes, rules, custody, closure, export) runs at full function with every capability below unbound — the product is **non-AI and non-integrated by design**, and its value loop (00 DoD) completes in exactly that state. What follows is the capability map for the four abstract channels the product acknowledges at all, plus the fifth (calendar subscription) held as a proposed binding.

## Abstract needs (each with its manual alternative as the PRIMARY path — LOOP-5)

| # | Need (capability language) | What it grants | Manual alternative (primary) | Degradation when absent |
|---|---------------------------|----------------|-------------------------------|--------------------------|
| N1 | **Document storage** — an abstract byte-store for document versions (`storageRef`, 07a) | the firm's document bytes live somewhere the product can reference; versions carry declared fingerprints | the firm keeps bytes wherever it already keeps them (shared drive, paper safe + scanned copies) — registration records the fingerprint, size, and abstract reference typed or pasted by hand; the **chain of custody is the record, not the storage** | nothing degrades: `registerDocument`/`addDocumentVersion` accept declared fingerprints with hand-entered references; the custody chain, sealing, and verification operate identically (07b rule 5 — no operation exposes or requires a provider); the UI never shows a storage kind it cannot name |
| N2 | **Export delivery channel** — outbound package delivery for matter archives | the export package (timeline + custody ledger + deadline report) leaves the product through a bound channel | **direct download is the default and always-available path** — the artifact downloads in-product; "send it yourself" is not a degraded mode, it is the primary posture | export jobs still run, progress stays determinate, artifacts still expire/regenerate; the channel row in S8 renders as "channel unbound — download available" in capability language; consent-gated when bound (below) |
| N3 | **Notification channel** — the docket digest (P21 ladder: hearing-imminent instant, daily docket digest, weekly matter digest) | firm members hear about zones outside the product | the product's own surfaces: the board on open, the bell surface (in-product digest, 05 icon vocabulary), and the export/report path for client-facing needs | zero silent loss: every notification class is a *derived re-announcement* of state that already exists in-product — the digest is a convenience, never the record; tier controls per class (P21) |
| N4 | **Filing-attendance channel** — the abstract court-facing channel (LOOP-10: no e-filing) | explicitly **never bound at v1** and never court-directed: the product records that a filing happened (FilingEvent + document link); it does not perform filings | file at the court counter or through the court's own portal (Najiz-class platforms are the court's system, 01 I2), then record the FilingEvent here — the record is the value | this is the permanent state, not a degradation: FilingEvents are chronicle facts with direction (outbound/inbound) and a plain document link (07a); no filing operation exists on the adapter by construction |
| N5 (proposed) | **Calendar subscription channel** — hearing dates and deadlines as a subscribable calendar feed | the firm's existing calendar surfaces show hearing dates without manual entry | manual: read the board (zone-sorted), copy a date, or run the digest; the timeline is the canonical calendar of record | proposed as a future binding (12 Q-8), NOT v1: at v1 the product itself is the docket instrument; a feed is a convenience loop with a stale-risk the board never has |

## Consent & binding gates (credential-contract)

- **Kind, never vendor**: every capability renders as its kind — "Document storage credential", "Export delivery credential", "Notification sender credential" — with the capabilities it grants (credential-contract §2); the adapter file knows bindings, the UI does not.
- **Workspace consent, never assumed**: N2 binds only through explicit workspace consent (07b rule 5); consent changes append to the activity log (`consent-change` action exists in the 07a enum for exactly this); scope display is per-operation-class and later out-of-scope use asks for extension (credential-contract §4).
- **Grant display before save**: each credential surface shows what it will be used for, in capability language, before it is stored; health states surface where the capability is used, never in a settings graveyard (credential-contract §3).
- **The never-events apply**: no secret in a URL, log line, export, notification, or announcement — exports are matter archives and custody evidence; a leaked credential inside one would be a category-defining failure (credential-contract §7).
- **Manual-alternative test as a release gate**: the 00 Mock-Adapter Definition-of-Done *is* the binding gate — the full loop must pass with every capability unbound; a binding that removes a manual path (rather than adding a channel) is rejected at review.

## Degradation map (what the UI shows, per absent capability)

| Capability absent | Board / chronicle | Documents & custody | Rules / gate | Export | Notifications |
|--------------------|-------------------|---------------------|--------------|--------|----------------|
| N1 storage | unchanged | fingerprints + hand-entered abstract references; chain identical — a "reference recorded by hand" note on the version row is the only visible difference | unchanged | unchanged (custody-ledger format is chain data, not bytes) | unchanged |
| N2 delivery channel | unchanged | unchanged | unchanged | determinate job + **download as the primary path**; the channel affordance renders unbound-in-capability-language | digest ready notice lands in-product |
| N3 notification channel | unchanged (the board IS the state) | unchanged | unchanged | unchanged | in-product digest only; no out-of-product silence is possible because no information exists only in the notification |
| N4 filing channel | FilingEvents are records, not actions — nothing to degrade | the `presented` custody entry carries the hearing link; no court-facing write exists | unchanged | unchanged | unchanged |
| N5 feed (not v1) | unchanged | unchanged | unchanged | unchanged | unchanged |

**AI degradation map (ai-native-patterns §8, one line):** declared non-AI — no AI capability exists to degrade; countdown zones, deadline generation, custody sequencing, and closure evaluation are deterministic rules (07c) and are the *entire* engine; no surface pauses, falls back, or labels anything "smart" under any condition.

## Boundary notes (LOOP-3, details in 12)

- **contract-lifecycle-manager** (bilateral mirror recorded): their abstract execution channel and our abstract filing channel are different artifacts (contract execution records vs court filings); a matter may reference a contract as a plain link — no shared entity (12 Q-4).
- **Court platforms (Najiz-class)** are the court's system, never an integration target at v1 (00 LOOP-10; 01 I2) — adjacency honesty, not scope creep.
