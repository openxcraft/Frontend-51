// GENERATED from specs-source/bilingual-content-calendar/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "bilingual-content-calendar",
 "title": "Bilingual Content Calendar",
 "family": "content_tools",
 "tier": 2,
 "flagship": false,
 "adapter": "PlannerAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Taba Spring",
  "pairing": "P13",
  "radius": "22px",
  "elevation": "soft-lift",
  "icon": "filled-rounded",
  "motion": "crisp",
  "fonts": [
   "Baloo Bhaijaan 2",
   "Plus Jakarta Sans"
  ],
  "primary": "#2FA36B",
  "accent": "#EDBE4F",
  "canvas": "#F4F7F2"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Workspace home",
   "purpose": "horizons list, onboarding checklist (P22), recent activity",
   "shell": "",
   "data": "listHorizons, getCalendarMethod",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Calendar grid",
   "purpose": "the planning surface (4 modes)",
   "shell": "",
   "data": "getSlots(range, filter), getMoments(range)",
   "archetype": "calendar-grid"
  },
  {
   "id": "S3",
   "name": "Slot detail",
   "purpose": "variants, owners, status, history",
   "shell": "",
   "data": "getSlot, updateVariant, updateSlot",
   "archetype": "review-queue"
  },
  {
   "id": "S4",
   "name": "Moments library",
   "purpose": "seasonal moments + timing patterns",
   "shell": "",
   "data": "listMoments, applyPattern(Job)",
   "archetype": "settings-admin"
  },
  {
   "id": "S5",
   "name": "Season mode console",
   "purpose": "Ramadan/season configuration, quiet hours, city",
   "shell": "",
   "data": "getSeasonConfig, updateSeasonConfig",
   "archetype": "list-console"
  },
  {
   "id": "S6",
   "name": "Review mode",
   "purpose": "conflict + parity actionable list, comments",
   "shell": "Review mode",
   "data": "getHorizonReview, addComment, resolveComment, approveHorizon",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Export",
   "purpose": "format choice, artifact list",
   "shell": "",
   "data": "exportHorizon(Job), getArtifact",
   "archetype": "wizard-flow"
  },
  {
   "id": "S8",
   "name": "Channels & workspace settings",
   "purpose": "channels, calendar method declaration, locale",
   "shell": "",
   "data": "workspace ops",
   "archetype": "calendar-grid"
  },
  {
   "id": "S9",
   "name": "Jobs center",
   "purpose": "bulk pattern/export jobs (P12/async §7)",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S10",
   "name": "Mobile review",
   "purpose": "read grid + approve/comment (subset)",
   "shell": "Mobile review",
   "data": "getSlots(range), addComment, approveHorizon",
   "archetype": "editor-studio"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — First-run → season grid in one session (value proof)",
   "steps": [
    "Workspace creation (name, channels list, calendar method declaration: Umm al-Qura default with disclosure, per _index Q-5).",
    "First slot creation (createSlot): channel + date/time + title; variant pairing UI creates the ar/en pair automatically (P23).",
    "Autosave persists (P10); onboarding checklist (P22) marks \"first season planned\".",
    "*Recovery: plan is continuously autosaved; undo window on structural changes (slot move/delete) per P03."
   ]
  },
  {
   "title": "CP-2 — Variant parity loop (the daily loop)",
   "steps": [
    "Assign variant owner; status changes are instant + undoable (P03) — variant writes go through setVariant.",
    "Fill a variant: write brief or paste final copy (setVariant); mark approved (setVariant → approved).",
    "*Recovery: slot history (activity log P17) restores any prior state of a variant."
   ]
  },
  {
   "title": "CP-3 — Season mode planning (Ramadan)",
   "steps": [
    "Moments panel populates season-specific moment suggestions with countdown links (P24).",
    "Bulk-apply a timing pattern across a week (applyPattern Job — P07 bulk bar with count).",
    "Review with Reem: season review mode lists timing conflicts + parity gaps as an actionable list (getReviewSummary, S6).",
    "*Recovery: bulk actions are jobs (P12) — cancellable and per-item retriable; the jobs center (listJobs, S9) is the console for pattern-apply and export jobs."
   ]
  },
  {
   "title": "CP-4 — Review & export handoff (the boundary of the product)",
   "steps": [
    "Send horizon to review (status in-review); Reem reviews on desktop or mobile review layout (S6/S10 — the actionable list is the getReviewSummary surface).",
    "Comments anchor to slots/variants (threaded, resolvable — addComment).",
    "Approve horizon (approveHorizon; status approved, approval recorded).",
    "*Failures: export job failure (typed error, retry); artifact expired (renew action regenerates from current plan).",
    "*Recovery: export is regenerable at any time from plan state — the artifact is a projection, never the source."
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "Zero moments, zero channels (fresh workspace): grid guides to add at least one channel; planning remains possible on \"unspecified\" channel slots.",
    "Offline: banner P20; slot edits queue; grid reads work fully."
   ]
  }
 ],
 "components": [
  {
   "name": "DualCalendarHeader",
   "purpose": "Hijri+Gregorian date header, one primary + cross-reference",
   "obligations": "P24; cross-reference on hover AND focus; method disclosure tooltip is accessible; announced as one coherent date (\"الثلاثاء ١٤ رمضان ١٤٤٧ — 24 Mar 2026\")"
  },
  {
   "name": "SlotChip",
   "purpose": "grid slot with parity indicator + status",
   "obligations": "Parity = icon+text (never color-only); 24px target minimum; drag has keyboard move (⌘+arrows) per 2.5.7"
  },
  {
   "name": "VariantPanes",
   "purpose": "ar/en paired panes in slot detail (P23)",
   "obligations": "Per-pane direction; sync-state chip; length hints soft; pane switch preserves focus position"
  },
  {
   "name": "MomentsPanel",
   "purpose": "library + apply timing patterns",
   "obligations": "Pattern preview before apply; bulk apply = job (P12) with count; city selector with method disclosure"
  },
  {
   "name": "SeasonConsole",
   "purpose": "quiet-hours, iftar/suhoor windows config",
   "obligations": "Overrides require reason (recorded); guidance is visual+text, never hard-block; all settings persist per horizon"
  }
 ],
 "ops": [
  "getSession",
  "listHorizons",
  "createHorizon",
  "updateSeasonConfig",
  "listSlots",
  "getSlot",
  "createSlot",
  "updateSlot",
  "moveSlot",
  "setVariant",
  "listMomentLibrary",
  "placeMoment",
  "applyPattern",
  "getReviewSummary",
  "addComment",
  "approveHorizon",
  "exportHorizon",
  "getArtifact",
  "listJobs"
 ],
 "entities": [
  {
   "name": "Variant",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; slotId: string; locale: 'ar'|'en'; status: SlotStatus"
    },
    {
     "name": "content",
     "optional": true,
     "type": "string; ownerId?: string; divergenceNote?: string"
    }
   ]
  },
  {
   "name": "Horizon",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; title: string; kind: 'month'|'season'|'custom'; start: string; end: string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'planning'|'in-review'|'approved'; seasonConfig?: { quietHours?: { start: string; end: string }; city?: string }; }"
    },
    {
     "name": "progress",
     "optional": false,
     "type": "{ determinate: boolean; done?: number; total?: number }; partial?: T; result?: T; error?: AdapterError; }"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "First-run (no horizon)",
   "\"Start with the horizon you're planning — this Ramadan, or the month ahead. Moments come pre-placed.\"",
   "\"ابدأ بالأفق الذي تخطط له — رمضان هذا، أو الشهر القادم. اللحظات تأتي مسبقة التموضع.\"",
   "Create Ramadan horizon / Create month",
   "Horizon empty (no slots)"
  ],
  "loading": [
   "Grid boot",
   "skeleton cells mirroring geometry; SR: \"Loading {horizon} — dual calendar\"",
   "خلايا هيكلية؛ \"جارٍ تحميل {الأفق} — التقويم المزدوج\"",
   "Slot drawer",
   "skeleton panes (ar/en)"
  ],
  "error": [
   "VALIDATION (channel limit)",
   "\"Feed accepts 6 slots that day — this would be the 7th. Move it or clear one.\"",
   "\"تقبل الفيد ٦ خانات في ذلك اليوم — وستكون هذه السابعة. انقلها أو أخلِ إحداها.\"",
   "VALIDATION (slot fields)",
   "\"A slot needs a channel, a time, and a title before it can live on the grid.\""
  ],
  "success": [
   "Horizon approved",
   "\"Approved. The plan is now the record of what goes out.\"",
   "\"تمت الموافقة. الخطة الآن سجلٌ لما سيصدر.\"",
   "Pattern applied with conflicts",
   "\"Pattern applied to 21 slots — 2 need your eye (marked in red on the grid).\""
  ]
 },
 "briefLine": "Bilingual social media and content teams (3–15 users) at MENA brands, agencies, and publishers — the same buyer pool as arabic-copy-studio's teams but the planner role (social media managers, content leads) rather than the writer role. Economic buyer: social/content lead."
} as const;
export type Spec = typeof SPEC;
