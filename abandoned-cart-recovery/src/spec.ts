// GENERATED from specs-source/abandoned-cart-recovery/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "abandoned-cart-recovery",
 "title": "Abandoned Cart Recovery",
 "family": "commerce_integrations",
 "tier": 2,
 "flagship": false,
 "adapter": "AbandonedCartAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Istijad Rosewood",
  "pairing": "P05",
  "radius": "8px",
  "elevation": "soft-lift",
  "icon": "duotone",
  "motion": "energetic",
  "fonts": [
   "Tajawal",
   "Hanken Grotesk"
  ],
  "primary": "#80529A",
  "accent": "#64337F",
  "canvas": "#2E1A39"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Recovery queue",
   "purpose": "carts list, priority/band/locale/state, filters + saved views (P08), onboarding checklist (P22)",
   "shell": "",
   "data": "listCarts, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Cart detail",
   "purpose": "items, shopper, consent basis, send timeline + events, sequence state, operator actions (override / cancel / event / suppress)",
   "shell": "",
   "data": "getCart, assignSequence, cancelCartRecovery, recordShopperEvent, addSuppression",
   "archetype": "list-console"
  },
  {
   "id": "S3",
   "name": "Sequence studio",
   "purpose": "sequence list + step editor (delay, channel kind, template binding, policy refs), versioning, activation gate, schedule preview",
   "shell": "Sequence studio",
   "data": "listSequences, getSequence, createSequence, updateSequence, setSequenceStatus, previewSchedule",
   "archetype": "calendar-grid"
  },
  {
   "id": "S4",
   "name": "Template library + generation dock",
   "purpose": "bilingual two-column authoring (P23), variable chips, length budgets, approve/retire lifecycle; dock: generated drafts with diff + promote gate",
   "shell": "",
   "data": "listTemplates, saveTemplate, approveTemplate, retireTemplate, generateMessageVariants, getDraftVariantSet, promoteDraftVariant, getUsage",
   "archetype": "settings-admin"
  },
  {
   "id": "S5",
   "name": "Routing & incentives",
   "purpose": "value-band thresholds, band → sequence mapping, per-band incentive policy, version diffs",
   "shell": "",
   "data": "getRoutingPolicy, updateRoutingPolicy",
   "archetype": "settings-admin"
  },
  {
   "id": "S6",
   "name": "Quiet-hours policy center",
   "purpose": "jurisdiction window rows with source labels, workspace default row, versioning, preview link",
   "shell": "Quiet-hours policy center",
   "data": "listQuietHourPolicies, saveQuietHourPolicy",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Send ledger",
   "purpose": "the outbox: every send with state incl. deferred (reason + rescheduled time + policy version), channel kind, filters",
   "shell": "",
   "data": "listSends",
   "archetype": "calendar-grid"
  },
  {
   "id": "S8",
   "name": "Suppression ledger",
   "purpose": "opt-out and manual entries, restore with reason",
   "shell": "",
   "data": "listSuppressions, removeSuppression",
   "archetype": "review-queue"
  },
  {
   "id": "S9",
   "name": "Recovery report",
   "purpose": "recovered revenue, per-step funnel, deferral statistics, per-sequence comparison, export launch",
   "shell": "",
   "data": "getRecoveryReport, exportRecoveryPackage, getArtifact",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S10",
   "name": "Jobs center",
   "purpose": "imports/generations/exports, cancel/retry, link-to-context (async-contract §7)",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S11",
   "name": "Settings",
   "purpose": "workspace locale + currency set, capability consent state (kind-not-vendor), usage window, defaults (abandonment threshold)",
   "shell": "",
   "data": "getSession, getUsage",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-2 — Standing up a bilingual recovery sequence (the authoring loop)",
   "steps": [
    "He opens the sequence studio; the step rail starts empty with the stock template library one panel away. listSequences · getSequence",
    "Template approval (the library's own gate): an approved template is the only kind a sequence step can bind; approval records actor + timestamp. approveTemplate",
    "He retires a superseded template so no future step can bind it (retiring never touches bound steps — they keep their pinned template version). retireTemplate"
   ]
  },
  {
   "title": "CP-5 — Recovery report, export, and the manual send path (evidence out)",
   "steps": [
    "Jobs console across the product: imports, generations, exports — filterable, cancel/retry, link-to-context (async-contract §7). listJobs",
    "Artifact retrieval before the 7-day expiry window; expired artifacts regenerate deterministically from state. getArtifact"
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "Offline: reads work; event entries and overrides queue with per-item state (P20) and reconcile to the authoritative ledger on reconnect.",
    "Viewer seat (Nayla's board read-only view): everything readable, nothing mutable — PERMISSION names the seat's capability in capability language."
   ]
  }
 ],
 "components": [
  {
   "name": "RecoveryQueueTable",
   "purpose": "the home surface: virtualized cart rows ranked by priority",
   "obligations": "Rows: priority rank (Western numerals, physical order stable both directions), cart total + currency, band chip, shopper locale glyph (ar/en), state chip, next-send time with deferral mark; >200 rows virtualize (P19) — focus never moves on scroll; row-count context announced on region entry (\"14 carts — 8 in recovery, 3 recovered, 2 expired, 1 suppressed\"); ⌘↓/⌘↑ jump to next needs-decision row (failure/override-candidate); selection via Space → ActionBar scopes every action to \"N selected\" (P07); filters render as removable chips with accessible predicate descriptions (P08); batch cancel requires the P04 level-2 confirm naming the count and remaining steps"
  },
  {
   "name": "CartTimeline",
   "purpose": "the cart-detail send/event trail",
   "obligations": "Vertical timeline (mirrors in RTL per rtl-rules §2): one node per SendRecord and ShopperEvent, newest on top; each send node renders state chip + due/rescheduled times + channel kind + policy-row version that governed a deferral; each event node renders kind + provenance (manual or channel) + timestamp; nodes are keyboard-traversable in listed order with return-trip from the queue; the recovered node renders the seal (05 signature — motion only at the moment of arrival, never on re-render)"
  },
  {
   "name": "SequenceStepEditor",
   "purpose": "authoring one step of a sequence",
   "obligations": "Fields: delay (minutes from anchor — the contested-doctrine field renders its seeded default with the honest note \"defaults are editable policy — vendors disagree\", 12 Q-9), channel kind (email / rich-message / plain-text — capability language), template binding (approved templates only; binding a draft → VALIDATION at save listing the draft by name), quiet-hours policy row ref, incentive ref (optional); blur validation per field + error summary on save; step rows drag-reorder WITH keyboard equivalent (2.5.7 — move up/down menu items); saving an active sequence forks a draft — the fork banner states \"active version 4 keeps serving; you are editing draft version 5\""
  },
  {
   "name": "BilingualTemplateEditor",
   "purpose": "two-column bilingual message authoring (P23)",
   "obligations": "EN column LTR, AR column RTL — each at its own script direction, side by side with alignment links between corresponding blocks (subject↔subject, body↔body); per-locale length budgets render live (subject ≤ 60, body ≤ 900 chars — arithmetic meters, text+bar never bar-only); variable chips validated against the known set (unknown → inline VALIDATION naming the variable and column); AR column: line-height ≥1.6, tracking 0, no italic token exists anywhere; mixed-script previews bidi-isolated (rtl-rules §2); sync-state indicators: in-sync / edited-since / length-far-apart (AR ~125% of EN budget flagged, not blocked — copy-voice §5); autosave indicator (P10) with conflict → both versions side by side"
  },
  {
   "name": "QuietClockTimeline",
   "purpose": "the schedule-preview instrument (the product's signature object)",
   "obligations": "For a sequence × sample cart × timezone: a horizontal 24h band per step — sendable window rendered as rosewood-wash band, quiet span as paper, the due-time marker and (when deferring) an arrow from the due time to the window's next opening with the deferral reason as text beside it; timezone named in every row (America/New_York); reflow below 768px stacks bands vertically; the clock is never color-only: window/quiet spans carry pattern differentiation + text labels (\"send window 08:00–21:00 · quiet 21:00–08:00\"); preview is read-only (pure function — 07c rule 9)"
  },
  {
   "name": "SendStateChip",
   "purpose": "the send-ledger and timeline state mark",
   "obligations": "States: scheduled (slate clock glyph) · deferred (amber moon glyph + amber-deep text \"deferred to 08:00\") · dispatched (slate send glyph) · delivered (teal check) · clicked (rosewood cursor glyph) · recovered (green seal) · failed (critical alert glyph + retry action inline) · cancelled (muted) · skipped-suppressed (critical-deep ban glyph); every chip is icon + text + color (never color alone — 05 contracts); chips are focusable with their full reason text as the accessible description"
  },
  {
   "name": "ValueBandMapper",
   "purpose": "routing & incentives policy surface",
   "obligations": "Band rows (low/mid/high) with threshold inputs (sanity: strictly ordered — inversion → VALIDATION naming both numbers), band → sequence mapping (select), per-band incentive policy (none / free-shipping / percent / fixed + code string field — with the honest caption \"codes are issued by your own systems; this product generates and verifies none\", LOOP-10); edits version the policy with a diff view (P16, direction-aware); in-flight carts keep pinned versions — the surface states which pins exist"
  },
  {
   "name": "PolicyRowEditor",
   "purpose": "quiet-hours jurisdiction window rows",
   "obligations": "Fields: jurisdiction key, window start/end (HH:MM, 24h), source label (statutory anchor / workspace policy — the honesty field), version; midnight-crossing windows render a circle diagram + the exact rule text (\"sendable iff t ≥ 21:00 or t < 03:00\"); deleting a row referenced by any step → VALIDATION naming the sequences; baseVersion → CONFLICT both kept"
  },
  {
   "name": "GenerationDock",
   "purpose": "the conditionally-AI surface, contained",
   "obligations": "Reserved region beside the template editor (P13: stream into reserved space, CLS ≤0.02); request form states locale pair + tone + count with metered-cost estimate BEFORE running (P14); drafts arrive with provenance badge generated (never ambiguous with library templates); stop/regenerate available from first token; promote action opens the DiffView (both locales) with the explicit review-confirm — confirmReviewed is structural (07b); quota exhausted → rung-3 fallback renders the template library with the label \"non-generative — your library\" (ai-native-patterns §5); the dock never writes into a sequence, ever (two-gate posture, 00)"
  },
  {
   "name": "RecoveryScoreboard",
   "purpose": "the report surface (S9)",
   "obligations": "Recovered revenue headline (green ink, tabular figures, counts up ONLY at the live recovery moment — static on read), carts-by-state definition table, per-step funnel as definition rows (scheduled → dispatched → delivered → clicked → recovered with counts), deferral statistics (count + top jurisdictions + top defer reasons), per-sequence comparison table; every value present as text (plots optional supplements with stats tables — skill chart rule); recovery-rate row states its denominator (\"3 of 14 carts that entered recovery — definitions vary across the industry; ours is stated\"); export launch buttons for the three formats"
  }
 ],
 "ops": [
  "getSession",
  "importCarts",
  "listCarts",
  "getCart",
  "createSequence",
  "listSequences",
  "getSequence",
  "updateSequence",
  "setSequenceStatus",
  "listTemplates",
  "saveTemplate",
  "approveTemplate",
  "retireTemplate",
  "generateMessageVariants",
  "getDraftVariantSet",
  "promoteDraftVariant",
  "getRoutingPolicy",
  "updateRoutingPolicy",
  "listQuietHourPolicies",
  "saveQuietHourPolicy",
  "previewSchedule",
  "listSends",
  "assignSequence",
  "cancelCartRecovery",
  "recordShopperEvent",
  "addSuppression",
  "listSuppressions",
  "removeSuppression",
  "getRecoveryReport",
  "exportRecoveryPackage",
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
     "name": "currencies",
     "optional": false,
     "type": "CurrencyCode[]"
    },
    {
     "name": "abandonmentThresholdMinutes",
     "optional": false,
     "type": "number"
    },
    {
     "name": "valueNormalizer",
     "optional": false,
     "type": "number"
    },
    {
     "name": "defaultQuietHourRowId",
     "optional": false,
     "type": "string"
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
   "name": "Shopper",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "displayName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "jurisdiction",
     "optional": false,
     "type": "string"
    },
    {
     "name": "timezone",
     "optional": false,
     "type": "string"
    },
    {
     "name": "consentBasis",
     "optional": false,
     "type": "ConsentBasis"
    },
    {
     "name": "contact",
     "optional": false,
     "type": "{ channelKind: ChannelKind; handle: string }[]"
    },
    {
     "name": "firstSeenAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "CartLineItem",
   "fields": [
    {
     "name": "productId",
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
     "optional": false,
     "type": "string"
    },
    {
     "name": "quantity",
     "optional": false,
     "type": "number"
    },
    {
     "name": "unitPrice",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "PriorityComponents",
   "fields": [
    {
     "name": "value",
     "optional": false,
     "type": "number"
    },
    {
     "name": "recency",
     "optional": false,
     "type": "number"
    },
    {
     "name": "engagement",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "AbandonedCart",
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
     "name": "shopperId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "items",
     "optional": false,
     "type": "CartLineItem[]"
    },
    {
     "name": "total",
     "optional": false,
     "type": "number"
    },
    {
     "name": "currency",
     "optional": false,
     "type": "CurrencyCode"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "provenance",
     "optional": false,
     "type": "CartProvenance"
    },
    {
     "name": "sourceRef",
     "optional": true,
     "type": "string"
    },
    {
     "name": "lastActivityAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "abandonedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "CartState"
    }
   ]
  },
  {
   "name": "SequenceStep",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "order",
     "optional": false,
     "type": "number"
    },
    {
     "name": "delayMinutes",
     "optional": false,
     "type": "number"
    },
    {
     "name": "channelKind",
     "optional": false,
     "type": "ChannelKind"
    },
    {
     "name": "templateId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "templateVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "incentiveRef",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "RecoverySequence",
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
     "name": "status",
     "optional": false,
     "type": "SequenceStatus"
    },
    {
     "name": "consentBasis",
     "optional": false,
     "type": "'any' | 'consent-only'"
    },
    {
     "name": "expiryHours",
     "optional": false,
     "type": "number"
    },
    {
     "name": "steps",
     "optional": false,
     "type": "SequenceStep[]"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "activatedAt",
     "optional": true,
     "type": "string"
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
   "name": "SequenceAssignment",
   "fields": [
    {
     "name": "sequenceId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "sequenceVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "assignedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "assignedBy",
     "optional": false,
     "type": "'routing' | 'operator-override'"
    },
    {
     "name": "overrideReason",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "TemplateLocaleContent",
   "fields": [
    {
     "name": "subject",
     "optional": false,
     "type": "string"
    },
    {
     "name": "body",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "MessageTemplate",
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
     "name": "status",
     "optional": false,
     "type": "TemplateStatus"
    },
    {
     "name": "content",
     "optional": false,
     "type": "{ en: TemplateLocaleContent; ar: TemplateLocaleContent }"
    },
    {
     "name": "channelKind",
     "optional": false,
     "type": "ChannelKind"
    },
    {
     "name": "origin",
     "optional": false,
     "type": "'stock' | 'authored' | 'generated-promoted'"
    },
    {
     "name": "variables",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "approvedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "approvedByMemberId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (no carts yet)",
   "\"لا سلال لاستردادها بعد. الصق أول استيراد، أو افتح مساحة العيّنة وشاهد رسالةً تؤجّل نفسها وسلةً تعود.\"",
   "Paste carts / Open sample workspace",
   "S1 filtered-empty",
   "\"No carts match these filters. Every cart stays in the queue — clear the filters to see them.\""
  ],
  "loading": [
   "S1 queue skeleton",
   "skeleton rows ×10 mirroring row geometry (direction-aware) + \"Loading the recovery queue…\"",
   "صفوف هيكلية + \"جارٍ تحميل طابور الاسترداد…\"",
   "S2 cart detail",
   "header + items + timeline skeletons, reserved widths"
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (import, empty total)",
   "\"Row 3 was refused — its cart total is empty. Rows 1–2 landed; fix row 3 and import it alone.\"",
   "\"رُفض السطر 3 — إجمالي سلة السطر فارغ. هبط السطران 1–2؛ صحّح السطر 3 واستورده وحده.\"",
   "VALIDATION (import, total mismatch)"
  ],
  "success": [
   "Import done",
   "\"14 carts in — 1 parked under threshold, 1 held at intake (suppressed shopper), 0 bad rows.\"",
   "\"دخلت 14 سلة — 1 منتظرة تحت الحد، و1 محجوزة عند الاستيعاب (متسوّق مُخضَد)، و0 صفوف معطوبة.\"",
   "Import partial",
   "\"2 carts landed; row 3 was named and refused. Import row 3 alone when it's fixed.\""
  ]
 },
 "briefLine": "The signature mechanism is quiet-hours-aware scheduling. Every sequence step carries a delay from its anchor event, and the scheduler computes each send's due time in the *shopper's* timezone against a per-jurisdiction send-window policy — window rows the merchant configures from retrieved statutory anchors (US federal 8am–9pm and its stricter state variants are the only hour-level rules our research retrieved; GCC windows ship as honest workspace policy, labeled as such, because no retrieved source publishes GCC messaging hours). A send whose due time falls outside the window is deferred to the window's next opening — visibly: the send ledger shows the state deferred, the local time that triggered it, the policy row that governed it, and the exact rescheduled time. Nothing silent ever ships. Opt-outs are the harder stop: an opt-out event cancels every scheduled and deferred send for that shopper mid-flight, writes a suppression-ledger entry, and holds future carts out of recovery at intake. Around the sequences sit value-band routing (cart total → band → sequence variant → incentive policy, so a 40-riyal cart never gets the 15% code built for a 1,500-riyal one — the flat-discount pain practitioners report in the wild) and a deterministic recovery report that reconciles carts, sends, deferrals, and recovered revenue from recorded events, never from vendor promises."
} as const;
export type Spec = typeof SPEC;
