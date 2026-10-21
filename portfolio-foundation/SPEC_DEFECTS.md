# Spec Defects Found by Building — verbatim 07b/07a contracts vs `tsc --noEmit`
Found: 2026-10-21, Phase 1 build. STATUS 2026-10-21 (completion run): all 10 corrected in generated code (counted in each contract.ts header; specs-source untouched) — tsc now 50/50. The spec-side fixes below remain the recommended corrections to the spec documents themselves. Contracts were extracted **verbatim**; nothing below was silently patched.
Vite builds pass 50/50 (types are stripped at build). Typecheck: **40/50 clean**. The 10 failures are all
inside the specs' own TypeScript, in 4 classes. Each entry gives the exact fix a spec revision should make.

## A. Type used in 07b, defined only in 07a prose (no TS definition anywhere) — 3 apps
- **arabic-copy-studio** — `BrandKit` (07a §line 9 describes fields in prose: id, workspaceId, voiceTraits[], sampleCopy[], bannedTerms[], registerHint). Fix: add `export interface BrandKit {...}` to 07a TS blocks.
- **brand-voice-guardian** — `TermInput`, `BannedInput`. Fix: define both in 07a TS blocks.
- **caption-lab** — `ProjectSummary`. Fix: define in 07a TS blocks (Project fields are described there).

## B. Syntax slip in 07b source — 2 apps (identical pattern)
`Promise<Result<Page<{ …fields… }, AdapterError>>` — `Page<T>` is closed with `, AdapterError` inside its
angle brackets; a `>` is missing after the object literal (intended: `Result<Page<{…}>, AdapterError>`).
- **invoice-generator-desk** — two sites: line 347 (listActivity, missing `>` as above) and line 331
  (getArtifact: the mirror slip — a stray extra `>` after the inline object, `Result<{…}>, AdapterError>`,
  which closes Result early and cascades 20+ parse errors from that line onward).
- **shipping-rate-comparator** — 07b-adapter-contract.md line 292 (listActivity pattern only).

## C. Re-export used where a local import is required + circular reference — 2 apps
07b does `export type { … } from './07a-data-contract'` (a re-export, which brings nothing into local scope)
and then uses those names locally; additionally the 07a blocks reference `AdapterError`, which is defined in 07b.
- **podcast-publish-kit** — JobKind/JobState/LocaleContent used locally after re-export; 07a → AdapterError.
- **social-clip-cutter** — same pattern; also `Job` used with no definition in scope.
Fix: change the re-export to `import type { … } from './07a-data-contract'` + a separate `export type { … }`
line, and move `AdapterError`/`Result` into a shared foundation module both files import.

## D. Internal inconsistency within 07b's own TS — 3 apps
- **clinic-appointment-desk** — code reads `ClinicSettingsPatch.reminderLadder` / `.noShow`, but the
  `ClinicSettingsPatch` interface in the same contract declares neither field.
- **khatt-type-playground** — `Result` declared with 2 type parameters in one block, used with 1 in another.
- **op-ed-desk — `Job` declared non-generic, used as `Job<T>`; plus the class-B Page pattern at 07b line 107 (listContributors).
Fix: reconcile the declarations in a spec revision (the usage sites show the intended shapes).

## What the generator already handles legitimately (not defects)
- 07a TS blocks merged into `contract.ts` as a labelled supplement (only names 07b doesn't define).
- Apps whose 07b imports `./07a-data-contract` / `./07a` as a module get that module emitted verbatim from
  07a's TS blocks (`src/adapter/07a-data-contract.ts`, `07a.ts`) — interactive-story-builder and
  price-rule-engine typecheck clean this way.
- clinic-appointment-desk's 04 header says "10 screens" but its table lists 11 — the build uses the table (11).
