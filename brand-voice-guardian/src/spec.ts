// GENERATED from specs-source/brand-voice-guardian/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "brand-voice-guardian",
 "title": "Brand Voice Guardian",
 "family": "content_tools",
 "tier": 3,
 "flagship": false,
 "adapter": "GuardianAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Hakam Plum",
  "pairing": "P01",
  "radius": "8px",
  "elevation": "flat-line",
  "icon": "line-2",
  "motion": "minimal",
  "fonts": [
   "IBM Plex Sans Arabic",
   "IBM Plex Sans"
  ],
  "primary": "#6D3B72",
  "accent": "#A8DCC0",
  "canvas": "#F6F3F6"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Check surface",
   "purpose": "paste/upload → run pass",
   "shell": "",
   "data": "runCheck(Job), getJob",
   "archetype": "list-console"
  },
  {
   "id": "S2",
   "name": "Findings review",
   "purpose": "grouped findings, accept/dismiss",
   "shell": "Findings review",
   "data": "getCheckResult, resolveFinding",
   "archetype": "review-queue"
  },
  {
   "id": "S3",
   "name": "Profiles list",
   "purpose": "profile cards + health",
   "shell": "",
   "data": "listProfiles",
   "archetype": "settings-admin"
  },
  {
   "id": "S4",
   "name": "Profile editor",
   "purpose": "glossary, banned, register, samples",
   "shell": "",
   "data": "getProfile, updateProfile, importTerms(Job)",
   "archetype": "editor-studio"
  },
  {
   "id": "S5",
   "name": "History",
   "purpose": "pass records list",
   "shell": "",
   "data": "listRecords(query)",
   "archetype": "review-queue"
  },
  {
   "id": "S6",
   "name": "Record view",
   "purpose": "findings + resolutions, export",
   "shell": "",
   "data": "getRecord, exportReport(Job)",
   "archetype": "jobs-centre"
  },
  {
   "id": "S7",
   "name": "Jobs center",
   "purpose": "import/calibration/export jobs",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S8",
   "name": "Settings/members",
   "purpose": "workspace basics",
   "shell": "",
   "data": "getSession, member ops",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Brand profile setup (the 30-minute commitment)",
   "steps": [
    "Create profile from the profiles list (S3 — listProfiles): name, declared register (بيضاء/وسطى), locales in scope (createProfile).",
    "Banned terms + optional regulated-phrases list (Tariq) — same versioned updateProfile write.",
    "Optional sample-copy upload (calibrate Job) → profile marked \"calibrated\" (drift thresholds informed by samples).",
    "Save; the profile health surface (getProfile — the S4 editor load) shows coverage (terms, banned, samples) — first-run checklist (P22).",
    "*Failures: import parse failure (typed error with row numbers); calibration analysis timeout (job per async-contract, retry).",
    "*Recovery: profile is versioned; changes are diffable (P16)."
   ]
  },
  {
   "title": "CP-2 — Governance pass (the daily value loop)",
   "steps": [
    "Check surface: paste text or upload a supported file (abstract parse need — paste always works).",
    "Resolved state produces a pass record (actor, timestamp, profile version) — the audit unit.",
    "*Failures: job failure (typed error, retry — no partial silence); quota (RATE_LIMIT ladder per P14 — usage window + reset read via getUsage).",
    "*Recovery: every pass record is retained and re-openable; dismissed findings carry reasons in the record."
   ]
  },
  {
   "title": "CP-3 — Report & audit export (Tariq's path)",
   "steps": [
    "Pass history list (listRecords — S5; filter by date/profile/author).",
    "Open record (getRecord, S6) → export audit report (exportReport Job — structured file: findings, resolutions, actors, timestamps, profile version).",
    "Artifact with expiry per async-contract (getArtifact); re-generable from record at any time.",
    "*Edges: export spanning multiple records (batch export job); profile changed since a record (report pins the profile VERSION used — governance honesty).",
    "*Failures: export quota (RATE_LIMIT); expired artifact (renew).",
    "*Recovery: records immutable; reports regenerate."
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "Zero findings: a clean-pass state with equal craft (\"Clean pass — 0 findings against 214 rules checked\") — the success state IS a feature for Salma.",
    "Offline: paste checks queue? No — checks require the adapter; offline banner (P20) with queue only for report exports. Honest boundary."
   ]
  }
 ],
 "components": [
  {
   "name": "FindingCard",
   "purpose": "one finding: span excerpt, rule, class, suggested fix, accept/dismiss",
   "obligations": "Keyboard triage (P18): ↑/↓, A accept, D dismiss-with-reason; span highlight bidi-safe in both directions; class = icon+text"
  },
  {
   "name": "ProfileHealth",
   "purpose": "coverage meter (terms/banned/samples/calibration)",
   "obligations": "Text equivalent always (counts); \"partial profile\" state visible wherever checks run"
  },
  {
   "name": "CleanPassStamp",
   "purpose": "zero-findings success state",
   "obligations": "140ms settle (05); announced politely with rules-checked count; never confetti"
  }
 ],
 "ops": [
  "getSession",
  "listProfiles",
  "getProfile",
  "createProfile",
  "updateProfile",
  "importTerms",
  "calibrate",
  "runCheck",
  "getRun",
  "listFindings",
  "resolveFinding",
  "bulkResolve",
  "listRecords",
  "getRecord",
  "exportReport",
  "getArtifact",
  "getUsage"
 ],
 "entities": [
  {
   "name": "CheckRun",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string; profileId: string; profileVersion: number; state: 'queued'|'running'|'succeeded'|'failed'"
    },
    {
     "name": "progress",
     "optional": false,
     "type": "{ determinate: boolean; done?: number; total?: number }"
    },
    {
     "name": "counts",
     "optional": true,
     "type": "Record<FindingClass, number>; degraded?: { registerHeuristicOnly: boolean }; error?: AdapterError; }"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "First-run (no profile)",
   "\"Build your first profile — a register, your terms, your banned list. Thirty minutes, once.\"",
   "\"ابنِ ملفك الأول — سجلٌ، ومصطلحاتك، وقائمة المحظورات. ثلاثون دقيقة، مرةً واحدة.\"",
   "Create profile",
   "No history"
  ],
  "loading": [
   "Check running",
   "\"Checking — 214 rules over your text.\"",
   "\"جارٍ التدقيق — ٢١٤ قاعدة على نصّك.\"",
   "Findings skeleton",
   "finding-card skeletons ×6"
  ],
  "error": [
   "VALIDATION",
   "\"A profile needs a name, a register, and at least one locale before it can govern anything.\"",
   "\"يحتاج الملف إلى اسمٍ وسجلٍ ولغةٍ واحدة على الأقل قبل أن يحكم شيئاً.\"",
   "NOT_FOUND (record)",
   "\"That record no longer exists in this workspace.\""
  ],
  "success": [
   "Clean pass",
   "\"Clean pass — 0 findings against 214 rules checked.\"",
   "\"تدقيق نظيف — ٠ نتائج مقابل ٢١٤ قاعدة مُدقّقة.\"",
   "Findings ready",
   "\"5 findings — 3 terminology, 1 banned, 1 register. Triage with the keyboard.\""
  ]
 },
 "briefLine": "Brand and communications managers (1–8 seats) at MENA brands and agencies who own voice consistency across writers, agencies, and freelancers — Omar-persona types (see arabic-copy-studio 02) who today act as human spell-checkers for the whole organization."
} as const;
export type Spec = typeof SPEC;
