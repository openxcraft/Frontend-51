// GENERATED from specs-source/loyalty-stamp-card/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "loyalty-stamp-card",
 "title": "Loyalty Stamp Card",
 "family": "commerce_integrations",
 "tier": 3,
 "flagship": false,
 "adapter": "LoyaltyStampAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Wafa Rose",
  "pairing": "P13",
  "radius": "22px",
  "elevation": "soft-lift",
  "icon": "filled-rounded",
  "motion": "calm",
  "fonts": [
   "Baloo Bhaijaan 2",
   "Plus Jakarta Sans"
  ],
  "primary": "#BC6CAB",
  "accent": "#7C316E",
  "canvas": "#2A2028"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Console home",
   "purpose": "today at the counter: stamps, redemptions, active cards, flags digest; P22 checklist on first run",
   "shell": "",
   "data": "getProgramInsights (today window), listAuditEntries (flags digest), getSession",
   "archetype": "list-console"
  },
  {
   "id": "S2",
   "name": "Stamper",
   "purpose": "the speed surface: lookup → card sheet → stamp / redeem / undo",
   "shell": "",
   "data": "lookupMember, getMemberCard, issueStamp, undoStamp, redeemReward, enrollMember (walk-in)",
   "archetype": "list-console"
  },
  {
   "id": "S3",
   "name": "Card studio",
   "purpose": "program authoring: kind, stamp count, bilingual tiers, policies; live dual-direction preview",
   "shell": "Card studio",
   "data": "createProgram, getProgram, updateProgram, setProgramStatus",
   "archetype": "editor-studio"
  },
  {
   "id": "S4",
   "name": "Programs",
   "purpose": "list with status/version; archive path; studio entry",
   "shell": "",
   "data": "listPrograms, getProgram",
   "archetype": "editor-studio"
  },
  {
   "id": "S5",
   "name": "Members ledger",
   "purpose": "normalized bilingual search, filters (active/expiring/expired/blocked), pagination",
   "shell": "",
   "data": "listMembers, lookupMember",
   "archetype": "review-queue"
  },
  {
   "id": "S6",
   "name": "Member detail",
   "purpose": "card state, full timeline (stamps/undos/adjustments/redemptions/renewals), notes, pass panel, block path",
   "shell": "",
   "data": "getMember, getMemberCard, updateMember, setMemberStatus, createPassToken, adjustStamps",
   "archetype": "list-console"
  },
  {
   "id": "S7",
   "name": "Member pass (customer-facing)",
   "purpose": "token-keyed, phone-first, read-only: card, stamp dots, tier ladder with distances, member QR",
   "shell": "",
   "data": "getPassView",
   "archetype": "list-console"
  },
  {
   "id": "S8",
   "name": "Insights",
   "purpose": "deterministic counters per program with disclosed arithmetic; export actions",
   "shell": "",
   "data": "getProgramInsights, exportMembers, listJobs",
   "archetype": "dashboard-analytics"
  },
  {
   "id": "S9",
   "name": "Staff & audit",
   "purpose": "staff list/roles/PIN lifecycle; the audit ledger with filters; flag board",
   "shell": "",
   "data": "listStaff, createStaffMember, setStaffStatus, listAuditEntries",
   "archetype": "board"
  },
  {
   "id": "S10",
   "name": "Settings",
   "purpose": "workspace locale, default program policies, retention window, artifact housekeeping",
   "shell": "",
   "data": "updateWorkspaceSettings, getSession, getArtifact",
   "archetype": "settings-admin"
  },
  {
   "id": "S11",
   "name": "Command palette (overlay)",
   "purpose": "bilingual search across members/programs/staff/audit",
   "shell": "",
   "data": "client-side over S4/S5/S9 data",
   "archetype": "list-console"
  }
 ],
 "flows": [
  {
   "title": "CP-1 — Card authoring → publish (the owner's first-evening flow)",
   "steps": [
    "He creates the program: Arabic + English program names, mode ladder, 8 stamps per card. Draft state. createProgram",
    "Programs list shows the new card live beside the seeded draft fixture. listPrograms"
   ]
  },
  {
   "title": "CP-2 — The counter stamp flow (the speed surface)",
   "steps": [
    "Wrong member or double-tap mistake: undo within the 120s counter window, before any later stamp on the same card. undoStamp",
    "When stamps hit the final tier, the sheet's primary action flips from stamp to redeem (the counter never offers a full-card stamp)."
   ]
  },
  {
   "title": "CP-4 — Member enrollment + pass delivery",
   "steps": [
    "Staff-side follow-through: the members ledger finds her by the same normalized search; her detail shows the card timeline. listMembers · getMember",
    "A name correction (or locale preference flip, or an internal note) edits the member record without touching card state. updateMember"
   ]
  },
  {
   "title": "CP-5 — The manager integrity loop",
   "steps": [
    "A compromised pass QR is rotated: the member keeps the card, the old token dies. createPassToken (rotate)",
    "*Failures: staff-role caller → PERMISSION with the honest scope statement; stale card version → CONFLICT with both payloads."
   ]
  },
  {
   "title": "CP-6 — Insights, exports, and settings",
   "steps": [
    "Faisal exports the member list (compliance copy): a Job with declared expiry, cancellable, honest row progress. exportMembers",
    "The artifact downloads from its link until expiry; after that, regeneration from unchanged state. getArtifact",
    "The jobs console consolidates exports (T3 posture per async-contract §7) with link-to-context and retry. listJobs",
    "*Recovery: exports regenerate deterministically from state; jobs reconcile on re-entry (async-contract §6)."
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "First-run: the P22 checklist on console home links each milestone into the flow that achieves it; no tours-of-balloons.",
    "Reduced motion: the stamp landing degrades to an instant fill + polite announcement (motion-language §5; 09)."
   ]
  }
 ],
 "components": [
  {
   "name": "StampDotCluster",
   "purpose": "the card's stamp dots: pending slots (rose tint) and earned stamps (Wafa Rose fill) in fill order inline-start → inline-end per direction",
   "obligations": "Dots are graphics at declared contrast (3.08:1 on tint — 05 contract); fill order mirrors in RTL; count text \"6 من 8\" renders beside in ink (Western numerals — the count is never color-only); the Stamp Landing is the one signature motion (05); SR: \"ختم 4 من 8\" polite on commit; target ≥44px on tablet view (2.5.8 exceeds)"
  },
  {
   "name": "StamperSearch",
   "purpose": "one field resolving members three ways: QR scan payload, 6-char short code, normalized phone/name search",
   "obligations": "Normalization disclosed (alef/taa-marbuta/yaa rules + phone digit stripping — rtl-rules §4); bidi-isolated rendering of mixed-script results; keystroke-to-paint ≤16ms (10); results are listbox semantics with arrow navigation; Enter resolves the top match; Esc clears and returns focus to the field"
  },
  {
   "name": "MemberCardSheet",
   "purpose": "the counter result: identity (masked phone), card face, tier ladder, state badges, stamp/redeem actions",
   "obligations": "One-hand operable (≥56px action targets tablet); state badges icon+text (expiring-soon amber-deep, blocked red, one-away rose-deep); actions disabled-with-reason, never hidden; CONFLICT re-fetch is one tap; the sheet is a dialog with focus trap + return (a11y-baseline §3)"
  },
  {
   "name": "TierLadderEditor",
   "purpose": "studio rows: stampsRequired stepper + nameAr + nameEn side-by-side (P23 columns) + final-tier mark",
   "obligations": "Both locales required — the blank-locale VALIDATION names the row and side; ascending stampsRequired enforced live; final tier must equal stampCount; alignment links between the two name fields; locale fields render at their own direction in isolation"
  },
  {
   "name": "CardPreview",
   "purpose": "live dual-direction card face: Arabic face and English face tabs, stamp dots, tier ladder, program names",
   "obligations": "Renders from program state only (never mock art); both directions true render (not mirrored CSS hacks); preview stage = raised surface, card carries the deepest soft-lift; numerals Western in both faces"
  },
  {
   "name": "RewardRedeemPanel",
   "purpose": "redeemable tiers on the card sheet/counter: tier name (member locale + other script secondary), redeem action with reset semantics",
   "obligations": "Redeemable = green-deep chip icon+text; P04 level-2 confirm names tier + reset consequence; receipt line renders bilingually post-commit; mid-tier vs final-tier semantics stated in the confirm itself; concurrent-redemption CONFLICT re-fetch in place"
  },
  {
   "name": "AuditTrail",
   "purpose": "the immutable ledger surface: actor, action kind, member, time; filter chips (actor/kind/date)",
   "obligations": "P17 grammar — active voice, named actors (\"أمينة ختمت بطاقة نورة العتيبي\"); rows keyboard-navigable; >200 rows virtualize (P19); timestamps Western numerals, timezone declared; no deletion affordance anywhere (append-only posture)"
  },
  {
   "name": "FlagBoard",
   "purpose": "deterministic threshold flags: staff ≥3 adjustments / 24h; member ≥2 cap-blocked attempts / 7d",
   "obligations": "Flags are computed counts with their thresholds written on the chip (\"3 تعديلات خلال 24 ساعة\"); each flag links to its filtered AuditTrail view; icon+text, never color alone; flags refresh with the ledger, no polling motion"
  },
  {
   "name": "ExpiryBadge",
   "purpose": "card states: active / expiring-soon (≤30 days) / expired",
   "obligations": "Amber-deep text + clock glyph (flips per direction rules — 06 flip table); the expiry date renders Western numerals; expired carries the honest consequence line (unredeemed tiers lost)"
  },
  {
   "name": "PassQR",
   "purpose": "the member's QR + short code display: on the pass view, on the counter sheet, and the printable join sheet",
   "obligations": "QR is the identity token — never the stamp authority (stamps are staff-sessioned; 00); short code renders LTR-isolated inside RTL chrome (rtl-rules §2 mixed-direction rule); print sheet carries both scripts and stock-safe geometry (08 N2 manual path)"
  }
 ],
 "ops": [
  "getSession",
  "createProgram",
  "updateProgram",
  "setProgramStatus",
  "listPrograms",
  "getProgram",
  "lookupMember",
  "getMemberCard",
  "issueStamp",
  "undoStamp",
  "redeemReward",
  "adjustStamps",
  "enrollMember",
  "listMembers",
  "getMember",
  "updateMember",
  "setMemberStatus",
  "createPassToken",
  "getPassView",
  "listStaff",
  "createStaffMember",
  "setStaffStatus",
  "listAuditEntries",
  "getProgramInsights",
  "exportMembers",
  "getArtifact",
  "listJobs",
  "updateWorkspaceSettings"
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
     "name": "nameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "defaultLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "joinCode",
     "optional": false,
     "type": "string"
    },
    {
     "name": "retentionMonths",
     "optional": false,
     "type": "number"
    },
    {
     "name": "policyDefaults",
     "optional": false,
     "type": "ProgramPolicy"
    },
    {
     "name": "timezone",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "RewardTier",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "stampsRequired",
     "optional": false,
     "type": "number"
    },
    {
     "name": "nameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "final",
     "optional": false,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "LoyaltyProgram",
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
     "name": "nameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "mode",
     "optional": false,
     "type": "ProgramMode"
    },
    {
     "name": "stampCount",
     "optional": false,
     "type": "number"
    },
    {
     "name": "tiers",
     "optional": false,
     "type": "RewardTier[]"
    },
    {
     "name": "policy",
     "optional": false,
     "type": "ProgramPolicy"
    },
    {
     "name": "status",
     "optional": false,
     "type": "ProgramStatus"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "publishedVersion",
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
   "name": "StaffMember",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "displayNameAr",
     "optional": false,
     "type": "string"
    },
    {
     "name": "displayNameEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "role",
     "optional": false,
     "type": "StaffRole"
    },
    {
     "name": "counterPin",
     "optional": false,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'active' | 'inactive'"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
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
     "name": "nameAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "nameEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "phoneCanonical",
     "optional": false,
     "type": "string"
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
     "name": "blockReason",
     "optional": true,
     "type": "string"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "enrolledChannel",
     "optional": false,
     "type": "'counter' | 'self'"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Card",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "programId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "memberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "stamps",
     "optional": false,
     "type": "number"
    },
    {
     "name": "cycle",
     "optional": false,
     "type": "number"
    },
    {
     "name": "redeemedTierIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "status",
     "optional": false,
     "type": "CardStatus"
    },
    {
     "name": "lastStampAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "expiredAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "openedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "StampEvent",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "cardId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "actorStaffId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "source",
     "optional": false,
     "type": "'counter' | 'adjustment'"
    },
    {
     "name": "delta",
     "optional": false,
     "type": "number"
    },
    {
     "name": "reason",
     "optional": true,
     "type": "AdjustmentReason"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "idempotencyKey",
     "optional": true,
     "type": "string"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    },
    {
     "name": "undone",
     "optional": true,
     "type": "boolean"
    }
   ]
  },
  {
   "name": "Redemption",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "cardId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "tierId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "actorStaffId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "stampsAtRedemption",
     "optional": false,
     "type": "number"
    },
    {
     "name": "cycle",
     "optional": false,
     "type": "number"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "PassToken",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "memberId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "token",
     "optional": false,
     "type": "string"
    },
    {
     "name": "issuedBy",
     "optional": false,
     "type": "'enrollment' | 'rotation'"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "AuditEntry",
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
     "name": "actorStaffId",
     "optional": false,
     "type": "string | 'self-enrollment'"
    },
    {
     "name": "action",
     "optional": false,
     "type": "AuditActionKind"
    },
    {
     "name": "targetRef",
     "optional": false,
     "type": "string"
    },
    {
     "name": "detail",
     "optional": true,
     "type": "string"
    },
    {
     "name": "at",
     "optional": false,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 first-run (no published program)",
   "\"لا بطاقة ولاء مباشرة بعد. أنشئ بطاقة ثنائية اللغة في الاستوديو — أو اختم لعميل العيّنة وشاهد السجل يدوّن ذلك.\"",
   "Open Card Studio / Stamp the sample member",
   "S1 checklist complete",
   "\"Your first day on the console: 41 stamps, 5 redemptions, every one attributed. The counter is yours.\""
  ],
  "loading": [
   "S2 search skeleton",
   "3 result rows + \"Resolving members…\" (SR)",
   "ثلاثة صفوف هيكلية + \"جارٍ إيجاد العملاء…\"",
   "S2 card sheet open",
   "\"Opening نورة العتيبي's card…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (daily cap — issueStamp)",
   "\"أخذت هذه البطاقة ختمها اليومي بالفعل — ختمتها أمينة في 08:12. قاعدة البطاقة ختمٌ واحد في اليوم؛ والتصحيح يحتاج المدير.\"",
   "VALIDATION (full card — issueStamp)",
   "\"The card is full — 8 of 8 stamps. Redeem the reward instead; the next card starts with it.\""
  ],
  "success": [
   "Stamp landed (the signature moment)",
   "\"Stamp 4 of 8 — two more to 'كوكيز مجاني'.\"",
   "\"ختم 4 من 8 — بقي ختمان حتى «كوكيز مجاني».\"",
   "Stamp crossed the final tier",
   "\"Stamp 8 of 8 — 'قهوة على حسابنا' is waiting at the register.\""
  ]
 },
 "briefLine": "The second pillar is the bilingual reward-tier system. A loyalty card is authored once in the Card Studio: how many stamps fill the card, which redemption mode it runs (classic single-reward, or a tiered ladder where a mid-card reward and a top-card reward coexist), and — the part no retrieved competitor treats as a first-class construct — every reward tier carries both an Arabic and an English name, authored side by side, validated so neither locale can be left blank. The member's pass renders tiers in the member's own locale with the other script a glance away; the counter surface shows staff the reward line exactly as it will be spoken aloud at the register, in the language of the moment (\"قهوة على حسابنا\" or \"any coffee on the house\"). Card expiry, daily stamp caps, and undo windows are deterministic policy data, not vibes: the same card state always yields the same eligibility answer, which is exactly what a counter-speed surface requires."
} as const;
export type Spec = typeof SPEC;
