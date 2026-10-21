# Accessibility Baseline — WCAG 2.2 AA

Status: SHARED FOUNDATION · The portfolio floor. SME-F audits every product against this file; any failure blocks batch closure (LOOP-14). Reference: W3C WCAG 2.2 Recommendation (https://www.w3.org/TR/WCAG22/).

---

## 1. Portfolio Floor

WCAG 2.2 Level AA, all criteria, both directions (ar/en) of every product, at 200% and 400% zoom, on a 1280px and a 360px viewport. Contrast contracts are enforced at token definition (token-architecture.md §2.3). AA is the floor, not the target: Tier 1 products are expected to clear several AAA contrast pairs where identity allows.

## 2. WCAG 2.2-Specific Criteria (commonly missed)

- **2.4.11 Focus Not Obsscured** — sticky headers/footers must not cover the focused element; focus scroll-margin is a token obligation.
- **2.4.13 Focus Appearance** — focus indicators ≥2px thickness, ≥3:1 change-contrast, ≥ area of a 2 CSS px solid outline of the control.
- **2.5.7 Dragging Movements** — every drag interaction (kanban, timeline, range) ships a keyboard/click alternative.
- **2.5.8 Target Size (Minimum)** — interactive targets ≥24×24 CSS px, spacing-aware exceptions documented per component.
- **3.3.7 Redundant Entry** — multi-step flows recall prior answers (see ux-patterns.md P11).
- **3.3.8 Accessible Authentication** — no cognitive function tests; paste is never blocked; session model stays provider-agnostic.

## 3. Keyboard Contract

Every product's 09-accessibility.md publishes a keyboard map per critical path: order rationale, focus visibility guarantee, shortcuts table (with ⌘K palette), escape behavior per surface, and trap-free guarantee for modals/popovers (focus returns to trigger on close). Grids follow ux-patterns.md P18. Shortcut conflicts with Arabic keyboard layouts are checked (e.g., avoid raw letter keys; prefer modified keys).

## 4. Screen Reader Announcement Schedule

Each product defines an announcement plan per surface: what is announced politely (status, autosave, stream completion) vs assertively (validation errors, destructive failures) vs never (decorative, per-token layout shifts, streaming text tokens — announce start/end + summary only, per ux-patterns.md P13). Live regions pair with a visible equivalent — an announcement without a visible surface is a defect. Error messages reference their field via described association.

## 5. Forms

Labels persist above/beside fields (placeholder is never the label). Validation is on-blur-or-submit with inline, linked messages; error summary on submit failure focuses the first error. Autocomplete tokens are declared for personal-data fields. Required is programmatic, not (only) asterisk-decorative.

## 6. Media

Prerecorded audio content in any product ships captions (caption-lab exists precisely because this is hard in Arabic). Media players expose full keyboard control and state. No autoplaying audio, ever.

## 7. Overlays (family-specific obligations)

- **Fintech/KYC (kyc-onboarding-flow)**: session-timeout warnings announce assertively with extend action; camera/document-capture steps provide screen-reader guidance ("hold the document flat, all four corners inside the frame") and a manual-upload alternative path; no biometric step is the only path.
- **Healthcare/PHI (patient-intake-forms, clinic-appointment-desk)**: health data never appears in page titles or URLs; validation errors do not echo answers; session screens have shoulder-surfing consideration (mask-on-blur optional, declared).
- **Legal/audit (legal-case-tracker, policy-acknowledgment-portal, contract-lifecycle-manager)**: attestation flows preserve focus order across the entire agreement text (or expose a structured alternative), timestamps are announced with the action, and the activity log (P17) is keyboard-navigable and exportable.

## 8. Release Testing Matrix (every product, every batch)

1. Keyboard-only pass of every critical path (03-ux-flows.md), both directions.
2. Screen-reader smoke test per critical path (at minimum one desktop SR + one mobile SR).
3. 200% and 400% zoom reflow on both viewport widths, both directions, worst-case Arabic strings (rtl-rules.md §5).
4. Contrast audit of all Layer 2 pairs per active theme.
5. Target-size spot audit of dense surfaces (tables, toolbars, calendar grids).
6. Motion spot audit with reduced-motion enabled: all state changes remain perceivable (motion-language.md §5).

## 9. Rejection Bar

A spec fails SME-F review if: any critical path lacks a keyboard map; any state change lacks a perceivable equivalent; announcement plan is missing or contradicts visible UI; an overlay obligation (§7) is unmet; direction verification matrix is incomplete for a bilingual product.
