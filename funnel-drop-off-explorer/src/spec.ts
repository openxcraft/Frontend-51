// GENERATED from specs-source/funnel-drop-off-explorer/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "funnel-drop-off-explorer",
 "title": "Funnel Drop Off Explorer",
 "family": "analytics",
 "tier": 1,
 "flagship": true,
 "adapter": "FunnelDropOffAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Kashf Abyss",
  "pairing": "P14",
  "radius": "4px",
  "elevation": "ink-press",
  "icon": "line-2",
  "motion": "crisp",
  "fonts": [
   "Rubik",
   "Space Mono"
  ],
  "primary": "#002028",
  "accent": "#032C33",
  "canvas": "#1A3B41"
 },
 "screens": [
  {
   "id": "S1",
   "name": "SIGN-IN",
   "purpose": "Both / all",
   "shell": "",
   "data": "session entry, locale pick, role routing",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S2",
   "name": "CANVAS HOME",
   "purpose": "Desktop ≥1280",
   "shell": "CANVAS HOME",
   "data": "funnel list with latest headlines (conversion, trend arrow, freshness), new-funnel entry, first-run data posture",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "EXPLORATION CANVAS",
   "purpose": "Desktop ≥1280 (tablet: read-only cascade)",
   "shell": "EXPLORATION CANVAS",
   "data": "the flagship surface: composer strip, the Cascade, seam navigation, dossier stack",
   "archetype": "editor-studio"
  },
  {
   "id": "S4",
   "name": "SEGMENT WORKSHOP",
   "purpose": "Desktop ≥1280",
   "shell": "SEGMENT WORKSHOP",
   "data": "segment library (provenance cards), anneal history (runs with traces), compare board",
   "archetype": "review-queue"
  },
  {
   "id": "S5",
   "name": "COHORTS & USERS",
   "purpose": "Desktop ≥1280 (tablet read-only)",
   "shell": "COHORTS & USERS",
   "data": "cohort library, pseudonymous user drill",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S6",
   "name": "TAXONOMY MANAGER",
   "purpose": "Desktop ≥1280",
   "shell": "TAXONOMY MANAGER",
   "data": "bilingual event dictionary, lint report, event cards, deprecation gates, proposed events",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "SOURCES & SAMPLES",
   "purpose": "Desktop ≥1280",
   "shell": "SOURCES & SAMPLES",
   "data": "bound source health (credential lifecycle), paste-sample import",
   "archetype": "review-queue"
  },
  {
   "id": "S8",
   "name": "ANALYSES FEED",
   "purpose": "Both (tablet default)",
   "shell": "",
   "data": "saved evidence packs: headline, narration, Spine preview, share state, export path",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S9",
   "name": "ACTIVITY & JOBS",
   "purpose": "Desktop ≥1280",
   "shell": "ACTIVITY & JOBS",
   "data": "activity trail (P17), job center",
   "archetype": "review-queue"
  },
  {
   "id": "S10",
   "name": "INBOX",
   "purpose": "Both",
   "shell": "",
   "data": "notification digest ladder (P21)",
   "archetype": "review-queue"
  },
  {
   "id": "S11",
   "name": "ONBOARDING CHECKLIST",
   "purpose": "Both / first-run overlay",
   "shell": "",
   "data": "P22 value milestones, four persona entry paths",
   "archetype": "board"
  }
 ],
 "flows": [],
 "components": [
  {
   "name": "CascadeChart",
   "purpose": "The funnel render: vertical strata (one per step) with the chartreuse conversion flow between them; the lost flow drapes from each seam as the abyss showing through (drop-off is absence, not a color — 05); stratum labels carry event bilingual labels + counts + step conversion in Space Mono",
   "obligations": "Semantics: an ordered list of stratum groups — step ordinal announced on focus (\"الخطوة 3 من 5 — البحث الأول\" / \"step 3 of 5 — First Search\"); counts and rates are TEXT (tabular numerals), the stratum heights are reinforcement; the largest seam badge is text+icon; the basis line (source, range, window, freshness) is a described-by figure stating the render's provenance in words; strata settle ≤60ms stagger capped at 5 then simultaneous; reduced-motion = strata render at final height simultaneously, drapes render as static side-flows"
  },
  {
   "name": "SeamSelector",
   "purpose": "The focusable gaps between strata: each seam is a target carrying lost-count, drop-off rate, and the largest-seam badge; j/k roving focus; Enter opens the dossier",
   "obligations": "Each seam is a button with described-by (\"الدرز 3: فُقد 86 من 271 — 31.7%\" / \"seam 3: 86 of 271 lost — 31.7%\"); focus-visible at 2.4.13 strength; selection pinches the cascade's population band (05 signature) — the pinch is decorative, the seam facts are text; seams with zero lost users render \"no leak\" state (P01 discipline); reduced-motion = instant band change + announcement"
  },
  {
   "name": "SeamDossier",
   "purpose": "The docked inline-end panel: header facts, breakdown axis picker + rows, displaced-paths ribbon, time-to-convert distribution, anneal launcher",
   "obligations": "The dossier is a labelled region (aria-labelledby) docked, not modal — cascade context stays live; breakdown rows are P18 grid rows with segment facts as text; every sub-section is a disclosure with aria-expanded; panel headers at wash surface with the usage contract honored (critical copy never body-size on wash — 05); focus moves into the dossier on open and returns to the seam on close (trap-free, a11y-baseline §3)"
  },
  {
   "name": "LostFlowRibbon",
   "purpose": "The displaced-paths render: ranked strands from the seam toward each next-event path (\"App Exited 31 · Restaurant Page Viewed 19…\") — the aggregate answer to \"where did they go instead\" (q19 precedent; LOOP-10: no replay, stated in the footer)",
   "obligations": "Ranked rows are a navigable list — rank, path event label (bilingual per reader locale), count, and share as text; strands are decorative reinforcement (SVG, currentColor d-series); strands draw once per selection (≤180ms, stagger ≤60ms, cap 6, then simultaneous); \"left the product\" renders as an honest first-rank row, never an error; reduced-motion = strands render statically, ranking re-order settles without animation"
  },
  {
   "name": "AnnealSpine",
   "purpose": "The segment-chain visualization: a vertical spine where each admitted predicate narrows the population band (survivor count per level); rejected candidates render below with reasons; final chain carries excess headcount + the correlation-honesty sentence",
   "obligations": "An ordered list of iterations — each iteration is a group announcing its admitted predicate (or rejection reason) in words (\"استُبعد المحور locale=ar — لا تحسين عن السلسلة الحالية\" / \"rejected locale=ar — no improvement over the current chain\"); every candidate row carries size/rate/excess/separation as TEXT in Space Mono; the pinch is decorative (facts are text); the support floor and epsilon render on the spine header; the honesty sentence is part of the component's required content (11 §D1); reduced-motion = bands render at final widths simultaneously, pinch collapses to state chips"
  },
  {
   "name": "PredicateChip",
   "purpose": "The segment predicate atom: axis = value chips with bilingual axis labels, removable, composable in the composer and compare picker",
   "obligations": "Chips are buttons with described-by stating the predicate in words; removal announces politely; the value renders bidi-isolated (mixed-script values like locale=ar inside EN chrome); target ≥24px; press feedback ≤80ms; chips never rely on hue alone (admitted vs rejected states are text+icon)"
  },
  {
   "name": "StepComposer",
   "purpose": "The funnel builder: ordered step chips from taxonomy search (bilingual labels, status glyph, usage count), per-step settings (ordering mode, window, filters), collapsible into the canvas header after save",
   "obligations": "The composer is a form region with a labelled listbox flow; taxonomy search normalizes Arabic variants (rtl-rules §4); deprecated events are excluded from NEW steps and render with the legacy glyph when editing existing ones (07b rule 7); usage counts accompany every result (\"used by 3 funnels — 41,203 events in range\") as text; draft autosave indicator per P10; validation errors link to the failing step chip"
  },
  {
   "name": "TaxonomyCard",
   "purpose": "The dictionary row: canonical name (Space Mono), labelEn + labelAr, description, owner, status lifecycle glyph, property list with types, usage counts",
   "obligations": "The card is a P18 grid row with described-by summary; the bilingual label pair renders with per-side direction and bidi isolation on the mixed row; status is text+icon (proposed/active/deprecated); the Arabic label gap renders as a lint ERROR affordance (\"التسمية العربية ناقصة\" / \"Arabic label missing\") — never silent; usage counts are text; deprecated cards carry the reference-impact note"
  },
  {
   "name": "LintReportPanel",
   "purpose": "The taxonomy health surface: violations grouped by class (naming, bilingual completeness, property health, governance), each with rule text + fix action",
   "obligations": "Groups are disclosures with counts in the summary line (\"12 مخالفة: 4 تسمية، 3 تسميات ثنائية اللغة، 3 خصائص، 2 حوكمة\" / \"12 violations: 4 naming, 3 bilingual labels, 3 properties, 2 governance\"); every violation links to its TaxonomyCard; the CLEAN state has its own copy (a good state, 11 §A); fixes open the edit surface with the failing rule focused; re-lint is synchronous on publish"
  },
  {
   "name": "NarrationPanel",
   "purpose": "The drop-off narrative region: reserved-space streaming (ai-native-patterns §2), provenance chip (template-metrics / model-assisted), stop/regenerate, the honesty sentence",
   "obligations": "The region is aria-live polite with start/completion announcements only (never per-token); the provenance chip is text (\"سرد بقالب المقاييس\" / \"narrated from metric templates\") and links to the engine-provenance note (11 §D2); Stop and Regenerate are available from the first token; partial output is marked partial; the reserved region bounds CLS ≤0.02; reduced-motion = paragraph-chunk rendering with per-chunk polite announcements (motion-language §5)"
  }
 ],
 "ops": [
  "getSession",
  "listFunnels",
  "getFunnel",
  "saveFunnel",
  "computeFunnelMetrics",
  "getFunnelTrend",
  "breakdownFunnelStep",
  "getStepTransitionDetail",
  "annealSegment",
  "compareSegments",
  "saveCohort",
  "listCohorts",
  "listCohortUsers",
  "saveAnalysis",
  "listAnalyses",
  "getAnalysis",
  "narrateDropOff",
  "exportAnalysis",
  "listTaxonomyEvents",
  "getTaxonomyEvent",
  "upsertTaxonomyEvent",
  "setTaxonomyEventStatus",
  "getTaxonomyLintReport",
  "listEventSources",
  "importEventSample",
  "listActivity",
  "listNotifications",
  "markNotificationsSeen",
  "subscribeWorkspaceEvents",
  "getJob",
  "retryJob",
  "cancelJob",
  "listUsers",
  "inviteUser",
  "updateUser"
 ],
 "entities": [
  {
   "name": "User",
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
     "name": "displayName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "role",
     "optional": false,
     "type": "Role"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'active' | 'suspended'"
    },
    {
     "name": "joinedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "TaxonomyProperty",
   "fields": [
    {
     "name": "name",
     "optional": false,
     "type": "string"
    },
    {
     "name": "type",
     "optional": false,
     "type": "PropertyType"
    },
    {
     "name": "segmentable",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "enumValues",
     "optional": true,
     "type": "string[]"
    },
    {
     "name": "labelEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "labelAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "descriptionEn",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "descriptionAr",
     "optional": false,
     "type": "string | null"
    }
   ]
  },
  {
   "name": "TaxonomyEvent",
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
     "name": "canonicalName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "labelEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "labelAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "descriptionEn",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "descriptionAr",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "status",
     "optional": false,
     "type": "EventStatus"
    },
    {
     "name": "ownerUserId",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "properties",
     "optional": false,
     "type": "TaxonomyProperty[]"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "TaxonomyLintViolation",
   "fields": [
    {
     "name": "eventId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "canonicalName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "rule",
     "optional": false,
     "type": "'naming-syntax' | 'naming-case' | 'naming-actor' | 'label-en-missing'"
    },
    {
     "name": "severity",
     "optional": false,
     "type": "'error' | 'warn'"
    },
    {
     "name": "detailEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "detailAr",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "EventSource",
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
     "name": "kindLabel",
     "optional": false,
     "type": "string"
    },
    {
     "name": "health",
     "optional": false,
     "type": "'unverified' | 'active' | 'expiring-soon' | 'expired' | 'failed'"
    },
    {
     "name": "lastFreshAt",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "coverageNoteEn",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "coverageNoteAr",
     "optional": false,
     "type": "string | null"
    }
   ]
  },
  {
   "name": "FunnelStep",
   "fields": [
    {
     "name": "order",
     "optional": false,
     "type": "number"
    },
    {
     "name": "eventId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "eventFilters",
     "optional": true,
     "type": "{ property: string; op: 'eq' | 'neq' | 'in' | 'gt' | 'lt'; value: string }[]"
    }
   ]
  },
  {
   "name": "Funnel",
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
     "name": "name",
     "optional": false,
     "type": "string"
    },
    {
     "name": "descriptionEn",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "descriptionAr",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "steps",
     "optional": false,
     "type": "FunnelStep[]"
    },
    {
     "name": "orderingMode",
     "optional": false,
     "type": "OrderingMode"
    },
    {
     "name": "conversionWindowHours",
     "optional": false,
     "type": "number"
    },
    {
     "name": "globalFilters",
     "optional": false,
     "type": "{ property: string; op: 'eq' | 'neq' | 'in' | 'gt' | 'lt'; value: string }[]"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'draft' | 'active' | 'archived'"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "createdById",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ComputationBasis",
   "fields": [
    {
     "name": "sourceId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "sourceKindLabel",
     "optional": false,
     "type": "string"
    },
    {
     "name": "rangeStart",
     "optional": false,
     "type": "string"
    },
    {
     "name": "rangeEnd",
     "optional": false,
     "type": "string"
    },
    {
     "name": "conversionWindowHours",
     "optional": false,
     "type": "number"
    },
    {
     "name": "orderingMode",
     "optional": false,
     "type": "OrderingMode"
    },
    {
     "name": "funnelVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "taxonomyVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "computedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "freshness",
     "optional": false,
     "type": "'fresh' | 'stale' | 'coverage-gap'"
    },
    {
     "name": "coverageDays",
     "optional": true,
     "type": "number"
    }
   ]
  },
  {
   "name": "StepMetrics",
   "fields": [
    {
     "name": "order",
     "optional": false,
     "type": "number"
    },
    {
     "name": "eventId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "canonicalName",
     "optional": false,
     "type": "string"
    },
    {
     "name": "labelEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "labelAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "usersCompleted",
     "optional": false,
     "type": "number"
    },
    {
     "name": "stepConversionRate",
     "optional": false,
     "type": "number"
    },
    {
     "name": "droppedFromPrior",
     "optional": false,
     "type": "number"
    },
    {
     "name": "dropOffRate",
     "optional": false,
     "type": "number"
    },
    {
     "name": "medianTransitionMinutes",
     "optional": false,
     "type": "number | null"
    },
    {
     "name": "p90TransitionMinutes",
     "optional": false,
     "type": "number | null"
    }
   ]
  },
  {
   "name": "FunnelMetrics",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "funnelId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "basis",
     "optional": false,
     "type": "ComputationBasis"
    },
    {
     "name": "entryUsers",
     "optional": false,
     "type": "number"
    },
    {
     "name": "overallConversionRate",
     "optional": false,
     "type": "number"
    },
    {
     "name": "totalConverted",
     "optional": false,
     "type": "number"
    },
    {
     "name": "largestDropOffStep",
     "optional": false,
     "type": "number | null"
    },
    {
     "name": "largestDropOffCount",
     "optional": false,
     "type": "number | null"
    },
    {
     "name": "slowestStep",
     "optional": false,
     "type": "number | null"
    },
    {
     "name": "steps",
     "optional": false,
     "type": "StepMetrics[]"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S2 first-run (no data at all)",
   "\"لا توجد بيانات أحداث بعد. الصق عيّنة محدودة ليُفتح مكتب الاستكشاف كاملاً — المسارات والدروز والتلبيد — على أرقامك أنت.\"",
   "Paste a sample",
   "S2 no-data-after-activity (source unbound after having data)",
   "\"لم يعد مصدر الأحداث مرتبطاً. تبقى الأدلة السابقة مقروءة — سطر الأساس يسمّي المصدر الذي حُسبت عليه. الصق عيّنة لمواصلة الاستكشاف.\""
  ],
  "loading": [
   "S3 cascade skeleton",
   "(skeleton stratum stack ×5, seam-gap geometry included, RTL-flipped) + SR: \"Computing the funnel — 27,882 events in range…\"",
   "(مجموعة طبقات هيكلية ×5 مع فجوات الدروز) + \"جارٍ حساب المسار — 27,882 حدثاً في النطاق…\"",
   "S3 re-query (range/window change)",
   "\"Recomputing — the last render stays until the new one lands.\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (paste row malformed)",
   "\"لم يُستورد الصف 17 — طابعه الزمني يقرأ 2026-13-32 99:00. أصلح الصف وأعد محاولة الاستيراد؛ والصفوف الأخرى البالغة 119 بلا تأثر.\"",
   "VALIDATION (zero-step funnel)",
   "\"Cannot save a funnel with no steps. Add at least one event from the taxonomy.\""
  ],
  "success": [
   "Funnel saved",
   "\"حُفظ المسار — الإصدار 3. سيذكر أساس المثلّج هذا الإصدار من التشغيل التالي.\"",
   "Cascade rendered (first compute)",
   "\"Computed — 400 entered, 121 converted (30.25%). Largest seam: First Search → Add to Cart, 86 lost.\"",
   "\"حُسب — دخل 400، وتحوّل 121 (30.25%). أكبر درز: البحث الأول ← الإضافة إلى السلة، بفقد 86.\""
  ]
 },
 "briefLine": "An exploration canvas for conversion funnels, built for growth teams who already have event data and do not have answers. Every product analytics vendor on the market ships a funnel report (01 §2 — funnels are table stakes, included on every plan tier of every major competitor), and every one of them buries the interesting part behind a query builder: pick events, get a bar chart, read the steepest bar, save a cohort, go ask a data analyst why. This product owns the part after the bar chart. The analyst composes a funnel from a bilingual event taxonomy (a governed dictionary of canonical event names with English and Arabic display labels, declared properties, owner, status, and a lint report that enforces the naming conventions the vendors themselves publish — 01 §3, q9/q10/q13), the funnel renders as The Cascade (06/13 — the product's signature visualization: each step a stratum, conversions flowing down in chartreuse, drop-offs shearing off as visible lost flow), and then the real work begins: selecting a seam — the gap between two steps where users leak — and exploring it. Seam exploration is three instruments with one grammar: breakdowns (any taxonomy property axis sliced against the seam, sorted by separation), displaced paths (what the lost users did instead — the path-exploration precedent, 01 §3, q19), and time-to-convert distributions (median and p90 per transition, the \"slowest conversion step\" craft, 01 §3, q20)."
} as const;
export type Spec = typeof SPEC;
