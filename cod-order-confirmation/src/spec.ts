// GENERATED from specs-source/cod-order-confirmation/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "cod-order-confirmation",
 "title": "Cod Order Confirmation",
 "family": "commerce_integrations",
 "tier": 1,
 "flagship": true,
 "adapter": "CodOrderConfirmationAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Task Courier Carbon",
  "pairing": "P04",
  "radius": "4px",
  "elevation": "ink-press",
  "icon": "outline-geometric",
  "motion": "crisp",
  "fonts": [
   "Cairo",
   "Sora"
  ],
  "primary": "#1B1F27",
  "accent": "#262C34",
  "canvas": "#333A45"
 },
 "screens": [
  {
   "id": "S1",
   "name": "SIGN-IN",
   "purpose": "Both / all",
   "shell": "",
   "data": "session entry, locale pick, role routing",
   "archetype": "list-console"
  },
  {
   "id": "S2",
   "name": "QUEUE",
   "purpose": "Console ≥1280 + on-call ≥360",
   "shell": "",
   "data": "live confirmation queue: band, ladder state, countdown, aging",
   "archetype": "review-queue"
  },
  {
   "id": "S3",
   "name": "ORDER DRAWER (Ladder Trail + Risk drill)",
   "purpose": "Console (drawer over S2) / on-call bottom sheet",
   "shell": "",
   "data": "the working context: trail, buyer card, risk drill, actions",
   "archetype": "list-console"
  },
  {
   "id": "S4",
   "name": "AGREEMENT SHEET",
   "purpose": "Console (sheet) / on-call (sheet)",
   "shell": "",
   "data": "window selection + stamp; capacity-aware",
   "archetype": "list-console"
  },
  {
   "id": "S5",
   "name": "CALL LEG SHEET",
   "purpose": "Console (sheet) / on-call (sheet)",
   "shell": "",
   "data": "voice-rung script, buyer history, outcome recording",
   "archetype": "list-console"
  },
  {
   "id": "S6",
   "name": "HOLDS & EXCEPTIONS",
   "purpose": "Console / on-call read+decide",
   "shell": "",
   "data": "value-cap + risk-band + blocklist holds review",
   "archetype": "list-console"
  },
  {
   "id": "S7",
   "name": "MANIFESTS",
   "purpose": "Console (dispatch default)",
   "shell": "",
   "data": "draft build, rollup review, seal, export/print",
   "archetype": "list-console"
  },
  {
   "id": "S8",
   "name": "TEMPLATES STUDIO",
   "purpose": "Console",
   "shell": "",
   "data": "bilingual template authoring + buyer-view preview",
   "archetype": "editor-studio"
  },
  {
   "id": "S9",
   "name": "POLICY CENTER",
   "purpose": "Console",
   "shell": "",
   "data": "ladder + risk policies (simulation-gated), window catalog, people",
   "archetype": "settings-admin"
  },
  {
   "id": "S10",
   "name": "BUYERS DIRECTORY",
   "purpose": "Console",
   "shell": "",
   "data": "buyer history trails, blocklist management",
   "archetype": "list-console"
  },
  {
   "id": "S11",
   "name": "LEDGER & JOBS",
   "purpose": "Console",
   "shell": "",
   "data": "dispute chain view, activity log, exports, job center",
   "archetype": "review-queue"
  },
  {
   "id": "S12",
   "name": "INBOX",
   "purpose": "Console + on-call",
   "shell": "",
   "data": "notification ladder per class, seen state",
   "archetype": "review-queue"
  },
  {
   "id": "S13",
   "name": "ONBOARDING CHECKLIST",
   "purpose": "Both / first-run overlay",
   "shell": "",
   "data": "P22 value milestones, four persona entry paths",
   "archetype": "board"
  }
 ],
 "flows": [
  {
   "title": "CP-6 — Policy spine, people, buyers, templates + the resilience walkthrough (manager/ops; documented and tested)",
   "steps": [
    "People (S9 tab): listUsers / inviteUser / updateUser — three structural roles (agent / manager / dispatch); role changes are ledger entries.",
    "Jobs center (S11): getJob / retryJob / cancelJob — imports, manifest exports, ledger exports; retry scoped to failed rows/items only (async-contract §4)."
   ]
  }
 ],
 "components": [
  {
   "name": "LadderTrail",
   "purpose": "The attempt state machine as a horizontal rung rail: rungs for message → SMS → voice → agent call, each with state (queued/sending/sent/delivered/read/responded/failed/skipped), timestamp, response tag; cooldown arc on the active rung; mirrored RTL (progress toward inline-end)",
   "obligations": "Semantics: an ordered list of rung groups — attempt ordinal announced on focus (\"المحاولة 2 من 4 — رسالة نصية\" / \"attempt 2 of 4 — SMS\"); states are text+icon (never color-only); response tags carry the buyer's reply verbatim with bidi isolation; cooldown arc is decorative — the remaining time is ALSO text (\"المحاولة التالية بعد 2:10\" / \"next attempt in 2:10\"); rung stamps announce politely once (attempt sent), never per state tick. Motion: rungs stamp in with the cadence (≤80ms press → land → settle); reduced-motion = rungs render at final state, stamps collapse to state chips"
  },
  {
   "name": "AttemptStamp",
   "purpose": "One rung's state chip: kind glyph + state + timestamp; the trail's atom",
   "obligations": "Text carries the state; glyph is reinforcement; ≥24px target; focus ring at 2.4.13 strength; press feedback ≤80ms"
  },
  {
   "name": "AgreementStamp",
   "purpose": "The signature confirm artifact: the selected window chip pressed into the order's agreement slot, carrying window + evidence glyph + the attempt that produced it",
   "obligations": "The stamped state is ALSO a persistent chip with text (\"نافذة متفق عليها: الخميس 17:00–20:00\" / \"Agreed window: Thu 17:00–20:00\") + evidence link → ledger entry — motion never the only carrier (motion-language §5); assertive-once announcement at stamp time then polite summary (09); reduced-motion = crossfade to chip; the stamp glyph is semantically RESERVED for confirmed-with-agreement (06 reservation, enforced)"
  },
  {
   "name": "WindowPicker",
   "purpose": "Capacity-aware slot grid in the agreement sheet: day-grouped chips with day-part labels + remaining capacity; arrow navigation, Enter commits",
   "obligations": "Each chip is a radio with label \"صباحاً 9–12 · متبقٍ 12\" (state + capacity as text); capacity zero disables with reason (aria-disabled + text); day groups are fieldset/legend; selection announced politely; RTL day order mirrors (Thursday's group renders inline-start of Friday's); 400% reflow → vertical list, labels identical"
  },
  {
   "name": "RiskRail",
   "purpose": "The three-band score meter: horizontal rail split into low/medium/high bands with the score's band marker + total; drill expands the six components (buyer history, value band, latency, engagement, address, tenure) each with raw value → points math",
   "obligations": "Band is position + text (\"الخطورة منخفضة: 82\" / \"Risk low: 82\"), never hue alone; the marker is a focusable figure with described-by stating the score and band in words; drill is a disclosure (aria-expanded) with ≤60ms stagger capped at 6 rows then simultaneous; component rows meet 4.5:1; recompute wipes 120ms + names the delta (\"ارتفعت 18 نقطة بعد الاتفاق\" / \"up 18 points after the agreement\") — announced politely, not per keystroke"
  },
  {
   "name": "BuyerHistoryPanel",
   "purpose": "The drawer's buyer card: completed/refused/unreachable counts over the window, tenure, language, blocklist state",
   "obligations": "Counts are text+icon pairs (\"أنجز 12 · رفض 2 · لم يرد 1\"); history ratio renders as a mini bar WITH the numbers as text; blocklist state is an alert region with reason; no buyer PII beyond phone/name/locale (08 consent posture)"
  },
  {
   "name": "CallLegSheet",
   "purpose": "The voice-rung workspace: bilingual call script, buyer history beside it, prior responses verbatim, outcome recorder (6 outcomes + bounded note)",
   "obligations": "Script is a readable article (Arabic 1.75 line-height); outcome recorder is a radio group with labels, note field ≤140 chars with live count; Escape closes with restore-on-reopen (P11); submit = ⌘⏎ (Arabic-layout-safe); the sheet never traps focus past its own cycle (a11y-baseline §3)"
  },
  {
   "name": "TemplateComposer",
   "purpose": "Bilingual template editor: AR/EN side-by-side columns with alignment links (P23), parameter slots ({{name}}, {{value}}, {{window}}), per-locale direction rendering",
   "obligations": "Columns are labelled regions with per-side dir attributes; parameter slots are marked tokens with aria-described syntax help; length warnings per locale (ar ≈125% of en — copy-voice §5); version history is a list with diffs as text (P16); publish is a P15-class review step showing the composed preview first"
  },
  {
   "name": "MessagePreviewSheet",
   "purpose": "The buyer-view render of a template for a chosen order: per-locale direction, bidi isolation visible, parameters filled, quick-reply buttons as the buyer sees them",
   "obligations": "Renders in the BUYER's locale independent of console locale (two locales, two surfaces, one record — 05); bidi isolation is visible structure (isolate marks shown as subtle brackets in an inspect mode); the preview is static text (no channel branding — channel-abstract discipline); screen-reader path reads the composed message as an article"
  },
  {
   "name": "ManifestBatchBoard",
   "purpose": "Manifest build/review/seal surface: draft assembly, rollup (count, value, window mix, band rollup, exception flags), seal action, export/print path",
   "obligations": "Rollup is a definition list (text facts, Western numerals); seal is a consequence-naming action (P04 level-2: \"ختم 41 طلباً — 5 نوافذ، بقيمة 8,240 ريال\" — count named, immutable stated); sealed rows lock with the seal glyph + text; export/print are two labeled paths (channel vs download); late-order banner names the next-manifest path"
  }
 ],
 "ops": [
  "getSession",
  "listCodOrders",
  "getCodOrder",
  "importOrders",
  "setOrderHold",
  "cancelCodOrder",
  "startLadder",
  "getLadderPolicy",
  "updateLadderPolicy",
  "rescheduleAttempt",
  "logManualContact",
  "recordBuyerResponse",
  "listDeliveryWindows",
  "upsertDeliveryWindow",
  "proposeWindowsForOrder",
  "computeRiskScore",
  "getRiskPolicy",
  "updateRiskPolicy",
  "simulateRiskPolicy",
  "listBuyers",
  "getBuyer",
  "setBuyerStatus",
  "listMessageTemplates",
  "upsertMessageTemplate",
  "previewMessage",
  "listHandoffManifests",
  "createHandoffManifest",
  "sealHandoffManifest",
  "exportManifest",
  "listActivity",
  "exportConfirmationLedger",
  "listNotifications",
  "markNotificationsSeen",
  "subscribeOrderEvents",
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
     "name": "siteIds",
     "optional": false,
     "type": "string[]"
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
   "name": "Buyer",
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
     "name": "phone",
     "optional": false,
     "type": "string"
    },
    {
     "name": "displayName",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'active' | 'blocked'"
    },
    {
     "name": "blocklistReason",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "history",
     "optional": false,
     "type": "BuyerHistory"
    },
    {
     "name": "firstOrderAt",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "totalOrders",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "BuyerHistory",
   "fields": [
    {
     "name": "windowDays",
     "optional": false,
     "type": "number"
    },
    {
     "name": "completed",
     "optional": false,
     "type": "number"
    },
    {
     "name": "refused",
     "optional": false,
     "type": "number"
    },
    {
     "name": "unreachable",
     "optional": false,
     "type": "number"
    },
    {
     "name": "cancelled",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "CodOrder",
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
     "name": "orderRef",
     "optional": false,
     "type": "string"
    },
    {
     "name": "buyerId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "buyerPhoneAtOrder",
     "optional": false,
     "type": "string"
    },
    {
     "name": "siteId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "zoneCode",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "district",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "city",
     "optional": false,
     "type": "string"
    },
    {
     "name": "valueAmount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "currency",
     "optional": false,
     "type": "string"
    },
    {
     "name": "itemsNote",
     "optional": false,
     "type": "string | null"
    }
   ]
  },
  {
   "name": "ConfirmationLadder",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "orderId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "policyVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "startedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "startedBy",
     "optional": false,
     "type": "'engine-auto' | 'user'"
    },
    {
     "name": "expiresAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'running' | 'completed' | 'expired' | 'halted'"
    },
    {
     "name": "attemptIds",
     "optional": false,
     "type": "string[]"
    }
   ]
  },
  {
   "name": "ConfirmationAttempt",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "ladderId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "orderId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "AttemptKind"
    },
    {
     "name": "sequence",
     "optional": false,
     "type": "number"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'queued' | 'sending' | 'sent' | 'delivered' | 'read' | 'responded'"
    },
    {
     "name": "scheduledFor",
     "optional": false,
     "type": "string"
    },
    {
     "name": "sentAt",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "stateDetail",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "templateId",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "responseIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "loggedByUserId",
     "optional": false,
     "type": "string | null"
    }
   ]
  },
  {
   "name": "DeliveryWindow",
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
     "name": "siteId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "zoneCode",
     "optional": false,
     "type": "string"
    },
    {
     "name": "date",
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
     "name": "dayPart",
     "optional": false,
     "type": "'morning' | 'afternoon' | 'evening' | 'night'"
    },
    {
     "name": "capacity",
     "optional": false,
     "type": "number"
    },
    {
     "name": "committed",
     "optional": false,
     "type": "number"
    },
    {
     "name": "labelAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "labelEn",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "WindowAgreement",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "orderId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "windowId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "responseId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "attemptId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "agreedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "supersededById",
     "optional": false,
     "type": "string | null"
    },
    {
     "name": "active",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "RiskComponent",
   "fields": [
    {
     "name": "kind",
     "optional": false,
     "type": "RiskComponentKind"
    },
    {
     "name": "rawValue",
     "optional": false,
     "type": "number"
    },
    {
     "name": "normalized",
     "optional": false,
     "type": "number"
    },
    {
     "name": "weight",
     "optional": false,
     "type": "number"
    },
    {
     "name": "points",
     "optional": false,
     "type": "number"
    },
    {
     "name": "explanationAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "explanationEn",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "RiskScore",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "orderId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "totalPoints",
     "optional": false,
     "type": "number"
    },
    {
     "name": "band",
     "optional": false,
     "type": "'low' | 'medium' | 'high'"
    },
    {
     "name": "components",
     "optional": false,
     "type": "RiskComponent[]"
    },
    {
     "name": "engine",
     "optional": false,
     "type": "'rule-scorecard' | 'model-assisted'"
    },
    {
     "name": "policyVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "computedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "computedByUserId",
     "optional": false,
     "type": "string | null"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S2 queue first-run (no orders ever)",
   "\"No orders yet. Paste today's COD batch — or connect your order source later — and every order arrives scored and ladder-ready.\"",
   "\"لا طلبات بعد. الصق دفعة اليوم — أو اربط مصدر الطلبات لاحقاً — وسيصل كل طلب مسجَّل درجة الخطورة وجاهزاً للسلم.\"",
   "Paste import",
   "S2 queue no-data-after-activity (all resolved)"
  ],
  "loading": [
   "S2 queue skeleton",
   "(skeleton rows ×12 with band-chip + trail columns) + SR: \"Loading today's orders…\"",
   "(صفوف هيكلية ×12) + \"جارٍ تحميل طلبات اليوم…\"",
   "S3 drawer detail",
   "\"Loading the ladder and responses…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (import row malformed)",
   "VALIDATION (reschedule into quiet hours)",
   "VALIDATION (window not eligible — capacity)",
   "\"That window filled a moment ago — 0 slots left. The next open evening slot is Thursday 17:00–20:00 with 12 left.\""
  ],
  "success": [
   "Import done",
   "\"Imported 56 orders — 2 rows failed, 2 need your choice\"",
   "\"استورد 56 طلباً — فشل صفان، وصفان يحتاجان اختيارك\"",
   "Attempt logged (manual call)",
   "\"Logged: buyer confirmed — window Thursday evening\""
  ]
 },
 "briefLine": "The product ends at the courier's door, deliberately. Confirmed orders with agreements compile into a courier handoff manifest — a sealed, exportable batch artifact carrying each order's window, risk band, and confirmation evidence — which the merchant hands to whatever courier channel they use through an abstract handoff channel or the manual path (download/print/paste). There is no courier booking, no route optimization, no fleet logic at v1 (LOOP-10): the region's last-mile ecosystem is a binding-time decision for the owner, not a product promise. And there is no payment processing anywhere: the product never touches money, cards, or gateways; it touches intent, agreement, and evidence."
} as const;
export type Spec = typeof SPEC;
