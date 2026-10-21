// GENERATED from specs-source/legal-case-tracker/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "legal-case-tracker",
 "title": "Legal Case Tracker",
 "family": "specialized",
 "tier": 2,
 "flagship": false,
 "adapter": "LegalCaseTrackerAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Qada Indigo",
  "pairing": "P16",
  "radius": "8px",
  "elevation": "layered-depth",
  "icon": "line-1.5",
  "motion": "stately",
  "fonts": [
   "Scheherazade New",
   "Libre Caslon Text"
  ],
  "primary": "#2B4778",
  "accent": "#152C55",
  "canvas": "#1C222B"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Docket home",
   "purpose": "the morning surface: cross-matter hearing board (zone-sorted, overdue first, prep-deadline column) + matters triage (urgencyZone / hasOverdue filters, counts, next-hearing column) + first-run value checklist (P22) + sample matter offer",
   "shell": "",
   "data": "listHearingBoard, listMatters, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Matter chronicle",
   "purpose": "the matter's timeline bed: events in the recessed stratum, hearing cards with countdown rings, generated deadlines carrying rule names, parties rail, counts, gate summary chip, segment control (timeline/documents/closure)",
   "shell": "",
   "data": "getMatter, listTimelineEvents, updateTimelineEvent (reschedule entry), recordHearingOutcome (in-place recorder), completeDeadlineEvent",
   "archetype": "list-console"
  },
  {
   "id": "S3",
   "name": "Event detail",
   "purpose": "one event full-frame: outcome history + correction chain, reschedule history, generated-deadline lineage (rule + source trigger), linked documents, countdown",
   "shell": "",
   "data": "getTimelineEvent, getDocument (linked), createTimelineEvent (related-note entry)",
   "archetype": "calendar-grid"
  },
  {
   "id": "S4",
   "name": "Documents & custody register",
   "purpose": "the matter's documents: kind/original/version-count/chain-length/last-action columns, unreturned-only companion view, register-document entry",
   "shell": "",
   "data": "listDocuments, registerDocument",
   "archetype": "wizard-flow"
  },
  {
   "id": "S5",
   "name": "Document detail",
   "purpose": "versions lineage (sealed marks), the custody strip rendered on the timeline bed (umber), verify state, add-version/seal/check-out/in actions",
   "shell": "",
   "data": "getDocument, addDocumentVersion, sealDocumentVersion, addCustodyEntry, verifyChain",
   "archetype": "list-console"
  },
  {
   "id": "S6",
   "name": "Clients directory",
   "purpose": "clients list with matter counts, normalized bilingual search, client drawer with its matters",
   "shell": "",
   "data": "listClients, createClient, getClient, updateClient",
   "archetype": "list-console"
  },
  {
   "id": "S7",
   "name": "Deadline rules console",
   "purpose": "the engine's parameters: stock vs firm rules, trigger/offset/lead/scope columns, author/edit/delete with forward-only regeneration surfacing, deactivation alternative",
   "shell": "",
   "data": "listDeadlineRules, saveDeadlineRule, deleteDeadlineRule",
   "archetype": "list-console"
  },
  {
   "id": "S8",
   "name": "Closure & export",
   "purpose": "the gate (live blockers with jump links), the ClosureRecord + resolution ledger, export package composer (formats, quota, determinate progress), artifact list with expiry",
   "shell": "",
   "data": "getMatter (gate), closeMatter, getUsage, exportMatterPackage, getArtifact",
   "archetype": "editor-studio"
  },
  {
   "id": "S9",
   "name": "Jobs console",
   "purpose": "export jobs: state filters, link-to-context (matter), cancel/retry, per-format partial recovery — referenced by 07b/07c as the jobs surface",
   "shell": "",
   "data": "listJobs",
   "archetype": "wizard-flow"
  },
  {
   "id": "S10",
   "name": "Activity log",
   "purpose": "every consequential mutation: actor, action, target, detail, timestamp; filter by actor/action/matter; keyboard-navigable, exportable (a11y-baseline §7)",
   "shell": "",
   "data": "listActivity",
   "archetype": "board"
  },
  {
   "id": "S11",
   "name": "Settings",
   "purpose": "workspace policy defaults (weekend shift, original-tracking, stock-rules-on), locale/direction default, capability consent (kind-not-vendor), usage window",
   "shell": "",
   "data": "getSession, getUsage",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-3 — The document chain of custody: register → version → seal → check-out → present → check-in → verify (the paper trail)",
   "steps": [
    "*Trigger: an original arrives from the client (Faisal's register); or a new draft document enters the matter.",
    "The original leaves custody: checked-out with location (\"with counsel Layla\") and note — the borrow requires its ledger line (Faisal's J4). addCustodyEntry"
   ]
  }
 ],
 "components": [
  {
   "name": "CountdownRing",
   "purpose": "the hearing's circular countdown mark on cards, rows, and the matter header",
   "obligations": "Ring arc = zone contract (far green / near amber ring with amber-deep text / imminent red / today red / overdue red-deep — 05 §Color); day-count text always accompanies the ring (motion/shape never carries information alone — a11y-baseline §4); arc change animates 280ms with the text delta (stately); reduced-motion: instant arc + announcement (09); ring is an instrument, not a card — declared circular deviation from radius B (05); tabular-figure day-counts with fixed cell width fallback (05 typography)"
  },
  {
   "name": "EventCard",
   "purpose": "one timeline event as a card: kind glyph (calendar/clock/file/notes/custom), bilingual title, date (dual-calendar P24), state (upcoming/past/completed/outcome-due/rescheduled), zone ring for hearings",
   "obligations": "Outcome-due state renders the red-deep \"ماذا قرّرت المحكمة؟\" affordance (11) — a first-class state, not an error; rescheduled events show the reschedule glyph + history count; completed deadlines show check-circle + completing actor (named actors, copy-voice §1.3); excerpt text bidi-isolated at render (rtl-rules §2); press ≤80ms tactile confirm, border-step hover only (no scale on hover — 05 motion)"
  },
  {
   "name": "OutcomeRecorder",
   "purpose": "the CP-2.5 modal: outcome kind, bilingual summary (P23 column pair), optional next-hearing date (dual-calendar), correction mode",
   "obligations": "Submit button disabled during submit (double-submit guard — skill row 32); adjourned kind surfaces the next-hearing field with guidance (not a hard block — legal reality wins, 03 edge); standing-outcome CONFLICT renders the existing outcome beside the form (both visible, choose explicitly); correction mode names the outcome being corrected and previews the supersede chain; on success this component fires the Gavel Settles (05 T2 signature: ring drains 360ms, card settles 320ms, outcome chip ≤60ms stagger, next hearing rises; ≤3 moving elements; reduced-motion: instant + identical announcement); timestamps announced with the action (a11y-baseline §7)"
  },
  {
   "name": "RescheduleLedger",
   "purpose": "reschedule dialog + history strip: from→to dates, reason required",
   "obligations": "Reason field validates on submit-with-empty → assertive inline error linked to the field (skill rows 55/56); history renders append-only (each entry actor + timestamp, dual-calendar dates); regeneration preview before commit: \"3 future deadlines move with this date\" — names them, never silent (07c rule 3 forward-only); stale baseVersion → CONFLICT with both payloads side-by-side"
  },
  {
   "name": "ChainVerifyBadge",
   "purpose": "the verify affordance + result state",
   "obligations": "States: unverified (quiet) · intact (shield + verified count, polite announcement) · broken (alert + firstBrokenSeq, assertive announcement — an integrity failure is urgent); verify is re-runnable, lands in activity (P17); never auto-fires — verification is a human-initiated fact"
  },
  {
   "name": "GeneratedDeadlineLineage",
   "purpose": "the trace on generated deadline rows/cards: rule name badge + source-trigger link (the verdict that opened the window)",
   "obligations": "The badge is a plain link into the rule (or the deleted-rule tombstone — deleted rules keep their generated deadlines pinned, 07c); source trigger links to the anchor event; the lineage is the audit chain made visible (07a: ruleId + sourceTriggerEventId forever); clamp state (\"clamped to +1d by minLead\") renders as a labeled fact on the row — the clamp is disclosed, never silent"
  },
  {
   "name": "BilingualFieldPair",
   "purpose": "the ar/en field container used by every authoring surface (matter title, court, event title, party names, document title, outcome summary, client name, rule name)",
   "obligations": "Per-side direction rendering in field-level containers (05 direction model; P23 applied to fields); alignment link between sides; sync-state indicators (edited-since on one side); empty-either-side is a named VALIDATION at submit (bilingual by construction — 07a); Arabic input at Scheherazade ≥17px/1.8 line-height in detail surfaces (05 typography); mixed-script values bidi-isolated (rtl-rules §2); labels persist beside/above fields — the in-input hint text never serves as the label (a11y-baseline §5)"
  }
 ],
 "ops": [
  "getSession",
  "listMatters",
  "createMatter",
  "getMatter",
  "updateMatter",
  "closeMatter",
  "listClients",
  "createClient",
  "getClient",
  "updateClient",
  "listTimelineEvents",
  "createTimelineEvent",
  "getTimelineEvent",
  "updateTimelineEvent",
  "recordHearingOutcome",
  "completeDeadlineEvent",
  "listHearingBoard",
  "listDeadlineRules",
  "saveDeadlineRule",
  "deleteDeadlineRule",
  "registerDocument",
  "addDocumentVersion",
  "listDocuments",
  "getDocument",
  "addCustodyEntry",
  "sealDocumentVersion",
  "verifyChain",
  "listActivity",
  "exportMatterPackage",
  "getArtifact",
  "listJobs",
  "getUsage"
 ],
 "entities": [
  {
   "name": "BilingualText",
   "fields": [
    {
     "name": "ar",
     "optional": false,
     "type": "string"
    },
    {
     "name": "en",
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
     "name": "deadlinePolicyDefaults",
     "optional": false,
     "type": "{"
    },
    {
     "name": "defaultRulesOn",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "weekendShift",
     "optional": false,
     "type": "'none' | 'next-business-day'"
    },
    {
     "name": "custodyPolicyDefaults",
     "optional": false,
     "type": "{"
    },
    {
     "name": "requireOriginalTracking",
     "optional": false,
     "type": "boolean"
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
     "type": "BilingualText"
    },
    {
     "name": "contact",
     "optional": true,
     "type": "string"
    },
    {
     "name": "notes",
     "optional": true,
     "type": "string"
    },
    {
     "name": "matterCount",
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
   "name": "Matter",
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
     "name": "clientId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "title",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "caseNumber",
     "optional": false,
     "type": "string"
    },
    {
     "name": "court",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "practiceArea",
     "optional": false,
     "type": "PracticeArea"
    },
    {
     "name": "stage",
     "optional": false,
     "type": "MatterStage"
    },
    {
     "name": "parties",
     "optional": false,
     "type": "PartyRef[]"
    },
    {
     "name": "teamMemberIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "openedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "closedAt",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "TimelineEventBase",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "matterId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "TimelineKind"
    },
    {
     "name": "date",
     "optional": false,
     "type": "string"
    },
    {
     "name": "title",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "notes",
     "optional": true,
     "type": "string"
    },
    {
     "name": "actorMemberId",
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
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "HearingOutcome",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "hearingEventId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "HearingOutcomeKind"
    },
    {
     "name": "summary",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "scheduledNextHearing",
     "optional": true,
     "type": "{"
    },
    {
     "name": "date",
     "optional": false,
     "type": "string"
    },
    {
     "name": "location",
     "optional": true,
     "type": "string"
    },
    {
     "name": "correctionOf",
     "optional": true,
     "type": "string"
    },
    {
     "name": "supersededBy",
     "optional": true,
     "type": "string"
    },
    {
     "name": "actorMemberId",
     "optional": false,
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
   "name": "HearingCountdown",
   "fields": [
    {
     "name": "hearingEventId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "matterId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "daysUntil",
     "optional": false,
     "type": "number"
    },
    {
     "name": "zone",
     "optional": false,
     "type": "CountdownZone"
    },
    {
     "name": "hasOutcome",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "DeadlineRule",
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
     "type": "BilingualText"
    },
    {
     "name": "trigger",
     "optional": false,
     "type": "DeadlineTrigger"
    },
    {
     "name": "offsetDays",
     "optional": false,
     "type": "number"
    },
    {
     "name": "minLeadDays",
     "optional": false,
     "type": "number"
    },
    {
     "name": "appliesToPracticeAreas",
     "optional": true,
     "type": "PracticeArea[]"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "stock",
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
   "name": "DocumentVersion",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "documentId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "seq",
     "optional": false,
     "type": "number"
    },
    {
     "name": "label",
     "optional": true,
     "type": "BilingualText"
    },
    {
     "name": "contentFingerprint",
     "optional": false,
     "type": "string"
    },
    {
     "name": "sizeBytes",
     "optional": true,
     "type": "number"
    },
    {
     "name": "storageRef",
     "optional": false,
     "type": "string"
    },
    {
     "name": "sealed",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "CustodyEntry",
   "fields": [
    {
     "name": "seq",
     "optional": false,
     "type": "number"
    },
    {
     "name": "action",
     "optional": false,
     "type": "CustodyAction"
    },
    {
     "name": "actorMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    },
    {
     "name": "versionId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "linkedEventId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "location",
     "optional": true,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (no matters)",
   "\"لا قضايا بعد. أنشئ الأولى مع عميلها ومحكمتها — أو افتح العيّنة وشاهد المطرقة تقرّ على جلسة مؤجلة.\"",
   "Create matter / Open sample matter",
   "S1 filtered-empty",
   "\"No hearings or matters match these filters.\""
  ],
  "loading": [
   "S1 board skeleton",
   "zone-grouped skeleton rows (overdue group first) + \"Loading the hearing board…\" (SR)",
   "صفوف هيكلية مجموعّة بالمناطق (المتأخرة أولاً) + \"جارٍ تحميل لوحة الجلسات…\"",
   "S2 chronicle skeleton",
   "date-grouped card skeletons in the bed geometry + \"Loading the chronicle…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (bilingual field empty)",
   "\"The Arabic title is empty — this field is authored in both languages, never machine-filled. Write the Arabic side and save.\"",
   "\"العنوان العربي فارغ — هذا الحقل يُكتب باللغتين ولا يُملأ آلياً أبداً. اكتب الجهة العربية واحفظ.\"",
   "VALIDATION (reschedule without reason)"
  ],
  "success": [
   "Matter created",
   "\"Matter 2041/45 opened — Riyadh Commercial Court, commercial. 3 deadlines generated by the stock rules.\"",
   "\"فُتحت القضية 2041/45 — المحكمة التجارية بالرياض، تجارية. تولّدت 3 مواعيد من القواعد النمطية.\"",
   "Hearing rescheduled",
   "\"Hearing moved to 12 Nov 2026 — reason recorded. 3 future deadlines regenerated; completed ones stayed history.\""
  ]
 },
 "briefLine": "The unique feature is the bilingual matter timeline with hearing countdown and document chain, and it is one interlocking commitment, not three features. In Gulf litigation the same case is two scripts at once: the Arabic court name, judge name, and event title beside the Latin case number and transliterated party names — so every identity-bearing field is authored in both locales, rendered per-side direction, and searchable through Arabic-aware normalization (rtl-rules §4), with the workspace chrome defaulting RTL/Arabic and English a full citizen (05 direction model, LOOP-6 proposed). The countdown is the second axis: litigation teams live by the docket clock (02), so time is the product's semantic palette — green → amber → red as a hearing approaches, red-deep when a hearing passed without a recorded outcome (the data hole the product turns into a first-class state rather than a silent assumption). The custody chain is the third: originals — the power of attorney, the signed lease, the evidence file — physically move between client, firm, courtroom, and translation desk, and the chain of custody is the authentication convention courts already trust (research q7); here it is an append-only data structure with a verify operation, not a paper log book. The AI stance is declared non-AI (ai-native-patterns §1, 07a): countdown zones are date arithmetic, deadline generation is rule arithmetic over anchors, custody sequencing is seq = last + 1, closure is a pure function over live matter state. Same input, same output, every time — which is exactly what an audit-facing artifact requires. No AI capability is bound anywhere, no workflow degrades when AI is absent, and no sparkle glyph appears in any surface (05)."
} as const;
export type Spec = typeof SPEC;
