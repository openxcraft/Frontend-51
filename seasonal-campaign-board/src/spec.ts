// GENERATED from specs-source/seasonal-campaign-board/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "seasonal-campaign-board",
 "title": "Seasonal Campaign Board",
 "family": "content_tools",
 "tier": 3,
 "flagship": false,
 "adapter": "SeasonalCampaignBoardAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Hilal Green",
  "pairing": "P05",
  "radius": "22px",
  "elevation": "soft-lift",
  "icon": "filled-rounded",
  "motion": "energetic",
  "fonts": [
   "Tajawal",
   "Hanken Grotesk"
  ],
  "primary": "#757800",
  "accent": "#575A00",
  "canvas": "#1F3A25"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Moment library",
   "purpose": "browse moments by season/kind/nearness",
   "shell": "",
   "data": "listSeasons, listMoments",
   "archetype": "settings-admin"
  },
  {
   "id": "S2",
   "name": "Moment detail",
   "purpose": "phases, dual dates + drift, template preview, guidance",
   "shell": "Moment detail",
   "data": "getMoment, getChecklistTemplate, listChecklistTemplates",
   "archetype": "review-queue"
  },
  {
   "id": "S3",
   "name": "Campaign board",
   "purpose": "lanes × countdown tiles × readiness meters × dual-calendar strip",
   "shell": "",
   "data": "listCampaigns, getReadiness, getCalendarFrame, getSession",
   "archetype": "calendar-grid"
  },
  {
   "id": "S4",
   "name": "Campaign detail (checklist)",
   "purpose": "the daily loop + intervention filters",
   "shell": "",
   "data": "getCampaign, listChecklistItems, updateChecklistItem, addChecklistItem, removeChecklistItem, bulkUpdateChecklistItems, updateCampaign, listAssignees, createAssignee, updateAssignee, getReadiness",
   "archetype": "board"
  },
  {
   "id": "S5",
   "name": "Closure & retro",
   "purpose": "closure note + waiver discipline + closed lane",
   "shell": "",
   "data": "closeCampaign, updateClosureNote, getCampaign",
   "archetype": "list-console"
  },
  {
   "id": "S6",
   "name": "Template editor",
   "purpose": "versioned checklist templates per moment kind",
   "shell": "",
   "data": "listChecklistTemplates, getChecklistTemplate, saveChecklistTemplate",
   "archetype": "editor-studio"
  },
  {
   "id": "S7",
   "name": "Jobs & activity",
   "purpose": "T3-consolidated jobs surface + activity log (async-contract §7)",
   "shell": "",
   "data": "listJobs, getArtifact, renewArtifact, getUsage, listActivity",
   "archetype": "review-queue"
  },
  {
   "id": "S8",
   "name": "Team roster",
   "purpose": "assignees: create, rename, deactivate",
   "shell": "",
   "data": "listAssignees, createAssignee, updateAssignee",
   "archetype": "list-console"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "locale, calendar method disclosure, numeral policy note, notification tiers (P21)",
   "shell": "",
   "data": "getSession, getUsage, getCalendarFrame (method verification frame)",
   "archetype": "calendar-grid"
  }
 ],
 "flows": [
  {
   "title": "CP-2 — Checklist execution & assignment (the daily loop)",
   "steps": [
    "Remove an item: P04 level 1 — removal is reversible via the 7-second undo affordance; the row ghosts then leaves; activity log records actor/action/target.",
    "*Recovery: checklist state is adapter-authoritative; the UI reconciles on reconnect rather than guessing (async-contract §5)."
   ]
  },
  {
   "title": "CP-3 — Readiness monitoring & intervention (the \"are we ready?\" flow)",
   "steps": [
    "Intervene: reassign (13), bulk-resolve (16), unblock after reading the block reason, or negotiate the due date (override with reason).",
    "*Recovery: all exports re-runnable from current state; readiness computation is derived and never itself a stored artifact that can go stale."
   ]
  },
  {
   "title": "CP-4 — National-day quick-start (the 60-second path)",
   "steps": [
    "One-screen creation: name + owner + create; template pre-selected; no optional fields shown (P09 — ask only what enables the next step).",
    "Land on the checklist with 5 items, owners unassigned (needs-owner cluster), countdown tile live.",
    "*Failures: same class set as CP-1.",
    "*Recovery: identical to CP-1."
   ]
  }
 ],
 "components": [
  {
   "name": "CountdownTile",
   "purpose": "per-campaign countdown: T-days numeral, phase label (التمهيد/الذروة/الانحسار), urgency state (on-track/attention/overdue — color+icon+text triplicated)",
   "obligations": "Digits in reserved-width tabular figures — no layout shift on update (10); updates at batched cadence, crossfade not slide; reduced-motion-safe (instant swap + threshold announcement only, 09); counts to the anchor from serverTime, never client clock; urgency thresholds announced on crossing, never per tick"
  },
  {
   "name": "MomentLibraryBrowser",
   "purpose": "season-grouped card grid with kind chips, drift badges, within-days filter",
   "obligations": "Card = single link target + quick-start action (CP-4); drift badge is text+icon (never color-only); filters are removable chips with described predicates (P08); filtered-empty offers reset (P01)"
  },
  {
   "name": "ChecklistBoard",
   "purpose": "campaign checklist rows grouped by section/phase with owner, status, due-T-minus, criticality",
   "obligations": "Inline edit P06 (escape restores, tab commits+advances); arrow-key row navigation P18; bulk select with keyboard equivalent + action bar naming the count (P07); blocked rows expose reason; needs-owner cluster pinned; virtualize >200 rows with focus preservation (P19); status words always ink-readable (11.6:1), state color is redundant coding"
  },
  {
   "name": "DualCalendarStrip",
   "purpose": "Hijri+Gregorian month strip with moment windows shaded and active-system explicit",
   "obligations": "Active system labeled (\"Gregorian primary · Hijri cross-reference\"); hover/focus cross-references the other system; method disclosure one click away (Q-5); strip mirrors in RTL (time flows inline-start→inline-end); moment windows shaded with tint + pattern for color-blind safety"
  },
  {
   "name": "ReadinessMeter",
   "purpose": "percent-complete + counts (critical open / at-risk / overdue / blocked)",
   "obligations": "Percentage never the only signal — counts listed as text; meter fill color is redundant; aria-describedby summary string matches visible numbers exactly"
  },
  {
   "name": "ClosureNoteForm",
   "purpose": "what-shipped (deterministic summary), what-slipped (pre-filled, editable), lessons, carry-to-template",
   "obligations": "Auto-summary is computed from checklist facts and labeled as such; waiver confirm names open critical items (P04-adjacent discipline, CP-5.3); no content is silently overwritten on edit (revision-protected)"
  },
  {
   "name": "TemplateEditor",
   "purpose": "versioned checklist-template structure editor (items: title, role, criticality, dueOffsetDays)",
   "obligations": "Row reorder via drag AND ⌘+arrow equivalent (2.5.7); version badge + restorable history; save conflict surfaces both versions (P10); offset changes preview affected future campaigns honestly"
  }
 ],
 "ops": [
  "getSession",
  "listSeasons",
  "listMoments",
  "getMoment",
  "getCalendarFrame",
  "listCampaigns",
  "getCampaign",
  "createCampaign",
  "updateCampaign",
  "closeCampaign",
  "updateClosureNote",
  "listChecklistItems",
  "updateChecklistItem",
  "addChecklistItem",
  "removeChecklistItem",
  "bulkUpdateChecklistItems",
  "getReadiness",
  "listAssignees",
  "createAssignee",
  "updateAssignee",
  "listChecklistTemplates",
  "getChecklistTemplate",
  "saveChecklistTemplate",
  "exportReadinessReport",
  "exportTaskHandoff",
  "listJobs",
  "getArtifact",
  "renewArtifact",
  "getUsage",
  "listActivity"
 ],
 "entities": [
  {
   "name": "PhaseWindow",
   "fields": [
    {
     "name": "phase",
     "optional": false,
     "type": "PhaseName"
    },
    {
     "name": "startsOffsetDays",
     "optional": false,
     "type": "number"
    },
    {
     "name": "endsOffsetDays",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "Season",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "label",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "gregorianYear",
     "optional": false,
     "type": "number"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'upcoming' | 'current' | 'past'"
    }
   ]
  },
  {
   "name": "Moment",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "seasonId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "MomentKind"
    },
    {
     "name": "name",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "anchorDate",
     "optional": false,
     "type": "string"
    },
    {
     "name": "anchorKind",
     "optional": false,
     "type": "'starts' | 'event-day'"
    },
    {
     "name": "hijriDate",
     "optional": false,
     "type": "{ day: number; month: number; year: number; label: string } | null"
    },
    {
     "name": "hijriMethod",
     "optional": false,
     "type": "HijriMethod | null"
    },
    {
     "name": "driftDisclosure",
     "optional": false,
     "type": "{ driftAware: boolean; note: BilingualText } | null"
    },
    {
     "name": "phases",
     "optional": false,
     "type": "PhaseWindow[]"
    },
    {
     "name": "checklistTemplateId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "guidance",
     "optional": false,
     "type": "BilingualText | null"
    }
   ]
  },
  {
   "name": "TemplateItem",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "title",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "role",
     "optional": false,
     "type": "string"
    },
    {
     "name": "critical",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "dueOffsetDays",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "ChecklistTemplate",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "momentKind",
     "optional": false,
     "type": "MomentKind"
    },
    {
     "name": "name",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "items",
     "optional": false,
     "type": "TemplateItem[]"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Assignee",
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
     "name": "role",
     "optional": false,
     "type": "string"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "Campaign",
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
     "name": "momentId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "templateId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "name",
     "optional": false,
     "type": "string"
    },
    {
     "name": "anchorDate",
     "optional": false,
     "type": "string"
    },
    {
     "name": "goLiveOverride",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "status",
     "optional": false,
     "type": "CampaignStatus"
    },
    {
     "name": "ownerId",
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
     "name": "revision",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "ChecklistItem",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "campaignId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "templateItemId",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "title",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "role",
     "optional": false,
     "type": "string"
    },
    {
     "name": "critical",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "dueOffsetDays",
     "optional": false,
     "type": "number"
    },
    {
     "name": "dueDate",
     "optional": false,
     "type": "string"
    },
    {
     "name": "dueDateOverride",
     "optional": false,
     "type": "{ date: string; reason: string } | null"
    },
    {
     "name": "status",
     "optional": false,
     "type": "ItemStatus"
    },
    {
     "name": "assigneeId",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "blockedReason",
     "optional": false,
     "type": "string | null"
    }
   ]
  },
  {
   "name": "ClosureNote",
   "fields": [
    {
     "name": "campaignId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "whatShipped",
     "optional": false,
     "type": "string"
    },
    {
     "name": "whatSlipped",
     "optional": false,
     "type": "string"
    },
    {
     "name": "lessons",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "waivedCriticalItems",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "carriedToTemplate",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "closedBy",
     "optional": false,
     "type": "string"
    },
    {
     "name": "closedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "revision",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "ReadinessSummary",
   "fields": [
    {
     "name": "campaignId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "computedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "phase",
     "optional": false,
     "type": "PhaseName | 'pre-season' | 'post-season'"
    },
    {
     "name": "percentComplete",
     "optional": false,
     "type": "number"
    },
    {
     "name": "counts",
     "optional": false,
     "type": "{ total: number; done: number; na: number; inProgress: number; blocked: number; notStarted: number }"
    },
    {
     "name": "criticalOpen",
     "optional": false,
     "type": "number"
    },
    {
     "name": "atRiskCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "overdueCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "nextDueAt",
     "optional": false,
     "type": "string | null"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "First-run (no campaigns yet)",
   "Browse moments",
   "Filtered-empty (kind/within-days filters)",
   "\"No moments match these filters. The season is fuller than this view shows.\"",
   "\"لا لحظات تطابق هذه المرشّحات. الموسم أوسع مما يعرضه هذا العرض.\""
  ],
  "loading": [
   "Library boot",
   "moment-card skeletons, season headers held",
   "هياكل بطاقات اللحظات مع تثبيت عناوين المواسم",
   "Board boot",
   "lane skeletons with reserved countdown boxes"
  ],
  "error": [
   "Instance",
   "VALIDATION",
   "campaign name empty",
   "\"The campaign needs a name before the board can carry it.\"",
   "\"تحتاج الحملة اسماً قبل أن تحملها اللوحة.\""
  ],
  "success": [
   "Campaign created",
   "\"Campaign created — {n} items from {template}, counting down to {date}.\"",
   "\"أُنشئت الحملة — {n} بنود من {template}، مع العدّ نزولاً إلى {date}.\"",
   "Quick-start created",
   "\"Campaign live in 4 steps — {moment} is {days} days out. Assign the 5 owners next.\""
  ]
 },
 "briefLine": "The daily surface is the board: campaign lanes against a dual-calendar strip (Hijri + Gregorian, active system explicit, hover cross-reference), countdown tiles per campaign, and readiness meters that compute percent-complete, at-risk (due within the threshold), overdue, and blocked counts from the checklist. Work happens in the checklist: inline status changes, assignment, blocked-with-reason, custom items beyond the template, and bulk moves. The product is deliberately dumb in the best way — deterministic counting, deterministic dates, deterministic math (ai-native-patterns §1: declared non-AI product; no generation, no prediction, no scoring intelligence; the intelligence is in the curated moment data and checklist templates, which are inspectable, editable objects). When a moment passes, campaigns close with a closure note — what shipped, what slipped, lessons — and the note can carry into the next season's template, so the board learns organizationally instead of algorithmically."
} as const;
export type Spec = typeof SPEC;
