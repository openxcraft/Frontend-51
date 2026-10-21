# 07a — Data Contract: khatt-type-playground

SME-G pass · Backend-agnostic · TypeScript TYPES ONLY. AI declaration: **non-AI product** — no operation generates, scores, or transforms content by model; curated pairing notes are human-authored data with recorded sources.

```ts
export type ErrorCode = 'VALIDATION'|'NOT_FOUND'|'PERMISSION'|'CONFLICT'|'RATE_LIMIT'|'NETWORK'|'UNKNOWN';
export type Script = 'ar' | 'latin';
export type FontCategory = 'naskh' | 'kufi' | 'display' | 'sans' | 'serif' | 'mono' | 'other';
export type LicenseBadge = 'open-ofl' | 'open-apache' | 'commercial' | 'user-licensed';
/** Justification capability model — drives disabled-with-reason UI (honesty feature). */
export type KashidaSupport = 'jalt-and-tatweel' | 'tatweel-only' | 'none';

export interface OpenTypeFeatureInfo {
  key: string;                 // 'calt' | 'liga' | 'dlig' | 'ss01'…'ss20' | 'jalt' | 'kern' | 'mark' | 'mkmk' | 'swsh' …
  nameEn: string; nameAr: string;
  script: Script | 'both';
  descriptionEn: string;       // AlternateToggles tooltip — authored once per key
  descriptionAr: string;
}
export interface WeightInfo { weight: number; styles: ('regular'|'italic')[] }
export interface VariableAxisInfo { tag: string; min: number; max: number; default: number; nameEn: string; nameAr: string }

export interface FontProfile {
  id: string;
  familyName: string;          // real market family names are catalog CONTENT
  origin: 'catalog' | 'user-uploaded';
  scripts: Script[];
  category: FontCategory;
  weights: WeightInfo[];       // reality-respecting: 400/700 only is legal (rtl-rules §3)
  variableAxes?: VariableAxisInfo[];
  openTypeFeatures: OpenTypeFeatureInfo[];
  kashidaSupport: KashidaSupport;
  numeralsSupported: ('western' | 'arabic-indic')[];
  coverage: { block: string; glyphCount: number }[];   // Unicode blocks for GlyphGrid
  license: LicenseBadge;
  foundryRef?: { name: string; externalUrl?: string }; // display-only referral; NO transactions (LOOP-10)
  sampleStrings: Record<Script, string[]>;
  state: 'active' | 'pending' | 'rejected';
}

export interface GlyphSummary { glyphId: string; codepointHex: string; name: string; block: string }
export interface GlyphDetail extends GlyphSummary {
  joiningForms?: { isolated: string; initial?: string; medial?: string; final?: string }; // Arabic joining
  alternates: { featureKey: string; glyphId: string; note?: string }[];
  components?: string[];
  unicodeName: string;
}

export interface CuratedPairingNote {
  id: string; arabicFontId: string; latinFontId: string;
  noteEn: string; noteAr: string;
  source: 'foundry' | 'curator';
  sourceLabel: string;         // provenance printed on share views (02 Mariam)
}

export type KashidaMode = 'off' | 'tatweel' | 'jalt';
export interface KashidaSettings {
  mode: KashidaMode;
  intensity: number;           // 0..1 — tatweel density / alternate level
  wordSpacingFloor: number;    // 0..0.25em — justification reserve before stretching
  perLineOverrides?: { lineIndex: number; intensity: number }[];
}

export interface AlternateSelection { fontRole: 'arabic' | 'latin'; featureKey: string; enabled: boolean }

export interface TypographySettings {
  baseSizePx: number;
  scaleRatio: number;          // modular scale for block sizes
  leadingAr: number;           // clamped ≥1.6 (≥1.8 tashkeel-on) — clamps stated, not errors
  leadingLatin: number;
  trackingLatinEm: number;     // Arabic tracking is structurally 0 — no field exists
  numerals: 'arabic-indic' | 'western';  // display policy; storage canonical
  tashkeelOn: boolean;
}

export interface PairingSession {
  id: string; title: string;
  arabicFont: { fontId: string; weight: number; opticalSize?: number };
  latinFont: { fontId: string; weight: number; opticalSize?: number };
  typography: TypographySettings;
  kashida: KashidaSettings;
  alternates: AlternateSelection[];
  pinnedRevision: number;      // specimen pins a session revision (provenance)
  revision: number;            // optimistic concurrency
  createdAt: string; updatedAt: string;
}

export type SpecimenBlockKind =
  | 'pair-headline'      // AR + EN headline pair at scale
  | 'body-paragraph'     // reading conditions, per-script direction
  | 'glyph-run'          // joined/run sequence showcase
  | 'numeral-run'        // Western + Arabic-Indic side by side (content-level proof)
  | 'mixed-line'         // bidi isolation demonstration
  | 'kashida-demo'       // justified block under KashidaSettings
  | 'feature-notes';     // printed alternate/feature notes (provenance)

export interface SpecimenBlock {
  kind: SpecimenBlockKind;
  textAr?: string; textLatin?: string;
  overrides?: { sizeStep?: number; weight?: number; align?: 'start' | 'justify' }; // justify reserved for kashida-demo
}

export interface Specimen {
  id: string; sessionId: string; sessionRevision: number;  // pinned — guideline honesty
  title: string; blocks: SpecimenBlock[];
  status: 'draft' | 'final';
  revision: number; updatedAt: string;
}

export type ExportFormat = 'specimen-sheet' | 'image-sheet' | 'css-tokens' | 'json-spec';
export interface ExportOptions {
  includeSettingsPanel: boolean;                       // provenance printed on artifact
  numerals: 'arabic-indic' | 'western';                // css/json force 'western' in code containers
}
export interface ExportArtifact { id: string; jobId: string; specimenId: string; format: ExportFormat; expiresAt: string; regenerable: boolean }

export interface JobEntity {
  id: string; kind: 'render-export';
  state: 'queued'|'running'|'awaiting-input'|'succeeded'|'failed'|'cancelled'|'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partialBlockIndexes?: number[];   // partial-results policy (async-contract §4)
  error?: { code: ErrorCode; message: string; correlationId: string };
}

export interface ActivityEntry {
  id: string; actor: string;
  action: 'session-created'|'session-updated'|'specimen-saved'|'specimen-finalized'|'export-requested'|'font-uploaded';
  target: string; timestamp: string;
}
```

## Relationships

FontProfile 1—N GlyphSummary (paged by block); PairingSession N—2 FontProfile (role-bound); CuratedPairingNote joins two FontProfiles; PairingSession 1—N Specimen (pins session revision); Specimen 1—N ExportArtifact (via Job); Job 1—N ExportArtifact; ActivityEntry references all.

## State obligations

- Capability honesty: `kashidaSupport` + `openTypeFeatures` drive disabled-with-reason UI; controls never fake unsupported features.
- Clamps (leading floors, weight reality) are stated responses — `updatePairingSession` returns applied values, never silent mutations.
- Numeral policy is display-only: `numerals` never affects stored text or export parsing (rtl-rules §3).
- Sessions/specimens use revision-based optimistic concurrency (CONFLICT carries both versions — 07b rule 4).
- `foundryRef` is display-only referral data — no transactions ever (LOOP-10).
- Uploaded fonts carry attestation provenance in ActivityEntry (P17) and license badge `user-licensed`.
