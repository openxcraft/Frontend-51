// GENERATED from specs-source/kpi-alert-watch/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "kpi-alert-watch",
 "title": "Kpi Alert Watch",
 "family": "analytics",
 "tier": 3,
 "flagship": false,
 "adapter": "KpiAlertWatchAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Tanbih Magenta-Plum",
  "pairing": "P12",
  "radius": "8px",
  "elevation": "soft-lift",
  "icon": "duotone",
  "motion": "energetic",
  "fonts": [
   "Harmattan",
   "Work Sans"
  ],
  "primary": "#B15AA9",
  "accent": "#7E2A78",
  "canvas": "#322330"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Console home",
   "purpose": "page-class banner, open detection queue, feed-health strip, watch chips, first-run sample (P22)",
   "shell": "",
   "data": "listDetections, listFeeds, listWatches, getSession",
   "archetype": "review-queue"
  },
  {
   "id": "S2",
   "name": "Feed workspace",
   "purpose": "series with baseline band, ingestion (paste/import + capability tab), attached watches",
   "shell": "",
   "data": "getFeed, getMetricSeries, ingestMetricPoints, syncMetricFeed, listWatches",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S3",
   "name": "Watch editor",
   "purpose": "policy-as-prose authoring, sensitivity, tiers, backtest preview, version history",
   "shell": "Watch editor",
   "data": "getWatch, getFeed, getMetricSeries, runEvaluation (backtest), createWatch, updateWatch",
   "archetype": "editor-studio"
  },
  {
   "id": "S4",
   "name": "Detections triage",
   "purpose": "filterable list, bulk acknowledge, snooze/dismiss affordances, saved views (P08)",
   "shell": "",
   "data": "listDetections, updateDetectionStatus, deleteWatch (maintenance)",
   "archetype": "review-queue"
  },
  {
   "id": "S5",
   "name": "Detection detail",
   "purpose": "bilingual explanation card, series context chart, narration assist + provenance, actions",
   "shell": "",
   "data": "getDetection, narrateDetection, updateDetectionStatus",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S6",
   "name": "Digest view",
   "purpose": "the bilingual daily/weekly document; delivery state; per-item links",
   "shell": "",
   "data": "listDigests, generateDigest, getDigest, deliverDigest",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S7",
   "name": "Season calendar",
   "purpose": "windows list (past/active/queued), upsert, affected feeds, overlap disclosure",
   "shell": "",
   "data": "listSeasonWindows, upsertSeasonWindow, listFeeds",
   "archetype": "calendar-grid"
  },
  {
   "id": "S8",
   "name": "Jobs console",
   "purpose": "all job classes, cancel/retry, link-to-context (T3-consolidated)",
   "shell": "",
   "data": "listJobs",
   "archetype": "jobs-centre"
  },
  {
   "id": "S9",
   "name": "Settings",
   "purpose": "digest preferences (P21 ladder), consent state, baseline disclosure, usage meter",
   "shell": "",
   "data": "getDigestPreferences, updateDigestPreferences, getUsage, getSession",
   "archetype": "settings-admin"
  },
  {
   "id": "S10",
   "name": "Command palette (overlay)",
   "purpose": "bilingual search across feeds/watches/detections/digests/actions",
   "shell": "",
   "data": "client-side over S1/S4/S6 data",
   "archetype": "dashboard-analytics"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Feed → paste ingestion → first watch → first explained detection (value proof)",
   "steps": [
    "The detection feed lists the new detection: feed name, observed vs baseline, delta in σ or %, tier chip (digest/page), status open. listDetections",
    "*Recovery: points persist across failed jobs; backtests are pure reads over stored series; the feed never loses ingested data on a job failure."
   ]
  },
  {
   "title": "CP-2 — The morning digest loop (the signature flow)",
   "steps": [
    "She opens one item's detection detail from the digest (deep link, context preserved). getDetection",
    "Cadence tier control lives in preferences: per watch class (page-class instant vs daily digest vs weekly digest), per member (P21 ladder). getDigestPreferences"
   ]
  },
  {
   "title": "CP-3 — Watch policy authoring, backtest, and tuning (the fatigue guard)",
   "steps": [
    "Tariq opens the watch editor from the watch list or a detection (\"tune this watch\"). listWatches · getWatch",
    "Save with versioned policy (stale-baseVersion edit → CONFLICT with both payloads). updateWatch",
    "Usage surface shows the window's assist narrations (P14 meter — deterministic engines deliberately render NO meter: unmetered by design). getUsage",
    "*Recovery: every policy version is retained; reverting is a save of a prior version; backtest is a pure function of stored series + candidate policy."
   ]
  },
  {
   "title": "CP-4 — Season calendar and the evaluation rhythm (the MENA calendar flow)",
   "steps": [
    "Hessa can pause a watch for a season (status paused with reason auto-suggested \"season window\", resume date defaulting to window end). updateWatch",
    "*Recovery: season windows are versioned data; watch pause/resume is logged with reasons; catch-up evaluations are marked catch-up."
   ]
  },
  {
   "title": "CP-5 — Console home, triage, jobs, and settings (the daily surface)",
   "steps": [
    "Jobs console: all job classes, cancel/retry, link-to-context. listJobs",
    "*Failures: NETWORK mid-list → banner + retry (P20); offline writes queue with per-item state and reconcile on return (async-contract §5).",
    "*Recovery: all lists cursor-paginated and re-fetchable; locale switches re-render without data loss."
   ]
  }
 ],
 "components": [
  {
   "name": "DetectionRow",
   "purpose": "the console queue's unit: feed name (bidi-isolated, own direction), observed vs baseline with delta (σ or %), tier chip (page/digest — icon+text+color), status mark, explanation excerpt (both languages, truncated at word boundaries — rtl-rules §4)",
   "obligations": "P18 grid (arrow navigation, range selection for bulk); virtualized >200 rows (P19) with focus preservation; row-count context on region entry; severity color never sole carrier (icon+text always); \"The Explained Arrival\" micro-interaction fires here (05 — reading-axis slide+settle, announcement carries the numbers); targets ≥24×24; Western numerals"
  },
  {
   "name": "ThresholdExplanationCard",
   "purpose": "the signature surface: the bilingual explanation pair rendered as two authored sentences with number slots highlighted (baseline, observed, band edges), plus the \"why this baseline\" disclosure (trailing window, same-weekday method, season exclusion)",
   "obligations": "Both language blocks render at their own direction in bidi-isolated containers (rtl-rules §2); numbers Western in both; disclosure is keyboard-reachable and SR-readable; the pair is never rendered as one mixed paragraph; narration-assist section, when present, appends BELOW the template pair with provenance chip (template/assist) — the template text is never replaced"
  },
  {
   "name": "SeriesBandChart",
   "purpose": "the feed/detection context chart: series line, seasonal baseline band (bullet-style flat zones: warning band edge, critical band edge, each edge numbered in the legend), season-window shading, offending-point flag",
   "obligations": "Chart runs right-to-left in RTL with value axis on the inline-end (rtl-rules §2); every band edge renders its number in text (charts.csv bullet contract — never gradient or heat-only); offending point carries icon+text flag; band transitions opacity-only; a data-table alternative is exposed for SR users (per-point observed/expected/deviation rows); threshold colors follow the 05 severity contracts (warning text never on wash)"
  },
  {
   "name": "WatchCard",
   "purpose": "watch summary: feed link, policy-as-prose excerpt (the template engine's sentence for the current policy), tier chip, status (active/paused-with-reason), last-evaluation stamp, version chip",
   "obligations": "Policy-as-prose renders bilingually per the same template tables as explanations (one engine, 07c); paused state shows reason + resume date as text; version chip discloses the policy version the last run used (provenance); keyboard path to the editor (Enter), maintenance menu has visible button equivalents"
  },
  {
   "name": "PolicyEditor",
   "purpose": "threshold bands (absolute or %-vs-baseline), anomaly sensitivity (1.5σ–4σ with plain-language reading at each stop), sustained-points window, severity tier per band (page opt-in with the interrupt-cost sentence)",
   "obligations": "P09 progressive disclosure (threshold mode first — works with zero history; anomaly layer behind \"add seasonality\"); every band input declares its unit; sensitivity slider is a real slider with keyboard equivalents (2.5.7 dragging rule) and announced value changes (polite); page-class opt-in shows the cadence-honesty sentence at selection; save gated on backtest preview shown (the fatigue guard is structural, not advisory)"
  },
  {
   "name": "BacktestPreview",
   "purpose": "the precision guard: candidate policy over the trailing window — detection count, per-feed breakdown, season-window intersections, dismissal-journal overlap (\"2 of 5 match reasons you previously dismissed\")",
   "obligations": "Read-only result marked backtest; counts as text (never a heat meter); journal-overlap rows link to the dismissal records; re-runs deterministically on every policy edit (same series + policy = same count); zero-state when the series is shorter than the window (honest VALIDATION copy, 11 §C)"
  },
  {
   "name": "DigestDocument",
   "purpose": "the bilingual daily/weekly artifact: header (date + counts in both languages), page-class section held at top, per-feed sections with explanation pairs, season note, footer with decisions recorded this cycle",
   "obligations": "Both language sections flow independently at their own direction (P23 sibling logic — side-by-side columns on desktop, stacked at ≤767px); items deep-link to detection detail with return path preserved (drill-down context rule); quiet-day state renders honestly (11 §A); immutable-once-assembled note rendered on re-render; delivery state chip (in console / delivered / delivery failed + retry)"
  },
  {
   "name": "SnoozeControl",
   "purpose": "snooze with reason + expiry: preset durations (1/3/7/14 days — 14 is the cap), reason required, expiry displayed, auto-resume promised in copy",
   "obligations": "P04 discipline (snooze is reversible → P03 undo window 7s; the cap is contract — 07b rule); reason field labeled above (ghost text never the label); expiry renders Western numerals; resumption note renders in the digest when a snooze expires (\"استؤنف الرصد بعد الكتم المؤقت\" — 11 §E)"
  },
  {
   "name": "TierLadder",
   "purpose": "P21 cadence control per watch class and per member: page-class instant / daily digest / weekly digest, with the ladder's cost sentence at each tier",
   "obligations": "Radio-group semantics with visible labels; changing a watch's tier names the consequence in text (\"page-class interrupts immediately; digest-class waits for the 8:00 digest\"); per-member preferences (S9) vs per-watch policy (S3) are distinct surfaces with distinct copy; never a silent default change"
  }
 ],
 "ops": [
  "getSession",
  "createFeed",
  "listFeeds",
  "getFeed",
  "getMetricSeries",
  "ingestMetricPoints",
  "syncMetricFeed",
  "createWatch",
  "listWatches",
  "getWatch",
  "updateWatch",
  "deleteWatch",
  "listSeasonWindows",
  "upsertSeasonWindow",
  "runEvaluation",
  "listDetections",
  "getDetection",
  "updateDetectionStatus",
  "narrateDetection",
  "listDigests",
  "getDigest",
  "generateDigest",
  "deliverDigest",
  "getDigestPreferences",
  "updateDigestPreferences",
  "listJobs",
  "getUsage"
 ],
 "entities": [
  {
   "name": "Workspace",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "name",
     "optional": false,
     "type": "string"
    },
    {
     "name": "defaultLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "baselineWindowWeeks",
     "optional": false,
     "type": "number"
    },
    {
     "name": "evaluationCadence",
     "optional": false,
     "type": "DataCadence"
    }
   ]
  },
  {
   "name": "Member",
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
     "name": "role",
     "optional": false,
     "type": "'owner' | 'editor' | 'viewer'"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "seatKind",
     "optional": false,
     "type": "'operator' | 'digest-reader'"
    }
   ]
  },
  {
   "name": "MetricFeed",
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
     "name": "nameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "unit",
     "optional": false,
     "type": "string"
    },
    {
     "name": "direction",
     "optional": false,
     "type": "FeedDirection"
    },
    {
     "name": "cadence",
     "optional": false,
     "type": "DataCadence"
    },
    {
     "name": "pointCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "lastPointAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "sourceKind",
     "optional": false,
     "type": "'manual' | 'capability' | 'both'"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "updatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "MetricPoint",
   "fields": [
    {
     "name": "feedId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    },
    {
     "name": "value",
     "optional": false,
     "type": "number"
    },
    {
     "name": "source",
     "optional": false,
     "type": "'manual' | 'import' | 'capability'"
    },
    {
     "name": "quality",
     "optional": false,
     "type": "'ok' | 'invalid'"
    }
   ]
  },
  {
   "name": "ThresholdBandSpec",
   "fields": [
    {
     "name": "kind",
     "optional": false,
     "type": "'absolute' | 'percent-vs-baseline'"
    },
    {
     "name": "warningEdge",
     "optional": false,
     "type": "number"
    },
    {
     "name": "criticalEdge",
     "optional": false,
     "type": "number"
    },
    {
     "name": "sustainedPoints",
     "optional": false,
     "type": "number"
    },
    {
     "name": "tier",
     "optional": false,
     "type": "SeverityTier"
    }
   ]
  },
  {
   "name": "AnomalyLayerSpec",
   "fields": [
    {
     "name": "sensitivitySigma",
     "optional": false,
     "type": "number"
    },
    {
     "name": "minHistoryPoints",
     "optional": false,
     "type": "number"
    },
    {
     "name": "tier",
     "optional": false,
     "type": "SeverityTier"
    }
   ]
  },
  {
   "name": "Watch",
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
     "name": "feedId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "policy",
     "optional": false,
     "type": "DetectionPolicy"
    },
    {
     "name": "status",
     "optional": false,
     "type": "WatchStatus"
    },
    {
     "name": "pausedReason",
     "optional": true,
     "type": "string"
    },
    {
     "name": "resumeAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "lastEvaluatedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "lastRunPolicyVersion",
     "optional": true,
     "type": "number"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "SeasonWindow",
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
     "name": "nameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "startsAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "endsAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "expectedEffect",
     "optional": false,
     "type": "'surge' | 'dip' | 'both'"
    },
    {
     "name": "feedIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "ExplanationPair",
   "fields": [
    {
     "name": "templateId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "en",
     "optional": false,
     "type": "string"
    },
    {
     "name": "ar",
     "optional": false,
     "type": "string"
    },
    {
     "name": "slots",
     "optional": false,
     "type": "Record<string, number | string>"
    }
   ]
  },
  {
   "name": "Narration",
   "fields": [
    {
     "name": "provenance",
     "optional": false,
     "type": "'template' | 'assist'"
    },
    {
     "name": "en",
     "optional": true,
     "type": "string"
    },
    {
     "name": "ar",
     "optional": true,
     "type": "string"
    },
    {
     "name": "generatedAt",
     "optional": false,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run",
   "\"No watches yet. Bring one number you own — or open the sample feed and read a detection that explains itself.\"",
   "\"لا مراقبات بعد. أحضر رقماً واحداً تملكه — أو افتح التغذية النموذجية واقرأ اكتشافاً يشرح نفسه.\"",
   "Create feed / Open sample feed",
   "S1 queue empty (watches exist)"
  ],
  "loading": [
   "S1 queue skeleton",
   "skeleton rows ×8 + \"Loading open detections…\" (SR)",
   "صفوف هيكلية + \"جارٍ تحميل الاكتشافات المفتوحة…\"",
   "Ingest job (determinate)",
   "\"Importing point 45 of 89 — 2 invalid rows marked, none dropped.\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (malformed ingest row)",
   "\"Row 17 has no value — rows around it imported fine. Fix row 17 and import just it.\"",
   "\"السطر 17 بلا قيمة — استُوردت الأسطر من حوله سليمة. صحّح السطر 17 واستورد وحده.\"",
   "VALIDATION (snooze without reason)"
  ],
  "success": [
   "Ingest done",
   "\"89 points in, 2 duplicates counted, 2 invalid marked — every one listed.\"",
   "\"دخلت 89 نقطة، وحُسب تكراران، ووُسم اثنان غير صالحين — كلها مدرجة.\"",
   "Evaluation done",
   "\"5 watches evaluated — 4 detections, 1 season-adjusted point recorded.\""
  ]
 },
 "briefLine": "A cross-metric alert console for team leads in MENA who own numbers that live in other people's tools. The buyer is not a data engineer and does not want to become one: she runs a delivery operation, a marketing budget, or a support queue, she can name six numbers she is accountable for (average delivery time, order completion rate, blended acquisition cost, CSAT, COD rejection rate, daily sales), and today she learns that one of them broke three days late — from a customer, from her manager, or from a monthly report. The product takes that job. The lead declares metric feeds (a named metric with its unit, its direction — higher-is-better or lower-is-better — and its data arriving either through the abstract metric-source capability when one is bound or by pasted/imported snapshots, which work from the first minute with zero credentials), puts a watch on each feed (a detection policy: threshold bands against a declared limit, seasonal anomaly detection against a computed baseline, or both), and chooses a cadence tier per watch: page-class (instant console interrupt) or digest-class (the daily or weekly digest). Everything the product says afterwards passes through one disciplined surface: the console's detection feed and the digest."
} as const;
export type Spec = typeof SPEC;
