# Motion Language — Personality Catalog & Per-Tier Expectations

Status: SHARED FOUNDATION · SME-I governs. Durations and easings are specified as INTENT (ranges and curve intents), never as fixed token values — concrete tokens are bound at implementation per token-architecture.md.

---

## 1. The Five Personalities

- **crisp** — percussive, precise, zero droop. Durations 100–180ms. Easing: standard ease-out; enters may use decelerate. No overshoot, ever. Use when the buyer's work is timing-critical (calendars, dispatch, caption timing, price rules).
- **energetic** — forward-leaning, confident pop. Durations 150–250ms. Easing: standard with a single controlled overshoot (≤8% travel) reserved for success moments (stamp, swap matched, clip ready). Never for errors.
- **calm** — unhurried, breath-like. Durations 200–320ms. Easing: symmetric ease-in-out. No scale change on hover (opacity/border only). Use for care-adjacent and reading surfaces.
- **stately** — choreographed, weighted. Durations 280–480ms with staggered reveals (stagger ≤60ms, capped at 5 elements). Easing: emphasized decelerate. Reserved for trust-critical and flagship surfaces.
- **minimal** — nearly still. Opacity-only transitions ≤120ms; position changes are instant with a crossfade. For high-density data surfaces where motion would be noise.

## 2. Micro-Interaction Taxonomy

Every product maps its critical actions (from 03-ux-flows.md) onto: hover (affordance discovery, never information), press (immediate tactile confirm ≤80ms), focus (visible per a11y-baseline §2 — motion never replaces focus indicators), success (the one place personality expresses fully), error (shake-free; errors arrive, they never bounce), streaming (per ai-native-patterns §2), and empty→filled transitions (content settles in place; never spins in).

## 3. Page & Surface Transitions

Route changes: crossfade ≤180ms (all personalities; stately may extend to 280ms with a single content settle). List→detail: shared-element intent for the invoking item where the platform supports it; otherwise a directional slide along the reading axis (inline-start reveal in RTL — rtl-rules §2). Modal/popover: scale 0.96→1.0 + fade, 140ms, with focus trap and return (a11y-baseline §3). No transition may move content the user is reading more than once.

## 4. Tier Expectations

- **Tier 1**: original motion proposals are mandatory — a signature moment per product (documented in 13-reference-mockups.md and 05-identity.md), invented choreography for the product's core interaction, and motion that expresses the buyer's emotional register. Original ≠ ornamental: every proposal states what work the motion does.
- **Tier 2**: disciplined application of the selected personality plus exactly one signature micro-interaction on the product's single most important action. Everything else is standard-set.
- **Tier 3**: the standard set for the personality, applied cleanly. Zero gratuitous motion. Success moments get the personality's default treatment; nothing else moves.

## 5. Reduced-Motion Contract

Every animated state change must have a perceivable non-motion equivalent: opacity in ≤2 steps, or instant change plus announcement (a11y-baseline §4). Page transitions become hard cuts; staggered reveals render simultaneously; the energetic overshoot collapses to a state chip; streaming text renders in paragraph chunks instead of token flow (announced per chunk completion, politely). A reduced-motion pass is part of the release testing matrix (a11y-baseline §8.6) — a spec that cannot describe its reduced-motion behavior for a given transition is incomplete and returns to SME-I.

## 6. Anti-Patterns (rejection bar)

Autoplaying hero loops >3s; parallax on scroll-jank surfaces; motion that carries information unavailable otherwise (a11y-baseline conflict); overlapping transitions on the same element; stagger >60ms; motion during user typing/caret operations; celebratory confetti on routine saves; any transition >480ms on interactive paths (loading art direction is exempt, ambient decoration is not).
