// VERBATIM from specs-source/khatt-type-playground/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below. Implementation corrections applied: 1 (see portfolio SPEC_DEFECTS.md; specs-source untouched).
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// All entity types (FontProfile, GlyphSummary, GlyphDetail, CuratedPairingNote, KashidaSettings,
// AlternateSelection, TypographySettings, PairingSession, SpecimenBlock, Specimen, ExportFormat,
// ExportOptions, ExportArtifact, JobEntity, ErrorCode) are defined in 07a-data-contract.md and imported.

/* ---------- Envelope, session, pagination (LOOP-15 satisfied) ---------- */

export type Result<T, E extends AdapterError = AdapterError> = { ok: true; data: T } | { ok: false; error: E }; // SPEC_DEFECTS D: two-arg form used by adapter methods

export interface AdapterError {
  code: ErrorCode;   // EXACTLY: 'VALIDATION'|'NOT_FOUND'|'PERMISSION'|'CONFLICT'|'RATE_LIMIT'|'NETWORK'|'UNKNOWN'
  message: string;
  correlationId: string;
  retryable: boolean;
  details?: Record<string, string[]>;   // e.g. { fontId: ['jalt not supported — family ships tatweel-only'] }
}

export interface Session {
  memberId: string;
  seatId: string;    // solo-buyer model: saved sessions belong to the seat
  locale: 'ar' | 'en';
  plan: { sessionLimit: number; exportWindowPerMonth: number };
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

/* ---------- Font-file resolution (abstract capability: font binary delivery) ---------- */

export interface FontFileRequest { fontId: string; weight: number; subset: 'arabic' | 'latin' | 'both'; }
export interface FontFileResponse { url: string; format: 'woff2'; expiresAt: string; fileSizeKb: number; }

export type JobHandle = JobEntity & { resultArtifactIds?: string[] };

/* ---------- Query types ---------- */

export interface FontCatalogQuery {
  filter?: {
    script?: ('ar' | 'latin')[];
    category?: FontProfile['category'][];
    license?: FontProfile['license'][] | 'any';
    kashidaSupport?: ('jalt-and-tatweel' | 'tatweel-only')[];
    featureKeys?: string[];                    // fonts shipping these features
    origin?: ('catalog' | 'user-uploaded')[];
    search?: string;                           // Arabic-normalized (rtl-rules §4)
  };
  sort: 'familyName' | 'updatedAt';
  cursor?: string; limit: number;
}

export interface PairingSessionPatch {
  title?: string;
  arabicFont?: { fontId: string; weight?: number; opticalSize?: number };
  latinFont?: { fontId: string; weight?: number; opticalSize?: number };
  typography?: Partial<TypographySettings>;   // applied (post-clamp) values returned
}

export interface SpecimenPatch { title?: string; blocks?: SpecimenBlock[]; status?: 'final'; }

/* ---------- The contract ---------- */

export interface KhattPlaygroundAdapterV1 {
  /** Auth-agnostic session resolution (a11y-baseline §3.8 — provider-agnostic, no cognitive test). */
  getSession(): Promise<Result<Session>>;

  /* Catalog & fonts (CP-1) */
  listFontProfiles(query: FontCatalogQuery): Promise<Result<Page<FontProfile>, AdapterError>>;
  getFontProfile(fontId: string): Promise<Result<FontProfile, AdapterError>>;
  /** Font binary delivery — abstract capability; adapters bind storage of their choosing. */
  getFontFile(request: FontFileRequest): Promise<Result<FontFileResponse, AdapterError>>;
  listGlyphs(fontId: string, query: { block?: string; cursor?: string; limit: number }): Promise<Result<Page<GlyphSummary>, AdapterError>>;
  getGlyph(fontId: string, glyphId: string): Promise<Result<GlyphDetail, AdapterError>>;
  /** Human-curated pairing notes (non-AI by construction; source recorded). */
  listPairingNotes(query: { fontId?: string; cursor?: string; limit: number }): Promise<Result<Page<CuratedPairingNote>, AdapterError>>;
  /** Licensed-font upload: attestation REQUIRED — refusal is VALIDATION, never silent acceptance. */
  uploadFontFile(input: {
    familyName: string; licenseAttested: boolean; fileRef: string;
    declaredScripts: ('ar' | 'latin')[]; declaredCategory: FontProfile['category'];
  }): Promise<Result<FontProfile, AdapterError>>;   // 'pending' until parse; 'rejected' with details on failure

  /* Pairing sessions (CP-2) */
  createPairingSession(input: { arabicFontId: string; latinFontId: string; title?: string }): Promise<Result<PairingSession, AdapterError>>;
  listPairingSessions(query: { sort: 'updatedAt' | 'title'; cursor?: string; limit: number }): Promise<Result<Page<PairingSession>, AdapterError>>;
  getPairingSession(sessionId: string): Promise<Result<PairingSession, AdapterError>>;
  /** Stale baseRevision → CONFLICT with both payloads in details. */
  updatePairingSession(sessionId: string, patch: PairingSessionPatch, baseRevision: number): Promise<Result<PairingSession, AdapterError>>;

  /* Kashida & alternates lab (CP-3) */
  /** mode 'jalt' on unsupported font → VALIDATION (details cite the font's kashidaSupport). */
  setKashidaSettings(sessionId: string, settings: KashidaSettings, baseRevision: number): Promise<Result<PairingSession, AdapterError>>;
  /** featureKey not in font's openTypeFeatures → VALIDATION (never a silent toggle). */
  setAlternateSelection(sessionId: string, selection: AlternateSelection, baseRevision: number): Promise<Result<PairingSession, AdapterError>>;

  /* Specimens (CP-4) */
  createSpecimen(sessionId: string, input: { title: string; blocks: SpecimenBlock[] }): Promise<Result<Specimen, AdapterError>>;
  listSpecimens(query: { filter?: { status?: Specimen['status'][]; sessionId?: string }; sort: 'updatedAt'; cursor?: string; limit: number }): Promise<Result<Page<Specimen>, AdapterError>>;
  getSpecimen(specimenId: string): Promise<Result<Specimen, AdapterError>>;
  /** status→'final' is an explicit promotion; stale revision → CONFLICT with both payloads. */
  updateSpecimen(specimenId: string, patch: SpecimenPatch, baseRevision: number): Promise<Result<Specimen, AdapterError>>;

  /* Export & jobs (CP-5) */
  /** Export is a Job (>2s class, async-contract). Idempotency key prevents duplicate artifacts. */
  exportSpecimen(specimenId: string, input: { format: ExportFormat; options: ExportOptions; idempotencyKey: string }): Promise<Result<JobHandle, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string }, AdapterError>>;   // expired → NOT_FOUND + renew path
  renewArtifact(artifactId: string): Promise<Result<ExportArtifact, AdapterError>>;
  listJobs(query: { filter?: { state?: JobEntity['state'][] }; cursor?: string; limit: number }): Promise<Result<Page<JobHandle>, AdapterError>>;
  cancelJob(jobId: string): Promise<Result<JobHandle, AdapterError>>;   // real & fast (async-contract §5)
  getUsage(): Promise<Result<{ window: string; exports: number; exportWindowResetAt: string; sessionsUsed: number; sessionLimit: number }, AdapterError>>;
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
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

