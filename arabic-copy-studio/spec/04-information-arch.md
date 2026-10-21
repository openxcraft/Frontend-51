# 04 — Information Architecture: arabic-copy-studio

SME-C pass · Screen inventory, navigation model, per-screen data needs. Every data need maps to adapter operations (07b); no screen renders data the contract cannot supply.

## Navigation model

Left rail (documents switcher: recent, collections, saved filters) · top bar (document title, save state P10, status chip, share/review actions) · right context rail (brand kit, glossary, register, usage) · AI panel (docked inline-end, collapsible; never overlays text). ⌘K palette (P05) reaches documents, actions, glossary terms, settings. Model: two-level — workspace list → single document editor with contextual rails. No nested routes beyond document + optional review sub-state.

## Screen inventory (14 screens)

| # | Screen | Purpose | Key data needs (→ 07b) |
|---|---|---|---|
| S1 | Workspace home | documents list, onboarding checklist (P22), recent jobs | listDocuments(Query), getUsage() |
| S2 | First-run setup | workspace prefs, brand kit quick-start, register defaults | getBrandKit(), updateBrandKit(), importGlossary(Job) |
| S3 | Document editor | write/edit/refine; DiffBrush; drift flags | getDocument(), updateBlocks(base), startGeneration(), subscribeGeneration(), inspectText() |
| S4 | AI panel | brief forms, refine actions, stream states | startGeneration(), startRefinement() |
| S5 | Parity Weave | bilingual transform review | transformContent(Job), getJob(), commitTransform() |
| S6 | Glossary manager | term CRUD, conflicts, import/export | listGlossaryTerms(Query), upsertGlossaryTerm(), resolveGlossaryConflict() |
| S7 | Brand kit | voice traits, samples, banned terms | getBrandKit(), updateBrandKit() |
| S8 | Register settings | defaults, tashkeel policy, dialect tolerances | workspace settings ops |
| S9 | Review mode | diff vs last approval, comments, approve | getDocument(revision range), addComment(), reviewDocument() |
| S10 | Revision history | version list, block diffs (P16) | listRevisions(), getRevision() |
| S11 | Templates gallery | asset-type brief templates (campaign, PDP, email…) | listTemplates() |
| S12 | Usage & quota | meter, window reset, cost transparency | getUsage(), getQuotaPolicy() |
| S13 | Jobs center | async-contract §7 surface | listJobs(Query) |
| S14 | Seats & workspace admin | members, roles (owner/editor) | listMembers(), inviteMember(), updateMemberRole() |

Reduced mobile layout (360–767px): S1, S3 (single-pane editor, rails become sheets), S12, S13, S9 (read+approve only). Parity Weave is desktop/tablet-only (two columns reflow to stacked compare at narrow widths — documented in 09 reflow matrix).

## Per-screen state obligations

Each screen declares its four empties (P01), loading shape (P02 skeletons mirroring final geometry), and error classes (03 mapping) in the 11 matrix. S3's editor boot is staged: shell → blocks → glossary highlights (progressive, no full-screen block).

## IA decisions and rationale

- **AI panel is not a chat**: brief-driven actions and selection-contextual refines only — prevents the "empty chat box" dead-end and keeps output anchored to documents (ai-native-patterns §2 reserved regions).
- **Glossary is a workspace-level citizen, not a document feature**: Omar's governance loop needs it above document scope; conflicts surface wherever enforcement runs.
- **Parity Weave is a mode of the editor, not a separate app area**: transform is part of writing flow (CP-3), and mode-switching preserves document context.
- **Review is a document state, not a destination**: reviewers arrive via share links into S9 directly on the document.
