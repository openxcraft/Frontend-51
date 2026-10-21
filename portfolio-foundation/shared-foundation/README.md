# Shared Foundation (code) — from specs-source/_shared/ (10 files)
Implemented as base CSS custom-property layers + primitives in each app's src/styles.css & src/App.tsx shell:
- Layer 1 primitives / Layer 2 semantic / Layer 3 component tokens (token-architecture.md)
- Patterns: P01 four empties, P02 skeletons, P05 command palette, P07 bulk bar, P08 filter chips, P10 autosave state, P17 activity log, P20 offline banner slot
- RTL: logical properties only, dir toggle, Arabic line-height >=1.6, tracking 0 for Arabic
- A11y: skip link, focus-visible >=2px/3:1, aria-live announcements, keyboard map (Esc closes palette/dialog, arrows navigate rail)
- Async: Jobs surface pattern (queued/running/succeeded/failed) per async-contract.md
Each app re-binds Layer 2 to its own 05-identity primitives — components are untouched (token-architecture §2.2).
