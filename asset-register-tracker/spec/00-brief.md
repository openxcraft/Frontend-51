# 00 — Brief: asset-register-tracker

Family: business_ops · Tier: 3 · Roster status: researched proposal, pending owner confirmation · Seed: none supplied.

## What it is

A bilingual (ar/en) asset registry for office and operations managers: one authoritative register of the physical things a workspace owns and moves — laptops, monitors, phones, AV gear, networking equipment, workshop tools, furniture — each carrying a QR label whose life the product manages end to end. The register is a table-first workspace: virtualized registry grid with filter chips and saved views, per-asset detail with a custody timeline, a label-batch surface for requesting and printing QR label sheets, and a mobile scan-companion view so anyone in the building can point a phone at a label and get the truth. Every mutation is deterministic registry state — this is a **declared non-AI product** (ai-native-patterns.md §1): no operation generates, scores, or transforms content by model; there are no smart anything, and the spec must not leak AI affordances.

The unique feature is the **QR-label lifecycle with custody chain**. The label lifecycle is modeled as first-class data: a label is requested (per asset or in batches), generated into a print-ready sheet, confirmed *applied* by scan, and retired with its asset — with damaged and missing states in between that trigger replacement rather than silent re-printing (a re-printed label without a recorded state change is exactly how registers start lying). The custody chain is the audit core: every hand-off is a signed event. Assignment, return, and person-to-person transfer each record who handed over, who took, where, when, the asset's condition, and a signature from the party accepting custody — typed name, drawn mark, or scan-acknowledged — because in Gulf office practice العهدة (custody responsibility) is only real when someone signs for it. The chain is append-only: mistakes are corrected with a correction event that references the erroneous entry, never by editing history; the audit trail is the product's integrity.

The buyer's reality (01 evidence): the status quo is a spreadsheet that cannot say who has an item, and a paper sign-out sheet that lives in a drawer. Category tools exist — free open-source registries, $125/mo hosted trackers, per-asset-tier QR platforms — but they are Latin-first, IT-department-shaped, and treat check-out as an assignment field rather than a signed, bilingual, exportable chain of custody. GCC audit practice (zakat/tax) expects a fixed-asset register with additions and disposals supported by evidence; accounting suites own valuation and depreciation — deliberately out of our scope (LOOP-10) — while the office manager still owns existence, location, custody, and disposal evidence. This product is that manager's instrument.

## Buyer

Office and operations managers at MENA businesses running 100–1,000 tracked assets: professional-services firms, clinics, schools, media/production houses, retail head offices, and growing tech companies. The economic buyer is the office/ops manager who answers when a laptop dispute escalates or an auditor asks for the register; daily users are the ops team, plus every employee who touches the hand-off flow via the scan companion. Two to five seats for the registry workspace; unlimited scan-only participants (hand-off signing never requires a seat). Full personas in 02-user-research.md.

## Surface

Web application, desktop-first (≥1280px primary; registry grid, asset detail, label sheets, people and locations management), responsive to 360px; plus dedicated **mobile scan-companion views** (≤767px): scan lookup, hand-off with signature, return, and report-damage — designed one-thumb for someone standing in a storeroom. No native app at v1 (scan views are web); no public API at v1; no kiosk mode.

## Unique feature

QR-label lifecycle with custody chain, as two interlocking state machines the UI makes legible: label (requested → printed → applied → damaged/missing → retired) and custody (in-stock → with-holder → return-pending → back), joined by the scan event that confirms both. Defensible on three grounds (01): (1) label lifecycle as explicit data states — with print-sheet artifacts, apply-confirmation, and replacement flows — is not surfaced by the category (tools print labels; none models the label's life); (2) signed, append-only custody chains with correction events exist only in heavyweight compliance suites priced and shaped for enterprises, not office managers; (3) bilingual ar/en operation end to end — bilingual asset names, Arabic normalization in search, bidi-safe tag rendering, custody signatures with Arabic names — is served by no verified competitor in the class.

## Exclusions (LOOP-10)

- No maintenance scheduling, work orders, or calibration tracking (CMMS scope; competitors bundle it — we do not).
- No procurement, purchasing, vendor quotes, or receiving workflows (registry starts when the asset exists).
- No depreciation accounting, valuation, cost ledgers, or financial posting — the register records existence, custody, location, and disposal evidence; accounting systems own the money (Q4 research: the fixed-asset register's financial side is the accounting suite's artifact).
- No GPS, RFID, or Bluetooth tracker hardware (QR labels on standard printable stock only; tracker add-ons are a different business).
- No employee onboarding/offboarding automation or directory sync at v1 (an optional abstract directory capability with manual entry alternative — 08).
- No stock/consumable inventory counting (inventory-count-assistant owns guided counts; this is a registry of discrete assets).

## Success signals

An office manager can: create a category and location tree; register assets (single and quick-add); request a QR label batch, export the print sheet, and confirm labels applied by scanning; run a signed hand-off on mobile (assign to a person with signature, then accept the return); look up any asset by scanning its label; read an asset's full custody timeline including one correction event; retire an asset with method and certificate reference; and export the register for an audit conversation — all in the first session, on the Mock Adapter, with zero provider-specific knowledge anywhere in the UI. The full loop must work with no integration bound at all: label sheets download as print-ready files, hand-offs work scan-to-scan, exports download directly (LOOP-5 bar).
