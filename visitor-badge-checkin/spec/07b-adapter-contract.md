# 07b — Adapter Contract: visitor-badge-checkin (TypeScript, v1)

SME-G pass · `VisitorBadgeAdapterV1` · LOOP-15 satisfied: full 7-class taxonomy, typed pagination, auth-agnostic session. Types only — no implementation. Entity semantics (Workspace, Member, Visit, VisitEvent, Badge, BadgeTemplate, VisitorProfile, KioskConfig, Job, ExportArtifact, ActivityEntry): 07a, by reference. Every operation traces to ≥1 flow (03 coverage table).

```ts
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
```

## Rules

1. **Notification-before-delivery**: `checkInVisitor` records the `host-notified` VisitEvent and returns `hostNotified` with the honest delivery bit — an unbound outbound channel returns `channel: 'in-app', delivered: true` on the fallback surface (the desk arrival board + host surface); the event exists either way. Delivery failure of a bound channel never rolls back check-in (LOOP-5: the loop completes).
2. **Forward-only visit state**: `updateVisit` on a checked-in visit → VALIDATION naming the state; corrections are `voidBadge` + replacement events, never edits. `cancelVisit` only from 'invited'.
3. **Idempotency**: `createVisitInvitation`, `checkInVisitor`, `checkOutVisitor`, `issueBadge`, `voidBadge`, `exportVisitorLog` carry idempotency keys; replays return the original result (async-contract §5). A replayed kiosk check-in returns the same visit state and the same badge — a double-tap never issues two badges.
4. **Stale-version semantics**: `updateVisit`, `saveBadgeTemplate`, `updateHost` with stale base versions → CONFLICT with both payloads in `details`.
5. **Code semantics**: `getVisitByCheckInCode` accepts codes case-insensitively with O/0 and I/1 disambiguation rules (07c); NOT_FOUND copy always offers the walk-in path (11). Codes never authenticate anything beyond the visit they name — they are a lookup token, not a credential (LOOP-10 posture).
6. **Badge pinning**: `getBadge` returns the resolved spec pinned at creation; template edits after issuance never alter existing badges; `voidBadge` with `replacement` produces the chained replacement (both lineage links populated) and requires `reason`.
7. **Role scoping**: hosts may `createVisitInvitation`/`updateVisit`/`cancelVisit` only for visits they host; receptionist+ may issue/void badges; viewer is read+export only; kiosk-surface sessions may only `getVisitByCheckInCode`, `lookupReturningVisitor`, `listHosts`, `checkInVisitor`, `checkOutVisitor`, `issueBadge`, `getBadgeArtifact` — violations → PERMISSION.
8. **Derived-state honesty**: `derivedNoShow` and the board's no-show zone are computed at read (window.end + 15 min grace); sweeps (`end-of-day-sweep`, `retention-sweep` Jobs) materialize snapshots into artifacts and append `swept-*` events — the live record never silently mutates.
9. **Partial policies**: export Jobs declare per-format partial with per-format retry (async-contract §4); sweeps are atomic per visit; check-in is atomic per visitor.
10. **Typed pagination on every list; cursors opaque. No orphan methods — 03 coverage table verified at Critic pass.**
