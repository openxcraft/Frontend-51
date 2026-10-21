# 04 — Information Architecture: customs-tariff-lookup

## Navigation model

Left rail: **Nomenclature** (home + hierarchy navigator) · **Notes** (ruling-notes library) · **Lists** (saved classifications) · **Editions** (schedule/version surfaces) · **Activity** (jobs + activity console, T3-consolidated) · **Settings**. The reading pane is the product's core mode: selecting any code from any surface opens the tariff-line card in the pane, and the originating surface (search results, tree, note, saved list) stays one click behind — the navigator never orphans context (drill-down context preservation, 05 integration record). ⌘K palette (P05 — list surfaces exceed three) reaches codes, notes, lists, and schedules with bilingual normalized search (rtl-rules §4). Two-level IA: section → item detail. Desktop-first; ≤767px: rail collapses to a top bar, tree browse and lists become read-only review surfaces, reading pane remains full-function.

## Entity overview (07a for full shapes)

TariffSchedule (edition) → NomenclatureNode (tree: section/chapter/heading/subheading/tariff line; bilingual descriptions; published duty reference) · RulingNote (immutable reference record, linked to headings) · BookmarkList → SavedCode (desk's pinned lines with product descriptions, status, linked notes, edition pin) · CodeChangeRecord (edition-pair diff) · Job / ExportArtifact (evidence packs) · ActivityEntry. Workspace holds locale default, assist default, active schedule, normalization disclosure.

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Nomenclature home | search-first entry, active-edition banner, chapter shortcuts, first-run sample list (P22) | searchNomenclature, suggestCandidates, listSchedules, getUsage |
| S2 | Hierarchy navigator | section grid → chapter → heading → line tree; breadcrumbs; schedule switcher | listNomenclatureChildren, getNomenclatureNode, listSchedules, listVersionDiffs (tombstones) |
| S3 | Tariff-line reading pane | the daily object: code card, bilingual descriptions, duty reference, attached notes, save/link actions | getNomenclatureNode, compareDutyRates, listRulingNotes, getRulingNote, addSavedCode, linkNoteToSavedCode |
| S4 | Search results | ranked candidate rows with matched-field markers, filters (P08) | searchNomenclature, getNomenclatureNode (open) |
| S5 | Ruling-notes library | filterable notes list, bilingual notes search | listRulingNotes, getRulingNote, linkNoteToSavedCode |
| S6 | Lists home + list detail | desk working memory: saved codes, statuses, bulk actions, edition checks | listBookmarkLists, getBookmarkList, createBookmarkList, deleteBookmarkList, listSavedCodes, updateSavedCode, removeSavedCode, unlinkNoteToSavedCode, checkCodeChanges |
| S7 | Editions surface | schedule editions, edition change log, pair-diff browse | listSchedules, getSchedule, listVersionDiffs, checkCodeChanges |
| S8 | Activity console | jobs + activity rows, filterable, link-to-context (P12/P17) | listJobs, listActivity |
| S9 | Settings | locale, assist default, active schedule, normalization disclosure, consent state | getSession, updateWorkspaceSettings, getUsage |
| S10 | Command palette (overlay) | bilingual search across codes/notes/lists/schedules | client-side over S1–S8 data |

## Per-screen state obligations

Four empties per P01: S1/S4 first-run teaches search-first with the sample list; S4 filtered-empty offers filter reset + the tree; S5 filtered-empty distinguishes no-notes-for-filter from no-notes-in-workspace (the library is seeded content, so a true first-run empty only exists pre-seed); S6 first-run offers the starter list; no-access states render PERMISSION surfaces, never "empty" (viewer role on S6). Skeletons mirror final geometry per direction (P02) — tree skeleton is a section-grid skeleton, not a shimmer list. Errors per 03 mapping; full copy matrix in 11.

## IA decisions and rationale

- **The reading pane is one surface with many doors**: search, tree, notes, and lists all open the same tariff-line card (S3). Classification work is convergent — every path ends at one line read completely — and splitting "browse detail" from "search detail" would fragment the object the desk cites.
- **Notes are a first-class section, not a tab on the line card**: Mariam searches precedent without a code in hand (02) — the library needs its own filterable home; the line card carries the notes attached to that heading (S3.3) and links into the library.
- **Editions earn a section**: edition reconciliation is a signature flow (00), not a settings footnote — the change log and pair-diff browse are reading surfaces of their own (S7), while the active-edition switcher also lives in the rail for one-tap context.
- **Lists are the desk's memory, deliberately separate from the nomenclature**: the tree is the world; the lists are the desk's claims about the world. Separation keeps reference data immutable and desk data accountable (07a state obligations).
- **Activity consolidated (T3 posture)**: per async-contract §7, Tier 3 may consolidate the job center into an activity surface — S8 is one console for jobs + consequential mutations with link-to-context.
- **Settings is small and honest**: normalization disclosure lives here AND at point-of-use on the search panel (ai-native-patterns §7.4); capability consent renders in capability language only (credential-contract §2).
