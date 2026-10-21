// GENERATED from specs-source/asset-register-tracker/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "asset-register-tracker",
 "title": "Asset Register Tracker",
 "family": "business_ops",
 "tier": 3,
 "flagship": false,
 "adapter": "AssetRegisterAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Sijill Steel",
  "pairing": "P06",
  "radius": "8px",
  "elevation": "flat-line",
  "icon": "line-2",
  "motion": "minimal",
  "fonts": [
   "Almarai",
   "Inter"
  ],
  "primary": "#1F7A8C",
  "accent": "#175566",
  "canvas": "#1F2933"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Registry home",
   "purpose": "virtualized asset table, filters + saved views, quick-add, bulk actions",
   "shell": "",
   "data": "listAssets · getSession · getUsage (settings posture link)",
   "archetype": "list-console"
  },
  {
   "id": "S2",
   "name": "Asset detail",
   "purpose": "profile + custody timeline + label block + retirement block",
   "shell": "",
   "data": "getAsset · listCustodyEvents · updateAsset",
   "archetype": "settings-admin"
  },
  {
   "id": "S3",
   "name": "Labels (batches)",
   "purpose": "batch list, sheet preview + download, apply checklist, replacement requests",
   "shell": "Labels (batches)",
   "data": "requestLabelBatch · getLabelBatch · getArtifact · confirmLabelApplied · reportLabelState · listJobs",
   "archetype": "review-queue"
  },
  {
   "id": "S4",
   "name": "People",
   "purpose": "custody ledger per person, open return-pending, inline person creation",
   "shell": "",
   "data": "listPeople · createPerson",
   "archetype": "review-queue"
  },
  {
   "id": "S5",
   "name": "Places & Categories",
   "purpose": "location tree editor, category manager (both locales)",
   "shell": "",
   "data": "listLocations · createLocation · listCategories · createCategory",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Activity",
   "purpose": "audit log, filterable, exportable (links to S9 export)",
   "shell": "",
   "data": "listActivity",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Jobs",
   "purpose": "label batches + exports, state, cancel/retry",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S8",
   "name": "Settings",
   "purpose": "locale default, tag format display, notification tiers, capability consents",
   "shell": "",
   "data": "getSession · getUsage",
   "archetype": "wizard-flow"
  },
  {
   "id": "S9",
   "name": "Export studio",
   "purpose": "register export scope/format/custody-history toggle, artifact list",
   "shell": "",
   "data": "exportRegister · getArtifact",
   "archetype": "editor-studio"
  },
  {
   "id": "M1",
   "name": "Scan companion (mobile)",
   "purpose": "scan lookup → asset card → hand-off / return / transfer / report / sighting / walk mode",
   "shell": "Scan companion (mobile)",
   "data": "lookupByScan · recordCustodyEvent · confirmLabelApplied · reportLabelState · getAsset",
   "archetype": "list-console"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Register first assets → QR label request → print → apply (value proof)",
   "steps": [
    "Usage meter check before/after the batch (getUsage — label batches and exports in window; P14).",
    "*Recovery: labels are re-requestable per asset; applied history persists per label; the register never loses assets to a print failure."
   ]
  },
  {
   "title": "CP-2 — Signed custody hand-off: assign → return → transfer (the daily loop)",
   "steps": [
    "Tariq opens the scan companion on his phone and scans the laptop's label (lookupByScan → asset summary card: tag, name, category, current holder, label state).",
    "*Recovery: every custody event is immutable; mistakes append corrections; queued offline events are individually cancellable before reconnect flush."
   ]
  },
  {
   "title": "CP-3 — Mobile scan lookup (the everyone surface)",
   "steps": [
    "Anyone — seat or no seat — opens the scan companion (web link or the QR on a poster by the storeroom) and scans a label. lookupByScan",
    "*Recovery: lookup is read-only; no state to lose. Manual tag entry works for every lookup operation (listAssets search by tag is the desktop equivalent)."
   ]
  },
  {
   "title": "CP-4 — Registry table, asset detail, and audit-trail review (the daily surface)",
   "steps": [
    "Activity log (listActivity): every consequential mutation — actor, action, target, timestamp (P17; the audit surface, exportable via CP-5).",
    "⌘K palette reaches assets, people, locations, categories (T3 with >3 list surfaces; bilingual normalization per P05).",
    "*Recovery: filters and saved views are client state; data is cursor-recoverable; every edit versioned."
   ]
  },
  {
   "title": "CP-5 — Audit walk (sightings), retirement, and the evidence export",
   "steps": [
    "Jobs console: label batches and exports with state, cancel/retry, link-to-context (listJobs).",
    "*Recovery: retirement records are immutable (corrections via note append on the activity log, never edits); exports regenerate from register state at will."
   ]
  }
 ],
 "components": [
  {
   "name": "AssetTable",
   "purpose": "the registry grid: virtualized rows, filter/sort state, quick-add rows, inline edit, bulk select",
   "obligations": "P18 grid keyboard contract (arrows, range select, inline-edit activation); P19 virtualization with focus preservation + row-count announcement on region entry; per-row direction rendering for bilingual names (bidi isolation); tag column tabular figures; custody/label state chips are icon+text+color; sticky header at density B; 360px collapse to stacked cards (ux-guidelines 71); inline validation row-level, never blocking the grid"
  },
  {
   "name": "CustodyTimeline",
   "purpose": "append-only event chain per asset: assign/return/transfer/sighting/correction with signatures, condition, location",
   "obligations": "Timeline order mirrors in RTL; border-inline-start weight encodes chain density; correction events render with plum marker + reference link to the corrected event (history honesty is the component's job); signature seal mark (amber ring + pen glyph) with signer name, method, timestamp announced; filter by kind/person/date; keyboard-navigable in reading order; exportable context (feeds S9 pack)"
  },
  {
   "name": "QrLabelSheetPreview",
   "purpose": "print-fidelity preview of a label batch: grid of label cells (QR + tag + bilingual name), size (25/40/60mm) and layout (A4 65/24/1-up) selection",
   "obligations": "True-to-print geometry (square cells, declared deviation — 05); print-safe contrast independent of theme; QR minimum-size note surfaced at size selection (research: ~1.6cm floor); per-cell applied/pending state marks; screen-reader alternative = the batch checklist list (equal information, text-first); print stylesheet is a fidelity obligation (what you preview is what prints)"
  },
  {
   "name": "ScanLookupView",
   "purpose": "mobile companion: camera decode → asset card → scoped actions",
   "obligations": "Manual tag-entry as first-class equal path (camera never required — a11y-baseline §5 spirit + the KYC camera-guidance pattern from a11y-baseline §7 applied as an analog: short SR guidance line while scanning); decode status announced politely; asset card shows tag/holder/serial prominently (wrong-asset catch pre-signature); action set scoped to role (member vs shared-link); queue state per offline event (P20); one-thumb targets ≥24px with 44px touch comfort"
  },
  {
   "name": "SignatureCapture",
   "purpose": "the custody signature block: typed name (default), drawn mark, or scan-ack",
   "obligations": "Typed-name path is the keyboard/SR default (drawn is enhancement, never the only path); drawn path captures a mark with a typed-name witness field (a mark alone names nobody); scan-ack path renders the acknowledging device's confirmation; signature never stored on the event without signer name + timestamp + method; decline path leaves the event un-recorded (no half-signed states — 03 CP-2 edge)"
  },
  {
   "name": "WalkModePanel",
   "purpose": "audit-walk companion state: expected-vs-seen reconciliation at a location",
   "obligations": "Expected set from listAssets at location; scanned set from sighting events; both gaps surfaced (unscanned listed + scanned unlisted); counts as text, not heat; progress is item counts (async-contract §3); exit walk mode asks nothing (state is events, not a session artifact)"
  }
 ],
 "ops": [
  "getSession",
  "listAssets",
  "createAsset",
  "getAsset",
  "updateAsset",
  "retireAsset",
  "listCategories",
  "createCategory",
  "listLocations",
  "createLocation",
  "requestLabelBatch",
  "getLabelBatch",
  "confirmLabelApplied",
  "reportLabelState",
  "recordCustodyEvent",
  "listCustodyEvents",
  "lookupByScan",
  "listPeople",
  "createPerson",
  "listActivity",
  "listJobs",
  "exportRegister",
  "getArtifact",
  "getUsage"
 ],
 "entities": [
  {
   "name": "Workspace",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "name",
     "optional": false,
     "type": "string"
    },
    {
     "name": "defaultLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "tagPrefix",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nextTagSequence",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "AssetCategory",
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
     "name": "code",
     "optional": true,
     "type": "string"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Location",
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
     "name": "parentId",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'building' | 'floor' | 'room' | 'storeroom' | 'vehicle' | 'other'"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Asset",
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
     "name": "tag",
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
     "name": "categoryId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "locationId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "serialNumber",
     "optional": true,
     "type": "string"
    },
    {
     "name": "model",
     "optional": true,
     "type": "string"
    },
    {
     "name": "acquiredOn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "AssetStatus"
    }
   ]
  },
  {
   "name": "QrLabel",
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
     "name": "assetId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "batchId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "code",
     "optional": false,
     "type": "string"
    },
    {
     "name": "printedTag",
     "optional": false,
     "type": "string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "LabelState"
    },
    {
     "name": "appliedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "appliedByMemberId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "stateReportedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "stateReportedByMemberId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "stateNote",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "LabelBatch",
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
     "name": "requestedByMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "assetIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "labelSizeMm",
     "optional": false,
     "type": "25 | 40 | 60"
    },
    {
     "name": "sheetLayout",
     "optional": false,
     "type": "'a4-65up' | 'a4-24up' | 'a4-1up'"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled'"
    },
    {
     "name": "progress",
     "optional": false,
     "type": "{ determinate: true; done: number; total: number }"
    },
    {
     "name": "sheetArtifactId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "appliedCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "CustodySignature",
   "fields": [
    {
     "name": "method",
     "optional": false,
     "type": "'typed-name' | 'drawn' | 'scan-ack' | 'staff-attest'"
    },
    {
     "name": "signerPersonId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "signerName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "drawnMarkRef",
     "optional": true,
     "type": "string"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    },
    {
     "name": "deviceNote",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "CustodyEvent",
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
     "name": "assetId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "CustodyEventKind"
    },
    {
     "name": "seq",
     "optional": false,
     "type": "number"
    },
    {
     "name": "actorMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "fromPersonId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "toPersonId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "locationId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "condition",
     "optional": true,
     "type": "ConditionGrade"
    },
    {
     "name": "dueOn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "Person",
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
     "name": "fullName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "fullNameSecondLocale",
     "optional": true,
     "type": "string"
    },
    {
     "name": "department",
     "optional": true,
     "type": "string"
    },
    {
     "name": "contactNote",
     "optional": true,
     "type": "string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'active' | 'inactive'"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "RetirementRecord",
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
     "name": "assetId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "method",
     "optional": false,
     "type": "RetirementMethod"
    },
    {
     "name": "disposalDate",
     "optional": false,
     "type": "string"
    },
    {
     "name": "counterparty",
     "optional": true,
     "type": "string"
    },
    {
     "name": "certificateRef",
     "optional": true,
     "type": "string"
    },
    {
     "name": "certificateUnreferenced",
     "optional": true,
     "type": "boolean"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "recordedByMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "idempotencyKey",
     "optional": false,
     "type": "string"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 registry first-run",
   "\"لا أصول بعد. ثلاث حركات تفتح السجلّ: فئة واحدة، وأصل واحد، ودفعة تسميات — أو افتح الأصل النموذجي وامسح ورقته أولاً.\"",
   "New asset / Open sample asset",
   "S1 filtered-empty",
   "\"No assets match these filters.\""
  ],
  "loading": [
   "S1 list skeleton",
   "skeleton rows ×8 + \"Loading your register…\" (SR)",
   "صفوف هيكلية ×8 + \"جارٍ تحميل سجلّك…\"",
   "Label batch job (determinate)",
   "\"Generating labels — 23 of 60.\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (label double-request)",
   "\"AST-0107 already carries a live label. Report it damaged or missing first — then request its replacement.\"",
   "\"يحمل AST-0107 تسميةً فعّالة. أبلغ عن تلفها أو فقدانها أولاً — ثم اطلب بديلها.\"",
   "\"That label is already applied — its batch checklist is up to date. Reprints go through the replacement path.\""
  ],
  "success": [
   "Asset registered",
   "\"AST-0313 registered — draft until its label goes on.\"",
   "\"سُجّل AST-0313 — مسودة حتى تلتصق تسميته.\"",
   "Label applied",
   "\"AST-0107's label is on — the register lists it active.\""
  ]
 },
 "briefLine": "The unique feature is the QR-label lifecycle with custody chain. The label lifecycle is modeled as first-class data: a label is requested (per asset or in batches), generated into a print-ready sheet, confirmed *applied* by scan, and retired with its asset — with damaged and missing states in between that trigger replacement rather than silent re-printing (a re-printed label without a recorded state change is exactly how registers start lying). The custody chain is the audit core: every hand-off is a signed event. Assignment, return, and person-to-person transfer each record who handed over, who took, where, when, the asset's condition, and a signature from the party accepting custody — typed name, drawn mark, or scan-acknowledged — because in Gulf office practice العهدة (custody responsibility) is only real when someone signs for it. The chain is append-only: mistakes are corrected with a correction event that references the erroneous entry, never by editing history; the audit trail is the product's integrity."
} as const;
export type Spec = typeof SPEC;
