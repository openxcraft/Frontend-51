// VERBATIM from specs-source/visitor-badge-checkin/07b-adapter-contract.md (TypeScript blocks, in order) + labelled 07a supplement below.
// The UI talks ONLY to this interface. Real backend = implement it in one adapter file.
// Single contract surface. Entity types referenced below (Visit, VisitEvent,
// Badge, BadgeTemplate, KioskConfig, ExportArtifact — and their fields) are
// declared canonically in 07a and are part of this contract by reference; 07b
// declares only the operational wrappers (summaries, views, jobs) its
// signatures need.
export type Result<T, E extends AdapterError = AdapterError> =
  | { ok: true; data: T } | { ok: false; error: E };

/**
 * The 7-token ErrorCode union corresponds to the portfolio error taxonomy:
 * 'VALIDATION'   -> ValidationError   (bad code format, expired-window arrival, void without
 *                                      reason, template sanity, kiosk-config reference,
 *                                      past-window invitation, duplicate open visit)
 * 'NOT_FOUND'    -> NotFoundError     (stale visit/badge/artifact links, expired artifacts)
 * 'PERMISSION'   -> PermissionError   (role scoping: hosts edit own invitations only;
 *                                      viewers issue nothing; inactive-host edges)
 * 'CONFLICT'     -> ConflictError     (concurrent invitation/template/member edits,
 *                                      stale badge render between preview and issue)
 * 'RATE_LIMIT'   -> RateLimitError    (outbound notification volume, export volume)
 * 'NETWORK'      -> NetworkError      (kiosk commit, list fetches, artifact delivery)
 * 'UNKNOWN'      -> UnknownError      (typed retry, correlationId)
 */
export type ErrorCode =
  | 'VALIDATION' | 'NOT_FOUND' | 'PERMISSION' | 'CONFLICT'
  | 'RATE_LIMIT' | 'NETWORK' | 'UNKNOWN';

export interface AdapterError {
  code: ErrorCode;
  message: string;
  correlationId: string;
  retryable: boolean;
  details?: Record<string, string[]>;
}

export interface Session {
  memberId: string;
  workspaceId: string;
  role: 'owner' | 'admin' | 'receptionist' | 'host' | 'viewer';
  locale: 'ar' | 'en';
  surface: 'desk' | 'kiosk';           // kiosk sessions are device-scoped, not person-scoped
}

export interface Page<T> { items: T[]; nextCursor: string | null; hasMore: boolean; }

// ---- Entities (summaries for lists; full shapes per 07a) ----

export type Locale = 'ar' | 'en';
export type VisitorType = 'guest' | 'vendor' | 'contractor' | 'interview' | 'vip';

export interface VisitSummary {
  id: string;
  visitorName: string;                  // verbatim; bidi-isolated at render
  visitorNameScript: 'arabic' | 'latin' | 'mixed';
  company?: string;
  visitorType: VisitorType;
  purposeLabel: { ar: string; en: string };
  hostName: { ar?: string; en?: string };
  window: { start: string; end: string };
  origin: 'invitation' | 'walk-in';
  status: 'invited' | 'checked-in' | 'checked-out' | 'cancelled';
  derivedNoShow: boolean;               // computed at read (07a obligation) — never a mutation
  checkInCode?: string;
  checkInAt?: string;
  checkOutAt?: string;
  badgeState: 'none' | 'ready' | 'issued' | 'void';
  updatedAt: string;
}

export interface BoardZone {
  expectedNext: VisitSummary[];         // window.start ascending
  inBuilding: VisitSummary[];           // with computed durations (Western numerals)
  recentArrivals: VisitSummary[];
  noShow: VisitSummary[];               // derived zone, named values, never auto-cancelled
  counts: { expected: number; inBuilding: number; noShow: number };
}

export interface HostSummary {
  id: string;
  nameAr?: string;
  nameEn?: string;
  department?: string;
  active: boolean;
  version: number;
}

export interface BadgeTemplateSummary {
  id: string;
  name: { ar: string; en: string };
  version: number;
  status: 'draft' | 'active' | 'retired';
  appliesTo: VisitorType[];
  updatedAt: string;
}

