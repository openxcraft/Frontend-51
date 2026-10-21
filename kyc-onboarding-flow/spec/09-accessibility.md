# 09 — Accessibility: kyc-onboarding-flow

SME-F pass · Baseline: _shared/a11y-baseline.md (WCAG 2.2 AA, both directions, 200% & 400% zoom, 360px and 1280px viewports). This file adds: the per-CP keyboard maps for BOTH shells (applicant phone flow + console keyboard-speed queue), the focus contracts (the attestation traversal is the product's most consequential focus order), the live-region announcement schedule (session warnings, gate checklist, fold/seal moments), the per-surface WCAG 2.2 AA checklists, the RTL/LTR verification matrix with worst-case Arabic strings, and the reduced-motion contract. **The fintech/KYC overlay (a11y-baseline §7) is CONTRACT LAW in this product, not UI goodwill**: session-timeout warnings announce assertively with an extend action (07b rule 6); camera/document-capture steps carry screen-reader guidance AND a manual-upload alternative path; no biometric step is ever the only path (07b rule 8 alternative-path labels). Two a11y-critical surfaces: the **applicant shell** — a phone-only, Arabic-first, high-stakes identity flow worked at 21:40 in bed by a person who distrusts forms (02 Amal) — and the **review console queue** — a keyboard instrument worked for hours at decision speed by a bilingual reviewer (02 Maryam). High-stakes identity data raises the privacy posture (§Privacy) beyond the portfolio default.

## 1. Keyboard map per critical path

### Applicant shell (touch-first ≥360px, external keyboard fully supported; RTL-first)

**CP-1 (entry, session discipline)**: the two doors are large-tap targets (≥44px) in DOM order matching visual order (start door, then resume door when present); Tab moves door → locale pick → data-use disclosure; Enter activates the focused door. The session ribbon's **مد الجلسة / "Extend session"** action is the ribbon's first tab stop from the moment the 2-minute warning fires (focus does not AUTO-move — stealing focus mid-typing is a defect — but the ribbon renders within the scroll-margin so a single Tab reaches it; 2.4.11). Locale pick is a two-option radio group (ar/en) with persistent visible labels; the choice persists with the application (05 direction model).

**CP-2 (identity steps)**: one question per screen — focus lands on the first field of the step (never on the spine; the spine is a secondary navigation region reachable by Tab after the step content, or by a skip-link "انتقل إلى قائمة الخطوات" / "Skip to the step list"). Fields follow a11y-baseline §5: persistent labels above fields, programmatic required, autocomplete tokens (name, tel, email, address-level classes) declared per field; validation on blur or submit; the failing rule is named inline and `aria-describedby`-linked; on submit failure, focus moves to the first error (error summary on mobile is the first error in place, not a top banner that orphans the field). The save-state indicator is in the tab order after the field group (06 StepCard) and announces only on conflict (schedule §3). Backward navigation to completed steps is free pre-submission: the spine's roving tabindex (06 ProgressSpine) moves with ↑/↓ (inline-start/inline-end arrows in RTL per rtl-rules §4 — physical mapping stable: inline-end arrow = next step in both directions); Enter opens the focused step; Home/End jump to first/last step.

**CP-3 (capture step — the flagship mechanic)**: the document step entry screen (statement + data-use + the upload alternative) is a standard reading surface (h2 → data-use disclosure → the alternative path link → the primary "افتح الكاميرا" / "Open the camera" action). In the capture viewport: Space or Enter fires the shutter (the shutter button is always operable — gates advise, submit enforces — CP-3.3); **U** jumps to the upload alternative from anywhere in the viewport; the gate checklist is a reading region after the guidance line (Tab order: guidance line → checklist rows → retake/upload actions → shutter); each checklist row is a list item with state text+icon (06 GateChecklist). The upload path renders as a standard file-input form with the same checklist as the post-hoc report (06). Capture zoom on evidence cards is keyboard-operable with Escape restore (06 CaptureEvidenceCard). Camera permission-denied flips the upload path to primary with the choice stated — never a dead surface.

**CP-4 (review, attestation, submission)**: the summary screen reads as an evidence document: h2 per section (identity values, captures with quality reports, presence, program lines); the attestation panel's focus contract is THE contract — **focus order traverses the entire agreement text end-to-end before the consent control** (06 AttestationPanel; a11y-baseline §7 legal discipline): the full text is focusable as reading blocks (or the structured-alternative section summary with expandable full text for long agreements), the consent checkbox is disabled until the traversal is reachable (never a click-wrapped scroll trap — 07b rule 8 records `focusTraversalCompleted`), ⌘⏎ submits the attested application, and the timestamp is announced with the action (schedule §3). The status page (A5) is a live region subscriber (CP-4.4) with needs-attention rework instructions rendered as a named-step list — each rework-targeted step is a link that resumes the application at that step (CP-4.5).

**Presence step (policy-optional)**: same keyboard grammar as CP-3; its purpose statement and the declared alternative path (branch/in-person verification — 08) render before any camera surface; the alternative is reachable by Tab before the camera action, not after (no biometric step is the only path — a11y-baseline §7, enforced structurally by StepSpec.alternativePathLabelAr/En never being null on presence steps).

### Review console (keyboard-first — P18; ≥1024px, two-monitor comfortable)

**CP-5 (queue, dossier, decisions)**: j/k or ↑/↓ move queue rows (roving tabindex; physical mapping stable in RTL — inline-end arrow = next row both directions); **Enter** opens the Evidence Dossier drawer in place (aria-expanded on the row; drawer content enters the tab order directly after the row; focus moves to the drawer's first focusable — layer one's summary heading); the dossier's four layers are tab regions within ONE drawer (06 EvidenceDossier — layer-then-item traversal: Tab cycles layers, ↑/↓ cycles items inside a layer; layer entry announces its region name, schedule §3); **S** self-claims the focused task (CP-5.2); decision one-key paths: **A** approve · **X** reject · **W** request-rework · **E** escalate — each opens the DecisionComposer sheet PRE-SET to that decision with focus on the first required input (reason-code area for reject/rework; the consequence line for approve/escalate), and **⌘⏎ commits** (06 DecisionComposer; Arabic-layout-safe — every letter binding carries a modified-key equivalent + ⌘K palette path, §5 shortcut table); **L** opens the ledger view for the focused application (Sami's two-click dispute path — CP-5.7); **V** requests a verification assessment when a capability is bound (CP-6.6; silently a no-op surface when unbound — the action is absent, not disabled-without-reason); **F** focuses the filter chip row (P08); **/** focuses queue search (bilingual normalized, rtl-rules §4). The composer's rework mode renders the step-targeting list pre-checked to mismatch-flagged steps (CP-5.4) — checkboxes are Tab-reachable, never mouse-only. Escape closes sheet → drawer → drawer-back-to-row in order, focus returning one level per press (trap-free guarantee, a11y-baseline §3).

**CP-6 (program, templates, team, jobs)**: program sheets are standard forms; the FlowDesignerBoard's step reordering ships the keyboard move alternative **Alt+↑/↓ per selected step** (2.5.7 — drag is the convenience, keys are the contract; 06 FlowDesignerBoard records this file as the register); threshold numeric inputs pair with stepper buttons (no slider-only affordances); publish carries the in-flight declaration checkbox whose unchecked submit returns VALIDATION naming the rule (07b rule 9) — announced assertively with focus on the declaration control. Template studio renders bilingual columns as labelled per-side-direction regions (P23 discipline); the preview sheet's bidi-inspect mode is a disclosure. Team and jobs surfaces are standard P18 grids; job rows expose cancel/retry as row actions with confirm naming consequences (P04).

**⌘K palette (P05)** on console: bilingual normalized search (rtl-rules §4 fold), grouped results (tasks by applicant name / application ref · applicants · templates · program sheets · actions: "export ledger" / "escalate task" / "request assessment"), recent items; palette is the universal fallback for every letter shortcut (Arabic layout safety, §5).

### Global keyboard guarantees (both shells)

Focus-visible at 2.4.13 strength everywhere: ≥2px ring, ≥3:1 change-contrast (focus.ring binds capture.beacon on capture surfaces at 6.43:1; accent.primary-weighted ring on light surfaces — 05 contrast ladder); sticky elements never obscure the focused element (2.4.11 — scroll-margin is a token obligation on queue rows and the session ribbon's extend action); every interactive target ≥24px (2.5.8) with the applicant shell at ≥44px touch targets; no drag interaction without a keyboard equivalent (2.5.7 — the FlowDesignerBoard move keys are the only drag surface, both alternatives declared); grids follow P18; no raw-letter-ONLY bindings (a11y-baseline §3 — every letter shortcut carries a modified-key equivalent, a navigation-key equivalent, or a ⌘K palette path; §5 table shows each). Paste is never blocked (3.3.8 — applicant contact and identity fields accept paste; no cognitive function test exists anywhere: entry is by resume token link or program deep link, never a remembered password).

## 2. Focus contracts (the named, testable ones)

| Contract | Surface | The rule (testable) |
|---|---|---|
| **Attestation traversal** | S5 Review & Submit | Tab from the panel's first reading block reaches EVERY subsequent block of the agreement text before the consent control; the consent control is disabled until the full text has been focus-reachable; the traversal outcome is recorded with the attestation (07a Attestation.focusTraversalCompleted; 07b rule 8) |
| **Session-warning reachability** | Applicant shell, ribbon | From the moment `session.warning` fires, exactly ONE Tab from any focused field reaches مد الجلسة / "Extend session" (ribbon rendered within scroll-margin; never auto-stealing focus from a mid-typing applicant) |
| **Dossier layer traversal** | S9 drawer | Tab cycles layer regions in fixed order (summary → captures+quality → assessments → mismatch flags → composer entry); focus never escapes the drawer while open; close returns focus to the originating row (a11y-baseline §3) |
| **Composer pre-set focus** | S10 sheet | One-key decision path opens the composer with focus on the first REQUIRED input for that decision (reason codes for reject/rework — the audit chain's weakest-link rule; consequence line for approve/escalate) |
| **Retake affordance focus** | S3 capture | On a failed gate submit, focus moves to the retake affordance with the named-gate error announced (CP-3.5) — the error message links its gate row via described association |
| **Spine navigation order** | S2 step flow | Content first, spine second (skip-link "انتقل إلى قائمة الخطوات" / "Skip to the step list" above the step card); roving tabindex inside the spine; fold states announced politely once (schedule §3) |
| **First-error focus** | All forms | Submit failure moves focus to the first failing field (applicant) / first failing rule row (console program sheets) — inline, linked, never an orphaned top banner |
| **Sheet/drawer escape ladder** | Console | Esc closes exactly one level per press (sheet → drawer → row) with focus returning to the level's trigger; no trap, no focus loss |

## 3. Screen-reader announcement schedule (live regions — both locales)

| Event | Mode | Copy (verbatim in 11; shape here) |
|---|---|---|
| Session warning (2 min before idle end) | **assertive** (a11y-baseline §7 — contract rule 6) | "ستنتهي الجلسة بعد دقيقتين — يمكنك مدّها أو الحفظ والخروج؛ إجاباتك محفوظة" / "Session ends in 2 minutes — extend it or save and exit; your answers are saved" |
| Session extended | polite | "مُدّت الجلسة — تنتهي الآن عند {time}" / "Session extended — now ends at {time}" |
| Session ended (timeout) | assertive once | ended-state copy with the resume-link offer and data-safety line (11 §G) |
| Camera start guidance | **assertive once** (a11y-baseline §7 verbatim class) | "امسك المستند مسطحاً، والأركان الأربعة داخل الإطار" / "Hold the document flat, all four corners inside the frame" (contract copy — 06 CaptureCoach) |
| Gate state CHANGE | polite, on change only — never per frame tick | the failing gate's label + fix instruction ("غير مجتازة — وهج" / "failed — glare" class, 11 §D2) |
| All gates ready | polite once | "جاهز — التقط الآن" / "Ready — capture now" |
| Capture accepted / rejected | polite / assertive | accepted: capture folded (evidence slot); rejected: the named-gate error with values+thresholds (11 §C VALIDATION row) — assertive because the retake path is the next action |
| Step fold (completion) | polite once | "اكتملت الخطوة — {step title}" / "Step complete — {step title}" |
| Resume cascade | polite once (summary, not per-step) | "استؤنف الطلب — خطوتان متبقيتان" / "Application resumed — 2 steps remaining" (06 ProgressSpine) |
| Attestation recorded | polite | "اعتُمد الإقرار الساعة {time}" / "Attestation recorded at {time}" |
| Submission done | assertive once then status surface | submitted copy with ReviewTask deadline in applicant terms (11 §F) |
| Validation errors (all forms, both shells) | assertive | the failing rule's plain-language string, field/rule-linked (first error focused — §2) |
| Autosave conflict | polite | both-states compare copy (11 §C CONFLICT) |
| Queue landings (live console) | polite, focused row only | "وصل طلب {ref} — مهلة {deadline}" / "Task {ref} arrived — {deadline} deadline"; rows landing off-viewport NEVER announce (CP-5.8) |
| Decision committed (own action) | assertive once then polite summary | decision + consequence sentence (11 §D3) — the seal moment's announcement |
| SLA breach warning | instant-tier notification + polite on inbox open | breach copy with minutes remaining (11 §E) |
| Deadline countdown ticks, gate metrics per evaluation tick, queue re-sorts off-viewport | **NEVER announced** | visible text only (tabular numerals); polite on focus when asked (P19) |
| Job progress (exports, assessment runs) | polite on the job row only | "تصدير السجل — 47 إدخالاً" class (async-contract §8) |
| Decorative motion, skeleton shimmer, spine fold-mark settles | never | a11y-baseline §4 — announcement without a visible surface is a defect; every row above pairs with a visible chip/row/ribbon (06) |

Live regions pair with visible surfaces (a11y-baseline §4): each announcement's visible equivalent is named in 06 component obligations. Motion never carries information alone (the fold and the seal both carry state chips + ledger entries — 05 motion signature).

## 4. Camera-alternative paths — the screen-reader document-capture flows (overlay §7, flagship depth)

The document step is where the category abandons screen-reader users (01 §2: the IDV industry's a11y posture is a marketing blog post — Socure's — while the checklist guidance is help-center folklore). This product treats the alternative path as a first-class flow with its own contract:

1. **The upload path is primary-equivalent evidence** (07a CaptureRecord.source: 'camera' | 'upload' — identical pipeline, identical gates, identical reviewer view). It is offered BEFORE the camera opens ("ليست لديك كاميرا جيدة؟ ارفع صورة موجودة" / "No good camera? Upload an existing photo" — CP-3.1), one Tab away throughout the capture viewport (U), and becomes the step's primary surface when camera permission is denied. A screen-reader user can complete the ENTIRE document step without ever entering a camera surface: file input with a described label ("ارفع صورة وجه بطاقة الإقامة" / "Upload the front of your residence permit"), the same five-gate evaluation running post-hoc on the file, the same quality report rendered as a definition list (gate → value → threshold → verdict), the same retake affordance ("أعد المحاولة بصورة أخرى" / "Try again with another photo").
2. **The camera path, when chosen, is guided in words**: the camera-start guidance is assertive contract copy (§3); the gate checklist is the information (the frame-guide overlay is decorative — its shapes never carry meaning alone); gate transitions announce politely with the failing gate's name AND its fix instruction, so a low-vision user working with magnification hears which condition to correct without reading the viewport; the ready state announces once; the shutter is always operable (Space/Enter/button) — guidance never becomes a gate on the shutter itself (CP-3.3: evaluateCaptureFrame NEVER blocks capture; submitCapture enforces with named-gate errors).
3. **Retakes are navigable history**: the retake chain renders as a browsable list with the submitted frame marked (06 CaptureEvidenceCard) — a screen-reader user can return to an earlier passing frame and submit it ("اختر المحاولة 2 — مجتازة" / "Select attempt 2 — passed").
4. **Quality reports are text everywhere they appear**: applicant summary, dossier layer two, exports — always the definition list, never an image-only badge. The reviewer's dossier and the applicant's coach render the SAME report (the loop closed — CP-5.3).
5. **No biometric step is the only path** (a11y-baseline §7): the presence step renders with its purpose stated, its alternative path declared in program data (StepSpec.alternativePathLabelAr/En — non-null is a program-authoring validation rule, 07b), and the alternative (branch/in-person verification through the fintech's network — abstract, 08 N1 posture) is Tab-reachable BEFORE the camera action. A program that makes presence mandatory-without-alternative is rejected at authoring (CP-6.1 validation), not discovered at runtime.
6. **Assist capability is invisible to this contract**: the conditionally-AI enrichment changes guidance RICHNESS only (08 N2 degradation map) — the rule-gate floor, the checklist, and the announcement schedule above are identical whether the assist is bound or unbound; provenance flips honestly ("إرشاد وفق القواعد" / "rule-based guidance") with no announcement change (a screen-reader user is never asked to notice a model's absence).

## 5. Shortcut table (complete, Arabic-layout-safe — every letter binding carries a modified-key equivalent, a navigation-key equivalent, or a ⌘K palette path)

| Context | Shortcut | Action | Layout-safe alternative |
|---|---|---|---|
| Global (console) | ⌘K / Ctrl+K | command palette (P05) | — (modified key) |
| Global (console) | / | queue search focus | ⌘F browser find never relied on; palette path "بحث الصف" exists |
| Global (console) | G then Q | go to QUEUE | palette path |
| Global (console) | G then L | go to LEDGER & JOBS | palette path |
| Queue | j / k (or ↑/↓) | row navigation (roving tabindex) | navigation keys |
| Queue | Enter | open Evidence Dossier drawer (in place) | — |
| Queue | S | self-claim focused task | palette "المطالبة بالمهمة" |
| Queue | A | open approve composer (pre-set) | palette "اعتماد الطلب" |
| Queue | X | open reject composer (pre-set) | palette "رفض الطلب" |
| Queue | W | open request-rework composer (pre-set) | palette "طلب إعادة العمل" |
| Queue | E | open escalate composer (pre-set) | palette "تصعيد المهمة" |
| Queue | L | open ledger view for this application | palette "عرض السجل" |
| Queue | V | request verification assessment (bound only) | palette "طلب التقييم" |
| Queue | F | filter chips focus | palette "المرشحات" |
| Dossier (drawer) | Tab / ↑↓ | layer-then-item traversal (06) | navigation keys |
| Dossier | ⌘1…⌘4 | jump to layer 1–4 directly | modified keys |
| Composer (sheet) | ⌘⏎ | commit decision | on-screen button (≥44px console, 24px floor) |
| Composer | Esc | close sheet, focus returns to drawer | — |
| Drawer | Esc | close drawer, focus returns to row | — |
| Program board | Alt+↑ / Alt+↓ | move selected step (2.5.7 keyboard move) | modified keys + drag alternative |
| Any form (both shells) | ⌘⏎ | submit | on-screen button |
| Applicant (capture viewport) | Space / Enter | fire shutter | on-screen button |
| Applicant (capture viewport) | U | jump to upload alternative | on-screen link, first-class |
| Applicant (step flow) | ↑/↓ (on spine) | step navigation (inline-end = next, both directions) | tap targets ≥44px |
| Applicant (any) | Esc | close sheet (upload, zoom) with restore | on-screen back |
| Inbox | M | mark seen | row action button |

## 6. Per-surface WCAG 2.2 AA checklist (S1–S14; product floors above AA where stated)

All surfaces: four empties implemented with correct copy (P01, 11 §A); skeletons mirror final geometry RTL-flipped (P02); focus-visible per 2.4.13 (§1); targets per surface floors (≥44px applicant, ≥24px console with dense rows at 40px height and full-row click targets); contrast per the 05 ladder (every text pair AA, all reading pairs AAA, UI boundaries ≥3:1); skip-to-main on console; skip-to-step-list on applicant shell; no color-only state anywhere (gate states, deadline urgency, mismatch severity are text+icon — 06); direction is a Layer-2 token concern (logical properties only — rtl-rules §2).

- **S1 ENTRY**: doors are h1-level choices with described facts (resume door carries the stopped-at fact line); locale radio persists; the resume contract reads at 1.65 Arabic line-height; the expired-token state renders as a decision surface (restart action citing policy + retention line), never a dead end.
- **S2 STEP FLOW**: labels persist; validation linked; recall chips carry described text (the RECALLED fact is in described-by, the chip is reinforcement — 06 RecallChip); save indicator is a status region announcing only on conflict; amendment path backward is free (04).
- **S3 CAPTURE STEP**: the dark viewport's contrast ladder holds (text.on-capture 13.51:1, capture.beacon labels 6.43:1 — 05); the frame guide is decorative; the checklist is the information; the shutter always operable; U-alternative one key away; 400% reflow stacks viewport with identical labels (§7).
- **S4 PRESENCE STEP**: purpose stated before camera; alternative Tab-reachable BEFORE the camera action; no biometric-only path (§4).
- **S5 REVIEW & SUBMIT**: the attestation traversal contract (§2); summary sections are h2-landmarked; capture thumbnails are labeled figures (document type + side + gate summary in words); the trust symmetry (applicant sees what the reviewer sees) is readable, not decorative.
- **S6 STATUS**: live-region transitions (§3); needs-attention steps are named links into the flow; outcome notices render the reviewer's reason summary verbatim.
- **S7 CONSOLE SIGN-IN**: standard session form; 3.3.8 clean (no cognitive test — identity is email-link class, 08 N4).
- **S8 REVIEW QUEUE**: P18 grid; row summaries via described-by ("طلب مراجعة — مهلة 4 ساعات، جولة إعادة عمل 2، تحذيرات جودة 1" — 06); deadline ribbons are text+icon+position, notice tone at <2h, critical at breach — never a red pulse; virtualization >200 rows preserves focus (P19); re-sorts never occur under the cursor (CP-5.8); counters are text.
- **S9 EVIDENCE DOSSIER (drawer)**: four tab-regions one drawer (§2 contract); assessments render provenance-first with "مدخل للمراجعة — ليس قراراً" / "an input for review — not a decision" (06); mismatch flags are keyboard-navigable list items naming the deterministic rule; zoomable captures with Escape restore.
- **S10 DECISION COMPOSER (sheet)**: reason-code checkboxes required for reject/rework (VALIDATION announced with the failing rule on missing); bounded note field with live count; consequence naming (P04 — never a content-free confirm); the reversal decision path composes identically.
- **S11 APPLICANTS**: search with Arabic normalization; history rows are text; withdrawal action requires rationale (admin) with consequence copy; masked contact identifiers in list rows (§Privacy).
- **S12 TEMPLATES STUDIO**: bilingual columns are labelled per-side-direction regions (P23); parameter syntax has described help; preview reads as the applicant will receive it; length-parity warnings are text.
- **S13 PROGRAM**: threshold inputs + steppers (2.5.7-safe); the in-flight declaration is a required checkbox with its rule stated; publish failure focuses the declaration control; the capability-posture tab renders bound/unbound states in capability language (08).
- **S14 TEAM · LEDGER & JOBS · INBOX**: activity log is a navigable table (P17) — the dispute surface; export expiry announced with the artifact named; job rows carry cancel/retry with consequences; inbox tiers per P21 (instant classes badge; digest classes never — 06).

## 7. RTL/LTR verification matrix (per surface, both directions — the bilingual-ar contract)

For each of S1–S14, recorded pass/fail on: pure-Arabic render; pure-English render; mixed strings (Latin application refs `APP-1042`, Latin applicant names, Latin document-type codes inside Arabic rows — bidi isolation at every interpolation, rtl-rules §2); numeral rendering under the Western policy inside Arabic prose (deadlines "مهلة 4 ساعات", gate percentages "وهج يغطي 12%", rework rounds — never mixed mid-sentence, copy-voice §1.7); embedded Latin tokens in RTL (applicationRef, engine labels, timestamps — isolating containers); table/grid mirroring (queue columns, dossier layers, activity log — column order mirrors; time and ref columns keep LTR-embedded numerals with isolation); the spine's direction (progress toward inline-end in RTL — the rail mirrors, fold-marks are direction-neutral chips); deadline ribbon direction (the clock glyph never flips — 06 icon ledger); icon flipping per the 06 metaphor ledger (chevrons + retake-rotate + external-link flip; clock, camera, document, check-circle, alert-triangle, shield, layers, bookmark, scale, attest glyph, upload tray never); truncation at 320px container with worst-case Arabic; 400% zoom reflow (single column, no horizontal scroll in one dimension); focus order matching visual order in both directions; form label/error placement on the correct inline edge.

**Worst-case Arabic strings (the reflow/truncation test set — joined long words + product sentences, per rtl-rules §4–5)**:

| Case | String | Where it must not break |
|---|---|---|
| Long joined words (the portfolio's canonical stress) | "مستشارو التدقيق والحوكمة" | applicant-name cells in queue rows, dossier headings — word-boundary ellipsis, no mid-word break |
| Longest applicant-facing sentence | "استؤنف طلبك من حيث توقفت — توقفت عند خطوة المستند — قبل 3 أيام" | S1 resume door fact line at 320px |
| Longest gate-fail sentence with embedded numerals | "التقاط غير مقبول — وهج يغطي 12% من المستند (الحد 4%)" | S3 checklist sub-line, S9 quality report row |
| Longest capability sentence | "غير مربوط — المراجعة اليدوية على الأدلة" | S13 posture tab, S9 assessment layer |
| Longest template body (parameters) | "طلبتكم {applicationRef} بانتظار تصحيح خطوتين قبل {deadline} — استأنفوا وصححوا الخطوات المذكورة" | S6 notice render, S12 preview at 360px |
| Mixed-script answer | Latin employer name inside an Arabic identity field | S2 recalled render, S5 summary — bidi isolation on render |
| Attestation legal text at 1.75 line-height | the full §D5 attestation body (11) | S5 attestation panel, 400% zoom, no clipping of stacked marks |

The mock's seeded fixtures guarantee a test case for every row (07c §1: bilingual applicant names, Latin refs, the glare-loop application, the mixed-locale assessment posture).

## 8. Reduced-motion contract (motion-language §5 — every animated state has a perceivable non-motion equivalent)

- **The fold** (step completion): reduced-motion renders the step at its folded state simultaneously — the fold-mark chip + ordinal text carry the state; the polite announcement ("اكتملت الخطوة — …") still fires. The resume cascade renders all folds at final state with the summary announcement only ("استؤنف الطلب — خطوتان متبقيتان").
- **The seal** (decision commit): the 360ms press-settle collapses to the state chip (navy seal chip + decision text) at identical information; the assertive-once announcement still fires (§3).
- **Route transitions**: hard cuts. Sheets render open (no 0.96→1.0 scale). Drawer expansion is instant with the same focus contract.
- **Gate-checklist state changes**: state text+icon change with no pointer animation (already the 06 CaptureCoach reduced-motion rule); the guidance line swaps as text.
- **Countdowns and ticks**: already text-only at 1Hz — unchanged.
- **Skeletons**: opacity steps ≤2 (P02 holds); no shimmer.
- **Staggered reveals**: render simultaneously (the ≤60ms/≤5 cap is a motion-only concern); nothing is lost — every reveal's information is textual.
- The release-testing matrix (a11y-baseline §8.6) runs every benchmark with reduced-motion enabled: all state changes remain perceivable; motion and direction never buy or cost information (10 §Measurement repeats every budget in reduced-motion + RTL variants).

## 9. Privacy posture (high-stakes identity data — beyond the portfolio default)

- **PII is bounded by contract** (07a state obligations): contactRef, displayName, locale, step answers, captures — no geolocation, no device fingerprints, no biometric templates retained; presence captures are images passed to the abstract capability, retention per program policy (12 Q-8).
- **Identity data never appears in page titles or URLs**: the resume link carries an opaque token only; application state lives behind the adapter; console routes address task/applicant ids, never document numbers.
- **Validation errors name rules, never values**: an invalid identifier error names the expected format, never echoes the applicant's typed value back at screen-reader volume (the healthcare overlay's discipline adopted for identity data — errors address the situation, not the person's data).
- **Masking discipline in list surfaces**: contact identifiers render masked (last 2–4 characters) in queue rows and directory lists; full values only inside the dossier/composer where the value is the work object. Document images render at thumbnail scale in lists; full images only in the dossier with zoom.
- **Screenshot-safe console surfaces**: the queue carries names + refs + deadlines only — the dossier is the evidence surface, and its masking posture is a workspace policy question carried in 12 (Q-15) rather than silently defaulted.
- **The assist capability reads frame metrics only** (08 N2 risk flag): never image content, never retained beyond the session; the assessment capability consumes declared evidence only (08 N1 privacy boundary — no contact identifiers to engines).
- **Exports are the audit boundary**: ledger artifacts carry the full chain (they are the regulator's file — 00 success signal 4) with expiry windows and renewal (async-contract §2); export events are ledger entries.

## 10. Overlay applicability (a11y-baseline §7 — declared and met)

**Fintech/KYC overlay — binding**: (1) session-timeout warnings announce assertively with an extend action — contract rule 6 (07b), the ribbon contract (§2), the schedule (§3); (2) camera/document-capture steps provide screen-reader guidance and a manual-upload alternative path — §4 (the flagship-grade treatment); (3) no biometric step is the only path — structural (program-authoring validation + alternative labels in data). The legal/audit overlay's attestation discipline ALSO applies (attestation flows preserve focus order across the entire agreement, timestamps announced with the action, the activity log is keyboard-navigable and exportable) — this product sits in both overlay families (identity verification + audit-grade decisions), and the stricter reading of each governs. The healthcare overlay does not apply (no PHI), though its errors-never-echo-values discipline is adopted voluntarily for identity data (§9).
