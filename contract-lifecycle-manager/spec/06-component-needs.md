# 06 — Component Needs: contract-lifecycle-manager

## Shared primitives consumed

Button, Menu, Dialog, Tabs, Tooltip, Toast, Skeleton, EmptyState, FilterChips (P08 — status/zone/owner/type filters with removable chips), JobRow, DiffView (term-history compare), QuotaMeter (extraction-assist window, P14), ActionBar (bulk obligation ops, P07), CommandPalette (P05), AutosaveIndicator (P10 — metadata inline edit).

## Invented components (10)

| Component | Purpose | Obligations |
|---|---|---|
| **VaultRegister** | the virtualized register grid: bilingual title cell (per-side direction rendering inside the cell), counterparty, status seal, zone chips, owner, value | P18 grid (arrow navigation, range selection); virtualized >200 rows (P19) with focus preservation + row-count context on region entry; mixed-script cells bidi-isolated (dir="auto"); Western numerals, tabular figures; 400% reflow → card collapse at 360px; row menu has visible button equivalents |
| **StatusSeal** | the lifecycle state seal (draft / in-review / awaiting-execution / active / terminated / archived + derived expiring-soon/expired marks) | State is icon+text (never color alone); derived states render as a corner ribbon on the seal, not a second seal (one state per record — display-only derivation, never stored); the Seal Settles moment (05) fires only on execution-record success; reduced-motion = instant + chip + announcement |
| **BilingualMetadataPanel** | paired EN/AR fields (title, counterparty legal name, obligation summary): per-field direction rendering, either-side-alone validity, sync indicator (both-authored / en-only / ar-only) | Each field is a labeled pair with its own direction container (rtl-rules §2 isolation); sync state is text ("Arabic title not yet recorded"), never a bare glyph; inline edit (P06 — Esc restores, Tab commits+advances); the panel is the detail surface's spine — screen-reader order reads EN field then AR field with language announced |
| **ObligationLedger** | obligations table: direction glyph (we-owe/they-owe), plain bilingual summary, kind, owner, due date, zone chip, provenance chip (manual/assist/import) | P18 grid semantics; direction is arrow+label (flips in RTL); zone chips icon+text; provenance chip states the origin honestly (assist-suggested → human-accepted history travels with the row); complete action is a visible button on the row (not menu-only); overdue rows announce politely on region entry with count |
| **ReminderTimeline** | the derived schedule: upcoming reminder entries grouped by zone (overdue / imminent / approaching / later), each linked to its obligation + contract | Entries are focusable list items; each states what fires when ("Reminder 30 days before 12 Dec"); the timeline is a list semantically; recomputation is instant + announced once ("Schedule updated — 1 overdue, 2 imminent"); never a heat blob — counts as text everywhere |
| **RenewalWindowBar** | per-contract renewal arithmetic: termination date, notice window days, computed notice deadline, days remaining (deterministic formulas, 07c) | Every number is text with its label; the bar's states (window-open / window-missed / expiry-mode when auto-renew off) pair text + icon; missed-window copy states the consequence plainly without blame ([23][24] posture); day-count changes always pair a text delta (motion never carries information alone) |
| **ExtractionReviewPanel** | assist suggestions: proposed metadata fields + obligations, each with confidence, document anchor, accept/edit-then-accept/dismiss | Draft-by-default (P15): nothing applies without per-item resolution; anchors link into the document view (context-preserving side panel per ai-native-patterns §3); confidence renders as a labeled figure, never a bare meter; dismissed suggestions stay visible in a collapsed "dismissed" group (audit honesty); the panel works identically as wizard step (S3) and detail mode (S2) |
| **DocumentVersions** | uploaded document versions: file name, language marks (ar/en/bilingual), pages, uploaded-by, uploaded-at, download | Version list is a semantic table; download opens the artifact link with expiry announced; replacing a post-review version surfaces the re-review warning chip (CP-4 edge) as text+icon; language marks are text labels (bilingual docs mark both scripts) |
| **ReviewTrack** | workflow steps: requested → assigned → decision (approve/return) entries in order | Ordered list semantics; each entry names actor + decision + timestamp (announced with the action per a11y-baseline §7); return-for-changes carries its comment visibly; the track is append-only — no entry ever edits another |
| **AuditTrail** | activity log surface: filterable (actor, action class, target, date range), keyboard-navigable, exportable | P17 accountability surface; every row is actor-action-target-timestamp (copy-voice §1.3 grammar); correction events reference the erroneous entry visibly; the export action sits on the surface itself (not only in settings — credential-contract §3 pattern applied to audit exports); >200 entries virtualize (P19) |

## Layer-3 token additions

`register.row.zone.*` (urgency chip states per 05 contracts — icon-duty amber vs text-bearing warning-deep), `seal.state.*` (seal ink + derived-ribbon states), `metadata.panel.sync.*` (en-only / ar-only / both), `obligation.row.direction.*`, `reminder.timeline.zone.group.*`, `renewal.window.state.*` (open/missed/expiry), `extraction.suggestion.state.*` (proposed/accepted/dismissed + confidence label), `review.track.entry.*`, `document.version.language.*` — all Layer 2 re-binds of the 05 palette; no raw values (token-architecture §1).

## Reused-with-twist

- **DiffView**: term-history compare (prior term vs recorded renewal term — date/note rows, not character diffs).
- **EmptyState**: S1 first-run sample contract (interactive: loads the seeded bilingual record so the reminder schedule is experienceable pre-load — CP non-happy path, P22).
- **QuotaMeter**: extraction-assist runs only; manual obligation entry deliberately renders NO meter (unlimited by design — the degradation floor must not read as rationed).
- **FilterChips**: zone/status/owner filters with accessible descriptions of each predicate (P08); saved views on S1 ("my renewals this quarter").

## Deviations recorded

- Fully-round seal mark inside radius-B system: permitted exception for the circular badge semantic (a seal is round), declared in 05; all card/panel/control radii stay in the B family.
- Icon flip decisions (rtl-rules §2): obligation direction arrows flip in RTL (we-owe points inline-start out); document-download, search, bell, tag glyphs are symmetric — never flip; the review-track step chevrons flip with reading direction; palette/recents glyphs symmetric.
