// GENERATED from specs-source/marketplace-listing-sync/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "marketplace-listing-sync",
 "title": "Marketplace Listing Sync",
 "family": "commerce_integrations",
 "tier": 2,
 "flagship": false,
 "adapter": "MarketplaceListingAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Sarraf Violet",
  "pairing": "P04",
  "radius": "8px",
  "elevation": "flat-line",
  "icon": "outline-geometric",
  "motion": "crisp",
  "fonts": [
   "Cairo",
   "Sora"
  ],
  "primary": "#775EBA",
  "accent": "#523C87",
  "canvas": "#2C243A"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Channels home",
   "purpose": "channel cards (state: connected/manual, readiness counts per channel), first-run checklist (P22)",
   "shell": "",
   "data": "listChannels, getSession, getComplianceReport (per-channel counts)",
   "archetype": "list-console"
  },
  {
   "id": "S2",
   "name": "Channel setup & rule-pack editor",
   "purpose": "archetype pick at create; locale requirement; rule list with severity + params, editable numbers; connection state in capability language",
   "shell": "",
   "data": "listChannelTemplates, createChannel, getChannel, updateChannel, listCapabilities",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Catalog",
   "purpose": "master products list (SKU, paired-title excerpts, price, stock, listing coverage per product), filters + saved views (P08), import",
   "shell": "",
   "data": "listMasterProducts, importCatalog, createMasterProduct",
   "archetype": "review-queue"
  },
  {
   "id": "S4",
   "name": "Master product editor",
   "purpose": "paired bilingual columns (P23) for title/description/bullets/brand/attributes; images; price + stock level; version history",
   "shell": "",
   "data": "getMasterProduct, updateMasterProduct, bulkUpdateMasterFields (single-product context), listListings (coverage strip)",
   "archetype": "editor-studio"
  },
  {
   "id": "S5",
   "name": "Field map studio",
   "purpose": "the core surface: mapping table (master field + variant + transform → channel attribute), channel attribute catalog rail, suggestion panel (assist state)",
   "shell": "",
   "data": "getFieldMap, saveFieldMap, getChannel, suggestFieldMappings, resolveMappingSuggestion, listCapabilities",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Listings board",
   "purpose": "per-channel/all listings with state chips (draft/ready/ready-with-warnings/blocked/publishing/published/error/stale/paused), bulk select + publish/export actions (P07)",
   "shell": "",
   "data": "listListings, bulkCreateListings, publishListings, exportChannelFile, getUsage",
   "archetype": "board"
  },
  {
   "id": "S7",
   "name": "Listing detail",
   "purpose": "mapped preview (attribute values with transforms named, overrides flagged), focused checklist results, publish history with pins, master diff when stale",
   "shell": "Listing detail",
   "data": "getListing, updateListing, setListingPaused, deleteListing, runComplianceCheck (scoped)",
   "archetype": "wizard-flow"
  },
  {
   "id": "S8",
   "name": "Readiness console",
   "purpose": "findings across a channel (grouped by rule, then severity), bulk acknowledgment paths, per-rule drill-down",
   "shell": "",
   "data": "getComplianceReport, listComplianceFindings, resolveComplianceFinding, runComplianceCheck",
   "archetype": "list-console"
  },
  {
   "id": "S9",
   "name": "Publish & exports",
   "purpose": "batch composition, per-listing outcomes for running/finished jobs, artifacts with expiry",
   "shell": "",
   "data": "publishListings, exportChannelFile, getArtifact, listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S10",
   "name": "Jobs center",
   "purpose": "imports/checks/publishes/exports — filterable, cancel/retry, link-to-context (async-contract §7)",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S11",
   "name": "Settings",
   "purpose": "capability consent state (kind, not vendor — credential-contract §2), usage window, workspace defaults",
   "shell": "",
   "data": "listCapabilities, getUsage, getSession",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-4 — Publish and export (the handoff gate)",
   "steps": [
    "Salem selects the ready set on the listings board (P07 bulk select — action bar names the count and criteria). listListings",
    "Jobs console across publish/export/import/check: filterable, cancel/retry, link-to-context (async-contract §7). listJobs"
   ]
  }
 ],
 "components": [
  {
   "name": "MappingTable",
   "purpose": "the core surface: one row per mapped channel attribute — master field + locale variant + transform → channel attribute",
   "obligations": "P18 keyboard-first grid (↑/↓ traversal, Enter edits, Escape restores, Tab commits and advances — never a focus trap); required-flag column mirrors the channel attribute catalog; mapping collisions rejected at save with the collision named (VALIDATION, CP-2 edge); transform chips focusable with the computed preview rendered as text (07c rule 4 — never a tooltip promise); rows settle in place on select (crisp 120ms); a11y: row = attribute key (announced) + master field + variant + transform as text; role=\"grid\" semantics with row-count announced on region entry (P19)"
  },
  {
   "name": "AttributeCatalogRail",
   "purpose": "the channel's attribute list beside the mapping table: key, label, required flag, constraints (max lengths, counts)",
   "obligations": "Read-only reference surface on raised paper (05 one-step separation); required attributes unmapped render an outline-geometric alert mark + text (never color alone); keyboard-reachable from the mapping table via declared shortcut (⌥→ / ⌥←); the rail's width is reserved when collapsed so opening causes no reflow (10 CLS rule)"
  },
  {
   "name": "SuggestionPanel",
   "purpose": "the conditionally-AI surface: candidate master-field→attribute pairings with disclosed confidence + provenance label",
   "obligations": "Provenance label always visible (assist-unbound state shows the manual-editor-first copy — 11 A; assist-simulated/assist-bound carry the capability label in capability language, never vendor); confidence renders as tabular figures + a plum meter (text+bar, never bar-only); each suggestion's actions: Accept / Edit-then-accept / Reject — draft-by-default, nothing auto-applies (P15); accept inserts an ordinary mapping row the seller can still edit; quota exhaustion → RATE_LIMIT ladder copy with the manual editor re-offered inline (ai-native-patterns §5 — the editor is the rung-4 path and it is the FULL product, not a reduced one); a11y: suggestions are list rows in reading order; accept/reject announced politely"
  },
  {
   "name": "LocaleVariantTag",
   "purpose": "the pair-dimension mark on mapped rows and field headers: ar / en / both",
   "obligations": "Bilingual-en product: tags render in the workspace's active direction but always carry the locale's own script direction for the sample value inside them (content-direction contract, 05); plum ink 5.72:1 text-safe; never color-only (the tag is text — \"ar\", \"en\", \"both\"); mixed-script sample values bidi-isolated (rtl-rules §2)"
  },
  {
   "name": "ChecklistColumn",
   "purpose": "per-listing rule results inside the listing detail: one row per rule with measured/limit arithmetic",
   "obligations": "Each row: rule name + severity + measured value vs limit in Western tabular figures + state (pass / blocker / warning / acknowledged); blocker rows focusable with jump-to-source (master field or mapping row — the fix path); recompute dissolves a blocker row (140ms) with the live-region announcement; the column ends in the readiness verdict chip (blocked / ready / ready-with-warnings) — verdicts always icon+text+color"
  },
  {
   "name": "ReadinessVerdictChip",
   "purpose": "the derived state mark on listings board rows, channel cards, and publish summaries",
   "obligations": "State machine per 07a (draft/ready/ready-with-warnings/blocked/publishing/published/error/stale/paused); counts rendered beside the mark (\"3 blockers\", \"2 warnings acknowledged\"); the T2 signature moment \"The Checklist Closes\" renders HERE (05): last blocker resolves → blocker rows collapse staggered ≤60ms/5 rows into the green ready chip with the rule-pass count; reduced-motion: instant render + full-summary announcement"
  },
  {
   "name": "MappedPreview",
   "purpose": "the computed listing as the channel will receive it: attribute key → mapped value, transforms named, overrides flagged",
   "obligations": "Values render at their own locale direction per attribute (content-direction contract); per-channel overrides carry an explicit override mark (never masquerade as master data); transform provenance as text beside each transformed value (\"truncated at word boundary, 75\"); the preview is recomputed from declared state on every master/mapping edit (deterministic, 07c) — the UI never caches a preview across edits"
  },
  {
   "name": "RulePackEditor",
   "purpose": "the channel's compliance rules: kind, severity, params, version",
   "obligations": "Inline-editable numbers (P06 with blur validation — skill row 56); param sanity enforced (ceiling ≥1, image minimum ≥0 — VALIDATION); edits re-version the pack with the side-effect declared (\"affected findings recompute on next check — never silent\", CP-3.4); rule version pinned per finding (07a); severity changes blocker↔warning are owner decisions logged (P17); a11y: error summary focuses first bad field on save"
  },
  {
   "name": "FindingsBoard",
   "purpose": "the readiness console: findings grouped by rule, then severity, across a channel",
   "obligations": "Virtualized >200 rows (P19 — the 24-product × 3-channel seed plus rule fan-out is deliberately near the line; 5,000-SKU workspaces are the design constraint, 10); bulk paths per CP-3.5; filter chips with accessible predicate descriptions (P08); acknowledged findings render with their reason and actor (never anonymous); the four empties per P01 (11 A)"
  }
 ],
 "ops": [
  "getSession",
  "listCapabilities",
  "listChannelTemplates",
  "createChannel",
  "listChannels",
  "getChannel",
  "updateChannel",
  "importCatalog",
  "listMasterProducts",
  "getMasterProduct",
  "createMasterProduct",
  "updateMasterProduct",
  "bulkUpdateMasterFields",
  "getFieldMap",
  "saveFieldMap",
  "suggestFieldMappings",
  "resolveMappingSuggestion",
  "runComplianceCheck",
  "getComplianceReport",
  "listComplianceFindings",
  "resolveComplianceFinding",
  "createListing",
  "bulkCreateListings",
  "listListings",
  "getListing",
  "updateListing",
  "setListingPaused",
  "deleteListing",
  "publishListings",
  "exportChannelFile",
  "getArtifact",
  "listJobs",
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
   "name": "Channel",
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
     "type": "string"
    },
    {
     "name": "archetype",
     "optional": false,
     "type": "ChannelArchetype"
    },
    {
     "name": "localeRequirement",
     "optional": false,
     "type": "LocaleRequirement"
    },
    {
     "name": "attributeCatalog",
     "optional": false,
     "type": "ChannelAttribute[]"
    },
    {
     "name": "rulePack",
     "optional": false,
     "type": "RulePack"
    },
    {
     "name": "connectionState",
     "optional": false,
     "type": "'manual' | 'capability-bound'"
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
   "name": "ChannelAttribute",
   "fields": [
    {
     "name": "key",
     "optional": false,
     "type": "string"
    },
    {
     "name": "label",
     "optional": false,
     "type": "string"
    },
    {
     "name": "required",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'text' | 'long-text' | 'numeric' | 'image-list' | 'enum'"
    },
    {
     "name": "acceptsLocale",
     "optional": false,
     "type": "'none' | 'ar' | 'en' | 'both'"
    },
    {
     "name": "constraint",
     "optional": true,
     "type": "{"
    },
    {
     "name": "maxLength",
     "optional": true,
     "type": "number"
    },
    {
     "name": "minItems",
     "optional": true,
     "type": "number"
    }
   ]
  },
  {
   "name": "ComplianceRule",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "RuleKind"
    },
    {
     "name": "severity",
     "optional": false,
     "type": "RuleSeverity"
    },
    {
     "name": "params",
     "optional": false,
     "type": "{"
    },
    {
     "name": "max",
     "optional": true,
     "type": "number"
    },
    {
     "name": "min",
     "optional": true,
     "type": "number"
    },
    {
     "name": "chars",
     "optional": true,
     "type": "string[]"
    },
    {
     "name": "locale",
     "optional": true,
     "type": "Locale"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "RulePack",
   "fields": [
    {
     "name": "channelId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "rules",
     "optional": false,
     "type": "ComplianceRule[]"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "BilingualText",
   "fields": [
    {
     "name": "ar",
     "optional": true,
     "type": "string"
    },
    {
     "name": "en",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "MasterProduct",
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
     "name": "sku",
     "optional": false,
     "type": "string"
    },
    {
     "name": "title",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "description",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "bullets",
     "optional": false,
     "type": "BilingualText[]"
    },
    {
     "name": "brand",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "attributes",
     "optional": false,
     "type": "Record<string, BilingualText>"
    },
    {
     "name": "images",
     "optional": false,
     "type": "{ url: string; isMain: boolean }[]"
    },
    {
     "name": "price",
     "optional": false,
     "type": "number"
    },
    {
     "name": "stockLevel",
     "optional": false,
     "type": "number"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'active' | 'draft' | 'archived'"
    }
   ]
  },
  {
   "name": "MappingRow",
   "fields": [
    {
     "name": "channelAttributeKey",
     "optional": false,
     "type": "string"
    },
    {
     "name": "source",
     "optional": false,
     "type": "{"
    },
    {
     "name": "masterField",
     "optional": false,
     "type": "'title' | 'description' | 'bullets' | 'brand' | 'attributes' | 'images' | 'price' | 'stockLevel' | 'sku'"
    },
    {
     "name": "localeVariant",
     "optional": false,
     "type": "'ar' | 'en' | 'none'"
    },
    {
     "name": "attributeKey",
     "optional": true,
     "type": "string"
    },
    {
     "name": "bulletIndex",
     "optional": true,
     "type": "number"
    },
    {
     "name": "transform",
     "optional": false,
     "type": "TransformKind"
    },
    {
     "name": "transformParams",
     "optional": true,
     "type": "{ maxLength?: number; template?: string }"
    }
   ]
  },
  {
   "name": "FieldMap",
   "fields": [
    {
     "name": "channelId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "rows",
     "optional": false,
     "type": "MappingRow[]"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ListingOverride",
   "fields": [
    {
     "name": "channelAttributeKey",
     "optional": false,
     "type": "string"
    },
    {
     "name": "value",
     "optional": false,
     "type": "string"
    },
    {
     "name": "reason",
     "optional": true,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 channels first-run",
   "Create channel / Open sample channel",
   "S1 filtered-empty",
   "\"No channels match these filters.\"",
   "\"لا قنوات تطابق هذه المرشّحات.\""
  ],
  "loading": [
   "S1 channel cards skeleton",
   "skeleton cards ×4 + \"Loading your channels…\" (SR)",
   "بطاقات هيكلية + \"جارٍ تحميل قنواتك…\"",
   "S5 studio boot",
   "table + rail skeleton with reserved widths"
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (import bad block)",
   "\"Block 7 is malformed — its stock field is not a number. Blocks 1–6 imported; fix block 7 and import it alone.\"",
   "\"الكتلة 7 معطوبة — حقل مخزونها ليس رقماً. استُوردت الكتل 1–6؛ صحّح الكتلة 7 واستوردها وحدها.\"",
   "VALIDATION (mapping collision)"
  ],
  "success": [
   "Import done",
   "\"24 products in — 1 missing Arabic description kept and flagged, 3 SKUs updated by merge, 0 invalid blocks.\"",
   "\"دخل 24 منتجاً — وصف عربي ناقص واحد حُفظ ووُسم، و3 رموز SKU حُدّثت بالدمج، و0 كتل غير صالحة.\"",
   "Check done",
   "\"Check complete — 4 blockers on 4 listings, 1 warning, 21 resolved rows, 1 stale listing flagged.\""
  ]
 },
 "briefLine": "The product ends at the listing's readiness and its handoff. A ready listing publishes through an abstract channel capability when one is bound, or exports as a channel-ready file the seller uploads by hand — the manual path is primary and permanent (LOOP-5). The buyer's evidence that this is the right shape is the failure class the category itself documents: most listing rejections trace to missing required attributes, bad images, product-ID conflicts, or rule violations — data problems, not connection problems (research digest §B.3: sellenvo; salest.io paraphrase — \"most failed marketplace exports come down to missing data rather than a broken connection\"). Channel-agnostic feed-tool vendors already sell \"prebuilt feed maps with required fields, validations, and mapping guidance to reduce SKU rejections before feed submission\" (godatafeed) — for Latin-first catalogs. What no retrieved competitor carries is the bilingual pair as the catalog's spine: a mapping where the locale variant is a first-class dimension (this channel takes the Arabic title in one attribute and the English title in another; that channel takes Arabic only; this one truncates the English title at a different ceiling than the Arabic one), with per-marketplace checklists that treat bilingual parity as a rule, not an accident. MENA sellers get the advice \"use both English and Arabic keywords, adapt product descriptions to local preferences\" from every practitioner source (digest §B.4) — and a tool to enforce it per channel."
} as const;
export type Spec = typeof SPEC;
