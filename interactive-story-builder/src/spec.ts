// GENERATED from specs-source/interactive-story-builder/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "interactive-story-builder",
 "title": "Interactive Story Builder",
 "family": "content_tools",
 "tier": 3,
 "flagship": false,
 "adapter": "StoryBuilderAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Hikaya Crimson",
  "pairing": "P03",
  "radius": "8px",
  "elevation": "layered-depth",
  "icon": "line-1.5",
  "motion": "calm",
  "fonts": [
   "Noto Naskh Arabic",
   "Newsreader"
  ],
  "primary": "#B84F8A",
  "accent": "#2F1E26",
  "canvas": "#F6F0F2"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Story library",
   "purpose": "list, filter, new, duplicate, delete",
   "shell": "",
   "data": "listStories, createStory, deleteStory, duplicateStory",
   "archetype": "settings-admin"
  },
  {
   "id": "S2",
   "name": "Template gallery",
   "purpose": "arc skeletons with anatomy previews",
   "shell": "Template gallery",
   "data": "listTemplates",
   "archetype": "review-queue"
  },
  {
   "id": "S3",
   "name": "Outline editor",
   "purpose": "chapter rail + step board (CP-1); story details (title/theme/direction) edit in place; suggestion panel (CP-4)",
   "shell": "",
   "data": "getStory, updateStoryDetails, listChapters, listSteps, createChapter, updateChapter, reorderChapters, deleteChapter, createStep, updateStep, reorderSteps, deleteStep, suggestStructure",
   "archetype": "editor-studio"
  },
  {
   "id": "S4",
   "name": "Step editor",
   "purpose": "scroll canvas + inspector (CP-1.5)",
   "shell": "",
   "data": "createStep, updateStep",
   "archetype": "editor-studio"
  },
  {
   "id": "S5",
   "name": "Sync panel",
   "purpose": "bilingual alignment grid (CP-2)",
   "shell": "",
   "data": "getSyncState, listSteps, updateStep",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Preview",
   "purpose": "live render, direction toggle (CP-1.6/CP-3)",
   "shell": "Preview",
   "data": "story state (client render)",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "QA report",
   "purpose": "findings, jump-to-step (CP-3.5)",
   "shell": "",
   "data": "validateStory",
   "archetype": "wizard-flow"
  },
  {
   "id": "S8",
   "name": "Review surface",
   "purpose": "notes, approve (CP-5.1–5.3)",
   "shell": "Review surface",
   "data": "addReviewNote, listReviewNotes, resolveReviewNote, setStoryStatus",
   "archetype": "review-queue"
  },
  {
   "id": "S9",
   "name": "Jobs & exports",
   "purpose": "job states, export initiation (CP-5.5), artifacts, renew/cancel",
   "shell": "",
   "data": "exportStory, listJobs, cancelJob, getExportArtifact, renewExportArtifact",
   "archetype": "jobs-centre"
  },
  {
   "id": "S10",
   "name": "Settings",
   "purpose": "locale/numeral policy, direction default, usage, activity",
   "shell": "",
   "data": "getSession, getUsage, listActivity",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Create story → structure → step authoring → preview (the spine)",
   "steps": [
    "Library → \"New story\": bilingual title (≥1 locale), default direction, starting point (blank / template / duplicate).",
    "Outline editor: chapter rail (inline-start) + step board; autosave P10 (saving → saved → conflict → offline-queued).",
    "Author step: media ref (external URL or abstract capability, 08) with bilingual alt + credit; per-locale text; optional per-locale layout override (CP-3).",
    "Preview any time: direction toggle (ar-rtl / en-ltr / side-by-side) + chapter progress; renders from story state, never a separate artifact.",
    "Structural edits: drag reorder + ⌘/Ctrl+arrows (P18); optimistic with 5s undo (P03).",
    "*Recovery: edits persist per step revision; conflicts keep both texts in history; offline queue (P20) flushes on reconnect."
   ]
  },
  {
   "title": "CP-2 — Bilingual chapter sync loop (the differentiator)",
   "steps": [
    "Sync panel per chapter: per-step alignment grid, ar/en columns, rows = shared steps (alignment by step index).",
    "Write missing locale inline (P06): Tab commits + advances; Escape restores; alignment link jumps preview to that step in that direction.",
    "\"Mark reviewed\": explicit editorial act resetting edited-since to in-sync — parity is never silently decided.",
    "Chapter rollup chips (x/y in-sync) in the outline rail; QA consumes the same derived state.",
    "*Failures: stale sync reads after offline edits → recomputed on reconnect; updateStep conflicts per CP-1.",
    "*Recovery: sync is derived — always recomputable; \"mark reviewed\" logged (P17)."
   ]
  },
  {
   "title": "CP-3 — RTL/LTR step reflow and the QA gate",
   "steps": [
    "Per-locale layout override: pin a step's media side for one locale; sync shows override + reason (CP-2.2).",
    "Numeral policy: Arabic prose may render ٠–٩ per workspace toggle (canonical storage unchanged); stat-bands/time-codes stay Western.",
    "Fix loop: jump-to-step per finding; re-run; rail shows checks pass / N issues.",
    "*Edges: mixed-direction user strings get bidi isolation on input (dir=\"auto\") + QA flag; wrong-policy digits → warning + one-click conformant render.",
    "*Failures: transport → NETWORK, report stale with re-run; stale story link → NOT_FOUND → library.",
    "*Recovery: QA re-runs deterministically at zero cost; findings persist per revision."
   ]
  },
  {
   "title": "CP-4 — Structure suggestion (conditionally-AI, draft-by-default)",
   "steps": [
    "\"Suggest structure\" from the outline editor: confirm brief (bilingual title/description or pasted summary) + audience arc.",
    "suggestStructure runs as a Job: outline streams into a reserved review region (P13); announcements = start + completion summary only.",
    "Apply inserts selected chapters/steps as drafts (sync starts missing-in-locale; content marked suggestion-origin until first human edit).",
    "Quota (P14): window shown before/after; 80% warning; ladder per ai-native-patterns §5.",
    "*Failures: quota → RATE_LIMIT with reset; stall >8s → stalled + retry guidance; mid-stream failure → partial kept, marked partial, retry-continue or discard.",
    "*Recovery: partial never promotes silently; applied suggestions are ordinary steps — editable, deletable, undoable."
   ]
  },
  {
   "title": "CP-5 — Review → approve → export → delivery",
   "steps": [
    "Producer sets story in-review (setStoryStatus); reviewers gain the review surface; post-submission edits re-flag the story as changed (surfaced, not silent).",
    "Reviewer reviews chapter-by-chapter with the sync grid visible; pins step notes with locale context (addReviewNote); resolves as addressed; filterable list.",
    "Approve — names the version; logged with actor + timestamp; later edits return the story to draft visibly.",
    "Manual alternative (LOOP-5): the downloaded bundle is the deliverable — host or embed anywhere; no hosting, no analytics claims (LOOP-10).",
    "*Recovery: exports re-generate from story state at zero authoring cost."
   ]
  }
 ],
 "components": [
  {
   "name": "ChapterRail",
   "purpose": "ordered chapters + rollup sync chips",
   "obligations": "default/hover/focus/active/dragging/drop-target; empty-chapter state; drag + ⌘/Ctrl+↑↓ reorder; sync chip counts"
  },
  {
   "name": "StepBoard",
   "purpose": "ordered step cards of the chapter",
   "obligations": "default/hover/focus-selected/loading(media)/error(media)/dragging; sync + layout-override badges; add-step affordance"
  },
  {
   "name": "LayoutPicker",
   "purpose": "RTL-native layout chooser (6 layouts, logical-axis previews)",
   "obligations": "previews render in story direction with toggle; selected/disabled; per-locale override control"
  },
  {
   "name": "SyncGrid",
   "purpose": "bilingual per-step alignment matrix (CP-2)",
   "obligations": "rows: in-sync/edited-since/missing-in-locale/length-divergent/layout-override; inline edit cells; \"mark reviewed\" per row"
  },
  {
   "name": "PreviewSurface",
   "purpose": "live scrollytelling render + direction toggle",
   "obligations": "rendering/partial-media/error; ar/en/side-by-side toggle; chapter progress; jump-to-chapter (skip); reduced-motion variant"
  },
  {
   "name": "QaReportPanel",
   "purpose": "findings list with jump-to-step",
   "obligations": "clean/issues/stale/error; severity order; error-vs-warning distinction; re-run"
  }
 ],
 "ops": [
  "getSession",
  "listStories",
  "createStory",
  "getStory",
  "updateStoryDetails",
  "duplicateStory",
  "deleteStory",
  "setStoryStatus",
  "listTemplates",
  "listChapters",
  "createChapter",
  "updateChapter",
  "reorderChapters",
  "deleteChapter",
  "listSteps",
  "createStep",
  "updateStep",
  "reorderSteps",
  "deleteStep",
  "getSyncState",
  "suggestStructure",
  "validateStory",
  "addReviewNote",
  "listReviewNotes",
  "resolveReviewNote",
  "exportStory",
  "getExportArtifact",
  "renewExportArtifact",
  "listJobs",
  "cancelJob",
  "listActivity",
  "getUsage"
 ],
 "entities": [
  {
   "name": "Workspace",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; name: string; defaultLocale: Locale"
    },
    {
     "name": "directionDefault",
     "optional": false,
     "type": "'rtl' | 'ltr'; numeralPolicy: 'ar-indic-prose' | 'western'"
    }
   ]
  },
  {
   "name": "Story",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; workspaceId: string"
    },
    {
     "name": "title",
     "optional": false,
     "type": "LocalizedText; description?: LocalizedText"
    },
    {
     "name": "directionDefault",
     "optional": false,
     "type": "'rtl' | 'ltr'"
    },
    {
     "name": "theme",
     "optional": false,
     "type": "{ fontScale: 'normal' | 'large'; spacing: 'normal' | 'relaxed' }"
    },
    {
     "name": "status",
     "optional": false,
     "type": "StoryStatus; revision: number"
    },
    {
     "name": "chapterCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "syncRollup",
     "optional": false,
     "type": "{ inSync: number; issues: number }"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "Iso8601; updatedAt: Iso8601"
    }
   ]
  },
  {
   "name": "Chapter",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; storyId: string; order: number"
    },
    {
     "name": "title",
     "optional": false,
     "type": "LocalizedText; revision: number; stepCount: number"
    }
   ]
  },
  {
   "name": "LocaleVariant",
   "fields": [
    {
     "name": "heading",
     "optional": true,
     "type": "string"
    },
    {
     "name": "bodyBlocks",
     "optional": false,
     "type": "{ kind: 'paragraph' | 'pull-quote' | 'stat-line'; text: string }[]"
    },
    {
     "name": "wordCount",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "LayoutOverride",
   "fields": [
    {
     "name": "locale",
     "optional": false,
     "type": "Locale; property: 'mediaSide' | 'textPosition'"
    },
    {
     "name": "value",
     "optional": false,
     "type": "'inline-start' | 'inline-end'; reason: string"
    }
   ]
  },
  {
   "name": "Step",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; chapterId: string; order: number"
    },
    {
     "name": "layout",
     "optional": false,
     "type": "StepLayoutKind; media?: MediaRef"
    },
    {
     "name": "localeVariants",
     "optional": false,
     "type": "{ ar?: LocaleVariant; en?: LocaleVariant }"
    },
    {
     "name": "layoutOverride",
     "optional": true,
     "type": "LayoutOverride"
    },
    {
     "name": "revision",
     "optional": false,
     "type": "number"
    },
    {
     "name": "lastEditedByLocale",
     "optional": true,
     "type": "{ locale: Locale; at: Iso8601 }"
    }
   ]
  },
  {
   "name": "StoryTemplate",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; audience: 'newsroom' | 'ngo' | 'university'; name: LocalizedText"
    },
    {
     "name": "chapters",
     "optional": false,
     "type": "{ title: LocalizedText"
    },
    {
     "name": "steps",
     "optional": false,
     "type": "{ layout: StepLayoutKind; suggestedMediaType?: MediaRef['kind'] }[] }[]"
    }
   ]
  },
  {
   "name": "StructureOutline",
   "fields": [
    {
     "name": "origin",
     "optional": false,
     "type": "'generated' | 'template'"
    },
    {
     "name": "partial",
     "optional": true,
     "type": "boolean"
    },
    {
     "name": "chapters",
     "optional": false,
     "type": "{ title: LocalizedText; steps: { layout: StepLayoutKind; note?: string }[] }[]"
    }
   ]
  },
  {
   "name": "ReviewNote",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; storyId: string"
    },
    {
     "name": "targetRef",
     "optional": false,
     "type": "{ kind: 'story' | 'chapter' | 'step'; id: string; locale?: Locale }"
    },
    {
     "name": "body",
     "optional": false,
     "type": "string; authorMemberId: string"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "Iso8601; resolvedAt?: Iso8601"
    }
   ]
  },
  {
   "name": "ExportArtifact",
   "fields": [
    {
     "name": "artifactId",
     "optional": false,
     "type": "string; storyId: string; jobId: string"
    },
    {
     "name": "format",
     "optional": false,
     "type": "'html-bundle' | 'embed-package'; localeScope: 'both' | 'ar' | 'en'"
    },
    {
     "name": "expiresAt",
     "optional": false,
     "type": "Iso8601; regenerable: true"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run",
   "\"Your desk is empty — every story starts as one chapter and one step. Begin blank, or start from an arc template.\"",
   "\"مكتبك خالٍ — كل قصة تبدأ بفصلٍ واحد وخطوةٍ واحدة. ابدأ من فراغ، أو من قالب مسار.\"",
   "New story / قصة جديدة",
   "S1 filtered-empty"
  ],
  "loading": [
   "S1 library",
   "skeleton rows ×8 + \"Loading your stories…\"",
   "صفوف هيكلية ×٨ + \"جارٍ تحميل قصصك…\"",
   "S3 outline boot",
   "shell → rail → board; SR: \"Opening «{title}»\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (title)",
   "\"The story needs a title in at least one language.\"",
   "\"تحتاج القصة عنواناً بلغةٍ واحدة على الأقل.\"",
   "VALIDATION (export scope)"
  ],
  "success": [
   "Story created",
   "\"Story created — one chapter, one step. Build from here.\"",
   "\"أُنشئت القصة — فصلٌ واحد وخطوةٌ واحدة. ابنِ من هنا.\"",
   "Story duplicated",
   "\"أُنشئت نسخة بالهيكل والوسائط. نصّ النسختين يبدأ فارغاً.\""
  ]
 },
 "briefLine": "Bilingual by construction: every step carries Arabic and English LocaleVariants aligned one-to-one by structure. The bilingual chapter sync surface shows per step whether the locales are in-sync, edited-since-other, missing-in-locale, length-divergent, or layout-override — the portfolio's P23 parity discipline applied to narrative structure. RTL is native, not mirrored-after-the-fact: layouts are defined on inline-start/inline-end axes so an Arabic chapter reflows by design, with optional per-locale layout overrides when a step's visual argument demands it (rtl-rules §2)."
} as const;
export type Spec = typeof SPEC;