export interface BadgeView {             // full badge with lineage
  id: string;
  visitId: string;
  templateId: string;
  templateVersion: number;
  status: 'ready' | 'issued' | 'void';
  issuedAt?: string;
  issuedVia?: 'print' | 'screen-pass';
  voidReason?: 'checked-out' | 'expired' | 'correction' | 'desk-error';
  replacedById?: string;
  replacedFromId?: string;
  checkOutCode: string;
  resolvedSpec: {                     // the pinned render contract (BadgeSpecRender per 07a)
    layoutDirection: 'rtl-first' | 'ltr-first';
    fields: string[];                 // ordered field ids as rendered
    band: { visitorType: VisitorType; stripToken: string; textDeepToken: string };
    stockSize: 'adhesive-standard' | 'card-standard';
    nameDisplay: string;              // visitor name as it renders (worst-case aware)
    validity: { from: string; to: string };
  };
}

export interface Job<T> {
  id: string;
  kind: 'export-log' | 'retention-sweep' | 'end-of-day-sweep';
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: T;
  result?: T;
  error?: AdapterError;
}

// ---- Contract ----

export interface VisitorBadgeAdapterV1 {
  getSession(): Promise<Result<Session, AdapterError>>;

  // today board + visit records
  getFrontDeskBoard(input: { day: string }): Promise<Result<BoardZone, AdapterError>>;
  listVisits(query: {
    filter?: {
      status?: VisitSummary['status'][];
      hostId?: string;
      visitorType?: VisitorType[];
      origin?: ('invitation' | 'walk-in')[];
      day?: string;                    // board-adjacent day scoping
      range?: { from: string; to: string };
      mine?: boolean;                  // host-mode: only my hosted visits
    };
    search?: string;                   // normalized bilingual search on visitor/host/company (rtl-rules §4)
    sort: 'windowStart' | 'checkInAt' | 'updatedAt';
    cursor?: string; limit: number;
  }): Promise<Result<Page<VisitSummary>, AdapterError>>;
  getVisit(id: string): Promise<Result<VisitSummary & { events: VisitEvent[] }, AdapterError>>;

  // pre-registration (CP-2)
  createVisitInvitation(input: {
    visitorName: string;
    company?: string;
    phone?: string;                    // optional everywhere (12 Q-8)
    visitorType: VisitorType;
    purposeId: string;
    hostId: string;
    window: { start: string; end: string };
    idempotencyKey: string;            // double-submit never double-invites
  }): Promise<Result<VisitSummary & { checkInCode: string }, AdapterError>>;
  updateVisit(id: string, patch: {
    window?: { start: string; end: string };
    company?: string;
    phone?: string | null;
    purposeId?: string;
    visitorType?: VisitorType;
    hostId?: string;                   // reassignment before arrival only
    baseVersion: number;
  }): Promise<Result<VisitSummary, AdapterError>>;
  cancelVisit(id: string, input: { reason: string; baseVersion: number }): Promise<Result<VisitSummary, AdapterError>>;

  // kiosk check-in path (CP-1)
  getVisitByCheckInCode(code: string): Promise<Result<
    VisitSummary & { prefill: { company?: string; phone?: string; purposeId: string } },
    AdapterError
  >>;
  lookupReturningVisitor(input: {
    visitorName: string;               // normalized server-side; rules disclosed in-product
    phoneLast4?: string;
  }): Promise<Result<{ candidates: VisitorProfile[]; normalizationApplied: boolean }, AdapterError>>;
  checkInVisitor(input: {
    visitId?: string;                  // code path (pre-registered)
    walkIn?: { visitorName: string; company?: string; phone?: string; hostId: string; purposeId: string; visitorType: VisitorType };
    profileId?: string;                // returning-visitor confirm
    surface: 'kiosk' | 'desk';
    idempotencyKey: string;            // kiosk double-tap never double-checks-in
  }): Promise<Result<
    VisitSummary & { hostNotified: { channel: 'in-app' | 'outbound-channel'; delivered: boolean }; badgeId: string },
    AdapterError
  >>;
  checkOutVisitor(input: {
    visitId: string;
    via: 'badge-code' | 'desk';
    checkOutCode?: string;             // required when via = 'badge-code'
    idempotencyKey: string;
  }): Promise<Result<VisitSummary, AdapterError>>;

