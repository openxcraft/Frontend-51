// GENERATED from specs-source/halal-certification-tracker/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "halal-certification-tracker",
 "title": "Halal Certification Tracker",
 "family": "specialized",
 "tier": 3,
 "flagship": false,
 "adapter": "HalalCertificationAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Itqan Forest",
  "pairing": "P03",
  "radius": "8px",
  "elevation": "layered-depth",
  "icon": "line-1.5",
  "motion": "stately",
  "fonts": [
   "Noto Naskh Arabic",
   "Newsreader"
  ],
  "primary": "#244624",
  "accent": "#143015",
  "canvas": "#1D241D"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Register home",
   "purpose": "certificate grid with urgency zones, Monday renewal digest, onboarding checklist (P22)",
   "shell": "",
   "data": "listCertificates, getSession, getRenewalLadder (zone legend)",
   "archetype": "editor-studio"
  },
  {
   "id": "S2",
   "name": "Applicants directory",
   "purpose": "applicant list (bilingual names, certificate counts), applicant detail (facilities, products, certificates, open cases)",
   "shell": "Applicants directory",
   "data": "listApplicants, createApplicant, getApplicant, updateApplicant",
   "archetype": "list-console"
  },
  {
   "id": "S3",
   "name": "Application workspace",
   "purpose": "the case: stage ladder, formulation tab, evidence tab, audit records, decision dossier",
   "shell": "",
   "data": "createApplication, getApplication, advanceApplication, setFormulation, getFormulation, recordAuditOutcome, issueCertificate, listSupplierCertificates, createSupplierCertificate",
   "archetype": "wizard-flow"
  },
  {
   "id": "S4",
   "name": "Ingredient directory",
   "purpose": "master ingredient list with statuses, E-numbers, bilingual search; classification edits; impact drill",
   "shell": "",
   "data": "listIngredients, createIngredient, updateIngredient, getIngredientImpact, importIngredients",
   "archetype": "list-console"
  },
  {
   "id": "S5",
   "name": "Supplier-certificate vault",
   "purpose": "evidence records with derived states (valid / expiring-soon / expired), expiry-sorted, line back-links",
   "shell": "",
   "data": "listSupplierCertificates, createSupplierCertificate, updateSupplierCertificate",
   "archetype": "list-console"
  },
  {
   "id": "S6",
   "name": "Certificate detail",
   "purpose": "ladder timeline (rung states), traceability summary (scope products → ingredients), status actions, successor chain",
   "shell": "",
   "data": "getCertificate, getRenewalLadder, setCertificateStatus, openRenewalCase, getIngredientImpact (drill)",
   "archetype": "list-console"
  },
  {
   "id": "S7",
   "name": "Renewal console",
   "purpose": "cross-certificate rung digest grouped by urgency zone; due-this-month; missed rungs first",
   "shell": "",
   "data": "listCertificates (zone filters), openRenewalCase, getCertificate",
   "archetype": "list-console"
  },
  {
   "id": "S8",
   "name": "Ladder policy editor (in Settings)",
   "purpose": "scheme ladders: rung offsets, kinds, validity; versioned edits (owner role)",
   "shell": "",
   "data": "getRenewalLadder, updateRenewalLadder",
   "archetype": "editor-studio"
  },
  {
   "id": "S9",
   "name": "Activity log",
   "purpose": "append-only accountability surface, filterable, exportable via register export",
   "shell": "",
   "data": "listActivity",
   "archetype": "review-queue"
  },
  {
   "id": "S10",
   "name": "Jobs console",
   "purpose": "import/export jobs with state, cancel/retry, link-to-context (async-contract §7, T3-consolidated)",
   "shell": "",
   "data": "listJobs, getArtifact",
   "archetype": "jobs-centre"
  },
  {
   "id": "S11",
   "name": "Settings",
   "purpose": "workspace locale/direction, scheme defaults, storage-mode state, session role display",
   "shell": "",
   "data": "getSession",
   "archetype": "settings-admin"
  },
  {
   "id": "S12",
   "name": "Command palette (overlay)",
   "purpose": "bilingual normalized search across five entity lists",
   "shell": "",
   "data": "client-side over S1–S5/S7/S9 data (P05)",
   "archetype": "list-console"
  }
 ],
 "flows": [
  {
   "title": "CP-5 — Register, surveillance, accountability, exports (the daily surface)",
   "steps": [
    "Register home: the certificate grid with urgency zones, status filters, scheme filter, saved views (P08); virtualized beyond 200 rows (P19). listCertificates",
    "Applicant directory management and the applications board with stage filters. listApplicants · listApplications · getApplicant",
    "Ladder policy console + settings: scheme ladders editable (owner role), workspace defaults, direction. getRenewalLadder · updateRenewalLadder",
    "Ingredient directory maintenance: search with Arabic normalization, status edits. listIngredients · updateIngredient"
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "Delivery channel unbound: certificate documents download as artifacts; the staff send them (08 N3).",
    "Offline (P20): reads work; writes queue with per-item state; jobs reconcile to authoritative state on reconnect (async-contract §5)."
   ]
  }
 ],
 "components": [
  {
   "name": "RegisterGrid",
   "purpose": "the certificate register: rows with certificate number, applicant (bilingual, per-side direction), scheme, scope count, expiry, days-to-expiry, urgency-zone chip, status",
   "obligations": "P18 grid (arrow navigation, range selection); virtualized >200 rows (P19) with focus preservation and row-count context on region entry; zone chips are icon+text+color (never color alone — 05 contracts); Western numerals, tabular figures; applicant names bidi-isolated (dir=\"auto\" inputs; isolate marks on interpolation); 360px collapse to cards; suspended rows show reason on hover AND focus (keyboard parity)"
  },
  {
   "name": "LadderTimeline",
   "purpose": "a certificate's computed renewal ladder: rungs at proportional positions, each with kind label, date (dual-script per locale policy), state (upcoming/reached/cleared/missed)",
   "obligations": "Timeline order mirrors in RTL (rtl-rules §2); rung states are text+glyph+color; the rung settle signature micro-interaction (05) has a reduced-motion collapse to state chip + polite announcement; timeline is a semantic list, arrow-navigable; missed rungs assertively announced on entry to detail; dates Western numerals"
  },
  {
   "name": "RenewalDigest",
   "purpose": "cross-certificate rung digest grouped by urgency zone (steady/due-soon/overdue/lapsed), \"due this month\" first",
   "obligations": "Region landmark with live count in text; each row links to its certificate (link-to-context); zone groups announce counts on collapse/expand; empty zone renders its own honest line (not hidden — \"no certificates due this month\" is information)"
  },
  {
   "name": "FormulationEditor",
   "purpose": "versioned formulation lines: ingredient (bilingual), function, supplier, supplier-certificate chip with derived state, per-line resolution state, resolution drawer",
   "obligations": "Inline edit with escape hatch (P06 — Esc restores, Tab commits+advances, focus returns to trigger); per-line resolution state announced politely on change; haram lines render a blocking chip that names the ingredient (never just red); version history via DiffView (P16 — block-level, RTL-aware); autosave persistent (P10) with conflict surfacing both versions; drag-reorder has ⌘↑/⌘↓ equivalent (2.5.7)"
  },
  {
   "name": "IngredientDirectory",
   "purpose": "master ingredient list: bilingual names, E-number, source category, status chip, usage count, normalization-aware search",
   "obligations": "Search normalizes alef/taa-marbuta/yaa variants with the rule disclosed at point-of-use (ai-native-patterns §7.4 discipline applied to a non-AI normalization — disclosure still owed); >200 rows virtualize (P19); status edits are versioned + logged; each row exposes impact drill (visible button, not just a colored dot)"
  },
  {
   "name": "ImpactResult",
   "purpose": "the traceability graph answer: affected products, certificates (ranked by days-to-expiry), applicants; severity per line state",
   "obligations": "Synchronous compute with reserved geometry (no CLS on arrival); results are a semantic list with counts in text first (\"3 certificates affected\"); every row links to its entity; severity is glyph+text; the result is stateless and re-runnable — copy includes that fact honestly"
  },
  {
   "name": "SupplierCertVault",
   "purpose": "evidence records sorted by derived state: number, issuer, scope, dates, state chip (valid/expiring-soon/expired), line back-links",
   "obligations": "Derived states computed at read (07a); expiring-soon and expired are text+glyph+color; detail drawer keyboard-reachable; replacement (renewal) adds a record — the expired one stays in history with its own visibility filter"
  },
  {
   "name": "StageLadder",
   "purpose": "the application case's typed stage track: intake → documents → formulation → audit → decision → issued, with returned-flag",
   "obligations": "Step indicators mirror in RTL; current stage announced on region entry; backward transitions carry a reason affordance (typed text, logged); stage completion is text+state, never motion-only"
  },
  {
   "name": "DecisionDossier",
   "purpose": "the committee's read-and-record surface: formulation with resolutions, evidence states, audit outcome, decision form (grant/reject + justification)",
   "obligations": "Read-only dossier with persistent labels (a11y-baseline §5); the decision form has autocomplete tokens off (no personal-data echo); justification is required on reject (VALIDATION); recording announces actor+action+timestamp (a11y-baseline §7 legal/audit obligation); focus order walks the dossier THEN the form — the committee reads before ruling"
  },
  {
   "name": "AuditRecordCard",
   "purpose": "audit-outcome record: date, site, auditor, findings summary, non-conformity count + closure state, document reference",
   "obligations": "Closure state is a controlled vocabulary (open/closed/waived-with-reason); open non-conformities render as blocking text on the issuance gate surface (the gate quotes the count); document reference renders metadata-mode when storage is unbound, with the manual path stated in-place (LOOP-5)"
  }
 ],
 "ops": [
  "getSession",
  "listApplicants",
  "createApplicant",
  "getApplicant",
  "updateApplicant",
  "listApplications",
  "createApplication",
  "getApplication",
  "advanceApplication",
  "recordAuditOutcome",
  "listIngredients",
  "createIngredient",
  "updateIngredient",
  "getIngredientImpact",
  "importIngredients",
  "getFormulation",
  "setFormulation",
  "listSupplierCertificates",
  "createSupplierCertificate",
  "updateSupplierCertificate",
  "issueCertificate",
  "listCertificates",
  "getCertificate",
  "setCertificateStatus",
  "openRenewalCase",
  "getRenewalLadder",
  "updateRenewalLadder",
  "exportRegister",
  "exportCertificate",
  "getArtifact",
  "listJobs",
  "listActivity"
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
     "type": "BilingualString"
    },
    {
     "name": "defaultLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "schemeIds",
     "optional": false,
     "type": "string[]"
    }
   ]
  },
  {
   "name": "Member",
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
     "name": "displayName",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "role",
     "optional": false,
     "type": "WorkspaceRole"
    }
   ]
  },
  {
   "name": "Applicant",
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
     "name": "legalName",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "tradeName",
     "optional": true,
     "type": "BilingualString"
    },
    {
     "name": "jurisdiction",
     "optional": false,
     "type": "string"
    },
    {
     "name": "contact",
     "optional": false,
     "type": "{ name: BilingualString; email?: string; phone?: string }"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Facility",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "applicantId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "name",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "address",
     "optional": false,
     "type": "string"
    },
    {
     "name": "activityScope",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Product",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "applicantId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "name",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "formulationId",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "Application",
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
     "name": "applicantId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "ApplicationKind"
    },
    {
     "name": "schemeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "productIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "stage",
     "optional": false,
     "type": "ApplicationStage"
    },
    {
     "name": "returnedToApplicant",
     "optional": true,
     "type": "{ reason: string; by: string; at: string }"
    },
    {
     "name": "linkedCertificateId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "auditRecordIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "decision",
     "optional": true,
     "type": "CommitteeDecision"
    },
    {
     "name": "issuedCertificateId",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "Ingredient",
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
     "name": "name",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "eNumber",
     "optional": true,
     "type": "string"
    },
    {
     "name": "sourceCategory",
     "optional": false,
     "type": "SourceCategory"
    },
    {
     "name": "status",
     "optional": false,
     "type": "HalalStatus"
    },
    {
     "name": "statusChangedBy",
     "optional": true,
     "type": "string"
    },
    {
     "name": "statusChangedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "evidenceRequired",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "SupplierCertificate",
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
     "name": "supplierName",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "certificateNumber",
     "optional": false,
     "type": "string"
    },
    {
     "name": "issuer",
     "optional": false,
     "type": "string"
    },
    {
     "name": "scope",
     "optional": false,
     "type": "string"
    },
    {
     "name": "issuedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "expiresAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "documentRef",
     "optional": true,
     "type": "DocumentRef"
    }
   ]
  },
  {
   "name": "ResolutionRecord",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "formulationLineId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "basis",
     "optional": false,
     "type": "'committee-decision' | 'supplier-evidence' | 'classification'"
    },
    {
     "name": "justification",
     "optional": false,
     "type": "string"
    },
    {
     "name": "decidedBy",
     "optional": false,
     "type": "string"
    },
    {
     "name": "committeeRef",
     "optional": true,
     "type": "string"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "FormulationLine",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "ingredientId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "functionNote",
     "optional": true,
     "type": "string"
    },
    {
     "name": "supplierCertificateId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "resolutionId",
     "optional": true,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 register first-run",
   "\"لا شهادات في السجل بعد. افتح بيانات العيّنة — ثلاث شهادات عبر ثلاثة أنظمة — واقرأ سلّم تجديد وتحليل أثر واحداً قبل أي استيراد.\"",
   "Open sample / New applicant",
   "S1 filtered-empty",
   "\"No certificates match these filters.\""
  ],
  "loading": [
   "S1 register skeleton",
   "skeleton rows ×8 + \"Loading the register…\" (SR)",
   "صفوف هيكلية + \"جارٍ تحميل السجل…\"",
   "S3 formulation loading",
   "\"Loading the formulation — 5 lines with their resolutions.\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (one-script legal name)",
   "\"The applicant's legal name needs both languages — the register is bilingual by construction. Add the missing side and save.\"",
   "\"الاسم القانوني لمقدّم الطلب يحتاج اللغتين — السجل ثنائي اللغة بالبنية. أضف الجهة الناقصة واحفظ.\"",
   "VALIDATION (malformed import row)"
  ],
  "success": [
   "Import done",
   "\"14 rows in, 2 spelling variants merged, 0 invalid — every row accounted for.\"",
   "\"دخل 14 سطراً، ودُمجت صيغتا كتابة، و0 غير صالحة — كل سطر محسوب.\"",
   "Formulation saved",
   "\"Formulation v3 saved — 5 lines, 4 resolved, 1 needs attention.\""
  ]
 },
 "briefLine": "Family: specialized · Tier: 3 · Seed: none supplied."
} as const;
export type Spec = typeof SPEC;
