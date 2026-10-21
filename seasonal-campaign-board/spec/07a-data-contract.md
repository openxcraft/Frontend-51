# 07a — Data Contract: seasonal-campaign-board

SME-G pass. Backend-agnostic. **AI declaration (ai-native-patterns §1): this product is declared NON-AI** — no generation, inspection, clustering, or transformation operations exist on the contract; the moment library and templates are curated, inspectable data. TYPES ONLY (no implementation). 07b references these entities by name; the two files form one contract surface.

```ts
// ---------- Shared value types ----------
export type BilingualText = { ar: string | null; en: string | null };

export type MomentKind =
  | 'religious-season'    // Ramadan
  | 'religious-festival'  // Eid al-Fitr, Eid al-Adha
  | 'commerce-event'      // White Friday
  | 'national-day'        // Saudi National Day, Founding Day, UAE Eid Al Etihad
  | 'school-term';        // back-to-school

export type PhaseName = 'build-up' | 'peak' | 'wind-down';
export type HijriMethod = 'ummalqura'; // presentation conversion; disclosed in-app (portfolio Q-5)

export interface PhaseWindow {
  phase: PhaseName;
  startsOffsetDays: number; // relative to moment anchor (negative = before)
  endsOffsetDays: number;
}

// ---------- Season ----------
export interface Season {
  id: string;
  label: BilingualText;              // e.g. { ar: 'سنة التجزئة 2026', en: '2026 retail year' }
  gregorianYear: number;
  status: 'upcoming' | 'current' | 'past';
}

// ---------- Moment (library entity) ----------
export interface Moment {
  id: string;
  seasonId: string;
  kind: MomentKind;
  name: BilingualText;               // { ar: 'رمضان 1447', en: 'Ramadan 1447' }
  anchorDate: string;                // ISO Gregorian date the countdown anchors to (moment start, or event day)
  anchorKind: 'starts' | 'event-day';// Ramadan anchors at start; National Day anchors at the day itself
  hijriDate: { day: number; month: number; year: number; label: string } | null; // Western digits; null for Gregorian-only moments
  hijriMethod: HijriMethod | null;
  driftDisclosure: { driftAware: boolean; note: BilingualText } | null;
  // driftAware = true for moon-sighting-dependent dates (±1 day; presentation only, subject to official announcement)
  phases: PhaseWindow[];             // build-up / peak / wind-down with offsets
  checklistTemplateId: string;       // default template for this moment kind (inspectable, overridable per campaign)
  guidance: BilingualText | null;    // curated cultural/timing notes (content, not AI)
  confirmedDate: string | null;      // set when an official announcement resolves drift
}

// ---------- ChecklistTemplate ----------
export interface TemplateItem {
  id: string;
  title: BilingualText;
  role: string;                      // e.g. 'e-commerce', 'content', 'merchandising', 'field'
  critical: boolean;
  dueOffsetDays: number;             // T-minus days relative to campaign anchor (negative = before anchor)
}

export interface ChecklistTemplate {
  id: string;
  momentKind: MomentKind;
  name: BilingualText;
  version: number;                   // closure-to-template loop bumps versions (CP-5)
  items: TemplateItem[];
  updatedAt: string;
}

// ---------- Assignee (thin roster; no permission semantics) ----------
export interface Assignee {
  id: string;
  name: string;                      // display name, bidi-isolated on render
  role: string;                      // free-form team role
  active: boolean;                   // false = left the team; items keep history (CP-2 edge c)
}

// ---------- Campaign ----------
export type CampaignStatus = 'draft' | 'active' | 'closed';

export interface Campaign {
  id: string;
  workspaceId: string;
  momentId: string;
  templateId: string;                // template instantiated at creation (pins template id, not version)
  name: string;
  anchorDate: string;                // moment anchor unless goLiveOverride was set
  goLiveOverride: string | null;     // explicit countdown anchor override (recorded, never silent)
  status: CampaignStatus;
  ownerId: string;                   // Assignee id (the accountable lead)
  createdAt: string;
  updatedAt: string;
  revision: number;                  // optimistic concurrency (CONFLICT on stale)
}

// ---------- ChecklistItem ----------
export type ItemStatus = 'not_started' | 'in_progress' | 'blocked' | 'done' | 'na';

export interface ChecklistItem {
  id: string;
  campaignId: string;
  templateItemId: string | null;     // null = custom item added beyond template (visibly marked)
  title: BilingualText;              // custom items may be mono-lingual (one side null)
  role: string;
  critical: boolean;
  dueOffsetDays: number;             // from template or custom offset
  dueDate: string;                   // computed: anchorDate + dueOffsetDays (display: "T-14 · Tue 10 Feb")
  dueDateOverride: { date: string; reason: string } | null; // override preserved for template honesty
  status: ItemStatus;
  assigneeId: string | null;
  blockedReason: string | null;      // required when status = 'blocked' (accountability record, LOOP-10)
  completedAt: string | null;        // lateness preserved in activity even after done
  revision: number;
}

// ---------- ClosureNote ----------
export interface ClosureNote {
  campaignId: string;                // 1—1 with a closed campaign
  whatShipped: string;               // deterministic summary pre-fill, editable
  whatSlipped: string;               // pre-filled from open/overdue items, editable
  lessons: string | null;            // free text; explicit skip allowed
  waivedCriticalItems: string[];     // ids of critical items open at close (recorded, not escalated)
  carriedToTemplate: boolean;        // closure → next template version (CP-5)
  closedBy: string;                  // memberId
  closedAt: string;
  revision: number;
}

// ---------- Readiness (derived view, deterministic) ----------
export interface ReadinessSummary {
  campaignId: string;
  computedAt: string;                // vs serverTime — never client clock
  phase: PhaseName | 'pre-season' | 'post-season';
  percentComplete: number;           // done+na / total (critical-weighted variant shown as counts, not a second %)
  counts: { total: number; done: number; na: number; inProgress: number; blocked: number; notStarted: number };
  criticalOpen: number;
  atRiskCount: number;               // open items due within the attention threshold (7 days)
  overdueCount: number;
  nextDueAt: string | null;
}

// ---------- Dual-calendar frame (presentation data, deterministic conversion) ----------
export interface CalendarDay {
  gregorianIso: string;              // ISO date
  weekday: BilingualText;
  hijri: { day: number; month: number; year: number; label: string; method: HijriMethod } | null;
  momentMarkers: { momentId: string; phase: PhaseName | 'anchor' }[];
}

// ---------- Job (async-contract) ----------
export type JobKind = 'export-readiness' | 'export-task-handoff';

export interface ExportJob {
  id: string;
  kind: JobKind;
  state: 'queued' | 'running' | 'awaiting-input' | 'succeeded' | 'failed' | 'cancelled' | 'expired';
  progress: { determinate: boolean; done?: number; total?: number };
  requestedBy: string;
  createdAt: string;
  finishedAt: string | null;
  artifact: { id: string; format: string; expiresAt: string } | null; // expiry declared at creation (async-contract §2)
  error: { code: string; message: string; correlationId: string } | null;
  campaignIds: string[];
}

// ---------- Activity (P17) ----------
export interface ActivityEntry {
  id: string;
  actorId: string;                   // memberId (or 'system' for date-confirm migrations)
  action:
    | 'campaign-created' | 'campaign-updated' | 'campaign-closed' | 'campaign-reopened'
    | 'item-updated' | 'item-added' | 'item-removed' | 'items-bulk-updated'
    | 'assignee-created' | 'assignee-updated'
    | 'template-saved' | 'export-requested' | 'artifact-renewed' | 'date-confirmed';
  targetId: string;                  // campaign / item / assignee / template / artifact id
  targetLabel: string;               // human-readable, bidi-safe
  detail: string | null;             // e.g. blockedReason, override reason
  at: string;
}

// ---------- Usage (exports are the only metered surface) ----------
export interface UsageWindow {
  windowLabel: string;
  exportsUsed: number;
  exportsLimit: number;
  resetAt: string;
}
```