  // badge templates + spec lifecycle (CP-5)
  listBadgeTemplates(query: {
    filter?: { status?: BadgeTemplateSummary['status'][]; appliesTo?: VisitorType[] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<BadgeTemplateSummary>, AdapterError>>;
  getBadgeTemplate(id: string): Promise<Result<BadgeTemplateSummary & {
    fields: Record<string, boolean>;
    bands: { visitorType: VisitorType; stripToken: string; textDeepToken: string }[];
    layoutDefault: 'rtl-first' | 'ltr-first';
    layoutVariantForLatinVisitors: boolean;
    stockSize: 'adhesive-standard' | 'card-standard';
    nameLengthBudget: number;
  }, AdapterError>>;
  saveBadgeTemplate(input: {
    id?: string;                       // absent = create
    patch: {
      name?: { ar: string; en: string };
      fields?: Record<string, boolean>;   // visitorName must remain true (validation)
      bands?: { visitorType: VisitorType; stripToken: string; textDeepToken: string }[];
      layoutDefault?: 'rtl-first' | 'ltr-first';
      layoutVariantForLatinVisitors?: boolean;
      stockSize?: 'adhesive-standard' | 'card-standard';
      nameLengthBudget?: number;
      status?: 'draft' | 'active' | 'retired';
    };
    baseVersion?: number;              // stale -> CONFLICT with both payloads
  }): Promise<Result<BadgeTemplateSummary, AdapterError>>;
  validateBadgeTemplate(input: {
    id?: string; draft?: Record<string, unknown>;   // validate before save (CP-5.3)
  }): Promise<Result<{ valid: boolean; issues: { field: string; message: string; severity: 'blocking' | 'warning' }[] }, AdapterError>>;
  previewBadge(input: {
    templateId?: string; templateDraft?: Record<string, unknown>;
    sampleVisitorId?: string;          // seeded bilingual samples (07c); absent = default worst case
    direction: 'rtl-first' | 'ltr-first';
  }): Promise<Result<BadgeView['resolvedSpec'], AdapterError>>;

  // badge issuance + correction chain (CP-1.6 / CP-3.3)
  issueBadge(input: {
    badgeId: string;                   // the ready badge resolved at check-in
    via: 'print' | 'screen-pass';
    idempotencyKey: string;
  }): Promise<Result<BadgeView, AdapterError>>;
  voidBadge(input: {
    badgeId: string;
    reason: 'correction' | 'desk-error';
    note?: string;                     // required for correction chain readability
    replacement?: { fieldPatches: Record<string, string> };  // e.g. corrected visitor name
    idempotencyKey: string;
  }): Promise<Result<{ voided: BadgeView; replacement?: BadgeView }, AdapterError>>;
  getBadge(badgeId: string): Promise<Result<BadgeView, AdapterError>>;
  getBadgeArtifact(badgeId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean; format: 'print-ready' | 'screen-pass' }, AdapterError>>;

  // host directory (CP-1.3 / CP-2.5)
  listHosts(query: {
    filter?: { active?: boolean; department?: string };
    search?: string;                   // normalized bilingual search (rtl-rules §4)
    cursor?: string; limit: number;
  }): Promise<Result<Page<HostSummary>, AdapterError>>;
  addHost(input: {
    nameAr?: string; nameEn?: string; department?: string;
    notifyPrefs?: { arrival: 'app' | 'app-plus-channel' };
  }): Promise<Result<HostSummary, AdapterError>>;
  updateHost(id: string, patch: {
    nameAr?: string; nameEn?: string; department?: string;
    active?: boolean;
    notifyPrefs?: { arrival: 'app' | 'app-plus-channel' };
    baseVersion: number;
  }): Promise<Result<HostSummary, AdapterError>>;

  // kiosk + workspace configuration (CP-1.1 / CP-4.4 / CP-5.5)
  getKioskConfig(): Promise<Result<KioskConfig, AdapterError>>;
  saveKioskConfig(patch: {
    defaultLocale?: Locale;
    walkInFields?: ('name' | 'company' | 'host')[];
    welcomeCopy?: { ar: string; en: string };
    idleSeconds?: number;
    activeTemplateIds?: Partial<Record<VisitorType, string>>;
  }): Promise<Result<KioskConfig, AdapterError>>;
  getWorkspaceSettings(): Promise<Result<{
    retention: { visitLogMonths: number; archiveExportable: boolean };
    notifyTiers: Record<'arrival' | 'invitation-sent' | 'sweep-summary', 'instant' | 'daily-digest' | 'off'>;
    purposes: { id: string; label: { ar: string; en: string } }[];
  }, AdapterError>>;
  saveWorkspaceSettings(patch: {
    retention?: { visitLogMonths?: number; archiveExportable?: boolean };
    notifyTiers?: Record<'arrival' | 'invitation-sent' | 'sweep-summary', 'instant' | 'daily-digest' | 'off'>;
    purposes?: { id?: string; label: { ar: string; en: string } }[];
  }): Promise<Result<WorkspaceSettingsView, AdapterError>>;

  // log exports + jobs (CP-4)
  exportVisitorLog(input: {
    kind: 'daily-log' | 'in-building' | 'archive';
    range?: { from: string; to: string };      // daily-log/archive
    asOf?: string;                             // in-building point-in-time
    idempotencyKey: string;
  }): Promise<Result<Job<{ artifacts: { artifactId: string; expiresAt: string; rows: number }[] }>, AdapterError>>;
  getArtifact(artifactId: string): Promise<Result<{ url: string; expiresAt: string; regenerable: boolean }, AdapterError>>;
  listJobs(query: {
    filter?: { state?: Job<unknown>['state'][]; kind?: Job<unknown>['kind'][] };
    cursor?: string; limit: number;
  }): Promise<Result<Page<Job<unknown>>, AdapterError>>;

  // platform
  getUsage(): Promise<Result<{
    window: string;
    invitationsCreated: number;
    outboundNotifications: number;
    exports: number;
    resetAt: string;
  }, AdapterError>>;
}

// WorkspaceSettingsView is the return shape of saveWorkspaceSettings (same
// fields as getWorkspaceSettings' payload) — declared here because 07a owns
// the entity, 07b owns the operational view.
export interface WorkspaceSettingsView {
  retention: { visitLogMonths: number; archiveExportable: boolean };
  notifyTiers: Record<'arrival' | 'invitation-sent' | 'sweep-summary', 'instant' | 'daily-digest' | 'off'>;
  purposes: { id: string; label: { ar: string; en: string } }[];
}

// ===== Supplement: entity types verbatim from 07a-data-contract.md TS blocks (only names not already defined in 07b) =====
export type VisitOrigin = 'invitation' | 'walk-in';
export interface VisitWindow {
  start: string;                       // ISO 8601, Gregorian (rtl-rules §3)
  end: string;                          // default duration 30 min when composed
}
export interface Workspace {
  id: string;
  name: string;                         // bilingual display name, e.g. "دار مجد للاستشارات"
  defaultLocale: Locale;                // kiosk + desk default; LOOP-6 proposal bilingual-ar
  retention: {
    visitLogMonths: number;             // live-log retention; default 12 (12 Q-8)
    archiveExportable: boolean;         // archived visits remain exportable
  };
  purposes: PurposeItem[];              // visit purpose list (kiosk + composer)
  notifyTiers: Record<NotifyClass, 'instant' | 'daily-digest' | 'off'>;  // P21
}
export interface PurposeItem {
  id: string;
  label: { ar: string; en: string };    // e.g. اجتماع / meeting · مقابلة / interview
}
export type NotifyClass = 'arrival' | 'invitation-sent' | 'sweep-summary';
export interface Member {               // the host directory; desk seats and hosts are Members
  id: string;
  nameAr?: string;                      // at least one name required
  nameEn?: string;
  department?: string;
  role: 'owner' | 'admin' | 'receptionist' | 'host' | 'viewer';
  active: boolean;                      // inactive members stay on history forever (no deletion)
  notifyPrefs: { arrival: 'app' | 'app-plus-channel' };
  version: number;                      // optimistic concurrency
  createdAt: string;
}
export interface VisitorProfile {       // returning-visitor match key (normalized)
  id: string;
  displayName: string;                  // last-used verbatim name
  normalizedName: string;               // read-only, system-computed (rtl-rules §4 pipeline)
  phoneLast4?: string;                  // optional; match confidence input only
  lastVisitId?: string;
  lastVisitAt?: string;
}
export type VisitStatus =
  | 'invited'                           // invitation created (or walk-in form open at kiosk — transient)
  | 'checked-in'
  | 'checked-out'
  | 'cancelled';                        // host/desk cancelled before arrival; actor+reason on events
// 'no-show' is NOT a stored status: it is DERIVED AT READ (window.end + 15 min grace elapsed
// while status = 'invited') and materialized only inside export artifacts — the live record
// never silently mutates a visit the host may still redeem (03 CP-3 edge).
export interface Visit {
  id: string;
  workspaceId: string;
  visitorName: string;                  // verbatim, bidi-isolated at render (rtl-rules §2)
  visitorNameScript: 'arabic' | 'latin' | 'mixed';  // drives badge layout variant
  company?: string;
  phone?: string;                       // optional at kiosk; reason stated at the field (11)
  visitorType: VisitorType;             // drives badge band + template resolution
  purposeId: string;
  hostId: string;                       // host Member; active at composition time
  window: VisitWindow;
  origin: VisitOrigin;
  status: VisitStatus;
  checkInCode?: string;                 // deterministic (07c); present when origin = 'invitation'
  checkInAt?: string;
  checkOutAt?: string;
  profileId?: string;                   // linked on returning-visitor confirm
  version: number;                      // optimistic concurrency on pre-arrival edits
  createdAt: string;
  updatedAt: string;
}
export type VisitEventKind =
  | 'invitation-created' | 'invitation-updated' | 'invitation-cancelled'
  | 'host-notified'                     // channel + target recorded — the core promise's receipt
  | 'checked-in'
  | 'badge-ready' | 'badge-issued' | 'badge-voided' | 'badge-corrected'
  | 'checked-out'
  | 'swept-no-show' | 'swept-open-visit';   // materialized by sweep jobs into artifacts
export interface VisitEvent {           // APPEND-ONLY timeline (P17); no event is ever edited
  id: string;
  visitId: string;
  kind: VisitEventKind;
  actorMemberId?: string;               // absent for visitor-kiosk events
  actorLabel?: 'visitor-kiosk' | 'system-sweep';
  at: string;
  detail?: {
    channel?: 'in-app' | 'outbound-channel';   // capability language only (credential-contract §2)
    targetMemberId?: string;
    reason?: string;                    // required on badge-voided / invitation-cancelled
    replacedBadgeId?: string;           // badge-corrected chain link
    code?: string;
  };
}
export interface BadgeTemplateFieldSet {
  visitorName: true;                    // always on — a badge without a name is a sticker
  hostName: boolean;
  company: boolean;
  date: boolean;
  validityWindow: boolean;
  checkOutCode: boolean;
}
export interface BadgeTypeBand {
  visitorType: VisitorType;
  stripToken: string;                   // Layer 2 binding per 05 palette; deep text variant locked
}
export interface BadgeTemplate {
  id: string;
  name: { ar: string; en: string };
  version: number;                      // versioned spec; issues pin the version
  status: 'draft' | 'active' | 'retired';
  appliesTo: VisitorType[];
  fields: BadgeTemplateFieldSet;
  bands: BadgeTypeBand[];
  layoutDefault: 'rtl-first' | 'ltr-first';      // workspace default rtl-first (bilingual-ar)
  layoutVariantForLatinVisitors: boolean;        // LTR variant must also validate (05 obligation)
  stockSize: 'adhesive-standard' | 'card-standard';
  nameLengthBudget: number;             // max display characters before truncation warning
  createdAt: string;
  updatedAt: string;
}
export type BadgeStatus = 'ready' | 'issued' | 'void';
export interface Badge {
  id: string;
  visitId: string;
  templateId: string;
  templateVersion: number;              // pinned at resolution — template edits never rewrite badges
  status: BadgeStatus;
  issuedAt?: string;
  issuedVia?: 'print' | 'screen-pass';
  voidedAt?: string;
  voidReason?: 'checked-out' | 'expired' | 'correction' | 'desk-error';
  replacedById?: string;                // correction chain: voided badge → its replacement
  replacedFromId?: string;              // symmetric link for the replacement badge
  checkOutCode: string;                 // deterministic; rides ON the badge, never as a key
  createdAt: string;
}
export interface BadgeArtifact {
  id: string;
  badgeId: string;
  format: 'print-ready' | 'screen-pass';
  expiresAt: string;                    // declared retention window at creation
  regenerable: boolean;
}
export type ExportKind = 'daily-log' | 'in-building' | 'archive';
export interface ExportArtifact {
  id: string;
  kind: ExportKind;
  rangeStart?: string;                  // daily-log/archive; in-building is point-in-time
  asOf?: string;                        // in-building computation instant
  expiresAt: string;
  regenerable: boolean;
  rows: number;
}
export type JobKind = 'export-log' | 'retention-sweep' | 'end-of-day-sweep';
export interface KioskConfig {
  workspaceId: string;
  defaultLocale: Locale;                // 'ar' per bilingual-ar proposal
  languageSwitchVisible: true;          // always — the toggle is structural, not optional
  walkInFields: ('name' | 'company' | 'host')[];           // name+host required, company recommended
  phoneOptional: true;                  // phone is never required (02 Noura, 12 Q-8)
  phoneReasonText: { ar: string; en: string };             // stated AT the field
  welcomeCopy: { ar: string; en: string };
  idleSeconds: number;                  // reset to welcome; default 90
  activeTemplateIds: Partial<Record<VisitorType, string>>; // validated: every type covered
}
export interface ActivityEntry {        // workspace-scoped P17 (settings/template lifecycle)
  id: string;
  workspaceId: string;
  actorMemberId: string;
  action: 'settings-changed' | 'kiosk-config-changed' | 'template-saved' | 'template-activated'
        | 'template-retired' | 'retention-changed' | 'host-added' | 'export-run';
  targetRef: string;
  detail?: string;
  at: string;
}

