# 07b — Adapter Contract: khatt-type-playground (TypeScript, v1)

TYPES ONLY — no implementation. Contract name: `KhattPlaygroundAdapterV1`. AI declaration: non-AI product — no operation invokes any model; all data is deterministic catalog/session/specimen state.

```ts
// All entity types (FontProfile, GlyphSummary, GlyphDetail, CuratedPairingNote, KashidaSettings,
// AlternateSelection, TypographySettings, PairingSession, SpecimenBlock, Specimen, ExportFormat,
// ExportOptions, ExportArtifact, JobEntity, ErrorCode) are defined in 07a-data-contract.md and imported.

/* ---------- Envelope, session, pagination (LOOP-15 satisfied) ---------- */

export type Result<T> = { ok: true; data: T } | { ok: false; error: AdapterError };

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
```

## Rules

1. Error taxonomy is EXACTLY the 7 classes; no invented classes; every error carries `correlationId` + `retryable`.
2. Every method traces to ≥1 flow in 03 (coverage table there — no orphans; Critic-enforced).
3. `setKashidaSettings` / `setAlternateSelection` validate against the font's *actual* capability model — the adapter is the source of honesty behind disabled-with-reason UI.
4. Revision discipline: all session/specimen mutations take `baseRevision`; stale → CONFLICT with both versions; never silent overwrite (P10).
5. `uploadFontFile` refuses unattested uploads (VALIDATION); parse failures return details; rejected fonts never appear active in the catalog.
6. `exportSpecimen` partial failures follow the partial-results policy (rendered blocks delivered, failures listed, scoped retry); css/json exports force Western numerals in LTR-isolated code containers.
7. Auth-agnostic: `getSession` resolves a seat without provider semantics — bindable to any identity backend at implementation time.
