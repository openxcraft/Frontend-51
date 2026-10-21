// GENERATED from specs-source/caption-lab/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "caption-lab",
 "title": "Caption Lab",
 "family": "content_tools",
 "tier": 2,
 "flagship": false,
 "adapter": "CaptionLabAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Sinema Cyan",
  "pairing": "P02",
  "radius": "4px",
  "elevation": "ink-press",
  "icon": "outline-geometric",
  "motion": "crisp",
  "fonts": [
   "Noto Kufi Arabic",
   "Space Grotesk"
  ],
  "primary": "#62B8D6",
  "accent": "#171A22",
  "canvas": "#E4C25A"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Projects home",
   "purpose": "project list, onboarding checklist",
   "shell": "",
   "data": "listProjects",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Import wizard",
   "purpose": "media + transcript input, alignment job",
   "shell": "",
   "data": "createProject, alignTranscript(Job)",
   "archetype": "wizard-flow"
  },
  {
   "id": "S3",
   "name": "Caption grid",
   "purpose": "the refinement workspace (CP-2)",
   "shell": "",
   "data": "listCues(query), updateCue, bulkApply",
   "archetype": "editor-studio"
  },
  {
   "id": "S4",
   "name": "Cue inspector",
   "purpose": "text edit, line-break workbench, timing nudge",
   "shell": "",
   "data": "getCue, suggestBreaks, updateCue",
   "archetype": "list-console"
  },
  {
   "id": "S5",
   "name": "Style studio",
   "purpose": "preset editor + live preview + legibility linter",
   "shell": "Style studio",
   "data": "getPresets, savePreset, previewFrame(Job)",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Export queue",
   "purpose": "format jobs, artifacts",
   "shell": "",
   "data": "exportProject(Job), getArtifact",
   "archetype": "wizard-flow"
  },
  {
   "id": "S7",
   "name": "Jobs center",
   "purpose": "alignment/preview/export jobs",
   "shell": "Jobs center",
   "data": "listJobs",
   "archetype": "review-queue"
  },
  {
   "id": "S8",
   "name": "Presets library",
   "purpose": "shared presets, versions",
   "shell": "",
   "data": "listPresets",
   "archetype": "settings-admin"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "numeral/tashkeel policies, audience presets",
   "shell": "",
   "data": "workspace ops",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Import to first refined captions (value proof)",
   "steps": [
    "Alignment pass: transcript cues map to a timeline (Job; existing timecodes honored, untimecoded text gets auto-cue proposal marked \"proposed — verify\").",
    "Baseline caption grid renders — project shell + policies via getProject, cue rows via listCues: timecodes, text, duration, reading-speed meter.",
    "Project autosaves (P10); onboarding checklist marks \"first project refined\".",
    "*Failures: alignment job failure (typed error, retry); unsupported transcript format (VALIDATION with format list).",
    "*Recovery: project state continuous; cue edits undoable (P03)."
   ]
  },
  {
   "title": "CP-2 — Refinement loop (the daily craft loop; keyboard-critical)",
   "steps": [
    "Navigate cue grid with arrows (P18).",
    "Reading-speed gate flags cues over threshold (per audience preset: e-learning 17 CPM, broadcast 20 CPM, lecture 15 CPM).",
    "Batch operations: apply numeral policy / tashkeel policy / line-break rules across selection (bulkApply Job; P07 bulk bar).",
    "*Recovery: every edit is cue-revisioned; cue history restores."
   ]
  },
  {
   "title": "CP-3 — Style studio & burn-in spec (Mariam's reproducibility)",
   "steps": [
    "Live preview over scrubber (requestPreview stills Job; uses media reference frames).",
    "Legibility linter: contrast pair check vs declared video background samples; small-size tashkeel warning; stroke weight vs weight matrix.",
    "Save preset as workspace-shared (savePreset, versioned; Huda's desk presets).",
    "Export bundle: caption files (standard formats) + burn-in spec sheet (render instructions document) + preview stills.",
    "*Failures: preview render job failure (typed error + retry); export quota (RATE_LIMIT).",
    "*Recovery: presets versioned; spec sheet regenerable from project state."
   ]
  },
  {
   "title": "CP-4 — Export queue (the delivery path)",
   "steps": [
    "Export request (exportProject): formats, preset, watermark option; Job per async-contract with per-format progress.",
    "Delivery: getArtifact links with expiry (7-day default), renewable via renewArtifact.",
    "Delivery record in activity log (who exported what, when, with which preset version).",
    "*Edges: exporting with cues still in \"proposed\" state (explicit warning, allowed with flags in the file); mixed-format bundle (one job, per-format results).",
    "*Failures: format-level failure within bundle (partial delivery + per-format retry — async-contract §4).",
    "*Recovery: exports re-generate from project state — artifacts are projections."
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "No media, transcript only (audio-less refinement): grid works without preview; style studio preview disabled with honest copy.",
    "Offline: banner P20; cue edits queue; exports require reconnect."
   ]
  }
 ],
 "components": [
  {
   "name": "CueGrid",
   "purpose": "timecode-first caption rows with duration + reading-speed meters",
   "obligations": "P18 grid keyboard model; row targets ≥24px; meters text-duplicated; virtualization >200 cues (P19)"
  },
  {
   "name": "LineBreakWorkbench",
   "purpose": "RTL-safe break suggestions preview",
   "obligations": "Preview never mutates until applied; both break options shown on rule conflict (CP-2 edge); bidi-safe rendering of mixed cues"
  },
  {
   "name": "SpeedGateMeter",
   "purpose": "reading-speed vs audience threshold",
   "obligations": "Gate = icon+text+number; settle micro-interaction per 05; reduced-motion text swap"
  },
  {
   "name": "StylePreviewScrubber",
   "purpose": "preset preview over media frames",
   "obligations": "Frame requests are jobs; scrubber keyboard-operable (arrow frame-step); preview unavailable state honest (no media)"
  },
  {
   "name": "LegibilityLinter",
   "purpose": "contrast/size/tashkeel checks on presets",
   "obligations": "Findings as advisory list; never blocks export silently — warnings carry into export flags"
  }
 ],
 "ops": [
  "getSession",
  "listProjects",
  "createProject",
  "getProject",
  "listCues",
  "updateCue",
  "nudgeTiming",
  "splitCue",
  "suggestBreaks",
  "bulkApply",
  "listPresets",
  "savePreset",
  "importPreset",
  "requestPreview",
  "exportProject",
  "getArtifact",
  "renewArtifact",
  "getUsage"
 ],
 "entities": [],
 "copy": {
  "empty": [
   "First-run (no project)",
   "\"Bring a transcript — timecoded or plain. Plain text becomes proposed cues you verify; timecodes start verified.\"",
   "\"أحضر نصاً مكتوباً — مؤقتاً أو عادياً. العادي يصبح إشاراتٍ مقترحة تتحقق منها؛ والمؤقت يبدأ مُتحقّقاً.\"",
   "New project",
   "Project empty (0 cues)"
  ],
  "loading": [
   "Alignment",
   "\"Aligning — cue {n} of {total}\"",
   "\"المحاذاة — الإشارة {n} من {total}\"",
   "Grid boot",
   "cue-row skeletons mirroring geometry"
  ],
  "error": [
   "VALIDATION (format)",
   "\"This transcript format isn't supported yet. SRT, VTT, timecoded text, or plain text work.\"",
   "\"صيغة النص غير مدعومة بعد. تعمل الصيغ: SRT وVTT والنص المؤقت والعادي.\"",
   "VALIDATION (timing)",
   "\"A cue can't end before it starts. Nudge the end marker past {time}.\""
  ],
  "success": [
   "Gate cleared",
   "\"Under the gate — 17 words per minute.\"",
   "\"تحت البوابة — ١٧ كلمة في الدقيقة.\"",
   "Alignment done",
   "\"612 cues aligned — 18 proposed, waiting for your verification.\""
  ]
 },
 "briefLine": "Video producers, education/media teams, and post-production shops in MENA delivering Arabic-subtitled content: e-learning teams, broadcasters' digital desks, agencies delivering client video, and mosques/community educators producing lecture captions. 2–20 seats."
} as const;
export type Spec = typeof SPEC;
