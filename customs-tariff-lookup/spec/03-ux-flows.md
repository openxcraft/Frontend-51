# 03 — UX Flows: customs-tariff-lookup

SME-C pass · 6 critical paths. Coverage table at end traces every 07b operation exactly once — no orphans, no phantoms. All duty surfaces obey the no-guarantee contract (00 LOOP-10; 07b rule 2); all assist surfaces obey draft-by-default (P15).

## CP-1 — Search → candidates → verdict (value proof)

**Trigger**: Noura opens nomenclature home with a goods term in her head ("دجاج مجمد" on Monday, "frozen chicken cuts" on Tuesday — both must land on the same heading).

1. Nomenclature home renders the active schedule edition banner ("KSA · 2026 edition, effective 2026-01-01 — fixture data in Mock Adapter") and the search field. She types an Arabic term; deterministic bilingual search runs on the indexed nomenclature (normalization per rtl-rules §4: tashkeel stripped, alef variants, taa marbuta, yaa forms; disclosed in the search panel — ai-native-patterns §7.4). `searchNomenclature`
2. Results table: one row per candidate heading/subheading — code (mono, Western digits), English description, Arabic rendering (bidi-isolated, own direction), duty reference chip, note-count chip; matched-field marker says which side matched (en / ar / code). `searchNomenclature` (page)
3. She wants reasoning, not just rows: the assist panel (if the capability is active and consented) turns her description into ranked candidates with matched terms and a plain-language rationale per candidate. Suggestions are drafts — nothing is saved, nothing changes, until she acts. `suggestCandidates`
4. She picks a row → the tariff-line reading pane opens (CP-3 continues); the search context stays in the rail so Back returns to the same results page. `getNomenclatureNode`
5. Search too noisy (60 hits for "جبن")? She narrows by chapter filter chips (P08) or abandons search for the tree (CP-2) — the deterministic spine is one click away, never buried. `listNomenclatureChildren`

**Edges**: mixed-script query (Arabic term with a Latin brand word — both scripts searched, matched-field marker says which matched); code-shaped query ("0207" or "02.07" — dots and spaces stripped, prefix match on code, ranked above description hits); zero-result search (filtered-empty declares itself and offers the tree + assist, P01); Arabic rendering absent on a row (explicit "no Arabic national rendering published" gap mark — never machine-filled, 07b rule 1); assist disagrees with her instinct (both shown; human choice wins; nothing recorded until she saves).
**Failures**: malformed query (empty after normalization → VALIDATION with the rule disclosed); assist quota exhausted mid-panel → deterministic results remain primary, assist degrades with ladder notice (ai-native-patterns §5; 08 map); assist unconsented → PERMISSION naming the capability class with the consent surface linked, search unaffected; NETWORK on list fetch → banner + retry (P20).
**Recovery**: search is stateless and re-runnable; results paginate by cursor; the reading pane keeps its own deep link (`schedule/code`).

## CP-2 — Hierarchical browse (the deterministic spine)

**Trigger**: Fahad prefers walking the tree when the term is ambiguous ("charger" could be two chapters) — the spine the product must keep honest against free portals (01).

1. Navigator opens at the section grid of the active schedule: 21 section cards with bilingual titles and chapter ranges. `listNomenclatureChildren`
2. Section → chapter list → heading list → subheadings → tariff lines: each level paginated, each row carries code + bilingual description + child count; breadcrumbs pin the path (context preservation per drill-down discipline — 05 integration record). `listNomenclatureChildren` (per level)
3. Chapter notes render inline where the schedule publishes them (legal-notes panel on chapter open) — the hierarchy carries its own interpretive furniture. `getNomenclatureNode`
4. He opens a heading → reading pane (CP-3). `getNomenclatureNode`
5. The active edition is switchable from the rail (schedule switcher); switching re-roots the tree and re-renders the path under the new edition, with a banner if the open node's code changed edition (see CP-5). `listSchedules` · `getSchedule`

