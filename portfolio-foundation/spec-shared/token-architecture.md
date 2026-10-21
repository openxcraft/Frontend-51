# Token Architecture — Three-Layer Intent Specification

Status: SHARED FOUNDATION · Applies to all 50 products · Backend-agnostic · No concrete token values are defined here — this document specifies what tokens must express, the rules that govern them, and the constraints any implementation must satisfy. Concrete DTCG-format token files are produced at implementation time and must conform to this intent.

Reference format: Design Tokens Community Group format (design-tokens.org) — the implementation emits `.tokens.json` groups; this spec governs their structure, naming, and obligations.

---

## 1. The Three Layers

### Layer 1 — Primitives (raw values, context-free)
The only place where raw values exist. Colors as OKLCh coordinates, type as unitless step indices mapped to rem at build time, space as multiples of a base unit, durations as millisecond literals, radii as pixel literals. A primitive carries no meaning. `color.oklch.32-06-268` says nothing about where it is used. Primitives are never referenced by a component, a style, or a document — only by Layer 2.

### Layer 2 — Semantic tokens (intent-bound)
Names describe purpose, never appearance: `surface.raised`, `text.primary`, `text.on-accent`, `feedback.critical.background`, `focus.ring`, `border.subtle`, `space.gutter.screen`, `space.stack.card`, `motion.duration.feedback`, `radius.control.default`. Every semantic token resolves to exactly one primitive per active theme and per active direction. Direction variants are produced by reference to logical properties (`inline-start` / `inline-end`), not by duplicated physical tokens (`left` / `right` are forbidden token names).

### Layer 3 — Component tokens (affordance-bound)
Bind semantic tokens to component affordances: `button.primary.background` → `accent.primary`; `input.focus.ring` → `focus.ring`; `card.elevation.shadow` → product elevation style. Components never read Layer 1 directly. Any component variant that cannot be expressed by composing Layer 3 tokens is a signal that either the component or the layer is wrong — the conflict is documented, not patched with a hard-coded value.

## 2. Hard Rules

1. **No raw values above Layer 1.** Any literal hex, px, or ms found in component code or copy is a defect.
2. **Semantic tokens are theme slots, not colors.** Re-theming a product = re-binding Layer 2 → Layer 1. Components and documents are untouched.
3. **Contrast is a contract at definition time.** Every text/background pair in Layer 2 must declare its minimum contrast ratio (WCAG 2.2 AA: 4.5:1 body, 3:1 large text and UI components). A pair that cannot meet its declared ratio in a theme is rejected at token-review time, not discovered in QA.
4. **Direction is structural.** Space, border, and corner tokens use logical axes. `radius.inline-start` resolves differently in `dir=rtl` contexts where an asymmetric shape is required; symmetric radii are direction-free.
5. **Arabic typographic constraints are token obligations:** `type.tracking.arabic` must resolve to `0` (letter-spacing is forbidden for joined Arabic scripts — it breaks letterform connections); Arabic body line-height tokens must resolve ≥1.6; tashkeel-aware line boxes reserve vertical room (see rtl-rules.md).
6. **Motion tokens express intent, not choreography.** Durations are specified as tiered ranges (see motion-language.md); easings as intent curves (standard, emphasized, decelerate, overshoot-gated). A token never encodes a full animation.
7. **Naming grammar:** `category.role.variant.state`. States are suffixes (`hover`, `focus-visible`, `pressed`, `disabled`, `selected`). Forbidden: appearance words (`light`, `left`, `blue`), provider names, product-specific prefixes in shared tokens.
8. **Versioning:** token files are semver. Removing or re-typing a semantic token is breaking; adding is minor; primitive re-binding within contract (contrast, direction rules preserved) is patch.
9. **Density modes are themes, not components.** Comfortable/compact spacing is a Layer 2 re-bind; components must not implement density logic.
10. **Dark mode is a Layer 2 re-bind with its own contrast declarations** — never an inversion filter. Elevation in dark themes is expressed by surface lightness steps, not stronger shadows.

## 3. What Each Product Must Add

Each product's `05-identity.md` selects: hue slot, pairing, radius family, elevation style, motion personality (from design-language-map.md). Those selections drive the product's Layer 1 primitives and Layer 2 bindings. The product's `06-component-needs.md` declares any new Layer 3 tokens its invented components require. Nothing in this chain names a backend, a framework, or a provider.
