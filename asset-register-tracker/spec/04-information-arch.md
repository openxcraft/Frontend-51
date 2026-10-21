# 04 — Information Architecture: asset-register-tracker

## Navigation model

Left rail (desktop): **Registry** (assets table) · **Labels** (batches + sheet history) · **People** (custody ledger) · **Places & Categories** (location tree + categories) · **Activity** · **Jobs** · **Settings. Asset detail is a Registry item view** (not rail-level): profile / custody timeline / label / retirement blocks as in-page anchors with tab navigation. Two-level IA throughout: section → item; a global ⌘K palette (P05 — list surfaces exceed three) reaches assets, people, locations, categories, label batches, and jobs with bilingual normalized search (rtl-rules §4: alef variants, taa marbouta/heh, yaa forms, tashkeel stripping).

Scan companion (mobile web, ≤767px): a distinct, smaller IA — Scan (default), asset card, hand-off flow, walk mode, and my-pending list; no registry management surfaces on mobile beyond read-only asset detail (grid management is desktop work; a phone is a custody instrument, not a spreadsheet).

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Registry home | virtualized asset table, filters + saved views, quick-add, bulk actions | `listAssets` · `getSession` · `getUsage` (settings posture link) |
| S2 | Asset detail | profile + custody timeline + label block + retirement block | `getAsset` · `listCustodyEvents` · `updateAsset` |
| S3 | Labels (batches) | batch list, sheet preview + download, apply checklist, replacement requests | `requestLabelBatch` · `getLabelBatch` · `getArtifact` · `confirmLabelApplied` · `reportLabelState` · `listJobs` |
| S4 | People | custody ledger per person, open return-pending, inline person creation | `listPeople` · `createPerson` |
| S5 | Places & Categories | location tree editor, category manager (both locales) | `listLocations` · `createLocation` · `listCategories` · `createCategory` |
| S6 | Activity | audit log, filterable, exportable (links to S9 export) | `listActivity` |
| S7 | Jobs | label batches + exports, state, cancel/retry | `listJobs` |
| S8 | Settings | locale default, tag format display, notification tiers, capability consents | `getSession` · `getUsage` |
| S9 | Export studio | register export scope/format/custody-history toggle, artifact list | `exportRegister` · `getArtifact` |
| M1 | Scan companion (mobile) | scan lookup → asset card → hand-off / return / transfer / report / sighting / walk mode | `lookupByScan` · `recordCustodyEvent` · `confirmLabelApplied` · `reportLabelState` · `getAsset` |

Mobile (≤767px): M1 plus read-only S2/S4. Everything else is desktop/tablet.

## Per-screen state obligations

Four empties per P01, enumerated per surface in 11 (first-run teaches the loop; filtered-empty offers reset; no-access never says "empty"; retired-filtered explains itself). Skeletons mirror final geometry per direction (P02); errors per the 03 mapping; every list surface cursor-paginated.

## IA decisions and rationale

- **Registry is the home screen, not a dashboard**: the buyer's mental model is the sheet in the drawer — one authoritative table. No KPI cards, no charts at v1 (T3 discipline; counts live in filter headers where they are evidence, not decoration).
- **Labels is first-class IA**, not a settings tab: the label lifecycle (request → print → apply → replace) is half the unique feature; burying it in setup would bury the product (01 gap #2).
- **People is a custody ledger, not a directory**: the view answers "what does each person hold and what is pending return" — the عهدة question. Directory-shaped fields exist only to support it (and the optional directory capability binds here — 08 N3).
- **Activity and Jobs are split** (not one console) because audit-log browsing and job monitoring have different rhythms; both are small, filterable, and cross-linked (async-contract §7).
- **Scan companion is a separate minimal IA**: three taps deep at most (scan → card → action), because the person using it is standing up, holding equipment, and possibly Arabic-first (locale flips the companion fully, RTL and all — 09 verification matrix).
- **No mobile registry editing**: inline grid edit and bulk operations on a phone are failure modes for data integrity; mobile is custody + lookup only (recorded as IA policy, testable in the 400% reflow matrix).