**Edges**: a chapter with >200 headings virtualizes (P19); Arabic-first chrome flips the tree's expansion direction (inline-end) and the breadcrumb order (rtl-rules §2); a code retired in the switched edition renders a tombstone row ("retired in this edition — see change record") instead of vanishing. `listVersionDiffs`
**Failures**: NETWORK mid-tree → subtree skeleton + retry, siblings stay rendered; NOT_FOUND on a stale deep link (edition switched under a bookmark) → tombstone + redirect to the nearest live ancestor with the change record linked.
**Recovery**: tree state is URL-addressable; every level is re-fetchable by cursor; nothing mutates during browse (read-only surface).

## CP-3 — Tariff-line reading pane (the daily object)

**Trigger**: any selection from search, tree, notes, or a saved list lands here — one tariff line, read completely.

1. Reading pane renders the line card: full code in mono (grouped digits, e.g. 0207.14.00.10 fixture shape), level path (section → chapter → heading chain, bilingual), English description, Arabic national rendering (or the honest gap mark), published duty reference with structure (ad valorem %, or specific amount + unit), edition label, and the no-guarantee marker ("published reference — the customs authority's assessment is its own", 11 D). `getNomenclatureNode`
2. Cross-schedule compare strip: same 6-digit core across the workspace's schedules (KSA 2026 vs UAE 2026) — rate structure side-by-side, differences marked, with the reminder that these are different national schedules of the same international core. `compareDutyRates`
3. Ruling-notes attached to this heading (and its ancestor headings) list inline with status chips (current / superseded / withdrawn) and outcome codes; each opens the note detail. `listRulingNotes` · `getRulingNote`
4. Save action: "Add to classification list" opens the save dialog (list picker, product description EN+AR, status candidate, rationale optional) — the only mutation on this surface, and it is the desk officer's signature on the decision (P15 gate: the human takes responsibility). `addSavedCode`
5. Link-another-note action lets her attach a controlling note to a saved code from here. `linkNoteToSavedCode`

**Edges**: line with excise-flag (fixture marks the flag; the product shows the flag + "separate regime — outside customs duty scope", never a computed excise amount); specific duty (amount per unit renders with unit label, Western numerals); a line whose Arabic side is missing renders the gap mark and still ranks in Arabic search if the English side matched a Latin synonym — matched-field marker stays honest; duty "exempt" renders 0% with its schedule note.
**Failures**: compare on a code absent from one schedule → partial compare with the absent side named (partial-result policy, 07b rule 7); CONFLICT impossible here (read + single-shot save); NOT_FOUND on a retired code deep link → tombstone + change record.
**Recovery**: the pane is read-mostly; a failed save leaves the dialog open with the typed description preserved for retry.

## CP-4 — Ruling-notes library (the evidence spine)

**Trigger**: Mariam searches precedent before reviewing a junior's classification, or follows a note link from a heading.

1. Notes library home: filterable list — code prefix, authority kind (national customs authority / WCO committee class / regional bloc class), status (current/superseded/withdrawn), issue-date range, jurisdiction; saved-view chips (P08). `listRulingNotes`
2. Note detail renders: reference number (mono), authority kind + jurisdiction, issue date, goods description (EN, AR where the source carried it — the honest gap mark where not), outcome code, summary (curated, bilingual where sourced), supersession chain (supersedes / superseded-by links), and the linked headings. `getRulingNote`
3. "Attach to saved code" action: picks one of the desk's saved codes and links the note as rationale — evidence binding creates the audit trail (P17). `linkNoteToSavedCode`
4. Superseded note open? The banner names the superseding note and links it — chains are walkable, never dead ends. `getRulingNote`
5. Bilingual search across notes works like nomenclature search (same normalization, same disclosure). `listRulingNotes` (search)

