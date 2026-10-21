// GENERATED from specs-source/podcast-publish-kit/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "podcast-publish-kit",
 "title": "Podcast Publish Kit",
 "family": "content_tools",
 "tier": 3,
 "flagship": false,
 "adapter": "PodcastPublishKitAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Midyar Olive",
  "pairing": "P14",
  "radius": "14px",
  "elevation": "soft-lift",
  "icon": "duotone",
  "motion": "energetic",
  "fonts": [
   "Rubik",
   "Space Mono"
  ],
  "primary": "#908126",
  "accent": "#666005",
  "canvas": "#C26030"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Episodes board",
   "purpose": "stage-column view of all episodes per show; quick-add; first-run value checklist (P22)",
   "shell": "",
   "data": "listShows, listEpisodes, createEpisode, createShow",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Episode workbench",
   "purpose": "the product's spine: transcript pane + chapter timeline + notes composer + checklist drawer + playback bar (CP-1/2/3/4)",
   "shell": "",
   "data": "getEpisode, importTranscript, getTranscript, listSegments, updateSegment, suggestChapters, listChapters, createChapter, updateChapter, deleteChapter, getShowNotes, saveShowNotes, getEpisodeChecklist, setChecklistSignOff, updateEpisode, getJob, cancelJob, getUsage",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Transcript import surface",
   "purpose": "paste/abstract-source, format detection result, await-input duration path (CP-1.4–5)",
   "shell": "",
   "data": "importTranscript, getJob",
   "archetype": "wizard-flow"
  },
  {
   "id": "S4",
   "name": "Suggestion review panel",
   "purpose": "in-workbench reserved region; rationale + confidence; accept/adjust/reject (CP-2.1–2)",
   "shell": "Suggestion review panel",
   "data": "suggestChapters, getJob, createChapter",
   "archetype": "review-queue"
  },
  {
   "id": "S5",
   "name": "Notes composer zone",
   "purpose": "bilingual sections, parity indicators, chapter-list block (CP-3)",
   "shell": "",
   "data": "getShowNotes, saveShowNotes, listChapters",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Checklist drawer",
   "purpose": "derived + sign-off items with fix-links (CP-4.1–2)",
   "shell": "",
   "data": "getEpisodeChecklist, setChecklistSignOff",
   "archetype": "list-console"
  },
  {
   "id": "S7",
   "name": "Packages library + detail",
   "purpose": "versions, artifacts, digest view, delivery (CP-4.3–4, CP-5.4)",
   "shell": "",
   "data": "listPackages, getPackage, buildPublicationPackage, getArtifact, renewArtifact, deliverPackage",
   "archetype": "settings-admin"
  },
  {
   "id": "S8",
   "name": "Jobs center",
   "purpose": "filterable job list, cancel/retry, link-to-context (async-contract §7, Tier-3 consolidated surface)",
   "shell": "",
   "data": "listJobs, getJob, cancelJob",
   "archetype": "jobs-centre"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "show defaults (numbering, notes template, active locales), assist preferences, channels/credentials (CP-5.1–3)",
   "shell": "",
   "data": "getSession, listShows, updateShow, getUsage, listChannelCredentials, saveChannelCredential, verifyChannelCredential, revokeChannelCredential",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Episode setup → transcript import & alignment",
   "steps": [
    "*Failures: unparseable format → VALIDATION with the offending line number; transcript source unreachable → NETWORK with the paste path offered inline.",
    "*Recovery: cancelled imports leave the episode in Draft; jobs retain per-item results for retry-scoped re-runs (async-contract §4)."
   ]
  },
  {
   "title": "CP-3 — Bilingual show notes composition",
   "steps": [
    "Save & stage: saveShowNotes (baseRevision conflict-safe); notes completeness feeds the derived stage and the checklist.",
    "*Failures: save failure → offline-queued copy (11 §C); stale baseRevision → CONFLICT both-versions view (never silent overwrite).",
    "*Recovery: notes revisions retained; conflicts always offer a choice."
   ]
  },
  {
   "title": "CP-4 — Pre-publication checklist → package build",
   "steps": [
    "*Failures: build failure → typed error + retry with what completed reported (async-contract §4); artifact fetch failure → NETWORK retry.",
    "*Recovery: packages re-buildable from episode state at any time; artifacts renewable."
   ]
  },
  {
   "title": "CP-5 — Package delivery to a publication channel",
   "steps": [
    "Verify: verifyChannelCredential exercises a real round-trip (never a fake success — §7); result inline.",
    "*Recovery: failed deliveries retryable; idempotency keys prevent double-delivery (07b rule 5)."
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "Assist unavailable (rung 4): suggestion entry point renders unavailability with reset estimate; manual marking unaffected and affirmatively presented (08 map).",
    "First-run: value checklist + sample episode fixture (\"جرّب حلقة عيّنة\" — the full pipeline on seeded data, 07c).",
    "Offline (P20): board/packages read; notes + chapter mutations queue locally with per-item state; jobs reconcile on reconnect.",
    "Job center (S8): listJobs filterable, link-to-context on every row, cancel/retry (async-contract §7; Tier-3 consolidated surface — 04)."
   ]
  }
 ],
 "components": [
  {
   "name": "TranscriptPane",
   "purpose": "virtualized segment list with per-segment direction rendering and inline edit",
   "obligations": "Virtualize >200 segments (P19; row-count context on region entry for SR); per-segment dir auto with bidi-isolated Latin runs; P06 inline edit (escape restores, tab commits+advances, focus never trapped); needsReview flag visible as chip + filter; focused segment announces index + timecode + speaker; measure 65–75ch (ux-guidelines row 73); selected-segment ↔ timeline playhead sync (scroll never moves focus — focus moves scroll)"
  },
  {
   "name": "EpisodePlayerBar",
   "purpose": "persistent playback bar for the LOCAL audio reference (never uploaded — 07a)",
   "obligations": "File chosen from disk client-side; if absent, disabled with rationale (\"الاستماع يتطلب ملف الصوت على جهازك — لا يُرفع أبداً\" / \"Listening needs your audio file on your machine — it never uploads\"); full keyboard control (space play/pause when bar focused, ←/→ seek ±10s, shift for ±30s) with state announcements (a11y-baseline §6); glyphs unmirrored in RTL; time displays mono Western numerals LTR-isolated; seek to segment via transcript pane focus action; no autoplay, ever"
  },
  {
   "name": "SuggestionReviewPanel",
   "purpose": "reserved region for chapter suggestions (P13)",
   "obligations": "Streams cards with rationale + confidence chip (icon+text — never color-only); accept = explicit promotion (P15) creating a real chapter with origin:'assist'; adjust-before-accept; reject with 7s undo; stall >8s declares stalled with retry; partial results retained + marked; quota context before run (P14); region size reserved pre-arrival (CLS ≤0.02)"
  }
 ],
 "ops": [
  "getSession",
  "getUsage",
  "listShows",
  "createShow",
  "updateShow",
  "listEpisodes",
  "createEpisode",
  "getEpisode",
  "updateEpisode",
  "importTranscript",
  "getTranscript",
  "listSegments",
  "updateSegment",
  "suggestChapters",
  "listChapters",
  "createChapter",
  "updateChapter",
  "deleteChapter",
  "getShowNotes",
  "saveShowNotes",
  "getEpisodeChecklist",
  "setChecklistSignOff",
  "buildPublicationPackage",
  "listPackages",
  "getPackage",
  "deliverPackage",
  "listChannelCredentials",
  "saveChannelCredential",
  "verifyChannelCredential",
  "revokeChannelCredential",
  "listJobs",
  "getJob",
  "cancelJob",
  "getArtifact",
  "renewArtifact"
 ],
 "entities": [
  {
   "name": "LocaleContent",
   "fields": [
    {
     "name": "ar",
     "optional": true,
     "type": "string; en?: string; }"
    },
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
     "name": "title",
     "optional": false,
     "type": "LocaleContent"
    },
    {
     "name": "category",
     "optional": true,
     "type": "string"
    },
    {
     "name": "numbering",
     "optional": false,
     "type": "{ mode: 'seasons' | 'sequential' | 'none' }"
    },
    {
     "name": "notesTemplate",
     "optional": false,
     "type": "NotesSectionKind[]"
    },
    {
     "name": "activeLocales",
     "optional": false,
     "type": "('ar' | 'en')[]"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string; updatedAt: string"
    }
   ]
  },
  {
   "name": "Episode",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; showId: string"
    },
    {
     "name": "number",
     "optional": true,
     "type": "number; season?: number"
    },
    {
     "name": "title",
     "optional": false,
     "type": "LocaleContent"
    },
    {
     "name": "plannedReleaseDate",
     "optional": true,
     "type": "string"
    },
    {
     "name": "recordingDate",
     "optional": true,
     "type": "string"
    },
    {
     "name": "durationSec",
     "optional": true,
     "type": "number"
    },
    {
     "name": "stage",
     "optional": false,
     "type": "EpisodeStage"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string; updatedAt: string"
    }
   ]
  },
  {
   "name": "Transcript",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; episodeId: string"
    },
    {
     "name": "language",
     "optional": false,
     "type": "'ar' | 'en' | 'mixed'"
    },
    {
     "name": "sourceKind",
     "optional": false,
     "type": "'pasted' | 'transcript-source' | 'file-import'"
    },
    {
     "name": "format",
     "optional": false,
     "type": "'timestamped-plain' | 'srt' | 'vtt' | 'untimed-plain'"
    },
    {
     "name": "segmentCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "durationSec",
     "optional": true,
     "type": "number"
    },
    {
     "name": "revision",
     "optional": false,
     "type": "number"
    },
    {
     "name": "importedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "TranscriptSegment",
   "fields": [
    {
     "name": "index",
     "optional": false,
     "type": "number"
    },
    {
     "name": "startMs",
     "optional": true,
     "type": "number; endMs?: number"
    },
    {
     "name": "text",
     "optional": false,
     "type": "string"
    },
    {
     "name": "speaker",
     "optional": true,
     "type": "string"
    },
    {
     "name": "needsReview",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "edited",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "Chapter",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; episodeId: string"
    },
    {
     "name": "startSegmentIndex",
     "optional": false,
     "type": "number"
    },
    {
     "name": "endSegmentIndex",
     "optional": false,
     "type": "number"
    },
    {
     "name": "startMs",
     "optional": true,
     "type": "number; endMs?: number"
    },
    {
     "name": "title",
     "optional": false,
     "type": "LocaleContent"
    },
    {
     "name": "summaryHint",
     "optional": true,
     "type": "LocaleContent"
    },
    {
     "name": "origin",
     "optional": false,
     "type": "'manual' | 'assist'"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string; updatedAt: string"
    }
   ]
  },
  {
   "name": "ChapterSuggestion",
   "fields": [
    {
     "name": "startSegmentIndex",
     "optional": false,
     "type": "number; endSegmentIndex: number"
    },
    {
     "name": "title",
     "optional": false,
     "type": "LocaleContent"
    },
    {
     "name": "rationale",
     "optional": false,
     "type": "string"
    },
    {
     "name": "confidence",
     "optional": false,
     "type": "'high' | 'medium' | 'low'"
    }
   ]
  },
  {
   "name": "NotesLink",
   "fields": [
    {
     "name": "url",
     "optional": false,
     "type": "string; label: LocaleContent; }"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "NotesSectionKind"
    },
    {
     "name": "ar",
     "optional": true,
     "type": "string"
    },
    {
     "name": "en",
     "optional": true,
     "type": "string"
    },
    {
     "name": "takeaways",
     "optional": true,
     "type": "{ ar?: string[]; en?: string[] }"
    },
    {
     "name": "links",
     "optional": true,
     "type": "NotesLink[]"
    },
    {
     "name": "chapterListGenerated",
     "optional": true,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "ShowNotes",
   "fields": [
    {
     "name": "episodeId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "sections",
     "optional": false,
     "type": "NotesSection[]"
    },
    {
     "name": "shipSingleLocale",
     "optional": true,
     "type": "('ar' | 'en')[]"
    },
    {
     "name": "revision",
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
   "name": "ExportArtifact",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; packageId: string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'chapters-namespace-json' | 'chapters-plain-timestamps' | 'show-notes-md' | 'show-notes-txt' | 'episode-metadata' | 'bundle-zip'"
    },
    {
     "name": "url",
     "optional": false,
     "type": "string"
    },
    {
     "name": "expiresAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "DeliveryReceipt",
   "fields": [
    {
     "name": "channelCredentialId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "deliveredAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "receiptRef",
     "optional": false,
     "type": "string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'delivered' | 'failed'"
    },
    {
     "name": "detail",
     "optional": true,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "Board first-run (no episodes, no shows)",
   "\"Your episode studio is ready. Import one transcript to get chapters and bilingual notes — or try it on a sample episode.\"",
   "\"استوديو الحلقات جاهز. استورد تفريغاً واحداً لتحصل على فصول وملاحظات بلغتين — أو جرّب حلقة عيّنة.\"",
   "Import transcript / Try sample episode",
   "Board first-run (new show, no episodes)"
  ],
  "loading": [
   "Board boot",
   "(skeleton columns ×5) + \"Loading your episodes…\" (SR)",
   "(أعمدة هيكلية ×5) + \"جارٍ تحميل حلقاتك…\"",
   "Workbench boot (staged)",
   "shell → zones → segments; SR: \"Opening «{title}»\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (unparseable transcript)",
   "\"Couldn't parse the transcript — line 41 has an incomplete timestamp. Fix it and paste again.\"",
   "\"تعذّر تحليل التفريغ — السطر 41 يحمل طابعاً زمنياً غير مكتمل. صحّحه والصق من جديد.\"",
   "VALIDATION (chapter range)"
  ],
  "success": [
   "Transcript landed",
   "\"Transcript landed — 912 segments, srt format, 58:14 long.\"",
   "\"وصل التفريغ — 912 مقطعاً، بصيغة srt، ومدته 58:14.\"",
   "Chapter marked",
   "\"New chapter at segment 118 — title it in both locales.\""
  ]
 },
 "briefLine": "The product is deliberately not an editor. Audio never passes through the adapter: an optional local audio reference (a file on the podcaster's own machine, never uploaded) plays back in the workbench purely so the human can verify chapter boundaries by ear. There is no waveform surgery, no cut/trim/normalize, no hosting, no RSS generation, no analytics (LOOP-10, binding). What it removes from the podcaster's evening is the unglamorous publishing layer — the timestamps hunt, the second-language notes draft, the \"did I title every chapter in both languages?\" scan — which category research shows is exactly where solo producers lose hours (01)."
} as const;
export type Spec = typeof SPEC;
