// GENERATED from specs-source/invoice-generator-desk/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "invoice-generator-desk",
 "title": "Invoice Generator Desk",
 "family": "commerce_integrations",
 "tier": 3,
 "flagship": false,
 "adapter": "InvoiceGeneratorAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Hisab Slate-Blue",
  "pairing": "P06",
  "radius": "8px",
  "elevation": "flat-line",
  "icon": "line-2",
  "motion": "minimal",
  "fonts": [
   "Almarai",
   "Inter"
  ],
  "primary": "#2D628D",
  "accent": "#00406E",
  "canvas": "#1A232B"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Invoices home",
   "purpose": "list with status/payment-state/overdue chips, filters + saved views (P08), first-run value checklist + sample draft (P22)",
   "shell": "",
   "data": "listInvoices, getSession, createInvoice (new draft)",
   "archetype": "list-console"
  },
  {
   "id": "S2",
   "name": "Invoice composer (draft)",
   "purpose": "the workbench: client picker, scheme card, dates, line-item grid, totals rail + numeral toggle, live preview",
   "shell": "Invoice composer (draft)",
   "data": "getInvoice, updateInvoice, addLineItem, updateLineItem, removeLineItem, listClients, createClient, listJurisdictions, listNumberSeries, updateDocumentRender",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Issued invoice view",
   "purpose": "read-only document, render controls (numerals, layout), delivery panel, payment marks, export, void",
   "shell": "",
   "data": "getInvoice, updateDocumentRender, sendInvoice, recordPayment, deletePaymentMark, exportInvoice, voidInvoice",
   "archetype": "jobs-centre"
  },
  {
   "id": "S4",
   "name": "Clients",
   "purpose": "bilingual client cards, tax numbers, currency; create/edit",
   "shell": "",
   "data": "listClients, createClient, updateClient",
   "archetype": "list-console"
  },
  {
   "id": "S5",
   "name": "Setup — seller profile",
   "purpose": "issuer identity per scheme: bilingual legal name, addresses, registration numbers, payment-instruction text",
   "shell": "",
   "data": "getSellerProfile, updateSellerProfile",
   "archetype": "wizard-flow"
  },
  {
   "id": "S6",
   "name": "Setup — tax schemes & series",
   "purpose": "seeded GCC scheme table (editable, versioned, source-noted) + number series list/creation",
   "shell": "",
   "data": "listJurisdictions, updateJurisdiction, listNumberSeries, createNumberSeries",
   "archetype": "wizard-flow"
  },
  {
   "id": "S7",
   "name": "Jobs console",
   "purpose": "export and delivery jobs: state, cancel/retry, link-to-context, artifact expiry",
   "shell": "",
   "data": "listJobs, getArtifact",
   "archetype": "jobs-centre"
  },
  {
   "id": "S8",
   "name": "Activity log",
   "purpose": "filterable actor-action-target-timestamp audit surface (P17)",
   "shell": "",
   "data": "listActivity",
   "archetype": "review-queue"
  },
  {
   "id": "S9",
   "name": "Command palette (overlay)",
   "purpose": "bilingual normalized search across invoices/clients/jobs",
   "shell": "",
   "data": "client-side over S1/S4/S7 data",
   "archetype": "jobs-centre"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — First invoice in the first session (value proof)",
   "steps": [
    "She adds her first client with a bilingual name and address and the client's tax-registration number. listClients · createClient",
    "She exports the PDF (manual path — zero credentials, the LOOP-5 primary from first run) and downloads it. exportInvoice · getArtifact · listJobs"
   ]
  },
  {
   "title": "CP-2 — The monthly rhythm: duplicate → edit → issue → deliver (the daily loop)",
   "steps": [
    "Omar opens invoices home and finds last month's retainer invoice. listInvoices",
    "He issues. The next sequential number from the series is assigned atomically. issueInvoice",
    "*Recovery: a failed send never re-issues or re-numbers anything; retry sends with a fresh idempotency key replay window (07b rule 7)."
   ]
  },
  {
   "title": "CP-3 — Payment marks, partial payments, and the overdue chase",
   "steps": [
    "Layla filters invoices home to overdue (derived: due date passed and payment state not settled — never stored as a fact, always recomputed). listInvoices",
    "She opens the issued invoice: read-only document, payment-mark panel, delivery history, render controls. getInvoice",
    "She immediately corrects a typo in the mark (wrong reference) — delete with a 7-second undo window (P03) rather than a confirm dialog. deletePaymentMark",
    "She flips the document's numerals to Western for the finance team's follow-up and re-sends through the channel. updateDocumentRender · sendInvoice",
    "The full audit of who did what sits in the activity log (P17). listActivity",
    "*Failures: concurrent mark recording → CONFLICT with both marks kept; NOT_FOUND on a stale invoice link (deleted draft in another tab).",
    "*Recovery: marks are append-only with delete-undo; the payment state is always recomputed from marks, so history cannot drift (07a)."
   ]
  },
  {
   "title": "CP-4 — Jurisdiction and numbering configuration (the setup flow)",
   "steps": [
    "He creates a second number series for the European clients (\"EUR-2026-\") alongside the default. createNumberSeries · listNumberSeries",
    "He adds the seller tax-registration numbers per scheme — the required-field gate reads these at issue time. updateSellerProfile"
   ]
  },
  {
   "title": "CP-5 — Library, exports, jobs, and workspace management (the daily surface)",
   "steps": [
    "Invoices home: filter chips + saved views (P08) by status, scheme, client, payment state, overdue; virtualized beyond 200 rows (P19). listInvoices",
    "She exports a month's invoices as separate PDF artifacts (batch of jobs, each with expiry + renewal). exportInvoice · listJobs",
    "Usage surface: exports and channel sends this window against the soft quota (P14 — calm meter, warning at 80%). getUsage",
    "Activity log: filterable actor-action-target-timestamp surface, exportable (P17). listActivity",
    "Session/roles: owner and editor compose and issue; viewer reads and exports only. getSession",
    "*Failures: NETWORK mid-list → banner + retry (P20); usage read failure → \"last known\" posture.",
    "*Recovery: all lists cursor-paginated and re-fetchable; locale flip re-renders without data loss."
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "Viewer role: composer actions hidden, not disabled-with-mystery; read/export paths fully functional.",
    "Offline (P20): issued-invoice reads and draft editing queue writes with per-item state; jobs reconcile to authoritative state on reconnect."
   ]
  }
 ],
 "components": [
  {
   "name": "LineItemGrid",
   "purpose": "the composer's core grid: bilingual description cells (two stacked direction-isolated fields per row), quantity, unit price, per-line discount %, live line total",
   "obligations": "P18 grid semantics — ↑/↓ rows, ←/→ columns, physical mapping stable both directions (rtl-rules §4); Enter activates inline edit (P06 — Esc restores, Tab commits+advances); figures render Inter 500 tnum Western (system chrome); description fields are dir=\"auto\" bidi-isolated (rtl-rules §2); zero-quantity validation inline on the row; row menu has visible button equivalents; >60 rows virtualize with focus preservation (P19 — invoices rarely exceed; threshold declared anyway)"
  },
  {
   "name": "TotalsRail",
   "purpose": "the money summary: subtotal, discount total, tax line (scheme label bilingual + rate), grand total, residual-after-marks on issued view; amount-in-words block beneath",
   "obligations": "Every figure's computation breakdown reachable on focus/hover (rate, taxable base, rounding rule, currency minor digits) and keyboard-reachable + SR-readable; tax label renders both languages per scheme (missing side renders nothing, never auto-translates); grand total is primary-deep at document scale; amount-in-words block collapsible with disclosure state announced"
  },
  {
   "name": "NumeralSystemToggle",
   "purpose": "the segmented control switching document render between Western digits and Arabic-Indic digits",
   "obligations": "Radio-group semantics with visible labels (\"Western 0-9\" / \"العربية الهندية ٠-٩\" — glyph specimens are the labels); the change is render-only: a persistent microcopy line states \"stored values unchanged\" (05 numeral contract); triggers the ≤120ms document crossfade (the signature); polite announcement on change; never appears on system-chrome money columns (chrome is Western by ledger)"
  },
  {
   "name": "DocumentPreview",
   "purpose": "the live bilingual paper: seller/client blocks per direction, line-item table, totals block, notes, footer instructions; warm paper surface",
   "obligations": "Preview pane sits inline-end in LTR chrome / inline-start in RTL chrome (mirrored, 04); Arabic blocks flow RTL with bidi isolation on embedded Latin tokens (currency codes, series numbers); labels render both languages per scheme config with per-block direction; the preview reserves its geometry so render changes never shift layout (CLS budget, 10); preview is the print-fidelity surface — what renders here is what the PDF carries (same render config object, 07a)"
  },
  {
   "name": "JurisdictionCard",
   "purpose": "tax-scheme picker/editor: bilingual tax label fields, default rate, required-field flags, currency + minor digits, source note",
   "obligations": "Rate input accepts basis-point precision with % display; required-field toggles are plain-language (\"seller tax number must appear on the document\"); scheme edits expose version history (P16 diff at field level); source note renders as persistent secondary text (\"captured from public rate tables — verify against current rules\"); deleting a referenced scheme is disabled with the reference count named"
  },
  {
   "name": "SeriesBadge",
   "purpose": "number-series state: prefix, next-value preview on drafts, issued count, integrity state",
   "obligations": "Preview text states the reservation rule plainly (\"assigned at issue — drafts carry no number\"); the seal mark on issued documents renders the number in the document's numeral system; counter is read-only (append-only integrity, 07b rule 2); clashing-prefix creation blocked with VALIDATION surfaced here"
  },
  {
   "name": "PaymentMarksPanel",
   "purpose": "evidence list on issued invoices: date, amount, method label, reference, recorder; record form; residual computation",
   "obligations": "Table semantics with row headers announced; marks are append-only with delete-undo (P03 7s window); payment state chip (unmarked/partial/settled) is icon+text+color; overpayment state is plain text + flag, never auto-logic; marks never render as document content (evidence is workspace-side; the export artifact includes them only when the render option is on)"
  },
  {
   "name": "DeliveryPanel",
   "purpose": "delivery records: abstract-channel sends (queued → delivered / failed) and manual downloads; channel consent state",
   "obligations": "Channel named in capability language only (credential-contract §2 kind-not-vendor); consent surface links inline where the channel is used, never only in settings; failed sends carry retry scoped to the delivery; manual download path is always visible as the co-equal alternative (LOOP-5 posture); no read receipts anywhere (00 exclusion)"
  },
  {
   "name": "ClientPickerCard",
   "purpose": "bilingual client selection/creation in the composer: name (both scripts), tax number, currency, address preview",
   "obligations": "Inline create-from-picker (P09 — never a dead end); bilingual fields dir=\"auto\" isolated; missing tax number renders a scheme-gate hint (issue gate preview, not a typing-time block); selected card is focus-visible with announced selection text"
  },
  {
   "name": "DueStateChip",
   "purpose": "invoice status/money states: draft, issued, voided + unmarked/partial/settled/overdue (derived)",
   "obligations": "Icon+text+color always (05 contracts); overdue is derived at read (due date vs fixed clock/current date) and recomputed on region focus — never stored as a fact; voided renders strikethrough+icon+label; chips announce politely on state change with the amount context (\"partially settled — 2,500.00 of 12,000.00 SAR remaining\")"
  }
 ],
 "ops": [
  "getSession",
  "getSellerProfile",
  "updateSellerProfile",
  "listClients",
  "createClient",
  "updateClient",
  "listJurisdictions",
  "updateJurisdiction",
  "listNumberSeries",
  "createNumberSeries",
  "createInvoice",
  "getInvoice",
  "listInvoices",
  "updateInvoice",
  "addLineItem",
  "updateLineItem",
  "removeLineItem",
  "issueInvoice",
  "voidInvoice",
  "duplicateInvoice",
  "updateDocumentRender",
  "recordPayment",
  "deletePaymentMark",
  "sendInvoice",
  "exportInvoice",
  "getArtifact",
  "listJobs",
  "getUsage",
  "listActivity"
 ],
 "entities": [
  {
   "name": "BilingualString",
   "fields": [
    {
     "name": "en",
     "optional": true,
     "type": "string"
    },
    {
     "name": "ar",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "CurrencyInfo",
   "fields": [
    {
     "name": "code",
     "optional": false,
     "type": "string"
    },
    {
     "name": "minorDigits",
     "optional": false,
     "type": "2 | 3"
    }
   ]
  },
  {
   "name": "Money",
   "fields": [
    {
     "name": "amountMinor",
     "optional": false,
     "type": "number"
    },
    {
     "name": "currency",
     "optional": false,
     "type": "string"
    }
   ]
  },
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
     "name": "defaultNumeralSystem",
     "optional": false,
     "type": "NumeralSystem"
    },
    {
     "name": "defaultDueDays",
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
   "name": "SellerProfile",
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
     "name": "address",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "contactEmail",
     "optional": false,
     "type": "string"
    },
    {
     "name": "contactPhone",
     "optional": true,
     "type": "string"
    },
    {
     "name": "paymentInstructions",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "taxRegistrations",
     "optional": false,
     "type": "{ schemeId: string; registrationNumber: string }[]"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Client",
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
     "name": "address",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "email",
     "optional": true,
     "type": "string"
    },
    {
     "name": "taxRegistrationNumber",
     "optional": true,
     "type": "string"
    },
    {
     "name": "defaultCurrency",
     "optional": true,
     "type": "string"
    },
    {
     "name": "notes",
     "optional": true,
     "type": "BilingualString"
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
   "name": "JurisdictionProfile",
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
     "name": "code",
     "optional": false,
     "type": "'SA' | 'AE' | 'BH' | 'OM' | 'QA' | 'KW' | 'CUSTOM'"
    },
    {
     "name": "label",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "taxLabel",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "defaultRateBps",
     "optional": false,
     "type": "number"
    },
    {
     "name": "requiresSellerTaxNumber",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "requiresClientTaxNumber",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "currency",
     "optional": false,
     "type": "CurrencyInfo"
    },
    {
     "name": "sourceNote",
     "optional": false,
     "type": "string"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "SchemeSnapshot",
   "fields": [
    {
     "name": "schemeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "code",
     "optional": false,
     "type": "JurisdictionProfile['code']"
    },
    {
     "name": "taxLabel",
     "optional": false,
     "type": "BilingualString"
    },
    {
     "name": "rateBps",
     "optional": false,
     "type": "number"
    },
    {
     "name": "currency",
     "optional": false,
     "type": "CurrencyInfo"
    }
   ]
  },
  {
   "name": "NumberSeries",
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
     "name": "prefix",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nextValue",
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
   "name": "DocumentRender",
   "fields": [
    {
     "name": "numeralSystem",
     "optional": false,
     "type": "NumeralSystem"
    },
    {
     "name": "layout",
     "optional": false,
     "type": "'side-by-side-bilingual' | 'stacked-bilingual'"
    },
    {
     "name": "showAmountInWords",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "showHijriDate",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "includePaymentHistoryInExport",
     "optional": false,
     "type": "boolean"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run",
   "\"No invoices yet. Open the sample to see the bilingual paper and the numeral toggle — or start your first invoice.\"",
   "\"لا فواتير بعد. افتح العيّنة لترى المستند الثنائي اللغة ومبدّل الأرقام — أو ابدأ فاتورتك الأولى.\"",
   "Open sample / New invoice",
   "S1 filtered-empty"
  ],
  "loading": [
   "S1 list skeleton",
   "skeleton rows ×8 + \"Loading your invoices…\" (SR)",
   "صفوف هيكلية + \"جارٍ تحميل فواتيرك…\"",
   "Composer boot",
   "two-pane skeleton (editor + paper)"
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (issue gate — client tax number)",
   "\"The Saudi Arabia scheme requires the client's tax number on the document. Add it to شركة الفنار التجارية, then issue.\"",
   "\"يشترط نطاق السعودية رقم التسجيل الضريبي للعميل على المستند. أضِفه إلى شركة الفنار التجارية ثم أصدر.\"",
   "VALIDATION (issue gate — seller)"
  ],
  "success": [
   "Invoice issued",
   "\"Issued INV-2026-0007 — 18,227.50 SAR total. The content is frozen; the render stays yours.\"",
   "\"أُصدرت INV-2026-0007 — بإجمالي 18,227.50 ريالاً. المحتوى مجمَّد؛ والعرض يبقى لك.\"",
   "Void completed",
   "\"Voided INV-2026-0002 — the number stays consumed, the sequence has no gaps. Reason logged.\""
  ]
 },
 "briefLine": "The arithmetic is the product's spine and it is declared non-AI (ai-native-patterns §1): line totals are quantity × unit price minus line discount, tax is the scheme's rate applied to the after-discount subtotal, and every amount rounds half-up at the invoice currency's minor digits — the three-decimal currencies of the Gulf (Bahraini dinar, Kuwaiti dinar, Omani rial) round at three places, the two-decimal currencies at two. Every computed figure carries its breakdown on hover and in the export: the rate, the taxable base, the rounding rule. The same discipline governs the document's accountability furniture: invoice numbers come from a number series that assigns strictly sequential values at issue — numbers are consumed, never reused, never gapped (the sequential-numbering requirement of VAT regimes generally, per the research digest; missing or duplicate numbers are a named compliance defect in the UAE source) — and an issued invoice's content is frozen; corrections happen through void-with-reason (the number stays consumed) or a successor document, never through silent edits. The document also renders the amount in words in both languages — a deterministic number-to-words conversion (with the Arabic dual/plural group tables the language actually requires) — because formal Arabic money documents carry it, cheques demand it, and no mainstream invoicing tool generates it bilingually."
} as const;
export type Spec = typeof SPEC;
