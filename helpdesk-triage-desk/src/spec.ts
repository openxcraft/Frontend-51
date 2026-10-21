// GENERATED from specs-source/helpdesk-triage-desk/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "helpdesk-triage-desk",
 "title": "Helpdesk Triage Desk",
 "family": "business_ops",
 "tier": 2,
 "flagship": false,
 "adapter": "HelpdeskTriageAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Nazim Cobalt",
  "pairing": "P02",
  "radius": "8px",
  "elevation": "flat-line",
  "icon": "line-2",
  "motion": "crisp",
  "fonts": [
   "Noto Kufi Arabic",
   "Space Grotesk"
  ],
  "primary": "#003859",
  "accent": "#248FCC",
  "canvas": "#00375B"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Triage home",
   "purpose": "intake pulse (new/unclustered/at-risk/breached), onboarding checklist (P22)",
   "shell": "",
   "data": "getSession, listTickets (count queries)",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Triage queue",
   "purpose": "the virtualized new/routed queue — filter chips + saved views (P08), per-row language chip, severity badge, SLA state",
   "shell": "",
   "data": "listTickets, getTicket",
   "archetype": "review-queue"
  },
  {
   "id": "S3",
   "name": "Ticket detail",
   "purpose": "body at own direction, language declaration + override, severity panel with named signals, cluster membership, routing controls, notes, activity",
   "shell": "",
   "data": "getTicket, updateTicket, assignToCluster, routeTicket, mergeTickets, setTicketDisposition, logTicketResponse, escalateTicket, addTicketNote",
   "archetype": "list-console"
  },
  {
   "id": "S4",
   "name": "Cluster board",
   "purpose": "intent clusters: bilingual labels, ticket counts, language mix, provenance (rules/assist), drill-in",
   "shell": "",
   "data": "listClusters, getCluster",
   "archetype": "board"
  },
  {
   "id": "S5",
   "name": "Cluster editor",
   "purpose": "bilingual label authoring, signature-term editor, member list with matched terms, the confirm gate (P15)",
   "shell": "",
   "data": "saveCluster, confirmCluster, assignToCluster",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Routing rules console",
   "purpose": "versioned rule list, condition/queue editing, active/inactive, evaluation traces",
   "shell": "",
   "data": "listRoutingRules, saveRoutingRule, listQueues",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Severity & SLA policy studio",
   "purpose": "matrix editor, SLA targets, version history, re-assessment launch",
   "shell": "",
   "data": "saveSeverityPolicy, runSeverityReassessment, listJobs",
   "archetype": "editor-studio"
  },
  {
   "id": "S8",
   "name": "SLA monitor",
   "purpose": "per-severity tiers, at-risk/breached/met, breach ledger with timelines",
   "shell": "",
   "data": "getSlaOverview, listTickets",
   "archetype": "review-queue"
  },
  {
   "id": "S9",
   "name": "Queues & members",
   "purpose": "queue list (bilingual names, owners, capabilities, hours), member directory",
   "shell": "",
   "data": "listQueues, saveQueue, listMembers",
   "archetype": "review-queue"
  },
  {
   "id": "S10",
   "name": "Jobs center & exports",
   "purpose": "clustering/re-assessment/export jobs, artifacts",
   "shell": "",
   "data": "listJobs, exportTriageLog, getArtifact, getUsage",
   "archetype": "jobs-centre"
  },
  {
   "id": "S11",
   "name": "Settings",
   "purpose": "locale defaults, channel bindings (credential surface), capability consent, usage window",
   "shell": "",
   "data": "listChannelBindings, createChannelBinding, verifyChannelBinding, revokeChannelBinding, getSession, getUsage",
   "archetype": "settings-admin"
  }
 ],
 "flows": [],
 "components": [
  {
   "name": "TicketRow",
   "purpose": "one ticket in the triage queue: ticket number, severity badge, language chip, cluster chip, SLA state, requester, subject excerpt",
   "obligations": "Virtualized above 200 rows (P19); focus never moves on scroll; row-count context announced on region entry; severity = glyph + tier word + weight (never color alone — 05 palette contracts); language chip carries script + detected-method (\"auto\"/\"manual\") as text; mixed-script subjects bidi-isolated (rtl-rules §2); truncation breaks at word boundaries (rtl-rules §4); selection checkbox + Space key (P07); at-risk/breach state carries the countdown in tabular figures as text; ⌘↓/⌘↑ jump next P1-or-at-risk"
  },
  {
   "name": "SeverityBadge",
   "purpose": "the P1–P4 mark with its assessment provenance",
   "obligations": "Tier word (\"P1 — Critical\") always present as text; on open: the named signals list (\"impact: key account; urgency: outage term 'توقف' present; matrix v4\") + override history if any; P1 uses the critical ink, P2 the at-risk pair (amber glyph + advisory-deep text), P3/P4 structural inks — severity is a labeled scale, not a rainbow (05)"
  },
  {
   "name": "LanguageChip",
   "purpose": "detected language declaration + override affordance",
   "obligations": "Renders \"AR\"/\"EN\"/\"MIXED\" + the detection method; the override menu records actor and freezes detection (07a); mixed renders with an isolation note; never relies on a flag glyph (flags are not languages)"
  },
  {
   "name": "ClusterCard",
   "purpose": "one intent cluster on the board: bilingual labels, ticket count, language mix, provenance",
   "obligations": "Labels render labelEn/labelAr at their own directions in bidi-isolated lines; provenance chip is text (\"rules\" / \"proposed — 11 tickets\") in violet ink for proposals vs cobalt-confirmed for confirmed (P15 color grammar, 05); count + language mix as tabular figures; proposed cards carry the confirm action as their primary control; archived renders inert with history link"
  },
  {
   "name": "SignatureTermEditor",
   "purpose": "the bilingual keyword list that drives rule-match assignment",
   "obligations": "Two-column term list (ar"
  },
  {
   "name": "AssessmentPanel",
   "purpose": "the severity panel in ticket detail: signals, matrix version, override",
   "obligations": "Signals listed as definition rows (signal class → matched evidence with the matched term quoted); override control requires a reason (07b rule 8); override history chain visible; assessment pins its policy version (audit honesty)"
  },
  {
   "name": "RoutingTrace",
   "purpose": "the why-did-it-go-there surface: rule name, conditions, suppressed matches, decision actor/time",
   "obligations": "Renders the full condition list of the matched rule and, for manual routes, the reason; suppressed rule matches named (deterministic order rule, 07c); every row lands in the activity log (P17); this component is the anti-opacity grammar (01 q10) made a UI object"
  },
  {
   "name": "SlaMonitorBar",
   "purpose": "per-severity tier strip on the SLA monitor: at-risk, breached, met counts + oldest-first hot list",
   "obligations": "Derived read recomputed ≤120ms (10); at-risk threshold declared in-product (\"≥70% of target elapsed — policy-configurable\"); counts as tabular figures in a definition table for screen readers (never a heatmap); breach rows link to the full timeline (intake → detection → assessment → route → response)"
  },
  {
   "name": "ConfirmGateBar",
   "purpose": "the cluster-proposal confirmation surface (P15)",
   "obligations": "Names what becomes authoritative (label EN + AR, ticket count, assignment flip count); confirm is a single explicit action with the announcement; \"confirm\" is the only path from proposed → confirmed (07b rule 3); reduced-motion renders the state change instantly with the announcement carrying the summary"
  }
 ],
 "ops": [
  "getSession",
  "createTicket",
  "listTickets",
  "getTicket",
  "updateTicket",
  "listChannelBindings",
  "createChannelBinding",
  "verifyChannelBinding",
  "revokeChannelBinding",
  "runClustering",
  "listClusters",
  "getCluster",
  "saveCluster",
  "confirmCluster",
  "assignToCluster",
  "saveSeverityPolicy",
  "runSeverityReassessment",
  "listQueues",
  "saveQueue",
  "listRoutingRules",
  "saveRoutingRule",
  "routeTicket",
  "bulkRouteTickets",
  "getSlaOverview",
  "escalateTicket",
  "logTicketResponse",
  "setTicketDisposition",
  "mergeTickets",
  "addTicketNote",
  "listMembers",
  "listJobs",
  "getUsage",
  "exportTriageLog",
  "getArtifact"
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
     "name": "clockConvention",
     "optional": false,
     "type": "'response-from-intake' | 'response-from-route'"
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
     "name": "nameEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "nameAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "role",
     "optional": false,
     "type": "MemberRole"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "ChannelBinding",
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
     "name": "kind",
     "optional": false,
     "type": "ChannelKind"
    },
    {
     "name": "displayName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "health",
     "optional": false,
     "type": "'unverified' | 'active' | 'failed' | 'revoked'"
    },
    {
     "name": "verifiedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "lastFailure",
     "optional": true,
     "type": "{ at: string; code: string; correlationId: string }"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "LanguageAssessment",
   "fields": [
    {
     "name": "detected",
     "optional": false,
     "type": "TicketLanguage"
    },
    {
     "name": "method",
     "optional": false,
     "type": "'script-ratio'"
    },
    {
     "name": "override",
     "optional": true,
     "type": "{"
    },
    {
     "name": "value",
     "optional": false,
     "type": "TicketLanguage"
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
   "name": "Ticket",
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
     "name": "number",
     "optional": false,
     "type": "string"
    },
    {
     "name": "subject",
     "optional": false,
     "type": "string"
    },
    {
     "name": "body",
     "optional": false,
     "type": "string"
    },
    {
     "name": "requester",
     "optional": false,
     "type": "Requester"
    },
    {
     "name": "channel",
     "optional": false,
     "type": "{ kind: ChannelKind; bindingId?: string } | { kind: 'manual' }"
    },
    {
     "name": "channelMessageId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "language",
     "optional": false,
     "type": "LanguageAssessment"
    },
    {
     "name": "severity",
     "optional": false,
     "type": "SeverityAssessment"
    },
    {
     "name": "receivedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "TicketState"
    }
   ]
  },
  {
   "name": "SeveritySignal",
   "fields": [
    {
     "name": "signalClass",
     "optional": false,
     "type": "SignalClass"
    },
    {
     "name": "evidence",
     "optional": false,
     "type": "string"
    },
    {
     "name": "matched",
     "optional": true,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "SeverityAssessment",
   "fields": [
    {
     "name": "severity",
     "optional": false,
     "type": "SeverityTier"
    },
    {
     "name": "signals",
     "optional": false,
     "type": "SeveritySignal[]"
    },
    {
     "name": "policyVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    },
    {
     "name": "overrides",
     "optional": false,
     "type": "{"
    },
    {
     "name": "severity",
     "optional": false,
     "type": "SeverityTier"
    },
    {
     "name": "reason",
     "optional": false,
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
   "name": "IntentCluster",
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
     "name": "labelEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "labelAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "signatureTerms",
     "optional": false,
     "type": "{ ar: string[]; en: string[] }"
    },
    {
     "name": "matchThreshold",
     "optional": false,
     "type": "number"
    },
    {
     "name": "status",
     "optional": false,
     "type": "ClusterStatus"
    },
    {
     "name": "provenance",
     "optional": false,
     "type": "'rules' | 'assist'"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "sample",
     "optional": false,
     "type": "boolean"
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
   "name": "ClusterAssignment",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "ticketId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "clusterId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "clusterVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "method",
     "optional": false,
     "type": "AssignmentMethod"
    },
    {
     "name": "matchedTerms",
     "optional": true,
     "type": "string[]"
    },
    {
     "name": "confidence",
     "optional": true,
     "type": "number"
    },
    {
     "name": "actorMemberId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    },
    {
     "name": "retractedAt",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "Queue",
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
     "optional": false,
     "type": "string"
    },
    {
     "name": "ownerMemberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "capabilities",
     "optional": false,
     "type": "QueueCapability[]"
    },
    {
     "name": "businessHours",
     "optional": true,
     "type": "{ start: string; end: string; days: number[] }"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (no tickets)",
   "\"لا شيء للتفرّغ بعد. الصق دفعةً — أو افتح الموجة النموذجية وشاهد تذاكر عربية وإنجليزية عن عطلٍ واحد تهبط في عنقودٍ واحد.\"",
   "Paste tickets / Open sample batch",
   "S1/S2 filtered-empty",
   "\"No tickets match these filters. Everything stays in the queue — clear the filters to see it.\""
  ],
  "loading": [
   "S2 queue skeleton",
   "skeleton rows ×10 + \"Loading the queue…\" (SR)",
   "صفوف هيكلية ×10 + \"جارٍ تحميل الطابور…\"",
   "Ticket detail boot",
   "reading-surface skeleton with reserved assessment panel"
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (empty subject)",
   "\"A ticket needs a subject — the queue sorts on it. Add one and the batch continues.\"",
   "\"تحتاج التذكرة موضوعاً — الطابور يرتّب عليه. أضفه وتستمر الدفعة.\"",
   "VALIDATION (confirm without labels)"
  ],
  "success": [
   "Batch intake done",
   "\"40 tickets in — 22 Arabic, 15 English, 3 mixed. Severity ran on every one; the clocks are live.\"",
   "\"دخلت 40 تذكرة — 22 عربية و15 إنجليزية و3 مختلطة. جرت الخطورة على كل واحدة؛ والساعات تعمل.\"",
   "Clustering done (keyword)",
   "\"Keyword engine clustered 18 of 22 — 4 wait for a human, by name.\""
  ]
 },
 "briefLine": "The unique feature is bilingual intent clustering with severity routing, built as two inspectable mechanisms, not oracles. First, clustering: conditionally-AI (ai-native-patterns §1). The local engine is deterministic keyword rules — each intent cluster carries authored bilingual signature terms, normalized per rtl-rules §4 (alef/hamza variants, taa marbuta/heh, yaa/alif maqsura, tashkeel stripping), and a ticket joins a cluster when it matches the cluster's threshold of distinct signature terms in either language. When the abstract ticket-clustering capability is bound and consented, it proposes new clusters and better assignments — but every proposal lands as proposed with a confidence band, and nothing becomes authoritative until a human confirms it (P15 trust checkpoint; the confirm gate is a first-class operation, 07b confirmCluster). When the capability is unbound, rate-limited, or fails, the keyword engine carries the whole workday — same screens, same rules, honestly labeled. This honesty is not modesty; it is the design: Arabic intent classification is a genuinely hard modeling problem (morphological richness, dialect diversity, labeled-data scarcity — 01 q7), so a product that *requires* a model to function would be a product that fails its buyer on day one. Second, severity: never AI — a deterministic, versioned matrix (requester impact tier × urgency signals from the ticket's own words and account facts) that computes P1–P4 with the ITIL-style convention practitioners already trust (01 q4), records every signal it weighed, and refuses to be a black box. The same inspectable-rules grammar that made labor-rule guardrails trustworthy in this family's planner and policy findings defensible in the claims pipeline applies here to the question \"why is this P2 and where did it go.\""
} as const;
export type Spec = typeof SPEC;
