# Survey Insight Miner
Separate frontend project · family: analytics · tier: 2 · adapter: SurveyInsightAdapterV1

Build separately: `npm install && npm run build` (or from portfolio root: `node tools/build-all.mjs survey-insight-miner`).

## Spec traceability (source: ../specs-source/survey-insight-miner/)
- Screens (10): Projects home · Project overview · Theme board · Theme detail / editor · Response reader · Coverage & crosstab console · Intake · Jobs center · Activity log · Settings
- Adapter operations (30): getSession, createProject, listProjects, getProject, updateProject, importResponses, listQuestions, getQuestion, listResponses, getResponse, setResponseLanguageOverride, runClustering, listThemes, getTheme, saveTheme, confirmTheme, getConfirmGate, getMergePreview, mergeThemes, deleteTheme, setResponseTheme, bulkSetResponseTheme, setQuotePin, getCoverageReport, getCrosstab, exportAnalysis, getArtifact, listJobs, listActivity, getUsage
- Identity: Mashour Lavender, pairing P17 (Noto Sans Arabic + Manrope), radius C, soft-lift, motion: calm
- Direction default: bilingual-ar (proposed, LOOP-6 pending confirmation)
- Contract: src/adapter/contract.ts is verbatim 07b. Mock: src/adapter/mock.ts per 07c. UI never bypasses the adapter.
