// GENERATED from specs-source/customs-tariff-lookup/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "customs-tariff-lookup",
 "title": "Customs Tariff Lookup",
 "family": "specialized",
 "tier": 3,
 "flagship": false,
 "adapter": "CustomsTariffAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Jumruk Bronze",
  "pairing": "P14",
  "radius": "4px",
  "elevation": "flat-line",
  "icon": "outline-geometric",
  "motion": "minimal",
  "fonts": [
   "Rubik",
   "Space Mono"
  ],
  "primary": "#7D5E07",
  "accent": "#583D00",
  "canvas": "#A4802B"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Nomenclature home",
   "purpose": "search-first entry, active-edition banner, chapter shortcuts, first-run sample list (P22)",
   "shell": "",
   "data": "searchNomenclature, suggestCandidates, listSchedules, getUsage",
   "archetype": "wizard-flow"
  },
  {
   "id": "S2",
   "name": "Hierarchy navigator",
   "purpose": "section grid → chapter → heading → line tree; breadcrumbs; schedule switcher",
   "shell": "",
   "data": "listNomenclatureChildren, getNomenclatureNode, listSchedules, listVersionDiffs (tombstones)",
   "archetype": "calendar-grid"
  },
  {
   "id": "S3",
   "name": "Tariff-line reading pane",
   "purpose": "the daily object: code card, bilingual descriptions, duty reference, attached notes, save/link actions",
   "shell": "",
   "data": "getNomenclatureNode, compareDutyRates, listRulingNotes, getRulingNote, addSavedCode, linkNoteToSavedCode",
   "archetype": "list-console"
  },
  {
   "id": "S4",
   "name": "Search results",
   "purpose": "ranked candidate rows with matched-field markers, filters (P08)",
   "shell": "",
   "data": "searchNomenclature, getNomenclatureNode (open)",
   "archetype": "list-console"
  },
  {
   "id": "S5",
   "name": "Ruling-notes library",
   "purpose": "filterable notes list, bilingual notes search",
   "shell": "",
   "data": "listRulingNotes, getRulingNote, linkNoteToSavedCode",
   "archetype": "settings-admin"
  },
  {
   "id": "S6",
   "name": "Lists home + list detail",
   "purpose": "desk working memory: saved codes, statuses, bulk actions, edition checks",
   "shell": "",
   "data": "listBookmarkLists, getBookmarkList, createBookmarkList, deleteBookmarkList, listSavedCodes, updateSavedCode, removeSavedCode, unlinkNoteToSavedCode, checkCodeChanges",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Editions surface",
   "purpose": "schedule editions, edition change log, pair-diff browse",
   "shell": "",
   "data": "listSchedules, getSchedule, listVersionDiffs, checkCodeChanges",
   "archetype": "calendar-grid"
  },
  {
   "id": "S8",
   "name": "Activity console",
   "purpose": "jobs + activity rows, filterable, link-to-context (P12/P17)",
   "shell": "",
   "data": "listJobs, listActivity",
   "archetype": "jobs-centre"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "locale, assist default, active schedule, normalization disclosure, consent state",
   "shell": "",
   "data": "getSession, updateWorkspaceSettings, getUsage",
   "archetype": "calendar-grid"
  },
  {
   "id": "S10",
   "name": "Command palette (overlay)",
   "purpose": "bilingual search across codes/notes/lists/schedules",
   "shell": "",
   "data": "client-side over S1–S8 data",
   "archetype": "calendar-grid"
  }
 ],
 "flows": [
  {
   "title": "CP-2 — Hierarchical browse (the deterministic spine)",
   "steps": [
    "Navigator opens at the section grid of the active schedule: 21 section cards with bilingual titles and chapter ranges. listNomenclatureChildren",
    "He opens a heading → reading pane (CP-3). getNomenclatureNode",
    "*Recovery: tree state is URL-addressable; every level is re-fetchable by cursor; nothing mutates during browse (read-only surface)."
   ]
  },
  {
   "title": "CP-3 — Tariff-line reading pane (the daily object)",
   "steps": [
    "*Trigger: any selection from search, tree, notes, or a saved list lands here — one tariff line, read completely.",
    "Link-another-note action lets her attach a controlling note to a saved code from here. linkNoteToSavedCode",
    "*Recovery: the pane is read-mostly; a failed save leaves the dialog open with the typed description preserved for retry."
   ]
  },
  {
   "title": "CP-4 — Ruling-notes library (the evidence spine)",
   "steps": [
    "*Trigger: Mariam searches precedent before reviewing a junior's classification, or follows a note link from a heading.",
    "Superseded note open? The banner names the superseding note and links it — chains are walkable, never dead ends. getRulingNote",
    "Bilingual search across notes works like nomenclature search (same normalization, same disclosure). listRulingNotes (search)",
    "*Failures: NETWORK → list banner + retry; NOT_FOUND on a stale note link → tombstone with the superseding note if known.",
    "*Recovery: notes are immutable reference records (07a state obligations) — no edit path exists to fail."
   ]
  },
  {
   "title": "CP-5 — Saved classification lists + edition reconciliation (the memory)",
   "steps": [
    "Lists home: the desk's lists with counts, schedule pins, and review-state badges. listBookmarkLists · getBookmarkList",
    "New list creation (or the starter list on first run) with bilingual name. createBookmarkList",
    "Unlinking a note from a saved code (rationale maintenance). unlinkNoteFromSavedCode"
   ]
  },
  {
   "title": "CP-6 — Workspace, schedules, export, and the console (the daily surface)",
   "steps": [
    "*Trigger: session start; settings; the evidence-pack handoff; edition-curious browsing.",
    "Session boot: role/locale/active schedule hydrate the rail. getSession",
    "Usage meter renders assist-window consumption before/after assist runs (P14; deterministic search renders NO meter — unmetered by design). getUsage",
    "*Recovery: exports re-generate from list state; jobs reconcile on reconnect; activity is append-only and survives everything."
   ]
  }
 ],
 "components": [
  {
   "name": "NomenclatureTree",
   "purpose": "the hierarchy navigator: section grid → chapter/heading/line levels, breadcrumbs, schedule switcher, tombstone rows for retired codes",
   "obligations": "Tree semantics with aria-level/expanded; ↑/↓ walk nodes, → expands (inline-end arrow semantics stable both directions — rtl-rules §4), Enter opens the reading pane; >200 siblings virtualize (P19) with focus preserved; breadcrumbs are links + one \"back to results\" affordance; tombstone rows carry the change-record link; expansion is instant with crossfade (minimal motion)"
  },
  {
   "name": "TariffSearchBar",
   "purpose": "bilingual search entry: mixed-script input, normalization disclosure link, code-shaped input handling, assist trigger",
   "obligations": "dir=\"auto\" on the input with bidi isolation of the ambient chrome (rtl-rules §2); dots/spaces in code-shaped queries stripped before prefix match (disclosed); normalization panel is keyboard-reachable and SR-readable (ai-native-patterns §7.4); assist trigger is a labeled button (lattice glyph + \"assist\" text), never an auto-magic affordance; zero-result state offers the tree (P01)"
  },
  {
   "name": "SearchResultsTable",
   "purpose": "ranked candidate rows: code (mono), EN description, AR rendering, duty chip, note-count chip, matched-field marker",
   "obligations": "P18 grid (arrow navigation, range select); every code cell dir=\"ltr\" isolated; description cells render at own direction in sibling lines (never merged); matched-field marker is icon+text (\"matched: Arabic description\"), never color alone; >200 rows virtualize (P19); duty chip carries the no-guarantee title on hover/focus (a11y: tooltip is not the only carrier — the reading pane repeats it in text)"
  },
  {
   "name": "TariffLineCard",
   "purpose": "the reading pane's object: full code, level path, bilingual descriptions, duty reference block, edition label, attached notes list, save/link actions",
   "obligations": "Code renders Space Mono digit-grouped, dir=\"ltr\", two-step opacity settle ≤120ms (the signature micro-interaction, 05); Arabic rendering is a sibling line at own direction with the honest gap mark when absent (07b rule 1); duty block: kind label + value + unit + edition + the no-guarantee sentence as visible text (not tooltip-only); excise flag renders \"separate regime\" note, never an amount; level path is a described breadcrumb for SR; save action opens the dialog with focus trapped and returned (P15 gate: human signature)"
  },
  {
   "name": "RateCompareStrip",
   "purpose": "same 6-digit core across schedules side-by-side",
   "obligations": "Column headers announce schedule + edition; absent side named in text (partial policy); values render mono Western digits LTR-isolated; differences carry icon+text markers (not color alone); the strip never computes totals — it renders published rates only (07b rule 2)"
  },
  {
   "name": "RulingNoteCard",
   "purpose": "note detail: ref (mono), authority kind + jurisdiction, issue date, bilingual goods description, outcome code, summary, supersession chain, attach action",
   "obligations": "Ref and outcome code dir=\"ltr\" isolated mono; Arabic goods description sibling-line at own direction with gap mark when the source carried none; supersession banner links the superseding note (walkable chain); \"attach to saved code\" is a labeled button opening a list picker; status chip is icon+text+color (current/superseded/withdrawn)"
  },
  {
   "name": "NotesLibraryTable",
   "purpose": "filterable notes list: code prefix, authority kind, status, date range, jurisdiction; bilingual notes search",
   "obligations": "P18 grid + P08 filter chips with accessible descriptions of each predicate; filtered-empty declares itself (P01); date filter input carries inputmode numeric guidance; pagination cursors opaque; SR row-count context on region entry"
  },
  {
   "name": "SavedCodesTable",
   "purpose": "the desk's working memory: code, product description EN/AR, status, linked notes count, edition pin, last-checked",
   "obligations": "Status transitions (candidate → desk-verified / flagged) are explicit actions with undo window (P03) — status is a human signature, never auto-set; inline edit per P06 (Esc restores, Tab commits); stale baseVersion → CONFLICT surfaces both versions inline; bulk ops via ActionBar (P07) with every action scoped to \"N selected\"; retired-code rows render tombstone + migration link"
  },
  {
   "name": "EditionDiffList",
   "purpose": "edition change log + pair-diff browse: added / retired / description-changed / rate-changed / code-split rows",
   "obligations": "Change-kind marker is icon+text (bronze-bright UI-ink tick + ink text — never color alone); rate-changed rows show old→new published values in mono with both edition labels; \"affected saved codes\" column links the desk's lists (the reconciliation hook); P16 diff layout is direction-aware (RTL diffs flow right-to-left)"
  },
  {
   "name": "EvidencePackPreview",
   "purpose": "export composition: list of saved codes with linked notes, duty references, edition labels — what the artifact will contain",
   "obligations": "Preview is text-honest (no render tricks): every included element named; options (include notes: yes/no; include duty references) are checkboxes with described consequences; export button names the artifact and expiry (async-contract §2); artifact expiry renews via regeneration, stated at creation"
  }
 ],
 "ops": [
  "getSession",
  "updateWorkspaceSettings",
  "listSchedules",
  "getSchedule",
  "searchNomenclature",
  "suggestCandidates",
  "listNomenclatureChildren",
  "getNomenclatureNode",
  "compareDutyRates",
  "listRulingNotes",
  "getRulingNote",
  "createBookmarkList",
  "listBookmarkLists",
  "getBookmarkList",
  "deleteBookmarkList",
  "addSavedCode",
  "listSavedCodes",
  "updateSavedCode",
  "removeSavedCode",
  "linkNoteToSavedCode",
  "unlinkNoteFromSavedCode",
  "listVersionDiffs",
  "checkCodeChanges",
  "exportEvidencePack",
  "getArtifact",
  "listJobs",
  "listActivity",
  "getUsage"
 ],
 "entities": [
  {
   "name": "TariffSchedule",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "jurisdiction",
     "optional": false,
     "type": "string"
    },
    {
     "name": "labelEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "labelAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "editionTag",
     "optional": false,
     "type": "string"
    },
    {
     "name": "codeLength",
     "optional": false,
     "type": "6 | 8 | 10 | 12"
    },
    {
     "name": "effectiveFrom",
     "optional": false,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'current' | 'superseded' | 'announced'"
    },
    {
     "name": "supersedesScheduleId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "sourceNote",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "DutyReference",
   "fields": [
    {
     "name": "kind",
     "optional": false,
     "type": "DutyKind"
    },
    {
     "name": "ratePercent",
     "optional": true,
     "type": "number"
    },
    {
     "name": "specific",
     "optional": true,
     "type": "{"
    },
    {
     "name": "amount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "unit",
     "optional": false,
     "type": "string"
    },
    {
     "name": "unitLabelEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "unitLabelAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "scheduleNote",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "NomenclatureNode",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "scheduleId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "code",
     "optional": false,
     "type": "string"
    },
    {
     "name": "level",
     "optional": false,
     "type": "NomenclatureLevel"
    },
    {
     "name": "descriptionEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "descriptionAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "descriptionArSource",
     "optional": false,
     "type": "'national-schedule' | 'none'"
    },
    {
     "name": "parentCode",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "childCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "duty",
     "optional": true,
     "type": "DutyReference"
    },
    {
     "name": "exciseFlagged",
     "optional": true,
     "type": "boolean"
    },
    {
     "name": "unitRequired",
     "optional": true,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "NomenclatureSearchHit",
   "fields": [
    {
     "name": "node",
     "optional": false,
     "type": "NomenclatureNode"
    },
    {
     "name": "matchedField",
     "optional": false,
     "type": "'en' | 'ar' | 'code'"
    },
    {
     "name": "matchedTerms",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "rank",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "ClassificationCandidate",
   "fields": [
    {
     "name": "code",
     "optional": false,
     "type": "string"
    },
    {
     "name": "score",
     "optional": false,
     "type": "number"
    },
    {
     "name": "matchedTerms",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "rationale",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ClassificationSuggestion",
   "fields": [
    {
     "name": "provenance",
     "optional": false,
     "type": "SuggestionProvenance"
    },
    {
     "name": "degraded",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "candidates",
     "optional": false,
     "type": "ClassificationCandidate[]"
    },
    {
     "name": "notice",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "RulingNote",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "ref",
     "optional": false,
     "type": "string"
    },
    {
     "name": "authorityKind",
     "optional": false,
     "type": "AuthorityKind"
    },
    {
     "name": "jurisdiction",
     "optional": false,
     "type": "string"
    },
    {
     "name": "issuedOn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "appliesToCodePrefix",
     "optional": false,
     "type": "string"
    },
    {
     "name": "goodsDescriptionEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "goodsDescriptionAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "outcomeCode",
     "optional": false,
     "type": "string"
    },
    {
     "name": "summaryEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "summaryAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "NoteStatus"
    }
   ]
  },
  {
   "name": "BookmarkList",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "workspaceId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "savedCodeCount",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "SavedCode",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "listId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "scheduleId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "hsCode",
     "optional": false,
     "type": "string"
    },
    {
     "name": "productDescriptionEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "productDescriptionAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "SavedCodeStatus"
    },
    {
     "name": "rationaleNote",
     "optional": true,
     "type": "string"
    },
    {
     "name": "linkedNoteRefs",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "addedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "addedByMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "lastCheckedAt",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "CodeChangeRecord",
   "fields": [
    {
     "name": "hsCode",
     "optional": false,
     "type": "string"
    },
    {
     "name": "changeKind",
     "optional": false,
     "type": "ChangeKind"
    },
    {
     "name": "fromScheduleId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "toScheduleId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "detailEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "detailAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "successorCode",
     "optional": true,
     "type": "string"
    },
    {
     "name": "affectedSavedCodeIds",
     "optional": false,
     "type": "string[]"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (no search yet)",
   "\"The 2026 edition is loaded. Search in Arabic or English — or walk the tree from any section.\"",
   "\"الإصدار 2026 محمّل. ابحث بالعربية أو الإنجليزية — أو تجوّل في الشجرة من أي قسم.\"",
   "Search examples / Open the tree",
   "S1 sample-list prompt (first run)"
  ],
  "loading": [
   "S1/S4 search skeleton",
   "input-row skeleton + 8 result-row skeletons",
   "صفوف هيكلية للإدخال و8 صفوف نتائج",
   "S2 tree level skeleton",
   "section-grid skeleton / chapter-row skeletons ×6"
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (empty-after-normalization query)",
   "\"That query has no searchable text once normalization runs — check for stray marks. Meanwhile the tree is one click away.\"",
   "\"لا نص قابل للبحث في هذا الاستعلام بعد تشغيل التطبيع — تحقق من علامات زائدة. الشجرة على بُعد نقرة في الأثناء.\"",
   "VALIDATION (duplicate save)"
  ],
  "success": [
   "Search results ready",
   "\"12 results — top: 0207.14, subheading, 5% fixture reference.\"",
   "\"12 نتيجة — الأعلى: 0207.14، بند فرعي، مرجع 5% تركيبي.\"",
   "Code settled (reading pane)",
   "\"0207.14.00.20 — frozen fowl, cut in pieces (fixture line). 2026 edition.\""
  ]
 },
 "briefLine": "That library is the product's second object and its defensibility. Mature customs regimes publish classification rulings and interpretation notes — advance rulings, committee opinions, explanatory-note passages — and practitioners defend their code choices by citing them (research digest: the US CROSS database, Canadian and Japanese advance-ruling systems; the WCO's own Explanatory Notes and Classification Opinions). No surveyed tool attaches that evidence layer to the browsed code, and none of it is bilingual. customs-tariff-lookup curates ruling-notes as first-class records — reference number, issuing authority kind, issue date, goods description in both languages where the source carries both, the outcome code, a summary, a supersession chain — linked to the headings they interpret, searchable on their own, and linkable to the desk's own saved codes as classification rationale. The deliverable that leaves the product is an evidence pack: the desk's saved codes with product descriptions, chosen lines, duty references, and the linked ruling-notes, exported as a shareable artifact for the licensed broker, the finance team, or the audit file."
} as const;
export type Spec = typeof SPEC;
