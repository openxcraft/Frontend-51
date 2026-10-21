# 09 — Accessibility: content-remix-studio

## Keyboard map (critical paths)
- **CP-1**: library navigation standard; R runs focused recipe on open source; dialect-choice dialog is a radio + confirm (focus-trapped).
- **CP-2**: workbench: Tab moves source↔derivative columns in reading order; receipt links are focusable with span announcement; E edits focused block (P06); arrow keys traverse blocks.
- **CP-3**: recipe editor: structure rows P18 grid (↑/↓ reorder has ⌘+arrow equivalent — 2.5.7); validation issues are focusable list entries linking to fields.
- **CP-4**: export selection via space on rows; action bar P07.

## Announcement schedule
| Event | Mode | Copy shape |
|---|---|---|
| Recipe run started/done | polite | recipe kind + block count |
| Block focused | polite | role + source-link presence |
| Receipt link followed | polite | span excerpt + ratio |
| Regeneration confirm | assertive (destructive case) | what is discarded |
| Remix complete | polite | derivative stack summary (the overshoot moment's announcement) |
| Export ready | polite | formats + expiry |

## Per-surface checklist
- Receipt links: visual + text (ratio, kind) — never color-only; bidi-safe spans in mixed sources.
- S3 workbench: two columns reflow to stacked at narrow widths (400% safe); per-column direction rendering.
- S4 recipe editor: validation messages field-linked (error summary on save).
- Overshoot micro-interaction (05) is success-only and never carries information alone.
- Targets ≥24px throughout; focus-visible 2.4.13 strength.

## RTL/LTR verification matrix
Per S1–S8 both directions: source/derivative column direction per content; receipt links across directions (ar source → en derivative: links must render coherently in both); mixed-language spans isolation; structure previews mirroring; truncation; 400% reflow. Seeded mixed + paired derivatives are the fixtures.
