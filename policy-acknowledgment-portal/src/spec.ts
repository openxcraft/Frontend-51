// GENERATED from specs-source/policy-acknowledgment-portal/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "policy-acknowledgment-portal",
 "title": "Policy Acknowledgment Portal",
 "family": "business_ops",
 "tier": 3,
 "flagship": false,
 "adapter": "PolicyAcknowledgmentAdapterV1",
 "direction": "bilingual-en (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Ittibaq Denim",
  "pairing": "P01",
  "radius": "8px",
  "elevation": "flat-line",
  "icon": "line-2",
  "motion": "minimal",
  "fonts": [
   "IBM Plex Sans Arabic",
   "IBM Plex Sans"
  ],
  "primary": "#055D7E",
  "accent": "#003E5E",
  "canvas": "#18232A"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Policies register",
   "purpose": "the authoritative list: title (bilingual), category, current version, effective date, coverage state, governing locale",
   "shell": "",
   "data": "listPolicies, createPolicy, getPolicy, getSession",
   "archetype": "settings-admin"
  },
  {
   "id": "S2",
   "name": "Policy detail",
   "purpose": "bilingual metadata panel, version timeline with supersedes chain, campaign history, body previews per locale",
   "shell": "Policy detail",
   "data": "getPolicy, listPolicyVersions, getPolicyVersion, updatePolicyMetadata",
   "archetype": "board"
  },
  {
   "id": "S3",
   "name": "Version publish",
   "purpose": "document-control form (label, effective date, change summary, supersedes) + per-locale body upload/paste + reader preview",
   "shell": "Version publish",
   "data": "publishPolicyVersion, getPolicyVersion, withdrawPolicyVersion",
   "archetype": "wizard-flow"
  },
  {
   "id": "S4",
   "name": "Campaign composer",
   "purpose": "version target, segment pickers with live membership read-out, due window, reminder cadence, attestation text pair, required-locale rule",
   "shell": "",
   "data": "getPolicyVersion, listSegments, createCampaign, getUsage",
   "archetype": "editor-studio"
  },
  {
   "id": "S5",
   "name": "Coverage console",
   "purpose": "per-campaign arithmetic + derived-zone rosters + drill-downs; reminder/extend actions",
   "shell": "",
   "data": "getCampaign, listCampaigns, listAcknowledgments, getAcknowledgment, updateCampaign, cancelCampaign",
   "archetype": "board"
  },
  {
   "id": "S6",
   "name": "Person history",
   "purpose": "every version a person acknowledged (when, which locale), pending items, inactive marker",
   "shell": "",
   "data": "listPeople, listAcknowledgments, getAcknowledgment",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Ledger",
   "purpose": "append-only register of every consequential event; filterable, keyboard-navigable, exportable (a11y-baseline §7)",
   "shell": "",
   "data": "listLedger",
   "archetype": "board"
  },
  {
   "id": "S8",
   "name": "Evidence pack",
   "purpose": "scope picker (campaign / version), pack contents preview, artifact list with expiry",
   "shell": "Evidence pack",
   "data": "exportEvidencePack, getArtifact, listJobs",
   "archetype": "board"
  },
  {
   "id": "S9",
   "name": "People & segments",
   "purpose": "roster with bilingual names, import wizard, segment editors with future-only-membership rule",
   "shell": "",
   "data": "listPeople, createPerson, importPeople, updatePerson, listSegments, createSegment, updateSegment",
   "archetype": "editor-studio"
  },
  {
   "id": "S10",
   "name": "Settings",
   "purpose": "Rail surface described in IA prose",
   "data": "",
   "archetype": "settings-admin"
  },
  {
   "id": "S11",
   "name": "Jobs console",
   "purpose": "Surface described in IA prose",
   "data": "",
   "archetype": "jobs-centre"
  }
 ],
 "flows": [
  {
   "title": "CP-6 — People, segments, and platform management (the keep-the-lights-on path)",
   "steps": [
    "Single-person add for the one-off joiner (the always-available path); deactivation for leavers (never deletion — 07a). createPerson · updatePerson · listPeople",
    "Jobs console: import, dispatch, and export jobs with state, cancel/retry, link-to-context (async-contract §7; T3-consolidated single console). listJobs",
    "*Recovery: people import is resumable by failed-row resubmit; every directory mutation appends to the ledger."
   ]
  },
  {
   "title": "Non-happy paths",
   "steps": [
    "No directory capability bound: CSV import + single-person add are the primary paths; nothing waits on HR sync (08 N2).",
    "No document storage channel bound: pasted text bodies render identically; upload is an accelerator, paste is the floor (08 N3)."
   ]
  }
 ],
 "components": [
  {
   "name": "PolicyRegisterGrid",
   "purpose": "the authoritative list: bilingual titles (each at own direction, bidi-isolated), category mark, current version label, effective date, governing-locale mark, coverage state chip",
   "obligations": "P18 grid (arrow navigation, range selection); virtualized >200 rows (P19) with focus preservation and row-count context on region entry; mixed-script titles never force ambient direction; Western numerals; state chips are icon+text+count (never color alone); card collapse at 360px (ux-guidelines Table Handling row)"
  },
  {
   "name": "VersionTimeline",
   "purpose": "a policy's supersedes chain: spine with version nodes (label, effective date, status: draft/published/superseded/withdrawn), change summaries bilingual, coverage census per version",
   "obligations": "Timeline is a semantic ordered list (SR reads v3.1 → v3.0 → v2.3 order); withdrawn/superseded states use grey/plum labels at 5.53:1/5.92:1 contracts (05); keyboard: ↑/↓ walk nodes, Enter opens version detail; the spine mirrors in RTL (reading-axis geometry, rtl-rules §2)"
  },
  {
   "name": "BilingualBodyPanel",
   "purpose": "per-locale policy bodies: side-by-side or single-locale view, per-side direction rendering, body digest + size + paste/upload provenance",
   "obligations": "Each side renders at its own direction inside an isolating container; locale toggle announces locale names in text; unpaired-side warning is icon+text; the panel never offers editing (LOOP-10 — bodies are read-only evidence); governing-locale mark (steel, icon+text) sits on the governing side"
  },
  {
   "name": "DocumentControlForm",
   "purpose": "publish metadata: version label, effective date, bilingual change summary, supersedes selector",
   "obligations": "Label-grammar validation with precise field errors (draft 0.x / published 1.0+ — house grammar from research [44]–[51]); date input with inputmode + Gregorian ISO storage; change-summary fields are a bilingual pair with unpaired-warning state (never blocked — 03 CP-1 edge); P09 progressive disclosure (metadata → bodies → review)"
  },
  {
   "name": "CampaignComposer",
   "purpose": "version target, segment pickers with live membership read-out, due window, reminder cadence, attestation-text pair, required-locale rule",
   "obligations": "Membership read-out is a live count announced politely on change (\"Segment Retail Operations: 28 members\"); overlap dedup pre-computation surfaces before launch with named campaigns; attestation-text pair is human-authored both sides (unpaired warning at governing locale BLOCKS launch — 03 CP-2 gate); every field label persists (never ghost text, a11y-baseline §5)"
  },
  {
   "name": "CoverageConsole",
   "purpose": "per-campaign arithmetic row + derived-zone rosters (acknowledged/pending/overdue/declined) + drill-downs",
   "obligations": "Arithmetic as text first (\"28 assigned · 11 acknowledged · 4 overdue · 1 declined · 12 pending\"); zones are filterable lists, not heat blobs; roster rows carry person links; overdue is derived at read (deterministic — same state, same zone, every time); reminder/extend actions on rows with P07 bulk bar; zone chips carry the 05 tint+icon+text contracts"
  },
  {
   "name": "AcknowledgmentDetailCard",
   "purpose": "the evidence record: person, version, locales attested with per-locale read timestamps, attestation text (as pinned), digest, ledger link",
   "obligations": "All timestamps announced with the action (a11y-baseline §7); digest renders as monospaced-hint tabular figures (pairing at tnum, no third family); locales listed as text badges; the card links to its ledger entry and the attestation text appendix; declined records render the reason (if given) with the plum contract"
  },
  {
   "name": "AttestationLedgerView",
   "purpose": "the append-only register: actor, action kind, target, timestamp, detail; filterable by kind/policy/campaign/actor/date",
   "obligations": "Keyboard-navigable as a data grid (P18) and exportable (a11y-baseline §7 obligation — legal/audit overlay); entries are immutable (no edit affordances exist, and the copy says so at export); filter chips P08; virtualized >200 entries; ledger glyph (constructed, line-2) marks attestation entries"
  },
  {
   "name": "ReaderSurface",
   "purpose": "the acknowledger's document view: bilingual header, locale toggle with governing mark, body at own direction, heading navigation + structured outline panel",
   "obligations": "Focus order runs across the entire agreement text with the outline panel as the structured alternative (a11y-baseline §7 — binding); heading navigation via ↑/↓ once a heading is focused; body ≥1.7 line-height Arabic with tashkeel headroom; read tracking is timestamp recording, never scroll-policing (no read-time shaming UI); 400% reflow safe with worst-case Arabic strings (rtl-rules §5)"
  },
  {
   "name": "AttestationGate",
   "purpose": "the confirm control: attestation text in the attesting locale, typed-name confirmation, locale-read states, submit + decline",
   "obligations": "Radio-style locale attestation list with read states as text; typed-name field with autocomplete=name off + label persistent; the required-locale rule gates submit with honest copy (a quiet gate, not a quiz — LOOP-10); Decline is a first-class action with optional reason (never hidden behind a menu); on success renders the Ledger Line (the signature micro-interaction, 05) with the fact announced; on failure the typed error keeps the typed name (P11 redundant-entry — never make them retype)"
  }
 ],
 "ops": [
  "getSession",
  "listPolicies",
  "getPolicy",
  "createPolicy",
  "updatePolicyMetadata",
  "publishPolicyVersion",
  "listPolicyVersions",
  "getPolicyVersion",
  "withdrawPolicyVersion",
  "listPeople",
  "createPerson",
  "importPeople",
  "updatePerson",
  "listSegments",
  "createSegment",
  "updateSegment",
  "createCampaign",
  "updateCampaign",
  "listCampaigns",
  "getCampaign",
  "cancelCampaign",
  "listAcknowledgments",
  "getAcknowledgment",
  "listMyAssignments",
  "getPolicyVersionForReader",
  "recordView",
  "submitAcknowledgment",
  "submitDecline",
  "listLedger",
  "exportEvidencePack",
  "getArtifact",
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
     "name": "governingLocaleHint",
     "optional": false,
     "type": "GoverningLocaleRule"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "PolicyBody",
   "fields": [
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "source",
     "optional": false,
     "type": "'paste' | 'upload'"
    },
    {
     "name": "text",
     "optional": false,
     "type": "string"
    },
    {
     "name": "contentDigest",
     "optional": false,
     "type": "string"
    },
    {
     "name": "charCount",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "PolicyVersion",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "policyId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "label",
     "optional": false,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "VersionStatus"
    },
    {
     "name": "bodies",
     "optional": false,
     "type": "PolicyBody[]"
    },
    {
     "name": "changeSummaryEn",
     "optional": true,
     "type": "string"
    },
    {
     "name": "changeSummaryAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "effectiveDate",
     "optional": false,
     "type": "string"
    },
    {
     "name": "supersedesVersionId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "withdrawalReason",
     "optional": true,
     "type": "string"
    },
    {
     "name": "publishedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "publishedByMemberId",
     "optional": true,
     "type": "string"
    }
   ]
  },
  {
   "name": "Person",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "employeeNumber",
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
     "optional": true,
     "type": "string"
    },
    {
     "name": "email",
     "optional": true,
     "type": "string"
    },
    {
     "name": "phone",
     "optional": true,
     "type": "string"
    },
    {
     "name": "site",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "'employee' | 'contractor'"
    },
    {
     "name": "status",
     "optional": false,
     "type": "'active' | 'inactive'"
    },
    {
     "name": "deactivatedAt",
     "optional": true,
     "type": "string"
    },
    {
     "name": "readingLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "segmentIds",
     "optional": false,
     "type": "string[]"
    }
   ]
  },
  {
   "name": "Segment",
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
     "optional": true,
     "type": "string"
    },
    {
     "name": "memberPersonIds",
     "optional": false,
     "type": "string[]"
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
   "name": "AttestationText",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "textEn",
     "optional": false,
     "type": "string"
    },
    {
     "name": "textAr",
     "optional": true,
     "type": "string"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Campaign",
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
     "name": "policyVersionId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "segmentIds",
     "optional": false,
     "type": "string[]"
    },
    {
     "name": "dueWindowDays",
     "optional": false,
     "type": "number"
    },
    {
     "name": "dueDate",
     "optional": false,
     "type": "string"
    },
    {
     "name": "reminderCadenceDays",
     "optional": false,
     "type": "number[]"
    },
    {
     "name": "attestationTextId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "requireLocale",
     "optional": false,
     "type": "'governing' | 'both'"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'running' | 'cancelled'"
    },
    {
     "name": "launchedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "launchedByMemberId",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Assignment",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "campaignId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "personId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'assigned' | 'acknowledged' | 'declined'"
    },
    {
     "name": "assignedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "ReadEvidence",
   "fields": [
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "openedAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Acknowledgment",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "assignmentId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "personId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "campaignId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "policyVersionId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "attestationTextId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "localesAttested",
     "optional": false,
     "type": "Locale[]"
    },
    {
     "name": "readEvidence",
     "optional": false,
     "type": "ReadEvidence[]"
    },
    {
     "name": "submittedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "attestationDigest",
     "optional": false,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 register first-run",
   "New policy / Open sample policy",
   "S1 filtered-empty",
   "\"No policies match these filters.\"",
   "\"لا سياسات تطابق هذه المرشّحات.\""
  ],
  "loading": [
   "S1 register skeleton",
   "skeleton rows ×8 + \"Loading your register…\" (SR)",
   "صفوف هيكلية ×8 + \"جارٍ تحميل سجلّك…\"",
   "S5 coverage console skeleton",
   "arithmetic-row skeleton (counts row + zone list geometry, per direction) + \"Loading the coverage arithmetic…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (publishPolicyVersion — label grammar, G1)",
   "\"يتبع مُعرِّف الإصدار قواعد ضبط الوثائق — المسودّات v0.x والمنشور v1.0 فأعلى. لا يمكن نشر 'v0.9'؛ احفظها مسودّةً أو سمِّها v1.0.\"",
   "VALIDATION (publishPolicyVersion — governing-locale body missing, G1)",
   "VALIDATION (publishPolicyVersion — effective date in the past, G1)"
  ],
  "success": [
   "Version published",
   "\"v3.0 published — effective 1 Nov 2026, superseding v2.1. Its acknowledgments remain valid evidence for the period v2.1 governed.\"",
   "\"نُشر v3.0 — نافذٌ من 1 نوفمبر 2026، ويحلّ محلّ v2.1. وتبقى إقرارات v2.1 دليلاً صحيحاً عن الفترة التي حكمها.\"",
   "Draft saved",
   "\"Draft v0.2 saved — unpublished, untargetable by campaigns, never lost.\""
  ]
 },
 "briefLine": "A bilingual policy acknowledgment portal for compliance admins at MENA organizations: one authoritative register of the policies a workforce is bound to, each policy carrying immutable, versioned documents in both English and Arabic, and an attestation ledger that records — append-only, with timestamps and version pins — exactly who acknowledged which version of which policy, when, in which locale, and against which attestation text. The product's center of gravity is not policy storage and it is emphatically not policy drafting: the truth begins when a finished policy document exists (uploaded or pasted, stored whole and read-only), passes through a document-control publish step (version label, effective date, change summary, supersedes chain), and lands in the workflow the category already recognizes as its core grammar — who, when, which version (research digest source [1]) — extended with the bilingual dimension no competitor in our research corpus treats as a first-class schema: per-locale document bodies, per-locale read tracking, and a per-policy governing-locale rule that mirrors the legal reality of the region (in Saudi Arabia, workplace policies must be written in Arabic even when bilingual — Labor Law Article 9 per sources [33][34]; in the UAE the handbook language is not prescribed but MoHRE communications run in Arabic [35])."
} as const;
export type Spec = typeof SPEC;
