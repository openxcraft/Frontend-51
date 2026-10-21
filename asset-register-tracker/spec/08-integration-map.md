# 08 — Integration Map: asset-register-tracker

**Declared non-AI product** — no AI capability is bound anywhere and none may be added silently (ai-native-patterns §1). The degradation map below is the non-AI adaptation of §8: it covers the abstract capabilities this product *does* declare. Abstract capabilities only (credential-contract.md — kind, never vendor); LOOP-5: every abstract need has a manual alternative, and the full value loop (register → label → hand-off → audit → export) completes with **zero capabilities bound** (00 success signal; tested against the Mock Adapter's all-off configuration).

## Abstract needs

| # | Abstract need | Why | Consent/grant semantics | Manual alternative (LOOP-5) |
|---|---------------|-----|-------------------------|------------------------------|
| N1 | **Label print channel** ("send label sheets to a print capability") | one-click print beats download-handoff when a workspace binds a printer service | Grant: "Sends label sheets to your printing capability" — write-class, surfaced where batches are requested | Download the print-ready sheet (PDF) and print on standard label stock — the default path, fully specified (03 CP-1.4) |
| N2 | **Notification channel** ("deliver custody and due-date messages to people") | return-pending nudges and hand-off receipts reach people off-platform | Grant: "Sends custody notifications on behalf of the workspace" — send-class; digest tiers per class per P21 (instant for hand-off receipts the signer asked for; daily digest for return-pending) | In-product surfaces only: the People view's return-pending list, registry filters, and the printable **sign-off sheet** (paper fallback for the drawer — the incumbent honored, not erased) |
| N3 | **Directory capability** ("sync people from a workspace directory") | people lists stay fresh without manual entry when a workspace has one | Grant: "Reads member/people records from your directory capability" — read-class; sync is one-way (this register never writes to a directory) | Manual person entry + inline create mid-hand-off (03 CP-2.2) — identical UX, one extra field |
| N4 | **Export delivery** ("write export artifacts and issue retrievable links") | audit packs need an artifact home with expiry | Grant: "Writes export files for this workspace" — write-class; artifacts expire (7-day window) with renewal (async-contract §2) | Download directly (the artifact link is the file itself when unbound); re-export regenerates from register state at will |

## Credential surfaces

N1–N4 each render per credential-contract: masked by default (kind + identifier hint), lifecycle states (unverified → active → … → failed) surfaced at the point of use — the Labels screen for N1, the People view for N3, the Export studio for N4 — never in a settings graveyard; every failure message names the capability class in capability language and links the manual alternative ("Label printing is paused — the print channel credential failed verification; download the sheet and print it yourself"). Credential events append to the activity log (P17). No secret ever appears in a URL, export, notification, or scan-companion view (never-events honored).

## Degradation map (non-AI adaptation of ai-native-patterns §8)

| Surface | Capabilities bound | Capabilities unbound / failed |
|---|---|---|
| Registry, asset detail, custody timeline | full | full (pure product state) |
| Label batches | N1 print channel: one-click print | sheet download + self-print (the default path, unchanged UX) |
| Custody hand-offs & signatures | full + N2 receipts when granted | full — hand-offs are scan-to-scan product state; N2 only affects outbound nudges |
| People | N3 auto-sync | manual entry / inline create; return-pending visible in-product |
| Audit walk & sightings | full | full |
| Exports | N4 artifact links | direct download + regenerate |
| Scan companion | full | full (lookup + actions are product state; camera is a device feature, not a bound capability) |

The product is fully useful at every rung by construction: there is no quota ladder and no metered intelligence to degrade (non-AI); the only metered surfaces are label batches and exports (P14, 07b `getUsage`) and exhaustion degrades to *queued-until-reset* with all data work intact — never a wall.

## Risk flags

- N2 message content carries custody facts (who holds what) — outbound payloads must contain the minimum: person name, asset tag, action link. No chain history, no serials, no location tree (privacy posture recorded; 12 Q-7).
- N3 directory sync direction is one-way by contract; a two-way write-back would make the register a directory editor — rejected at v1 (scope discipline, recorded).
- N1 print fidelity is a product obligation regardless of channel: the sheet artifact (not the channel) is the source of truth — what you preview is what prints (06 QrLabelSheetPreview).
- Print-stock variance (label hardware purchased vs self-printed) is explicitly out of product scope: the sheet targets standard A4 label stock formats; vendor-printed label procurement is the buyer's business (01 pricing landscape records the $2–8/label consumable market we deliberately do not enter).

## No-AI leakage audit (ai-native-patterns §1)

No sparkle/wand glyphs (05 icon ban); no "smart" copy anywhere in 11; no suggestion, scoring, or generation operations on the 07b contract; quick-add and search are deterministic (normalization rules per rtl-rules §4, disclosed in-product as fixed rules). AI absence is never framed as a limitation in copy — it is framed as exactness ("the register records what happened — nothing else").
