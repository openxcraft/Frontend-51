# 04 — Information Architecture: content-remix-studio

## Navigation model
Left rail: Library (sources) · Recipes · Derivatives · Queue. Workbench is a mode of Library item view (source + derivative side-by-side). ⌘K palette reaches sources, recipes, derivatives. Two-level: section → item; workbench = item detail with recipe context.

## Screen inventory (8)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Library home | sources list + onboarding checklist | listSources(query) |
| S2 | Recipe gallery | stock + personal recipes, structure previews | listRecipes, getRecipe |
| S3 | Workbench | source+derivative + receipt links (CP-1/2) | runRecipe(Job), getDerivative, updateDerivative |
| S4 | Recipe editor | structure map editing, versions | saveRecipe(versioned), validateRecipe |
| S5 | Derivatives library | status, pairs, export selection | listDerivatives(query) |
| S6 | Export & queue | bundles, artifacts | exportDerivatives(Job), getArtifact |
| S7 | Jobs center | runs/exports | listJobs |
| S8 | Settings | locale defaults, dialect policy, quotas | getSession, workspace ops |

Mobile (≤767px): S1, S5, S6 read-only. Workbench and recipe editor are desktop/tablet.

## Per-screen state obligations
Four empties (P01 — first-run offers sample source); skeletons mirror geometry; errors per 03 mapping; copy matrix in 11.

## IA decisions and rationale
- **Recipe preview before run** (CP-1.3) is the IA's spine: inspectability is the differentiator (01) — the gallery is a first-class surface, not a settings tab.
- **Workbench binds source↔derivative permanently**: receipts require both in view; editing derivatives without source context is exactly the black-box behavior we oppose.
- **Queue is small but first-class**: remix runs are the product's jobs (async-contract).