## Relationships

Season 1—N Moment · Moment 1—N Campaign · ChecklistTemplate 1—N Campaign (instantiation pins template **id**; the item snapshot is taken at creation, later template versions do not mutate live campaigns) · Campaign 1—N ChecklistItem · Assignee 1—N ChecklistItem (assignment only; ownership lives on Campaign.ownerId) · Campaign 1—1 ClosureNote (created by close) · Campaign 1—N ExportJob · all consequential mutations 1—N ActivityEntry.

## State machines

- Campaign: `draft → active → closed`; reopening is an explicit recorded transition (`campaign-reopened`), never a silent undo; `closed` is append-only (closure note revision-protected).
- ChecklistItem: `not_started → in_progress → done | blocked | na`; `blocked → in_progress → done` normal path; any → `na` (with visible na state, not deletion); done items keep `completedAt` for lateness history.
- ExportJob: per async-contract §2 with `expired` reached when the artifact passes its declared retention window.

## State obligations

- Dates: Gregorian ISO storage; Hijri is presentation (rtl-rules §3); drift-aware moments render "expected" treatment until `confirmedDate` exists; a date confirmation shifts affected campaigns' computed due dates with a visible migration note (03 non-happy path) — never silently.
- Due dates are computed (`anchorDate + dueOffsetDays`) and recomputed on anchor changes; `dueDateOverride` preserves the template's truth for next season (honesty pattern from the family).
- `blockedReason` is mandatory data for blocked items — the no-escalation accountability record (LOOP-10).
- `waivedCriticalItems` is a recorded fact, not an approval chain — closing with open critical items is an explicit, logged choice (CP-5.3).
- No provider names, no credentials, no AI affordances anywhere in the contract.
