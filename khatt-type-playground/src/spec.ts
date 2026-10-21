// GENERATED from specs-source/khatt-type-playground/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "khatt-type-playground",
 "title": "Khatt Type Playground",
 "family": "content_tools",
 "tier": 3,
 "flagship": false,
 "adapter": "KhattPlaygroundAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Qalam Graphite",
  "pairing": "P09",
  "radius": "4px",
  "elevation": "flat-line",
  "icon": "line-1.5",
  "motion": "minimal",
  "fonts": [
   "Reem Kufi",
   "Fraunces"
  ],
  "primary": "#4A463D",
  "accent": "#C7A24B",
  "canvas": "#8A6F2B"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Catalog",
   "purpose": "browsing, filters, upload entry",
   "shell": "",
   "data": "listFontProfiles, uploadFontFile",
   "archetype": "wizard-flow"
  },
  {
   "id": "S2",
   "name": "Font detail + glyph grid",
   "purpose": "capability model, glyphs, notes, preview",
   "shell": "Font detail + glyph grid",
   "data": "getFontProfile, listGlyphs, getGlyph, listPairingNotes, getFontFile",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Session bench (canvas)",
   "purpose": "pairing workbench: blocks + controls column",
   "shell": "",
   "data": "createPairingSession, getPairingSession, updatePairingSession, getFontFile",
   "archetype": "editor-studio"
  },
  {
   "id": "S4",
   "name": "Kashida & alternates lab",
   "purpose": "panel mode on S3's justified block",
   "shell": "",
   "data": "setKashidaSettings, setAlternateSelection, getFontProfile",
   "archetype": "list-console"
  },
  {
   "id": "S5",
   "name": "Specimen composer",
   "purpose": "block editing, numeral proof, versions",
   "shell": "",
   "data": "createSpecimen, updateSpecimen, getSpecimen",
   "archetype": "editor-studio"
  },
  {
   "id": "S6",
   "name": "Specimens library + share view",
   "purpose": "list + read-only committee view",
   "shell": "",
   "data": "listSpecimens, getSpecimen",
   "archetype": "settings-admin"
  },
  {
   "id": "S7",
   "name": "Exports (jobs)",
   "purpose": "job states, artifacts, renewal, usage",
   "shell": "",
   "data": "exportSpecimen, listJobs, cancelJob, getArtifact, renewArtifact, getUsage",
   "archetype": "jobs-centre"
  },
  {
   "id": "S8",
   "name": "Settings",
   "purpose": "locale, numeral default, defaults, usage",
   "shell": "",
   "data": "getSession, getUsage",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Catalog exploration & glyph inspection (value proof)",
   "steps": [
    "Boot: getSession resolves seat + locale; catalog rail opens (listFontProfiles; script chips All · Arabic · Latin).",
    "Preview renders from the font file (getFontFile: weight + subset; progressive, metric-matched fallback)."
   ]
  },
  {
   "title": "CP-2 — Pairing session setup & bench work (daily loop)",
   "steps": [
    "New session → pick Arabic + Latin font; createPairingSession; canvas opens two-script blocks at a default shared scale.",
    "Controls: weight per script, optical size, base size + ratio, leading, tracking (Latin-only; states why Arabic tracking is structurally zero), numeral toggle.",
    "Commits via updatePairingSession (patch + baseRevision); P10 autosave cycle; stale → CONFLICT, both versions shown (never silent overwrite).",
    "Swap/replace a font; blocks re-render from new getFontFile resolution, scale preserved.",
    "List (listPairingSessions) + resume (getPairingSession); comparator pins a second session A/B with settings diff."
   ]
  },
  {
   "title": "CP-3 — Kashida & contextual alternates lab (unique feature)",
   "steps": [
    "Same line pinned at two settings with a text description of what changed (joins, stretch points) for screen readers.",
    "Provenance: pairing notes may cite foundry guidance on justification behavior; source labels shown (curated data, non-generated — AI stance honored)."
   ]
  },
  {
   "title": "CP-4 — Specimen composition & numeral proof",
   "steps": [
    "\"Compose specimen\" → createSpecimen with default blocks (pair-headline, body ×2, numeral-run, mixed-line, feature-notes).",
    "Numeral-run block renders Western + Arabic-Indic (٠–٩) side by side as content; chrome numerals follow AR-indic default (05).",
    "Save/version: updateSpecimen (blocks + baseRevision; CONFLICT ladder); draft → final is an explicit promotion naming what finalizes.",
    "Library (listSpecimens) + read view (getSpecimen) — settings panel prints weights, scale, kashida mode, alternates on the artifact (committee input)."
   ]
  },
  {
   "title": "CP-5 — Export, share & job handling",
   "steps": [
    "Job surface (listJobs): state, progress in units, cancel within one interaction (cancelJob); completion delivers in-context with artifact link + expiry.",
    "Artifact retrieval (getArtifact: URL + expiresAt); expired → NOT_FOUND + renewArtifact (declared retention path).",
    "Share view: read-only specimen with settings provenance for reviewers; no tool-knowledge required.",
    "Usage (getUsage): honest counters (P14); no paywall mid-bench."
   ]
  }
 ],
 "components": [
  {
   "name": "TypeCanvas",
   "purpose": "hero: two-script specimen blocks under a controls column; persists across rail modes (04)",
   "obligations": "Blocks are a reading-order list; per-block direction with bidi isolation on mixed lines; loading = metric-matched fallback + per-font notice; font-file failure = typed retry state, never blank"
  },
  {
   "name": "GlyphGrid",
   "purpose": "paginated Unicode-block glyph grid (S2)",
   "obligations": "P18 grid navigation (arrows, Home/End, range); row-count announced on region entry (P19); selection flagged with codepoint + name in text (never color-only); virtualized beyond ~200 cells"
  },
  {
   "name": "GlyphInspector",
   "purpose": "single glyph: codepoint, name, joining forms, alternates, components",
   "obligations": "Forms labeled in Arabic + Latin; codepoint in mono LTR-isolated; alternates as feature chips; keyboard-reachable from grid"
  },
  {
   "name": "PairingComparator",
   "purpose": "A/B of two loaded sessions on one canvas (CP-2.5)",
   "obligations": "Settings diff as DiffView rows (values, not prose); both revisions displayed; swap-sides action uses logical properties"
  },
  {
   "name": "KashidaControls",
   "purpose": "mode segmented control (Off · Tatweel · jalt) + intensity slider + word-spacing floor (CP-3)",
   "obligations": "Slider drag has click + arrow-key equivalents (2.5.7); value announced politely (\"كثافة الكشيدة ٤٠٪\"); unsupported modes disabled *with reason text* citing the font's capability list; per-line stretch readout is a live table"
  },
  {
   "name": "AlternateToggles",
   "purpose": "per-script feature panel (calt, liga, dlig, ss01…, jalt, kern, mark)",
   "obligations": "Feature codes in mono with explanation tooltip (content authored once per key — terminology discipline); unavailable features disabled + reason; toggle state text-duplicated (on/off, not color)"
  },
  {
   "name": "SpecimenComposer",
   "purpose": "block editor (CP-4): reorder, per-block overrides, numeral proof",
   "obligations": "Reorder drag has keyboard equivalent (P18); validation messages field-linked; draft autosave (P10); \"final\" promotion confirm names what finalizes (P04 level 2)"
  }
 ],
 "ops": [
  "getSession",
  "listFontProfiles",
  "getFontProfile",
  "getFontFile",
  "listGlyphs",
  "getGlyph",
  "listPairingNotes",
  "uploadFontFile",
  "createPairingSession",
  "listPairingSessions",
  "getPairingSession",
  "updatePairingSession",
  "setKashidaSettings",
  "setAlternateSelection",
  "createSpecimen",
  "listSpecimens",
  "getSpecimen",
  "updateSpecimen",
  "exportSpecimen",
  "getArtifact",
  "renewArtifact",
  "listJobs",
  "cancelJob",
  "getUsage"
 ],
 "entities": [
  {
   "name": "OpenTypeFeatureInfo",
   "fields": [
    {
     "name": "key",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": false,
     "type": "string; nameAr: string"
    },
    {
     "name": "script",
     "optional": false,
     "type": "Script | 'both'"
    },
    {
     "name": "descriptionEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "descriptionAr",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "WeightInfo",
   "fields": [
    {
     "name": "weight",
     "optional": false,
     "type": "number; styles: ('regular'|'italic')[] }"
    },
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "familyName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "origin",
     "optional": false,
     "type": "'catalog' | 'user-uploaded'"
    },
    {
     "name": "scripts",
     "optional": false,
     "type": "Script[]"
    },
    {
     "name": "category",
     "optional": false,
     "type": "FontCategory"
    },
    {
     "name": "weights",
     "optional": false,
     "type": "WeightInfo[]"
    },
    {
     "name": "variableAxes",
     "optional": true,
     "type": "VariableAxisInfo[]"
    },
    {
     "name": "openTypeFeatures",
     "optional": false,
     "type": "OpenTypeFeatureInfo[]"
    },
    {
     "name": "kashidaSupport",
     "optional": false,
     "type": "KashidaSupport"
    },
    {
     "name": "numeralsSupported",
     "optional": false,
     "type": "('western' | 'arabic-indic')[]"
    },
    {
     "name": "coverage",
     "optional": false,
     "type": "{ block: string; glyphCount: number }[]"
    }
   ]
  },
  {
   "name": "GlyphSummary",
   "fields": [
    {
     "name": "glyphId",
     "optional": false,
     "type": "string; codepointHex: string; name: string; block: string }"
    },
    {
     "name": "joiningForms",
     "optional": true,
     "type": "{ isolated: string; initial?: string; medial?: string; final?: string }"
    },
    {
     "name": "alternates",
     "optional": false,
     "type": "{ featureKey: string; glyphId: string; note?: string }[]"
    },
    {
     "name": "components",
     "optional": true,
     "type": "string[]"
    },
    {
     "name": "unicodeName",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "CuratedPairingNote",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; arabicFontId: string; latinFontId: string"
    },
    {
     "name": "noteEn",
     "optional": false,
     "type": "string; noteAr: string"
    },
    {
     "name": "source",
     "optional": false,
     "type": "'foundry' | 'curator'"
    },
    {
     "name": "sourceLabel",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "AlternateSelection",
   "fields": [
    {
     "name": "fontRole",
     "optional": false,
     "type": "'arabic' | 'latin'; featureKey: string; enabled: boolean }"
    },
    {
     "name": "baseSizePx",
     "optional": false,
     "type": "number"
    },
    {
     "name": "scaleRatio",
     "optional": false,
     "type": "number"
    },
    {
     "name": "leadingAr",
     "optional": false,
     "type": "number"
    },
    {
     "name": "leadingLatin",
     "optional": false,
     "type": "number"
    },
    {
     "name": "trackingLatinEm",
     "optional": false,
     "type": "number"
    },
    {
     "name": "numerals",
     "optional": false,
     "type": "'arabic-indic' | 'western'"
    },
    {
     "name": "tashkeelOn",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "PairingSession",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; title: string"
    },
    {
     "name": "arabicFont",
     "optional": false,
     "type": "{ fontId: string; weight: number; opticalSize?: number }"
    },
    {
     "name": "latinFont",
     "optional": false,
     "type": "{ fontId: string; weight: number; opticalSize?: number }"
    },
    {
     "name": "typography",
     "optional": false,
     "type": "TypographySettings"
    },
    {
     "name": "kashida",
     "optional": false,
     "type": "KashidaSettings"
    },
    {
     "name": "alternates",
     "optional": false,
     "type": "AlternateSelection[]"
    },
    {
     "name": "pinnedRevision",
     "optional": false,
     "type": "number"
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
   "name": "SpecimenBlock",
   "fields": [
    {
     "name": "kind",
     "optional": false,
     "type": "SpecimenBlockKind"
    },
    {
     "name": "textAr",
     "optional": true,
     "type": "string; textLatin?: string"
    },
    {
     "name": "overrides",
     "optional": true,
     "type": "{ sizeStep?: number; weight?: number; align?: 'start' | 'justify' }"
    }
   ]
  },
  {
   "name": "Specimen",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; sessionId: string; sessionRevision: number"
    },
    {
     "name": "title",
     "optional": false,
     "type": "string; blocks: SpecimenBlock[]"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'draft' | 'final'"
    },
    {
     "name": "revision",
     "optional": false,
     "type": "number; updatedAt: string"
    }
   ]
  },
  {
   "name": "ExportOptions",
   "fields": [
    {
     "name": "includeSettingsPanel",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "numerals",
     "optional": false,
     "type": "'arabic-indic' | 'western'"
    }
   ]
  },
  {
   "name": "ExportArtifact",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; jobId: string; specimenId: string; format: ExportFormat; expiresAt: string; regenerable: boolean }"
    },
    {
     "name": "id",
     "optional": false,
     "type": "string; kind: 'render-export'"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'queued'|'running'|'awaiting-input'|'succeeded'|'failed'|'cancelled'|'expired'"
    },
    {
     "name": "progress",
     "optional": false,
     "type": "{ determinate: boolean; done?: number; total?: number }"
    },
    {
     "name": "partialBlockIndexes",
     "optional": true,
     "type": "number[]"
    },
    {
     "name": "error",
     "optional": true,
     "type": "{ code: ErrorCode; message: string; correlationId: string }"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "Catalog first-run",
   "\"The bench is open. Pick an Arabic family and a Latin one — or start from the seeded pairing.\"",
   "\"مِنضدة العمل مفتوحة. اختر عائلة عربية وأخرى لاتينية — أو ابدأ من الاقتران المهيّأ.\"",
   "Open seeded pairing / Browse fonts",
   "Catalog filtered-empty"
  ],
  "loading": [
   "Entity & operation",
   "Catalog page",
   "(card skeletons ×12) + \"Loading families…\" (SR)",
   "(هياكل بطاقات ×١٢) + \"جارٍ تحميل العائلات…\"",
   "Font file (canvas hydration)"
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (upload attestation)",
   "\"Upload needs the license attestation — confirm you hold a license for this family, then retry.\"",
   "\"يتطلب الرفع إقرار الترخيص — أكّد حيازتك ترخيصاً لهذه العائلة ثم أعد المحاولة.\"",
   "VALIDATION (font parse failure)"
  ],
  "success": [
   "Session saved (P10 cycle)",
   "\"Saving…\" → \"Saved\" (fades)",
   "\"جارٍ الحفظ…\" → \"حُفظ\"",
   "Seeded pairing opened",
   "\"Amiri with Source Serif 4 — kashida at 40%, 6 blocks ready. Change anything; it's all yours.\""
  ]
 },
 "briefLine": "Its depth is Arabic-specific. Specimen blocks expose OpenType features per font — contextual alternates (calt), ligatures, stylistic sets, justification alternates (jalt) — with an honest capability model: a font without jalt shows that control disabled with an explanation, never faked. A dedicated kashida surface lets designers stretch justified Arabic via tatweel density or justification alternates and immediately see where word shapes break — the documented pain (01) no mainstream web tool exposes interactively."
} as const;
export type Spec = typeof SPEC;
