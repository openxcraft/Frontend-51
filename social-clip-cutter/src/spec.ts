// GENERATED from specs-source/social-clip-cutter/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "social-clip-cutter",
 "title": "Social Clip Cutter",
 "family": "content_tools",
 "tier": 2,
 "flagship": false,
 "adapter": "SocialClipCutterAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Qutta Neon",
  "pairing": "P11",
  "radius": "14px",
  "elevation": "layered-depth",
  "icon": "duotone",
  "motion": "energetic",
  "fonts": [
   "Changa",
   "Archivo"
  ],
  "primary": "#AE6DEE",
  "accent": "#733EA4",
  "canvas": "#5A2D83"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Episodes board",
   "purpose": "stage-column view of episode sources; quick-add; first-run value checklist (P22)",
   "shell": "",
   "data": "listEpisodeSources, createEpisodeSource, getEpisodeSource, deleteEpisodeSource, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Clip workbench",
   "purpose": "the product's spine: transcript pane + clip rail + preview stage (CP-1/2/3)",
   "shell": "Clip workbench",
   "data": "getEpisodeSource, updateEpisodeSource, importTranscript, getTranscript, listSegments, updateSegment, searchSegments, findHighlights, createClip, listClips, getClip, updateClip, deleteClip, getJob, cancelJob",
   "archetype": "review-queue"
  },
  {
   "id": "S3",
   "name": "Highlight review panel",
   "purpose": "in-workbench reserved region: candidates with scores + rationale, accept/adjust/dismiss (CP-2.2–3)",
   "shell": "Highlight review panel",
   "data": "findHighlights, createClip, listClips",
   "archetype": "review-queue"
  },
  {
   "id": "S4",
   "name": "Boundary editor mode",
   "purpose": "focused clip refinement: handles, offsets, live lint (CP-3)",
   "shell": "",
   "data": "getClip, updateClip, deleteClip, listClips",
   "archetype": "editor-studio"
  },
  {
   "id": "S5",
   "name": "Burn-in studio mode",
   "purpose": "caption style picker + spec composer + dual-direction preview + warnings (CP-4)",
   "shell": "Burn-in studio mode",
   "data": "listCaptionStyles, setClipBurnInSpec, getClip, saveCaptionStyle",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Export composer",
   "purpose": "batch selection, options, quota context, queue + recipe path (CP-5.1–2)",
   "shell": "",
   "data": "listClips, getUsage, exportClips, getJob",
   "archetype": "editor-studio"
  },
  {
   "id": "S7",
   "name": "Jobs center",
   "purpose": "filterable job list, per-clip progress, cancel/retry, activity link (CP-5.3)",
   "shell": "",
   "data": "listJobs, getJob, cancelJob, listActivity",
   "archetype": "jobs-centre"
  },
  {
   "id": "S8",
   "name": "Exports / artifacts library",
   "purpose": "per-clip outputs, sidecar files, manifest, expiry + renewal (CP-5.4)",
   "shell": "",
   "data": "listJobs, getArtifact, renewArtifact, getUsage",
   "archetype": "jobs-centre"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "workspace defaults (duration bands, reading-speed presets, house style), credentials (media source / notification channel), activity log (CP-1.6, CP-5.7)",
   "shell": "",
   "data": "getSession, getUsage, listCaptionStyles, saveCaptionStyle, listCredentials, saveCredential, verifyCredential, revokeCredential, listActivity",
   "archetype": "review-queue"
  }
 ],
 "flows": [
  {
   "title": "CP-3 — Clip boundary refinement",
   "steps": [
    "Delete: deleteClip returns the snapshot for the 7s undo re-create (P03); the clip rail reconciles via listClips.",
    "*Failures: CONFLICT (two seats refining the same clip); VALIDATION (range/offset); NETWORK mid-save → offline-queued copy (11 §C).",
    "*Recovery: clip revisions retained; conflicts always offer a choice; undo windows throughout."
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "Offline (P20): board/library reads; boundary and spec edits queue locally with per-item state and baseVersion; jobs reconcile on reconnect.",
    "No-access (P01): workspace scoping copy — never \"empty\".",
    "Transcript source unreachable: NETWORK with the paste path inline (CP-1.6 degraded state names the credential + failure date — credential-contract §3)."
   ]
  }
 ],
 "components": [
  {
   "name": "HighlightCard",
   "purpose": "one heuristic candidate: range, duration, score breakdown, rationale",
   "obligations": "Scores are icon+text breakdowns (keyword density, pause support, hook pattern) — never a bare number chip; rationale is real content read in order; accept = explicit keypress (A) → the human promotion; adjust opens the boundary stepper first; dismiss with 7s undo (P03); cards settle in place (never spin in — motion-language §2); region reserved pre-arrival (CLS ≤0.02); zero-candidates state is an honest empty with threshold copy, not a fake loading"
  },
  {
   "name": "CaptionStyleCard",
   "purpose": "style picker entry with on-clip preview",
   "obligations": "Previews render on the CLIP'S OWN caption text (real Arabic strings); family/weight pairs come from the Arabic-safe catalog's REAL sets (07a) — no synthetic bold offered; stroke/shadow/background treatments render at spec scale; workspace styles carry version badges; duplicating a stock style starts a workspace draft (CP-4.5)"
  },
  {
   "name": "ClipRail",
   "purpose": "the episode's clips with state chips + bulk select",
   "obligations": "State chips icon+text: no-spec-yet / warnings-pending / export-ready / exported-versions-exist; P07 bulk selection from row checkboxes with the floating action bar naming the count; the clip-ready pop fires ONCE on creation (the Tier-2 signature moment — 05), never on updates; row focus announces title + duration + spec state; reorder is NOT offered (clips order by creation; no library-management scope — LOOP-10)"
  }
 ],
 "ops": [
  "getSession",
  "getUsage",
  "listEpisodeSources",
  "createEpisodeSource",
  "getEpisodeSource",
  "updateEpisodeSource",
  "deleteEpisodeSource",
  "importTranscript",
  "getTranscript",
  "listSegments",
  "updateSegment",
  "searchSegments",
  "findHighlights",
  "createClip",
  "listClips",
  "getClip",
  "updateClip",
  "deleteClip",
  "setClipBurnInSpec",
  "listCaptionStyles",
  "saveCaptionStyle",
  "exportClips",
  "listJobs",
  "getJob",
  "cancelJob",
  "getArtifact",
  "renewArtifact",
  "listCredentials",
  "saveCredential",
  "verifyCredential",
  "revokeCredential",
  "listActivity"
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
     "name": "kind",
     "optional": false,
     "type": "'local-file' | 'external-locator'"
    },
    {
     "name": "label",
     "optional": false,
     "type": "string"
    },
    {
     "name": "locator",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "EpisodeSource",
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
     "name": "title",
     "optional": false,
     "type": "LocaleContent"
    },
    {
     "name": "language",
     "optional": false,
     "type": "EpisodeLanguage"
    },
    {
     "name": "mediaRef",
     "optional": true,
     "type": "MediaRef"
    },
    {
     "name": "plannedDurationSec",
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
     "type": "string; episodeSourceId: string"
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
   "name": "HighlightCandidate",
   "fields": [
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
     "name": "durationSec",
     "optional": true,
     "type": "number"
    },
    {
     "name": "scores",
     "optional": false,
     "type": "{"
    },
    {
     "name": "keywordDensity",
     "optional": false,
     "type": "number"
    },
    {
     "name": "pauseSupport",
     "optional": false,
     "type": "number"
    },
    {
     "name": "hookPattern",
     "optional": false,
     "type": "number"
    },
    {
     "name": "rationale",
     "optional": false,
     "type": "string"
    },
    {
     "name": "matchedKeywords",
     "optional": true,
     "type": "string[]"
    }
   ]
  },
  {
   "name": "ClipBoundary",
   "fields": [
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
     "name": "startOffsetMs",
     "optional": false,
     "type": "number"
    },
    {
     "name": "endOffsetMs",
     "optional": false,
     "type": "number"
    },
    {
     "name": "startMs",
     "optional": true,
     "type": "number; endMs?: number"
    }
   ]
  },
  {
   "name": "ClipSelection",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; episodeSourceId: string"
    },
    {
     "name": "boundary",
     "optional": false,
     "type": "ClipBoundary"
    },
    {
     "name": "title",
     "optional": false,
     "type": "LocaleContent"
    },
    {
     "name": "origin",
     "optional": false,
     "type": "'manual' | 'highlight'"
    },
    {
     "name": "highlightRef",
     "optional": true,
     "type": "{"
    },
    {
     "name": "rationale",
     "optional": false,
     "type": "string; scores: HighlightCandidate['scores']"
    },
    {
     "name": "burnInSpec",
     "optional": true,
     "type": "BurnInSpec"
    },
    {
     "name": "specWarnings",
     "optional": false,
     "type": "BurnInWarning[]"
    },
    {
     "name": "revision",
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
   "name": "CaptionStyle",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "scope",
     "optional": false,
     "type": "'stock' | 'workspace'"
    },
    {
     "name": "name",
     "optional": false,
     "type": "LocaleContent"
    },
    {
     "name": "family",
     "optional": false,
     "type": "{"
    },
    {
     "name": "arabic",
     "optional": false,
     "type": "string"
    },
    {
     "name": "latin",
     "optional": false,
     "type": "string"
    },
    {
     "name": "weights",
     "optional": false,
     "type": "number[]"
    },
    {
     "name": "sizeScale",
     "optional": false,
     "type": "{ basePx: number; minPx: number; maxPx: number }"
    },
    {
     "name": "stroke",
     "optional": false,
     "type": "{ color: string; widthPx: number } | null"
    },
    {
     "name": "shadow",
     "optional": false,
     "type": "{ color: string; blurPx: number; offsetYPx: number } | null"
    },
    {
     "name": "background",
     "optional": false,
     "type": "{ kind: 'none' | 'band' | 'box'; color: string; opacity: number }"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "BurnInSpec",
   "fields": [
    {
     "name": "captionStyleId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "placement",
     "optional": false,
     "type": "{"
    },
    {
     "name": "preset",
     "optional": false,
     "type": "SafeZonePreset"
    },
    {
     "name": "verticalPosition",
     "optional": false,
     "type": "'lower-third' | 'center' | 'upper-third'"
    },
    {
     "name": "alignment",
     "optional": false,
     "type": "'start' | 'center' | 'end'"
    },
    {
     "name": "nudgePercent",
     "optional": true,
     "type": "number"
    },
    {
     "name": "linePolicy",
     "optional": false,
     "type": "{"
    },
    {
     "name": "maxLines",
     "optional": false,
     "type": "number"
    },
    {
     "name": "maxCharsPerLineAr",
     "optional": false,
     "type": "number"
    },
    {
     "name": "maxCharsPerLineEn",
     "optional": false,
     "type": "number"
    },
    {
     "name": "readingSpeed",
     "optional": false,
     "type": "{"
    },
    {
     "name": "charsPerSecAr",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "BurnInWarning",
   "fields": [
    {
     "name": "kind",
     "optional": false,
     "type": "BurnInWarningKind"
    },
    {
     "name": "segmentIndex",
     "optional": false,
     "type": "number"
    },
    {
     "name": "detail",
     "optional": false,
     "type": "string"
    },
    {
     "name": "fixTarget",
     "optional": false,
     "type": "'placement' | 'linePolicy' | 'readingSpeed' | 'tashkeelMode' | 'bidiPolicy'"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "Board first-run (no episode sources)",
   "\"Your clip desk is ready. Import one transcript to start cutting — or try it on a sample episode.\"",
   "\"مكتب المقاطع جاهز. استورد تفريغاً واحداً لتبدأ القصّ — أو جرّب حلقة عيّنة.\"",
   "Import transcript / Try sample episode",
   "Board first-run (sample loaded)"
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
   "VALIDATION (clip segment range)"
  ],
  "success": [
   "Transcript landed",
   "\"Transcript landed — 912 segments, srt format, 58:14 long.\"",
   "\"وصل التفريغ — 912 مقطعاً، بصيغة srt، ومدته 58:14.\"",
   "Clip created (signature pop)",
   "\"Clip cut — 42 seconds at segment 118. Next: its burn-in spec.\""
  ]
 },
 "briefLine": "Captions are the second half of the job, and Arabic is where category tools fail: mainstream editors and players break RTL subtitle text (reversed runs, clipped glyphs, migrating punctuation — documented across NLE and player communities, 01), while AI clip tools emit machine captions tuned for Latin scripts. social-clip-cutter ships Arabic-safe caption burn-in specs: caption styles drawn from an Arabic-safe font catalog (real weight sets, no synthetic bold), RTL line-breaking that never splits joined words, bidi isolation for mixed-direction runs (a Latin product name inside an Arabic caption renders correctly, never reordered), punctuation mirroring, tashkeel-aware line-height, reading-speed gates, and per-platform safe-zone placement (9:16 TikTok/Shorts/Reels-class, with platform UI overlays kept clear). The export runs as an asynchronous render job with per-clip progress and partial-results delivery, and every export also emits sidecar caption files (SRT/VTT) alongside the burned-in master — because burn-in works everywhere but closed captions serve accessibility better where players support them (01 evidence)."
} as const;
export type Spec = typeof SPEC;
