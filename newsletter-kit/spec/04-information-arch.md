# 04 — Information Architecture: newsletter-kit

## Navigation model

Left rail: Issues · Subscribers · Send desk · Settings. Composer and QA studio are modes of an opened issue (S2/S3); jobs live inside the send desk (T3 consolidation of the job center per async-contract §7). ⌘K palette (P05): issues, lists, channels, jobs — bilingual search with Arabic normalization. Two levels: section → item; composer = item detail with locale tabs.

## Screen inventory (6)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Issues home | issue list, statuses, onboarding checklist (P22) | listIssues, getSession |
| S2 | Issue composer | bilingual block columns, variant tabs, assist (CP-1/2) | getIssue, createIssue, updateIssueContent, duplicateIssue, suggestSubjectVariants, getUsage |
| S3 | QA & preview studio | checklist panel + direction/width preview (CP-3) | runQaChecklist, listQaResults, updateIssueContent |
| S4 | Subscribers | lists, virtualized table, import review (CP-4) | listSubscriberLists, createSubscriberList, listSubscribers, importSubscribers, resolveImportRows, updateSubscriber, removeSubscribers |
| S5 | Send desk | channels, schedule, jobs, export (CP-5) | listDeliveryChannels, verifyDeliveryChannel, scheduleSend, listJobs, getJob, cancelJob, retryJob, exportIssue, getArtifact |
| S6 | Settings | locale defaults, numeral display, assist quota | getSession, getUsage |

Mobile (≤767px): S1 read; S4 lists read + import review (form-friendly); S5 statuses + job monitoring. S2/S3 are desktop/tablet — two-column composition by design.

## Per-screen state obligations

Four empties per P01 (first-run offers the sample issue with seeded QA fails — an interactive empty); skeletons mirror final geometry per direction (P02, RTL flips); errors per 03 mapping; copy matrix in 11.

## Entity overview (mirrors 07a)

Workspace → Issues (per-locale LocaleContent: subject variants, preheader, blocks; pairKey links blocks across locales) + QACheckResults per run; Workspace → SubscriberLists → Subscribers (consent-carrier rows); Workspace → DeliveryChannelBindings; Jobs (qa-run / subject-assist / import / export / send) reference issues and lists; ExportArtifacts belong to jobs.

## IA decisions and rationale

- **QA is an issue mode, not a destination**: the fix loop (CP-3.3) must be one click from the offending block.
- **Send desk owns jobs**: four job kinds, one activity surface, every row links to context — beats a dedicated jobs IA at T3.
- **Export is a first-class action on the send desk**: the no-channel path is a supported mode of use (LOOP-5); its IA position is the honesty mechanism.
- **Subscriber locale preference is visible on every list surface** (column + filter chip): Rania's wrong-edition failure (02) is an IA-visible fact, not a hidden attribute.
