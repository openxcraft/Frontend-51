// GENERATED from specs-source/patient-intake-forms/ (04 screens, 03 flows, 05 identity, 06 components, 07b ops). Do not edit by hand — edit the spec, re-run tools/generate.mjs.
export const SPEC = {
 "slug": "patient-intake-forms",
 "title": "Patient Intake Forms",
 "family": "specialized",
 "tier": 2,
 "flagship": false,
 "adapter": "PatientIntakeAdapterV1",
 "direction": "bilingual-ar (proposed, LOOP-6 pending confirmation)",
 "identity": {
  "colorName": "Rahma Sage",
  "pairing": "P12",
  "radius": "14px",
  "elevation": "soft-lift",
  "icon": "line-2",
  "motion": "calm",
  "fonts": [
   "Harmattan",
   "Work Sans"
  ],
  "primary": "#6CA17A",
  "accent": "#1E5B34",
  "canvas": "#193521"
 },
 "screens": [
  {
   "id": "S1",
   "name": "Forms library",
   "purpose": "form list, status/versions, operational counters (submissions, completion, flagged, pending), onboarding checklist (P22)",
   "shell": "",
   "data": "listForms, getFormOverview, getSession",
   "archetype": "board"
  },
  {
   "id": "S2",
   "name": "Form builder",
   "purpose": "section canvas + field palette + inspector; bilingual copy editing; version history",
   "shell": "",
   "data": "getForm, saveForm, publishForm, listSymptomTerms (inspector preview), duplicateForm, archiveForm, createForm",
   "archetype": "editor-studio"
  },
  {
   "id": "S3",
   "name": "Preview & test fill",
   "purpose": "the form as the patient sees it, both locales/directions, one-question-per-screen",
   "shell": "Preview & test fill",
   "data": "getForm (draft read; preview is render-only)",
   "archetype": "wizard-flow"
  },
  {
   "id": "S4",
   "name": "Fill sessions & links",
   "purpose": "create/monitor fill invitations: channel, expiry, state (open/filled/expired), resend",
   "shell": "",
   "data": "openFillSession, listSubmissions (state=in-progress filter)",
   "archetype": "list-console"
  },
  {
   "id": "S5",
   "name": "Submissions console",
   "purpose": "queue: state, urgent-flag count, pending-confirmation count, form, age; filters + saved views (P08)",
   "shell": "",
   "data": "listSubmissions, getSession",
   "archetype": "wizard-flow"
  },
  {
   "id": "S6",
   "name": "Submission review workspace",
   "purpose": "answers by section, normalization panel (modes, confirmations), urgent flag banner, review gate, audit chain",
   "shell": "Submission review workspace",
   "data": "getSubmission, resolveSymptomMatch, flagSubmission, setSubmissionReviewState, saveSymptomTerm (variant shortcut), exportIntakePackage",
   "archetype": "review-queue"
  },
  {
   "id": "S7",
   "name": "Vocabulary manager",
   "purpose": "term list + normalized search, term editor (canonical pair, variants, urgent flag), paste import, rules disclosure",
   "shell": "",
   "data": "listSymptomTerms, saveSymptomTerm, deleteSymptomTerm, importVocabulary",
   "archetype": "editor-studio"
  },
  {
   "id": "S8",
   "name": "Patient fill surface",
   "purpose": "the chrome-free flow: locale door → questions → symptom field with chips → review & attest → confirmation",
   "shell": "Patient fill surface",
   "data": "resumeFillSession, saveDraftAnswers, submitIntake, normalizeSymptomText",
   "archetype": "review-queue"
  },
  {
   "id": "S9",
   "name": "Exports & jobs",
   "purpose": "artifact list with expiry/regeneration, print view, jobs console (imports/exports with cancel/retry)",
   "shell": "",
   "data": "exportIntakePackage, getArtifact, listJobs, getUsage",
   "archetype": "jobs-centre"
  },
  {
   "id": "S10",
   "name": "Settings",
   "purpose": "locale defaults, fill-token expiry window, retention policy, capability consents (kind-not-vendor), activity audit",
   "shell": "",
   "data": "getSession, updateWorkspace, listActivity",
   "archetype": "settings-admin"
  }
 ],
 "flows": [
  {
   "title": "CP-4 — The symptom vocabulary (Nour's linguistic asset)",
   "steps": [
    "*Failures: import row without canonical pair → named invalid row; stale edit → CONFLICT both kept.",
    "*Recovery: terms are versioned; the vocabulary snapshots with the workspace (07c); every mutation logs (P17)."
   ]
  },
  {
   "title": "CP-5 — Export, handoff, and the EHR boundary (the honest edge)",
   "steps": [
    "Jobs console: exports and vocabulary imports with states, cancel/retry, link-to-context. listJobs",
    "*Recovery: artifacts regenerate identically from submission state; the queue reconciles after reconnect (async-contract §5)."
   ]
  }
 ],
 "components": [
  {
   "name": "BilingualFieldInspector",
   "purpose": "the builder's field editor: label, help text, and every option authored as ar+en pairs with per-locale completeness",
   "obligations": "Pair rows render per-side direction (P23 columns, alignment-linked); completeness check marks per option (both-locale check icon — icon + text, never color alone); length-far-apart warning between an option's two locales (~125% budget guidance, 10); placeholder-as-label is structurally impossible — the label input IS the persistent label (NN/g S8); keyboard-complete (Tab through pair rows, ⌘Enter saves); blur validation per field + error summary on save (skill rows 55/56); mixed-script previews bidi-isolated (rtl-rules §2)"
  },
  {
   "name": "PublishGatePanel",
   "purpose": "the bilingual completeness gate at form publish (CP-1.6)",
   "obligations": "Lists every gap as field + locale + missing kind (label/help/option/attestation) with jump links into the inspector; refusal copy names the first three gaps verbatim (never \"form incomplete\" — P04 discipline at artifact scale); gate status chip (blocked → clear); keyboard-traversable list; the SAME panel renders in preview mode as a completeness summary (S3)"
  },
  {
   "name": "QuestionCard",
   "purpose": "the fill surface's one-question-per-screen card (S8)",
   "obligations": "Persistent label above (never placeholder — S8 law), help text below in plain MSA, input types per field kind; direction follows the patient locale (RTL-first); progress spine on the inline-start edge; back/next along the reading axis (240ms slide, inline-start reveal in RTL); autosave indicator docked bottom (P10); required mark programmatic + visible; validation on advance-attempt (field-anchored message naming the LABEL — answers never echoed, a11y-baseline §7); 400% zoom reflow with worst-case Arabic strings (rtl-rules §5); targets ≥24×24"
  },
  {
   "name": "SymptomInputField",
   "purpose": "the signature field: free text + live vocabulary matching (CP-2.4/2.5)",
   "obligations": "Keystroke-to-paint ≤16ms (10); suggestion chips ≤120ms (dictionary) in a reserved region below the input (zero CLS); chips carry term pair (صداع — headache) + match mode; chip accept replaces the phrase visibly while the raw text persists underneath (verbatim-keep — the patient's words are immutable, 07a); assist-mode chips render ONLY as neutral \"suggested — staff will confirm\" hints at the patient surface (assist matches never self-apply — P15, 07c rule 3); mixed-script input bidi-isolated (dir=\"auto\"); the deterministic ruleset is disclosable from the field's help affordance (ai-native-patterns §7.4)"
  },
  {
   "name": "NormalizationPanel",
   "purpose": "the review workspace's matcher-truth surface (S6)",
   "obligations": "Rows per symptom entry: raw text (verbatim, own direction) · matched canonical pair · mode chip (exact=ink · normalized=sage · assist=indigo \"pending confirmation\" · unmatched=caution) · matched-span link into the answer · vocabulary version pin; confirm/correct controls on assist + unmatched rows (P15 — resolveSymptomMatch); correcting opens the vocabulary picker (never edits the raw text); \"add as variant\" shortcut prefills the term editor (CP-3.4); panel is the live region for match-state changes (polite); counts only in announcements (no PHI echoed — 09)"
  },
  {
   "name": "UrgentFlagBanner",
   "purpose": "red-flag surfacing in the review workspace + queue rows (CP-3.5)",
   "obligations": "Renders the urgent-term count + each flagged term's canonical pair + a link to the exact answer span (never the answer text in the banner — PHI discipline); escalate action records actor/timestamp/note (P17); ARRIVES without shake or pulse — red ink + icon carry the urgency (motion-language §2: errors/urgency arrive); assertive announcement ONCE on first render of a newly-flagged submission (09 schedule); staff-facing only — patient surfaces never show flags (02 Tariq's ethics posture, mirrored from clinic-appointment-desk Q-7's discipline)"
  },
  {
   "name": "FillSessionCard",
   "purpose": "fill invitation lifecycle surface (S4)",
   "obligations": "Channel glyph (link · kiosk · printed-qr), expiry countdown in Western numerals, state (open · filled · expired · in-progress-by-patient), resend action (P04 level-2 naming what a re-open does — new token, no silent merge, CP-2 edge); QR render for the printed path (the QR itself carries the opaque token, never patient data — 09); copy-link action with the copy announced; cards list states honestly (\"expired 2 hours ago — answers retained 90 days per policy\")"
  },
  {
   "name": "VocabularyTermEditor",
   "purpose": "symptom term authoring (S7)",
   "obligations": "Canonical pair (both locales required), variants list with optional dialect tags (Gulf/Levantine/Egyptian/MSA-adjacent), urgentAttention toggle with a confirm naming what it does (surfaces red flags on matching submissions — clinic-owned clinical policy), body-system tag (organizing only, never inference — recorded in the editor's help text), note; version history with DiffView; delete = P04 level-2 naming open-match count; normalized search with the ruleset disclosed in-panel (rtl-rules §4); two terms normalizing identically → VALIDATION naming both (CP-4 edge)"
  },
  {
   "name": "ReviewGateBar",
   "purpose": "the review-completion gate on the submission workspace (CP-3.6)",
   "obligations": "Live derived state: pending-confirmation count + unreviewed checks; \"Mark reviewed\" disabled (with reason text) while any assist match is pending — state changes are earned (the bilingual publish gate's discipline mirrored on the review side); on success the gate settles (calm 220ms, no overshoot) into the reviewed chip with actor + timestamp; the settle motion's information is fully redundant with the announcement + chip (reduced-motion safe, 09)"
  }
 ],
 "ops": [
  "getSession",
  "listForms",
  "createForm",
  "getForm",
  "saveForm",
  "publishForm",
  "archiveForm",
  "duplicateForm",
  "openFillSession",
  "resumeFillSession",
  "saveDraftAnswers",
  "submitIntake",
  "normalizeSymptomText",
  "listSubmissions",
  "getSubmission",
  "resolveSymptomMatch",
  "flagSubmission",
  "setSubmissionReviewState",
  "exportIntakePackage",
  "getArtifact",
  "listSymptomTerms",
  "saveSymptomTerm",
  "deleteSymptomTerm",
  "importVocabulary",
  "listJobs",
  "listActivity",
  "getFormOverview",
  "updateWorkspace",
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
     "type": "BilingualText"
    },
    {
     "name": "defaultLocale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "policies",
     "optional": false,
     "type": "{"
    },
    {
     "name": "fillTokenExpiryHours",
     "optional": false,
     "type": "number"
    },
    {
     "name": "retentionDays",
     "optional": false,
     "type": "number"
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
   "name": "FieldOption",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "label",
     "optional": false,
     "type": "BilingualText"
    }
   ]
  },
  {
   "name": "FormField",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "sectionId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "kind",
     "optional": false,
     "type": "FieldKind"
    },
    {
     "name": "label",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "helpText",
     "optional": true,
     "type": "BilingualText"
    },
    {
     "name": "required",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "options",
     "optional": true,
     "type": "FieldOption[]"
    },
    {
     "name": "symptomField",
     "optional": true,
     "type": "{"
    },
    {
     "name": "vocabularyId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "allowMultiple",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "allowFreeText",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "order",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "FormSection",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "title",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "order",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "IntakeForm",
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
     "name": "title",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "visitType",
     "optional": false,
     "type": "'new-patient' | 'follow-up' | 'procedure' | 'other'"
    },
    {
     "name": "status",
     "optional": false,
     "type": "FormStatus"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "sections",
     "optional": false,
     "type": "FormSection[]"
    },
    {
     "name": "fields",
     "optional": false,
     "type": "FormField[]"
    },
    {
     "name": "counts",
     "optional": false,
     "type": "{"
    },
    {
     "name": "submissions",
     "optional": false,
     "type": "number"
    },
    {
     "name": "inProgress",
     "optional": false,
     "type": "number"
    },
    {
     "name": "flagged",
     "optional": false,
     "type": "number"
    }
   ]
  },
  {
   "name": "FormVersion",
   "fields": [
    {
     "name": "formId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
    },
    {
     "name": "publishedAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "snapshot",
     "optional": false,
     "type": "Pick<IntakeForm, 'sections' | 'fields' | 'title' | 'visitType'>"
    }
   ]
  },
  {
   "name": "SymptomTerm",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "vocabularyId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "canonical",
     "optional": false,
     "type": "BilingualText"
    },
    {
     "name": "variants",
     "optional": false,
     "type": "{ text: string; locale: Locale; dialect?: DialectTag }[]"
    },
    {
     "name": "bodySystem",
     "optional": true,
     "type": "string"
    },
    {
     "name": "urgentAttention",
     "optional": false,
     "type": "boolean"
    },
    {
     "name": "provenance",
     "optional": false,
     "type": "'seeded-spec' | 'clinic-authored'"
    },
    {
     "name": "note",
     "optional": true,
     "type": "string"
    },
    {
     "name": "status",
     "optional": false,
     "type": "TermStatus"
    },
    {
     "name": "version",
     "optional": false,
     "type": "number"
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
   "name": "FillSession",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "formId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "formVersion",
     "optional": true,
     "type": "number"
    },
    {
     "name": "channel",
     "optional": false,
     "type": "FillChannel"
    },
    {
     "name": "token",
     "optional": false,
     "type": "string"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'open' | 'submitted' | 'expired'"
    },
    {
     "name": "expiresAt",
     "optional": false,
     "type": "string"
    },
    {
     "name": "openedByMemberId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "prefill",
     "optional": true,
     "type": "{ name?: string; dateOfBirth?: string }"
    },
    {
     "name": "createdAt",
     "optional": false,
     "type": "string"
    }
   ]
  },
  {
   "name": "Submission",
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
     "name": "formId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "formVersion",
     "optional": false,
     "type": "number"
    },
    {
     "name": "fillSessionId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "authoredBy",
     "optional": true,
     "type": "'patient' | 'staff'"
    },
    {
     "name": "authoredByMemberId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "patient",
     "optional": false,
     "type": "{"
    },
    {
     "name": "displayName",
     "optional": true,
     "type": "string"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "answers",
     "optional": false,
     "type": "SubmissionAnswer[]"
    },
    {
     "name": "symptomEntries",
     "optional": false,
     "type": "SymptomEntry[]"
    }
   ]
  },
  {
   "name": "SymptomEntry",
   "fields": [
    {
     "name": "id",
     "optional": false,
     "type": "string"
    },
    {
     "name": "submissionId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "fieldId",
     "optional": false,
     "type": "string"
    },
    {
     "name": "rawText",
     "optional": false,
     "type": "string"
    },
    {
     "name": "locale",
     "optional": false,
     "type": "Locale"
    },
    {
     "name": "matchedTermId",
     "optional": true,
     "type": "string"
    },
    {
     "name": "matchedTermVersion",
     "optional": true,
     "type": "number"
    },
    {
     "name": "matchMode",
     "optional": false,
     "type": "MatchMode"
    },
    {
     "name": "matchedSpan",
     "optional": true,
     "type": "{ start: number; end: number }"
    },
    {
     "name": "confirmation",
     "optional": true,
     "type": "{"
    },
    {
     "name": "state",
     "optional": false,
     "type": "'pending' | 'confirmed' | 'corrected'"
    },
    {
     "name": "resolvedByMemberId",
     "optional": true,
     "type": "string"
    }
   ]
  }
 ],
 "copy": {
  "empty": [
   "S1 forms first-run",
   "\"لا استمارات قبول بعد. ابنِ واحدة باللغتين من البداية — أو افتح الاستمارة العيّنة وشاهد عرضاً عامياً يجد مصطلحه.\"",
   "Create form / Open sample",
   "S1 filtered-empty",
   "\"No forms match these filters.\""
  ],
  "loading": [
   "Fill shell boot",
   "skeleton of the question card + spine, direction-aware",
   "هيكلية بطاقة السؤال والعمود الفقري، باتجاه العرض",
   "Resume in progress",
   "\"Bringing back your answers…\""
  ],
  "error": [
   "Class & trigger",
   "VALIDATION (publish gate)",
   "VALIDATION (required field at advance)",
   "\"This question is required — answer it to move on.\"",
   "\"هذا السؤال مطلوب — أجب عنه للمتابعة.\""
  ],
  "success": [
   "Form published",
   "\"Published at version 3 — both languages complete, 18 questions, consent included. Submissions in flight keep version 2.\"",
   "\"نُشرت في الإصدار 3 — اللغتان مكتملتان، و18 سؤالاً، والموافقة مشمولة. التسليمات الجارية تحتفظ بالإصدار 2.\"",
   "Fill invitation created",
   "\"Invitation ready — link, printed QR, or kiosk. It stays open for 72 hours.\""
  ]
 },
 "briefLine": "The unique mechanic is Arabic symptom vocabulary normalization. Patients describe symptoms in whatever Arabic they actually speak — MSA, Gulf, Levantine, Egyptian colloquial, mixed with English drug names — and the clinic needs that free text to land on canonical symptom vocabulary a provider can act on. The deterministic core does orthographic normalization (rtl-rules §4: tashkeel and tatweel stripping, alef/hamza unification, taa marbuta, alif maqsura) plus dictionary lookup against the workspace's own symptom vocabulary — every entry carrying canonical ar/en terms, colloquial variants, and a clinic-set urgent-attention flag. That core is conditionally-AI: an abstract vocabulary-normalization capability, when a workspace binds one, additionally resolves dialectal paraphrases the dictionary misses — and when unbound, rate-limited, or failed, the product degrades to the dictionary lookup, total and instant, with unmatched free text kept verbatim and flagged for staff. Assist matches are drafts until a human confirms them (P15); the normalization panel is the confirm surface. The stance is honest about why: the dialectal-Arabic symptom vocabulary literature is nearly empty (research digest S31 — five hits), so the dictionary plus a degradable assist is the defensible v1 shape, not a claimed understanding engine."
} as const;
export type Spec = typeof SPEC;
