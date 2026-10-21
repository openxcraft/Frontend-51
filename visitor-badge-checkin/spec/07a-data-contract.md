# 07a — Data Contract: visitor-badge-checkin

SME-G pass · Backend-agnostic. AI declaration (ai-native-patterns.md §1): **declared non-AI** — every operation is deterministic state transition, lookup, computation, or export; no model, no scoring, no generation, no assist. The specs must not and do not leak AI affordances. TypeScript declarations for every named entity follow; 07b composes these into operation signatures.

```ts
export type Locale = 'ar' | 'en';
export type VisitorType = 'guest' | 'vendor' | 'contractor' | 'interview' | 'vip';
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

export interface Job {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  partial?: unknown;                    // per-kind partial policy (below)
  result?: unknown;
  error?: { code: string; message: string; correlationId: string };
  idempotencyKey: string;               // async-contract §5
}

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
```

## Relationships

Workspace 1—N Member · Workspace 1—N Visit · Workspace 1—N BadgeTemplate (N versions) · Workspace 1—1 KioskConfig · Member (host) 1—N Visit · Visit 1—N VisitEvent (append-only) · Visit 1—N Badge (normally 1; N only through the correction chain) · Badge N—1 BadgeTemplate (pinned version) · Badge 1—N BadgeArtifact · Visit N—1 VisitorProfile (soft link on returning confirm) · Job spans exports and sweeps · ExportArtifact produced by export Jobs.

## Operations (summary; typed signatures in 07b)

Session: getSession. Board/log: getFrontDeskBoard, listVisits, getVisit. Invitations: createVisitInvitation, updateVisit, cancelVisit, getVisitByCheckInCode, lookupReturningVisitor. Check-in/out: checkInVisitor, checkOutVisitor. Badges: listBadgeTemplates, getBadgeTemplate, saveBadgeTemplate, validateBadgeTemplate, previewBadge, issueBadge, voidBadge, getBadge, getBadgeArtifact. Hosts: listHosts, addHost, updateHost. Config: getKioskConfig, saveKioskConfig, getWorkspaceSettings, saveWorkspaceSettings. Exports/jobs: exportVisitorLog, getArtifact, listJobs, getUsage.

## State obligations

- **The visit never regresses**: invited → checked-in → checked-out is forward-only; cancelled only from invited; corrections are new events (badge-corrected), never edits of checked-in facts. The timeline is append-only; a wrong check-in is reversed by an explicit desk correction event with reason, not by mutation.
- **No-show and in-building are derived at read**: no-show = status 'invited' AND now > window.end + 15 min; in-building = status 'checked-in' at the query instant. Sweeps materialize both into artifacts (auditable snapshots) without mutating live state silently.
- **Badges pin template versions**: an issued badge's rendered spec is immutable; template edits version forward; the correction chain (voided → replacement) is the only path to a changed badge, and it preserves the lineage both directions.
- **Codes are deterministic and never reissued**: check-in codes derive from invitation identity (07c rule); a regenerated invitation (after cancel + re-create) produces a NEW visit id and therefore a NEW code.
- **Host notification is a recorded event before it is a delivery**: the event lands on the timeline with channel and target regardless of channel binding (LOOP-5); outbound delivery failure never deletes the event, it flags it.
- **Partial-result policies**: export Jobs deliver per-format partial with per-format retry (async-contract §4); sweeps are atomic per visit; check-in is atomic per visitor (no half-checked-in state).
- **Members are never deleted**: deactivation keeps names on every historical event (custody-chain instinct from the portfolio's registry pattern, applied to lobby history).
- **No provider names anywhere**: channels render as 'outbound-channel' in capability language (credential-contract §2); the adapter file knows the binding, the UI does not.