**Edges**: note whose outcome code moved editions (the note cites an old edition's code — rendered with the edition label and a "see current code" link where the chain is known); a note with Arabic goods description only (reverse gap — English side marked missing, never fabricated); filtered-empty declares itself with filter reset (P01).
**Failures**: NETWORK → list banner + retry; NOT_FOUND on a stale note link → tombstone with the superseding note if known.
**Recovery**: notes are immutable reference records (07a state obligations) — no edit path exists to fail.

## CP-5 — Saved classification lists + edition reconciliation (the memory)

**Trigger**: Noura's Monday maintenance loop; or an edition update banner ("The 2026 edition is active — 3 of your saved codes need review") on return-to-app (async-contract §6.3 return state).

1. Lists home: the desk's lists with counts, schedule pins, and review-state badges. `listBookmarkLists` · `getBookmarkList`
2. List detail: saved-code table — code, product description (EN + AR, bidi-isolated per cell), status (candidate / desk-verified / flagged), linked notes count, last-checked date, edition pinned at save. Bulk select + action bar (P07): verify, flag, remove. `listSavedCodes` · `updateSavedCode` · `removeSavedCode`
3. New list creation (or the starter list on first run) with bilingual name. `createBookmarkList`
4. **Edition check**: she runs checkCodeChanges for the list across the prior → current edition; the result table names each affected code with its change kind (added / retired / description-changed / rate-changed / code-split) and links the change record. `checkCodeChanges` · `listVersionDiffs`
5. She resolves a flagged row: open the change record, re-verify against the new line (reading pane), update the saved code's status and re-pin the edition, or retire it from the list. `getNomenclatureNode` · `updateSavedCode`
6. Deleting a list is a level-3 destructive act (type-to-confirm with the list's name — P04); removing a single saved code is level 1 with undo window (P03). `deleteBookmarkList` · `removeSavedCode`
7. Unlinking a note from a saved code (rationale maintenance). `unlinkNoteFromSavedCode`

**Edges**: a saved code retired in the new edition (tombstone row + migration path via the change record's successor code where the chain is known); duplicate save (same code to the same list → VALIDATION "already saved here", both entries point to the same line — no silent duplicate); a list pinned to an old schedule edition keeps rendering under that edition (honest pinning) with a banner offering the reconciliation run; RTL chrome mirrors the table with numerals Western and code cells bidi-isolated LTR (rtl-rules §2).
**Failures**: stale baseVersion on updateSavedCode → CONFLICT with both payloads (P10 conflict grammar); edition pair not comparable (no diff data between two chosen editions → VALIDATION naming what the desk can compare instead); NETWORK → queued write banner (P20).
**Recovery**: saved-code updates are versioned; removals carry undo windows; the edition check is re-runnable and its result is a snapshot (never mutates the list it inspected).

## CP-6 — Workspace, schedules, export, and the console (the daily surface)

**Trigger**: session start; settings; the evidence-pack handoff; edition-curious browsing.

1. Session boot: role/locale/active schedule hydrate the rail. `getSession`
2. Settings: default locale (workspace chrome flips fully — 05 direction model), assist default, active schedule edition, normalization disclosure (the full ruleset text), capability consent state rendered in capability language (credential-contract §2). `updateWorkspaceSettings` · `listSchedules` · `getSchedule`
3. Evidence-pack export: pick a list (or the whole workspace), options (include linked notes: yes/no; include duty references with edition labels), then export — a Job per async-contract (determinate progress in sections: codes → notes → render), artifact with expiry + regeneration, download as the manual path (LOOP-5: no credential required to be useful). `exportEvidencePack` · `getArtifact` · `listJobs`
4. Activity console (T3-consolidated with jobs): every consequential mutation as actor-action-target-timestamp rows, filterable, link-to-context (P17 — the accountability surface for an auditable desk). `listActivity` · `listJobs`
5. Usage meter renders assist-window consumption before/after assist runs (P14; deterministic search renders NO meter — unmetered by design). `getUsage`

**Edges**: viewer role (read + export, no mutations — 07b Session grammar); Arabic locale flips every surface's chrome (09 matrix); export of a list containing retired codes (included with tombstone marks and change records — the pack stays honest).
**Failures**: export partial failure (notes section failed, codes delivered → partial policy with per-section retry, async-contract §4); artifact expired → NOT_FOUND with regenerable path; RATE_LIMIT on assist-heavy sessions → ladder notice, search unaffected.
**Recovery**: exports re-generate from list state; jobs reconcile on reconnect; activity is append-only and survives everything.

## Non-happy paths

- **Assist capability unavailable or quota-exhausted (rung 4 / rung 2–3, 08 map)**: search + browse + notes + lists + edition checks + exports all work — the deterministic spine IS the product; the assist panel renders the clean-unavailability notice with reset time.
- **No content-refresh capability bound (LOOP-5)**: the workspace runs on its bundled schedule editions with effective-date labels and honest staleness banners; the manual alternative is the desk's own portal check (08 N1) — the product never pretends an edition is current.
- **First run**: nomenclature home offers the seeded sample list ("3 settled classifications to explore") so the save-link-export loop is experienceable before real work lands (P22 value checklist; 07c fixtures).
- **Offline (P20)**: reading surfaces stay usable from the last fetch where the platform allows; saved-list writes queue with per-item state and reconcile on return; search/tree require the local cache or queue a retry honestly.

## Failure → error mapping

VALIDATION (malformed/empty-after-normalization query, duplicate save, non-comparable edition pair, assist input missing description) · NOT_FOUND (stale code/note/list/artifact deep links, retired codes in the current edition) · PERMISSION (assist consent, workspace scoping, viewer-role mutations) · CONFLICT (concurrent saved-code edits) · RATE_LIMIT (assist runs, exports) · NETWORK (list fetches, tree fetches, job polling, artifact delivery) · UNKNOWN (typed retry with correlationId).

## Flow → operation coverage (every 07b operation; no orphans)

| Op | Flows | Op | Flows |
|---|---|---|---|
| `getSession` | CP-6.1 | `addSavedCode` | CP-3.4 |
| `updateWorkspaceSettings` | CP-6.2 | `listSavedCodes` | CP-5.2 |
| `listSchedules` | CP-2.5, CP-6.2 | `updateSavedCode` | CP-5.2, CP-5.5 |
| `getSchedule` | CP-2.5, CP-6.2 | `removeSavedCode` | CP-5.2, CP-5.6 |
| `searchNomenclature` | CP-1.1/2, CP-4.5 (notes search shares the grammar) | `linkNoteToSavedCode` | CP-3.5, CP-4.3 |
| `suggestCandidates` | CP-1.3 | `unlinkNoteFromSavedCode` | CP-5.7 |
| `listNomenclatureChildren` | CP-1.5, CP-2.1/2 | `checkCodeChanges` | CP-5.4 |
| `getNomenclatureNode` | CP-1.4, CP-2.3/4, CP-3.1, CP-5.5 | `listVersionDiffs` | CP-2.5 (retired tombstone), CP-5.4 |
| `compareDutyRates` | CP-3.2 | `exportEvidencePack` | CP-6.3 |
| `listRulingNotes` | CP-3.3, CP-4.1/5 | `getArtifact` | CP-6.3 |
| `getRulingNote` | CP-3.3, CP-4.2/4 | `listJobs` | CP-6.3/4 |
| `createBookmarkList` | CP-5.3 | `listActivity` | CP-6.4 |
| `listBookmarkLists` | CP-5.1 | `getUsage` | CP-6.5 |
| `getBookmarkList` | CP-5.1 | `deleteBookmarkList` | CP-5.6 |

28 operations, 0 orphans (Critic-verified; scripted check run at audit).
